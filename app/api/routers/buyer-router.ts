import { z } from "zod";
import { eq, and, desc, isNull } from "drizzle-orm";
import { createRouter, orgProcedure, salesProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { buyers, projects, leads } from "@db/schema";

export const buyerRouter = createRouter({
  list: orgProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      status: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) return [];

      const conditions = [
        eq(buyers.projectId, input.projectId),
        isNull(buyers.deletedAt),
      ];
      if (input.status) conditions.push(eq(buyers.status, input.status as any));

      return db.select().from(buyers)
        .where(and(...conditions))
        .orderBy(desc(buyers.createdAt));
    }),

  create: salesProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      leadId: z.number().int().positive().optional(),
      unitId: z.number().int().positive().optional(),
      fullName: z.string().min(1).max(255),
      email: z.string().email().max(320),
      phone: z.string().max(50).optional(),
      assignedAgentId: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) throw new Error("Project not found");

      const result = await db.insert(buyers).values({
        leadId: input.leadId,
        projectId: input.projectId,
        unitId: input.unitId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        assignedAgentId: input.assignedAgentId,
      });
      return { id: Number(result[0].insertId) };
    }),
});

export const leadRouter = createRouter({
  list: orgProcedure
    .input(z.object({
      projectId: z.number().int().positive().optional(),
      stage: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(25),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(leads.orgId, ctx.org!.id), isNull(leads.deletedAt)];
      if (input.projectId) conditions.push(eq(leads.projectId, input.projectId));
      if (input.stage) conditions.push(eq(leads.stage, input.stage as any));
      return db.select().from(leads)
        .where(and(...conditions))
        .orderBy(desc(leads.createdAt))
        .limit(input.limit);
    }),
});
