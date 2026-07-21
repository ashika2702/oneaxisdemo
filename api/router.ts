import { authRouter } from "./auth-router";
import { projectRouter } from "./routers/project-router";
import { unitRouter } from "./routers/unit-router";
import { buyerRouter, leadRouter } from "./routers/buyer-router";
import { analyticsRouter } from "./routers/analytics-router";
import { workflowRouter } from "./routers/workflow-router";
import { demandRouter } from "./routers/demand-router";
import { whatsappRouter } from "./routers/whatsapp-router";
import { crmRouter } from "./routers/crm-router";
import { campaignRouter } from "./routers/campaign-router";
import { keywordRouter } from "./routers/keyword-router";
import { widgetRouter } from "./routers/widget-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,

  // Core platform routers — A1: all use orgProcedure
  project: projectRouter,
  unit: unitRouter,
  buyer: buyerRouter,
  lead: leadRouter,
  analytics: analyticsRouter,
  workflow: workflowRouter,

  // Demand Intelligence Engine — AI-native demand generation
  demand: demandRouter,
  whatsapp: whatsappRouter,

  // CRM — lead management, viewings, timeline, notes
  crm: crmRouter,

  // Campaigns & Ads — marketing management
  campaign: campaignRouter,

  // SEO Keywords — keyword research & tracking
  keyword: keywordRouter,

  // Widget — embed widget configuration
  widget: widgetRouter,
});

export type AppRouter = typeof appRouter;
