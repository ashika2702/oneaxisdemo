import { z } from "zod";
import { eq, and, desc, isNull } from "drizzle-orm";
import { createRouter, orgProcedure } from "../middleware";
import { getDb } from "../queries/connection";
const db = getDb();
import { campaigns, adCreatives } from "@db/schema";

export const campaignRouter = createRouter({
  list: orgProcedure
    .input(z.object({ projectId: z.number().optional(), status: z.string().optional(), limit: z.number().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [eq(campaigns.orgId, ctx.orgId), isNull(campaigns.deletedAt)];
      if (input?.projectId) conditions.push(eq(campaigns.projectId, input.projectId));
      if (input?.status) conditions.push(eq(campaigns.status, input.status as any));

      const rows = await db.select().from(campaigns)
        .where(and(...conditions))
        .orderBy(desc(campaigns.createdAt))
        .limit(input?.limit || 50);
      return rows;
    }),

  getById: orgProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [row] = await db.select().from(campaigns)
        .where(and(eq(campaigns.id, input.id), eq(campaigns.orgId, ctx.orgId)));
      return row || null;
    }),

  create: orgProcedure
    .input(z.object({
      name: z.string().min(1),
      projectId: z.number().optional(),
      objective: z.enum(["brand_awareness", "lead_generation", "engagement", "conversions", "retargeting"]).default("lead_generation"),
      budget: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      targetAudience: z.any().optional(),
      aiPlan: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.insert(campaigns).values({
        orgId: ctx.orgId,
        projectId: input.projectId,
        name: input.name,
        objective: input.objective,
        budget: input.budget?.toString(),
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        targetAudience: input.targetAudience,
        aiPlan: input.aiPlan,
        status: "draft",
        createdBy: ctx.userId,
      });
      return { id: Number(row.insertId) };
    }),

  update: orgProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      objective: z.any().optional(),
      status: z.enum(["draft", "planned", "active", "paused", "completed", "archived"]).optional(),
      budget: z.number().optional(),
      spent: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      targetAudience: z.any().optional(),
      aiPlan: z.any().optional(),
      performance: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      await db.update(campaigns)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(campaigns.id, id), eq(campaigns.orgId, ctx.orgId)));
      return { success: true };
    }),

  delete: orgProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(campaigns)
        .set({ status: "archived" as any, updatedAt: new Date() })
        .where(and(eq(campaigns.id, input.id), eq(campaigns.orgId, ctx.orgId)));
      return { success: true };
    }),

  /* ═════════════════ AD CREATIVES ═════════════════ */
  creatives: orgProcedure
    .input(z.object({ campaignId: z.number().optional(), projectId: z.number().optional(), limit: z.number().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [eq(adCreatives.orgId, ctx.orgId)];
      if (input?.campaignId) conditions.push(eq(adCreatives.campaignId, input.campaignId));
      if (input?.projectId) conditions.push(eq(adCreatives.projectId, input.projectId));
      return db.select().from(adCreatives)
        .where(and(...conditions))
        .orderBy(desc(adCreatives.createdAt))
        .limit(input?.limit || 50);
    }),

  createCreative: orgProcedure
    .input(z.object({
      campaignId: z.number().optional(),
      projectId: z.number().optional(),
      platform: z.enum(["google", "meta", "whatsapp", "native", "display"]),
      name: z.string().min(1),
      headline: z.string().optional(),
      description: z.string().optional(),
      ctaText: z.string().optional(),
      destinationUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.insert(adCreatives).values({
        orgId: ctx.orgId,
        campaignId: input.campaignId,
        projectId: input.projectId,
        platform: input.platform,
        name: input.name,
        headline: input.headline,
        description: input.description,
        ctaText: input.ctaText,
        destinationUrl: input.destinationUrl,
        status: "draft",
        createdBy: ctx.userId,
      });
      return { id: Number(row.insertId) };
    }),

  updateCreative: orgProcedure
    .input(z.object({
      id: z.number(),
      headline: z.string().optional(),
      description: z.string().optional(),
      ctaText: z.string().optional(),
      status: z.enum(["draft", "review", "approved", "live", "paused"]).optional(),
      performance: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      await db.update(adCreatives)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(adCreatives.id, id), eq(adCreatives.orgId, ctx.orgId)));
      return { success: true };
    }),
});
