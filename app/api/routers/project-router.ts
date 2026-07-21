import { z } from "zod";
import { eq, and, desc, isNull } from "drizzle-orm";
import { createRouter, orgProcedure, writeProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { projects, units, buyers } from "@db/schema";

/* ═══════════════════════════════════════════
   PROJECT ROUTER — A1: Tenant Isolation
   orgProcedure verifies org membership.
   Project-scoped reads verify project.orgId === ctx.org.id.
   ═══════════════════════════════════════════ */

export const projectRouter = createRouter({
  /* ── List projects for authenticated org ── */
  list: orgProcedure
    .input(z.object({
      status: z.string().optional(),
      type: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [
        eq(projects.orgId, ctx.org!.id),
        isNull(projects.deletedAt),
      ];
      if (input.status) conditions.push(eq(projects.status, input.status as any));
      if (input.type) conditions.push(eq(projects.type, input.type as any));

      return db.select().from(projects)
        .where(and(...conditions))
        .orderBy(desc(projects.updatedAt));
    }),

  /* ── Get single project with units + stats ── */
  /* Verify the project belongs to the authenticated org */
  getById: orgProcedure
    .input(z.object({
      id: z.number().int().positive(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const project = await db.select().from(projects)
        .where(and(
          eq(projects.id, input.id),
          eq(projects.orgId, ctx.org!.id),
          isNull(projects.deletedAt),
        ))
        .limit(1);

      if (!project[0]) return null;

      const unitList = await db.select().from(units)
        .where(and(eq(units.projectId, input.id), isNull(units.deletedAt)));

      const buyerList = await db.select().from(buyers)
        .where(and(eq(buyers.projectId, input.id), isNull(buyers.deletedAt)));

      // D7: Counts are computed, not denormalised
      const stats = {
        totalUnits: unitList.length,
        sold: unitList.filter((u) => u.status === "sold").length,
        available: unitList.filter((u) => u.status === "available").length,
        reserved: unitList.filter((u) => u.status === "reserved").length,
        totalValue: unitList.reduce((sum, u) => sum + Number(u.price || 0), 0),
        soldValue: unitList.filter((u) => u.status === "sold")
          .reduce((sum, u) => sum + Number(u.price || 0), 0),
      };

      return { project: project[0], units: unitList, buyers: buyerList, stats };
    }),

  /* ── Create project ── */
  create: writeProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      type: z.enum(["real-estate", "residential", "land-development", "construction", "manufacturing", "industrial", "oil-gas"]),
      stage: z.string().max(50).optional(),
      location: z.string().optional(),
      metadata: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(projects).values({
        orgId: ctx.org!.id,
        name: input.name,
        type: input.type,
        stage: (input.stage as any) || "planning",
        location: input.location ? JSON.parse(input.location) : null,
        metadata: input.metadata ? JSON.parse(input.metadata) : null,
      });
      return { id: Number(result[0].insertId) };
    }),

  /* ── Update project ── */
  update: writeProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(255).optional(),
      stage: z.string().max(50).optional(),
      status: z.enum(["active", "paused", "archived"]).optional(),
      metadata: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.stage) updates.stage = input.stage;
      if (input.status) updates.status = input.status;
      if (input.metadata) updates.metadata = JSON.parse(input.metadata);

      await db.update(projects).set(updates).where(and(
        eq(projects.id, input.id),
        eq(projects.orgId, ctx.org!.id),
      ));
      return { success: true };
    }),

  /* ── Soft delete (D8) ── */
  delete: writeProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.update(projects).set({
        status: "archived" as any,
        deletedAt: new Date(),
      }).where(and(
        eq(projects.id, input.id),
        eq(projects.orgId, ctx.org!.id),
      ));
      return { success: true };
    }),
});
