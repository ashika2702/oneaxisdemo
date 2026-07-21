import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, orgProcedure, writeProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { workflows, projects } from "@db/schema";

export const workflowRouter = createRouter({
  list: orgProcedure
    .input(z.object({
      projectId: z.number().int().positive().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(workflows.orgId, ctx.org!.id)];
      if (input.projectId) {
        const proj = await db.select({ id: projects.id }).from(projects)
          .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
          .limit(1);
        if (!proj[0]) return [];
        conditions.push(eq(workflows.projectId, input.projectId));
      }
      return db.select().from(workflows)
        .where(and(...conditions))
        .orderBy(desc(workflows.updatedAt));
    }),

  create: writeProcedure
    .input(z.object({
      projectId: z.number().int().positive().optional(),
      name: z.string().min(1).max(255),
      trigger: z.string().max(100),
      conditions: z.string().optional(),
      actions: z.string(),
      recipients: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      if (input.projectId) {
        const proj = await db.select({ id: projects.id }).from(projects)
          .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
          .limit(1);
        if (!proj[0]) throw new Error("Project not found");
      }
      const result = await db.insert(workflows).values({
        orgId: ctx.org!.id,
        projectId: input.projectId,
        name: input.name,
        trigger: input.trigger,
        conditions: input.conditions ? JSON.parse(input.conditions) : null,
        actions: JSON.parse(input.actions),
        recipients: JSON.parse(input.recipients),
      });
      return { id: Number(result[0].insertId) };
    }),

  updateStatus: writeProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["draft", "live", "archived"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const wf = await db.select().from(workflows)
        .where(and(eq(workflows.id, input.id), eq(workflows.orgId, ctx.org!.id)))
        .limit(1);
      if (!wf[0]) throw new Error("Workflow not found");

      await db.update(workflows).set({ status: input.status }).where(eq(workflows.id, input.id));
      return { success: true };
    }),
});
