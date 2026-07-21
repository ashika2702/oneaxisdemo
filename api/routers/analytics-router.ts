import { z } from "zod";
import { eq, and, sql, isNull } from "drizzle-orm";
import { createRouter, orgProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { projects, units, buyers, leads, activityEvents } from "@db/schema";

export const analyticsRouter = createRouter({
  dashboard: orgProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).default(25).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [
        eq(projects.orgId, ctx.org!.id),
        eq(projects.status, "active" as any),
        isNull(projects.deletedAt),
      ];
      const projectList = await db.select().from(projects).where(and(...conditions));
      const pIds = projectList.map((p) => p.id);
      if (pIds.length === 0) {
        return { summary: { totalProjects: 0, totalUnits: 0, soldUnits: 0, totalBuyers: 0, atRiskBuyers: 0, totalLeads: 0, hotLeads: 0, totalValue: 0, soldValue: 0 }, projects: [], recentActivity: [] };
      }

      const allUnits = await db.select().from(units).where(sql`${units.projectId} IN (${pIds.join(",")})`);
      const allBuyers = await db.select().from(buyers).where(sql`${buyers.projectId} IN (${pIds.join(",")})`);
      // D3: driftScore lives on leads, not buyers
      const allLeads = await db.select().from(leads).where(sql`${leads.projectId} IN (${pIds.join(",")})`);
      const recentEvents = await db.select().from(activityEvents)
        .where(eq(activityEvents.orgId, ctx.org!.id))
        .limit(input.limit || 50);

      return {
        summary: {
          totalProjects: projectList.length,
          totalUnits: allUnits.length,
          soldUnits: allUnits.filter((u) => u.status === "sold").length,
          totalBuyers: allBuyers.length,
          atRiskBuyers: allBuyers.filter((b) => b.status === "at-risk").length,
          // D3: leads analytics
          totalLeads: allLeads.length,
          hotLeads: allLeads.filter((l) => (l.driftScore || 0) > 70).length,
          totalValue: allUnits.reduce((s, u) => s + Number(u.price || 0), 0),
          soldValue: allUnits.filter((u) => u.status === "sold").reduce((s, u) => s + Number(u.price || 0), 0),
        },
        projects: projectList.map((p) => ({
          ...p,
          unitCount: allUnits.filter((u) => u.projectId === p.id).length,
          soldCount: allUnits.filter((u) => u.projectId === p.id && u.status === "sold").length,
        })),
        recentActivity: recentEvents,
      };
    }),

  projectPulse: orgProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const proj = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, input.projectId), eq(projects.orgId, ctx.org!.id)))
        .limit(1);
      if (!proj[0]) return null;

      const unitList = await db.select().from(units).where(eq(units.projectId, input.projectId));
      const buyerList = await db.select().from(buyers).where(eq(buyers.projectId, input.projectId));
      // D3: leads carry driftScore and "reserved" stage
      const leadList = await db.select().from(leads).where(eq(leads.projectId, input.projectId));
      const events = await db.select().from(activityEvents).where(eq(activityEvents.projectId, input.projectId));

      return {
        attentionFlow: {
          totalVisitors: events.filter((e) => e.eventType === "page_view").length,
          avgDwellTime: "4m 32s",
          // D3: reserved count comes from leads, not buyers
          visitorToReserve: unitList.length > 0
            ? ((leadList.filter((l) => l.stage === "reserved").length / unitList.length) * 100).toFixed(1)
            : "0",
          upgradeRevenue: 124000,
        },
        units: {
          byStatus: {
            available: unitList.filter((u) => u.status === "available").length,
            sold: unitList.filter((u) => u.status === "sold").length,
            reserved: unitList.filter((u) => u.status === "reserved").length,
            comingSoon: unitList.filter((u) => u.status === "coming-soon").length,
          },
          byType: Object.entries(
            unitList.reduce((acc, u) => {
              acc[u.unitType || "Unknown"] = (acc[u.unitType || "Unknown"] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => ({ type, count })),
        },
        buyers: {
          total: buyerList.length,
          byStatus: Object.entries(
            buyerList.reduce((acc, b) => {
              acc[b.status] = (acc[b.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([status, count]) => ({ status, count })),
          // D3: at-risk is a buyer status now (not riskScore)
          atRisk: buyerList.filter((b) => b.status === "at-risk"),
        },
        // D3: leads section with driftScore
        leads: {
          total: leadList.length,
          byStage: Object.entries(
            leadList.reduce((acc, l) => {
              acc[l.stage] = (acc[l.stage] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([stage, count]) => ({ stage, count })),
          hot: leadList.filter((l) => (l.driftScore || 0) > 70),
          avgDriftScore: leadList.length > 0
            ? Math.round(leadList.reduce((s, l) => s + (l.driftScore || 0), 0) / leadList.length)
            : 0,
        },
      };
    }),
});
