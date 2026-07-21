import { z } from "zod";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { createRouter, orgProcedure } from "../middleware";
import { getDb } from "../queries/connection";
const db = getDb();
import {
  leads, leadTimeline, leadNotes, viewings, units, projects
} from "@db/schema";

export const crmRouter = createRouter({
  /* ═════════════════ LEAD TIMELINE ═════════════════ */
  timeline: orgProcedure
    .input(z.object({ leadId: z.number(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const rows = await db.select()
        .from(leadTimeline)
        .where(and(
          eq(leadTimeline.orgId, ctx.orgId),
          eq(leadTimeline.leadId, input.leadId)
        ))
        .orderBy(desc(leadTimeline.createdAt))
        .limit(input.limit);
      return rows;
    }),

  addTimelineEvent: orgProcedure
    .input(z.object({
      leadId: z.number(),
      eventType: z.enum([
        "page_view", "pricing_click", "floor_plan_view", "brochure_download",
        "mortgage_calc", "viewing_request", "viewing_scheduled", "viewing_completed",
        "viewing_cancelled", "whatsapp_message", "whatsapp_reply",
        "email_sent", "email_opened", "email_clicked",
        "call_made", "call_received", "voicemail_left",
        "stage_changed", "note_added", "task_created", "task_completed",
        "campaign_touched", "ad_clicked", "widget_interact",
        "hot_routed", "reserved", "converted", "lost"
      ]),
      title: z.string(),
      description: z.string().optional(),
      metadata: z.any().optional(),
      channel: z.enum(["website", "whatsapp", "email", "phone", "in_person", "widget", "social", "system"]).default("system"),
      projectId: z.number().optional(),
      unitId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.insert(leadTimeline).values({
        orgId: ctx.orgId,
        leadId: input.leadId,
        eventType: input.eventType,
        title: input.title,
        description: input.description,
        metadata: input.metadata,
        channel: input.channel,
        projectId: input.projectId,
        unitId: input.unitId,
        agentId: ctx.userId,
      });
      return { id: Number(row.insertId) };
    }),

  /* ═════════════════ LEAD NOTES ═════════════════ */
  notes: orgProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ ctx, input }) => {
      return db.select()
        .from(leadNotes)
        .where(and(
          eq(leadNotes.orgId, ctx.orgId),
          eq(leadNotes.leadId, input.leadId)
        ))
        .orderBy(desc(leadNotes.createdAt));
    }),

  addNote: orgProcedure
    .input(z.object({
      leadId: z.number(),
      content: z.string().min(1),
      noteType: z.enum(["call", "meeting", "email", "general", "system"]).default("general"),
      isPinned: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.insert(leadNotes).values({
        orgId: ctx.orgId,
        leadId: input.leadId,
        content: input.content,
        noteType: input.noteType,
        agentId: ctx.userId,
        isPinned: input.isPinned,
      });
      // Also add timeline event
      await db.insert(leadTimeline).values({
        orgId: ctx.orgId, leadId: input.leadId,
        eventType: "note_added", title: `Note: ${input.noteType}`,
        description: input.content, channel: "system",
      });
      return { id: Number(row.insertId) };
    }),

  /* ═════════════════ VIEWINGS ═════════════════ */
  viewings: orgProcedure
    .input(z.object({
      leadId: z.number().optional(),
      projectId: z.number().optional(),
      status: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [eq(viewings.orgId, ctx.orgId)];
      if (input.leadId) conditions.push(eq(viewings.leadId, input.leadId));
      if (input.projectId) conditions.push(eq(viewings.projectId, input.projectId));
      if (input.status) conditions.push(eq(viewings.status, input.status as any));

      return db.select({
        id: viewings.id,
        leadId: viewings.leadId,
        projectId: viewings.projectId,
        unitId: viewings.unitId,
        scheduledAt: viewings.scheduledAt,
        duration: viewings.duration,
        status: viewings.status,
        meetingType: viewings.meetingType,
        location: viewings.location,
        agentId: viewings.agentId,
        feedback: viewings.feedback,
        rating: viewings.rating,
        nextSteps: viewings.nextSteps,
        reminderSent: viewings.reminderSent,
        createdAt: viewings.createdAt,
      }).from(viewings)
        .where(and(...conditions))
        .orderBy(desc(viewings.scheduledAt))
        .limit(input.limit);
    }),

  scheduleViewing: orgProcedure
    .input(z.object({
      leadId: z.number(),
      projectId: z.number(),
      unitId: z.number().optional(),
      scheduledAt: z.string(),
      duration: z.number().default(30),
      meetingType: z.enum(["in_person", "video_call", "phone_call"]).default("in_person"),
      location: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.insert(viewings).values({
        orgId: ctx.orgId,
        leadId: input.leadId,
        projectId: input.projectId,
        unitId: input.unitId,
        scheduledAt: new Date(input.scheduledAt),
        duration: input.duration,
        meetingType: input.meetingType,
        location: input.location,
        agentId: ctx.userId,
        status: "confirmed",
      });
      // Timeline event
      await db.insert(leadTimeline).values({
        orgId: ctx.orgId, leadId: input.leadId,
        eventType: "viewing_scheduled", title: "Viewing Scheduled",
        description: `Viewing scheduled for ${input.scheduledAt}`,
        channel: "system", projectId: input.projectId, unitId: input.unitId,
      });
      return { id: Number(row.insertId) };
    }),

  updateViewing: orgProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["requested", "confirmed", "completed", "no_show", "cancelled", "rescheduled"]),
      feedback: z.string().optional(),
      rating: z.number().optional(),
      nextSteps: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(viewings)
        .set({
          status: input.status,
          feedback: input.feedback,
          rating: input.rating,
          nextSteps: input.nextSteps,
          updatedAt: new Date(),
        })
        .where(and(eq(viewings.id, input.id), eq(viewings.orgId, ctx.orgId)));

      const [v] = await db.select().from(viewings).where(eq(viewings.id, input.id));
      if (v) {
        const eventType = input.status === "completed" ? "viewing_completed" :
          input.status === "cancelled" ? "viewing_cancelled" : "stage_changed";
        await db.insert(leadTimeline).values({
          orgId: ctx.orgId, leadId: v.leadId,
          eventType, title: `Viewing ${input.status}`,
          description: input.feedback || `Viewing status updated to ${input.status}`,
          channel: "system", projectId: v.projectId, unitId: v.unitId,
        });
      }
      return { success: true };
    }),

  /* ═════════════════ LEAD UPDATE (stage, assignment) ═════════════════ */
  updateLead: orgProcedure
    .input(z.object({
      id: z.number(),
      stage: z.enum(["anonymous", "identified", "qualified", "reserved", "converted", "lost"]).optional(),
      assignedAgentId: z.number().optional(),
      interestedUnitIds: z.array(z.number()).optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const updateData: any = { ...updates, updatedAt: new Date() };

      // Get old lead for timeline
      const [old] = await db.select().from(leads).where(eq(leads.id, id));

      await db.update(leads)
        .set(updateData)
        .where(and(eq(leads.id, id), eq(leads.orgId, ctx.orgId)));

      if (updates.stage && old && old.stage !== updates.stage) {
        await db.insert(leadTimeline).values({
          orgId: ctx.orgId, leadId: id,
          eventType: "stage_changed", title: `Stage: ${old.stage} → ${updates.stage}`,
          description: `Lead moved from ${old.stage} to ${updates.stage}`,
          channel: "system",
        });
      }

      return { success: true };
    }),

  /* ═════════════════ DASHBOARD STATS ═════════════════ */
  stats: orgProcedure
    .query(async ({ ctx }) => {
      const [leadCounts] = await db.select({
        total: sql<number>`count(*)`,
        anonymous: sql<number>`sum(case when ${leads.stage} = 'anonymous' then 1 else 0 end)`,
        identified: sql<number>`sum(case when ${leads.stage} = 'identified' then 1 else 0 end)`,
        qualified: sql<number>`sum(case when ${leads.stage} = 'qualified' then 1 else 0 end)`,
        reserved: sql<number>`sum(case when ${leads.stage} = 'reserved' then 1 else 0 end)`,
        converted: sql<number>`sum(case when ${leads.stage} = 'converted' then 1 else 0 end)`,
        lost: sql<number>`sum(case when ${leads.stage} = 'lost' then 1 else 0 end)`,
        avgDrift: sql<number>`avg(${leads.driftScore})`,
      }).from(leads)
        .where(and(eq(leads.orgId, ctx.orgId), isNull(leads.deletedAt)));

      const [viewingCounts] = await db.select({
        upcoming: sql<number>`count(*)`,
        thisWeek: sql<number>`count(*)`,
      }).from(viewings)
        .where(and(
          eq(viewings.orgId, ctx.orgId),
          eq(viewings.status, "confirmed"),
          sql`${viewings.scheduledAt} > now()`
        ));

      return { leads: leadCounts, viewings: viewingCounts };
    }),
});
