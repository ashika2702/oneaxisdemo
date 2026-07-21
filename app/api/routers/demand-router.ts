import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, publicQuery, orgProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import {
  intentSignals, driftScores, agentTasks, nurtureSequences,
  nurtureJobs, leads
} from "@db/schema";
import { recordSignal, recalculateDriftScore, getLeadSignals } from "../lib/drift";
import { axisAgent } from "../lib/agent";
import { startNurtureSequence, processNurtureJobs } from "../lib/nurture";

export const demandRouter = createRouter({
  /* ─── Track intent signal ─── */
  trackSignal: publicQuery
    .input(z.object({
      orgId: z.number().int().positive(),
      signalType: z.string(),
      source: z.string(),
      channel: z.string().default("website"),
      leadId: z.number().int().optional(),
      visitorId: z.string().optional(),
      projectId: z.number().int().optional(),
      signalData: z.object({}).passthrough().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordSignal({
        orgId: input.orgId,
        signalType: input.signalType,
        source: input.source,
        channel: input.channel,
        leadId: input.leadId,
        visitorId: input.visitorId,
        projectId: input.projectId,
        signalData: input.signalData,
      });
      return { ok: true, signalId: (result as any)?.insertId ?? null };
    }),

  /* ─── Hot leads ─── */
  hotLeads: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      threshold: z.number().int().min(0).max(100).default(60),
      limit: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const scores = await db.select().from(driftScores)
        .where(eq(driftScores.orgId, input.orgId))
        .orderBy(desc(driftScores.score))
        .limit(input.limit);

      const enriched = [];
      for (const score of scores) {
        if (score.score < input.threshold) continue;
        const lead = await db.select().from(leads)
          .where(eq(leads.id, score.leadId))
          .limit(1);
        if (lead[0]) {
          const signals = await db.select().from(intentSignals)
            .where(eq(intentSignals.leadId, score.leadId))
            .orderBy(desc(intentSignals.createdAt))
            .limit(3);
          enriched.push({ ...score, lead: lead[0], recentSignals: signals });
        }
      }
      return enriched;
    }),

  /* ─── Drift score ─── */
  driftScore: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      leadId: z.number().int().positive(),
    }))
    .query(async ({ input }) => {
      const score = await getDb().select().from(driftScores)
        .where(eq(driftScores.leadId, input.leadId))
        .limit(1);
      const signals = await getLeadSignals(input.leadId, 20);
      return { score: score[0] ?? null, signals };
    }),

  /* ─── Recalculate drift ─── */
  recalculate: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      leadId: z.number().int().positive(),
    }))
    .mutation(async ({ input }) => {
      return recalculateDriftScore(input.orgId, input.leadId);
    }),

  /* ─── Funnel stats ─── */
  funnelStats: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      days: z.number().int().min(1).max(365).default(30),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const since = new Date(Date.now() - input.days * 24 * 3600 * 1000);

      const allSignals = await db.select().from(intentSignals)
        .where(eq(intentSignals.orgId, input.orgId));
      const hotLeadScores = await db.select().from(driftScores)
        .where(eq(driftScores.orgId, input.orgId));
      const pendingTasks = await db.select().from(agentTasks)
        .where(and(eq(agentTasks.orgId, input.orgId), eq(agentTasks.status, "pending")));
      const activeNurture = await db.select().from(nurtureJobs)
        .where(and(eq(nurtureJobs.orgId, input.orgId), eq(nurtureJobs.status, "pending")));

      const recentSignals = allSignals.filter(s => s.createdAt && s.createdAt >= since);
      const uniqueVisitors = new Set(recentSignals.map(s => s.visitorId).filter(Boolean));
      const uniqueLeads = new Set(recentSignals.map(s => s.leadId).filter(Boolean));

      return {
        impressions: allSignals.length,
        signalsCaptured: recentSignals.length,
        uniqueVisitors: uniqueVisitors.size,
        uniqueLeads: uniqueLeads.size,
        leadsQualified: hotLeadScores.filter(s => s.score >= 50).length,
        hotLeads: hotLeadScores.filter(s => s.score >= 80).length,
        pendingTasks: pendingTasks.length,
        activeNurtureJobs: activeNurture.length,
        signalBreakdown: recentSignals.reduce((acc, s) => {
          acc[s.signalType] = (acc[s.signalType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        channelBreakdown: recentSignals.reduce((acc, s) => {
          acc[s.channel] = (acc[s.channel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    }),

  /* ─── Tasks ─── */
  tasks: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      status: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.status) {
        return db.select().from(agentTasks)
          .where(and(eq(agentTasks.orgId, input.orgId), eq(agentTasks.status, input.status as any)))
          .orderBy(desc(agentTasks.createdAt))
          .limit(input.limit);
      }
      return db.select().from(agentTasks)
        .where(eq(agentTasks.orgId, input.orgId))
        .orderBy(desc(agentTasks.createdAt))
        .limit(input.limit);
    }),

  /* ─── Update task ─── */
  updateTask: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      taskId: z.number().int().positive(),
      status: z.enum(["pending", "in_progress", "done", "cancelled"]),
      assignedTo: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      await getDb().update(agentTasks).set({
        status: input.status,
        ...(input.assignedTo ? { assignedTo: input.assignedTo } : {}),
        ...(input.status === "done" ? { completedAt: new Date() } : {}),
      }).where(eq(agentTasks.id, input.taskId));
      return { ok: true };
    }),

  /* ─── Nurture sequences ─── */
  nurtureSequences: orgProcedure
    .input(z.object({ orgId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getDb().select().from(nurtureSequences)
        .where(eq(nurtureSequences.orgId, input.orgId))
        .orderBy(desc(nurtureSequences.createdAt));
    }),

  /* ─── Create nurture sequence ─── */
  createNurtureSequence: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      name: z.string().min(1),
      triggerStage: z.enum(["captured", "identified", "qualified", "hot"]),
      steps: z.array(z.object({
        delayHours: z.number().int().min(0),
        channel: z.enum(["whatsapp", "email"]),
        template: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const [result] = await getDb().insert(nurtureSequences).values({
        orgId: input.orgId,
        name: input.name,
        triggerStage: input.triggerStage,
        steps: input.steps as any,
        isActive: true,
      });
      return { ok: true, id: (result as any).insertId };
    }),

  /* ─── Process nurture (cron) ─── */
  processNurture: publicQuery
    .query(async () => {
      const results = await processNurtureJobs();
      return { processed: results.length, results };
    }),

  /* ─── Start nurture ─── */
  startNurture: orgProcedure
    .input(z.object({
      orgId: z.number().int().positive(),
      leadId: z.number().int().positive(),
      triggerStage: z.string().default("captured"),
    }))
    .mutation(async ({ input }) => {
      await startNurtureSequence(input.orgId, input.leadId, input.triggerStage);
      return { ok: true };
    }),

  /* ─── Axis agent chat ─── */
  agentChat: publicQuery
    .input(z.object({
      orgId: z.number().int().positive(),
      message: z.string().min(1),
      leadId: z.number().int().optional(),
      projectId: z.number().int().optional(),
      channel: z.enum(["whatsapp", "email", "web"]).default("web"),
    }))
    .mutation(async ({ input }) => {
      if (input.leadId) {
        await recordSignal({
          orgId: input.orgId,
          leadId: input.leadId,
          signalType: "whatsapp_message",
          source: "axis_agent",
          channel: input.channel,
          signalData: { message: input.message, agent: true },
        });
        await recalculateDriftScore(input.orgId, input.leadId);
      }
      return axisAgent(input.message, {
        orgId: input.orgId,
        leadId: input.leadId,
        projectId: input.projectId,
        channel: input.channel,
      });
    }),

  /* ─── Capture sources ─── */
  captureSources: orgProcedure
    .input(z.object({ orgId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const signals = await getDb().select().from(intentSignals)
        .where(eq(intentSignals.orgId, input.orgId));

      const sources = ["embed_widget", "whatsapp", "social_media", "search", "referral", "partner", "direct"];
      return sources.map(name => {
        const sourceSignals = signals.filter(s => s.source === name || s.channel === name);
        const uniqueLeads = new Set(sourceSignals.map(s => s.leadId).filter(Boolean));
        return {
          name,
          leadsCaptured: uniqueLeads.size,
          signals: sourceSignals.length,
          conversionRate: sourceSignals.length > 0
            ? Math.round((uniqueLeads.size / sourceSignals.length) * 100)
            : 0,
        };
      });
    }),
});
