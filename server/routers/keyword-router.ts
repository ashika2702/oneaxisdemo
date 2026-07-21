import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, orgProcedure } from "../middleware";
import { getDb } from "../queries/connection";
const db = getDb();
import { keywords } from "@db/schema";

export const keywordRouter = createRouter({
  list: orgProcedure
    .input(z.object({
      projectId: z.number().optional(),
      status: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(100),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [eq(keywords.orgId, ctx.orgId)];
      if (input?.projectId) conditions.push(eq(keywords.projectId, input.projectId));
      if (input?.status) conditions.push(eq(keywords.status, input.status as any));
      if (input?.search) conditions.push(sql`${keywords.keyword} like ${'%' + input.search + '%%'}`);

      return db.select().from(keywords)
        .where(and(...conditions))
        .orderBy(desc(keywords.createdAt))
        .limit(input?.limit || 100);
    }),

  getById: orgProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [row] = await db.select().from(keywords)
        .where(and(eq(keywords.id, input.id), eq(keywords.orgId, ctx.orgId)));
      return row || null;
    }),

  create: orgProcedure
    .input(z.object({
      projectId: z.number().optional(),
      keyword: z.string().min(1),
      searchVolume: z.number().optional(),
      difficulty: z.number().optional(),
      cpc: z.number().optional(),
      intent: z.enum(["informational", "navigational", "commercial", "transactional"]).optional(),
      source: z.enum(["ai_suggested", "manual", "imported"]).default("manual"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.insert(keywords).values({
        orgId: ctx.orgId,
        projectId: input.projectId,
        keyword: input.keyword,
        searchVolume: input.searchVolume,
        difficulty: input.difficulty,
        cpc: input.cpc?.toString(),
        intent: input.intent,
        source: input.source,
        notes: input.notes,
        status: "pending",
        createdBy: ctx.userId,
      });
      return { id: Number(row.insertId) };
    }),

  createBatch: orgProcedure
    .input(z.object({
      projectId: z.number().optional(),
      items: z.array(z.object({
        keyword: z.string(),
        searchVolume: z.number().optional(),
        difficulty: z.number().optional(),
        cpc: z.number().optional(),
        intent: z.any().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.items.length === 0) return { count: 0 };
      const values = input.items.map(item => ({
        orgId: ctx.orgId,
        projectId: input.projectId,
        keyword: item.keyword,
        searchVolume: item.searchVolume,
        difficulty: item.difficulty,
        cpc: item.cpc?.toString(),
        intent: item.intent,
        source: "ai_suggested" as any,
        status: "pending" as any,
        createdBy: ctx.userId,
      }));
      const result = await db.insert(keywords).values(values);
      return { count: Number(result[0].insertId) ? input.items.length : 0 };
    }),

  update: orgProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "rejected", "active", "paused"]).optional(),
      currentRank: z.number().optional(),
      targetRank: z.number().optional(),
      contentUrl: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      await db.update(keywords)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(keywords.id, id), eq(keywords.orgId, ctx.orgId)));
      return { success: true };
    }),

  delete: orgProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(keywords)
        .where(and(eq(keywords.id, input.id), eq(keywords.orgId, ctx.orgId)));
      return { success: true };
    }),

  stats: orgProcedure
    .input(z.object({ projectId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [eq(keywords.orgId, ctx.orgId)];
      if (input?.projectId) conditions.push(eq(keywords.projectId, input.projectId));

      const [result] = await db.select({
        total: sql<number>`count(*)`,
        pending: sql<number>`sum(case when ${keywords.status} = 'pending' then 1 else 0 end)`,
        approved: sql<number>`sum(case when ${keywords.status} = 'approved' then 1 else 0 end)`,
        active: sql<number>`sum(case when ${keywords.status} = 'active' then 1 else 0 end)`,
        avgVolume: sql<number>`avg(${keywords.searchVolume})`,
        avgDifficulty: sql<number>`avg(${keywords.difficulty})`,
      }).from(keywords).where(and(...conditions));

      return result;
    }),
});
