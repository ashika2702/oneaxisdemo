import { z } from "zod";
import { eq, and, isNull } from "drizzle-orm";
import { createRouter, orgProcedure, writeProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { units, projects } from "@db/schema";

export const unitRouter = createRouter({
  list: orgProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      // Verify project belongs to org
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) return [];

      return db.select().from(units)
        .where(and(eq(units.projectId, input.projectId), isNull(units.deletedAt)));
    }),

  getById: orgProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.select().from(units)
        .where(and(eq(units.id, input.id), isNull(units.deletedAt)))
        .limit(1);
      if (!result[0]) return null;
      // Verify via project
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, result[0].projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) return null;
      return result[0];
    }),

  create: writeProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      unitNumber: z.string().min(1).max(50),
      floor: z.number().int().min(-5).max(200).optional(),
      unitType: z.string().max(100).optional(),
      area: z.string().optional(),
      bedrooms: z.number().int().min(0).max(20).optional(),
      bathrooms: z.number().int().min(0).max(20).optional(),
      price: z.string().optional(),
      basePrice: z.string().optional(),
      unitView: z.string().max(100).optional(),
      facing: z.string().max(50).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) throw new Error("Project not found");

      const result = await db.insert(units).values({
        projectId: input.projectId,
        unitNumber: input.unitNumber,
        floor: input.floor,
        unitType: input.unitType,
        area: input.area ? input.area : null,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        price: input.price ? input.price : null,
        basePrice: input.basePrice ? input.basePrice : null,
        unitView: input.unitView,
        facing: input.facing,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: writeProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["available", "sold", "reserved", "coming-soon", "held"]).optional(),
      price: z.string().optional(),
      materials: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const unit = await db.select({ projectId: units.projectId }).from(units)
        .where(eq(units.id, input.id)).limit(1);
      if (!unit[0]) throw new Error("Unit not found");
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, unit[0].projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) throw new Error("Access denied");

      const updates: any = {};
      if (input.status) updates.status = input.status;
      if (input.price) updates.price = input.price;
      if (input.materials) updates.materials = JSON.parse(input.materials);
      await db.update(units).set(updates).where(eq(units.id, input.id));
      return { success: true };
    }),
});
