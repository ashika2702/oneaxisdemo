import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, orgProcedure } from "../middleware";
import { getDb } from "../queries/connection";
const db = getDb();
import { widgetConfigs } from "@db/schema";

function generateEmbedCode(projectId: number, config: any): string {
  return `<script>
  (function() {
    var s = document.createElement('script');
    s.src = 'https://oneaxis.live/widget.js?pid=${projectId}';
    s.async = true;
    s.dataset.primaryColor = '${config.primaryColor || "#C8B89A"}';
    s.dataset.theme = '${config.theme || "auto"}';
    document.head.appendChild(s);
  })();
</script>`;
}

export const widgetRouter = createRouter({
  get: orgProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const [row] = await db.select().from(widgetConfigs)
        .where(and(
          eq(widgetConfigs.orgId, ctx.orgId),
          eq(widgetConfigs.projectId, input.projectId)
        ));
      return row || null;
    }),

  upsert: orgProcedure
    .input(z.object({
      projectId: z.number(),
      theme: z.enum(["light", "dark", "auto"]).optional(),
      primaryColor: z.string().optional(),
      features: z.any().optional(),
      amenities: z.any().optional(),
      displayOptions: z.any().optional(),
      leadFormFields: z.any().optional(),
      autoOpen: z.boolean().optional(),
      greetingMessage: z.string().optional(),
      analyticsEnabled: z.boolean().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { projectId, ...data } = input;

      const [existing] = await db.select().from(widgetConfigs)
        .where(and(eq(widgetConfigs.orgId, ctx.orgId), eq(widgetConfigs.projectId, projectId)));

      const embedCode = generateEmbedCode(projectId, data);
      const installInstructions = `<!-- Add this single line before </head> -->
${embedCode}`;

      if (existing) {
        await db.update(widgetConfigs)
          .set({ ...data, embedCode, installInstructions, updatedAt: new Date() })
          .where(eq(widgetConfigs.id, existing.id));
        return { id: existing.id, updated: true };
      } else {
        const [row] = await db.insert(widgetConfigs).values({
          orgId: ctx.orgId,
          projectId,
          ...data,
          embedCode,
          installInstructions,
        });
        return { id: Number(row.insertId), created: true };
      }
    }),

  trackImpression: orgProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db.select().from(widgetConfigs)
        .where(and(eq(widgetConfigs.orgId, ctx.orgId), eq(widgetConfigs.projectId, input.projectId)));
      if (existing) {
        await db.update(widgetConfigs)
          .set({ impressions: (existing.impressions || 0) + 1, updatedAt: new Date() })
          .where(eq(widgetConfigs.id, existing.id));
      }
      return { success: true };
    }),

  trackClick: orgProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db.select().from(widgetConfigs)
        .where(and(eq(widgetConfigs.orgId, ctx.orgId), eq(widgetConfigs.projectId, input.projectId)));
      if (existing) {
        await db.update(widgetConfigs)
          .set({ clicks: (existing.clicks || 0) + 1, updatedAt: new Date() })
          .where(eq(widgetConfigs.id, existing.id));
      }
      return { success: true };
    }),

  trackLead: orgProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db.select().from(widgetConfigs)
        .where(and(eq(widgetConfigs.orgId, ctx.orgId), eq(widgetConfigs.projectId, input.projectId)));
      if (existing) {
        await db.update(widgetConfigs)
          .set({ leadsCaptured: (existing.leadsCaptured || 0) + 1, updatedAt: new Date() })
          .where(eq(widgetConfigs.id, existing.id));
      }
      return { success: true };
    }),
});
