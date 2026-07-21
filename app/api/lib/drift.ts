/* ═══════════════════════════════════════════
   DRIFT SCORING ENGINE
   Rules-based scoring. Replace with ML model later.
   Every interaction updates the score in real-time.
   ═══════════════════════════════════════════ */

import { eq, desc } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { intentSignals, driftScores, leads, agentTasks } from "@db/schema";

// Score weights for each signal type
const SCORE_WEIGHTS: Record<string, number> = {
  page_view: 5,
  return_visit: 15,
  floor_plan_view: 10,
  "3d_model_interact": 20,
  pricing_click: 25,
  comparison: 20,
  brochure_download: 15,
  mortgage_calc: 30,
  viewing_request: 40,
  whatsapp_message: 20,
  email_open: 5,
  social_click: 10,
  search_arrival: 15,
  referral: 35,
  partner_embed: 10,
};

// Time decay: signals older than this lose relevance
const DECAY_DAYS = 30;

interface ScoreFactors {
  recencyScore: number;
  frequencyScore: number;
  depthScore: number;
  channelScore: number;
  signalCount: number;
}

/** 
 * Record a new intent signal and update the lead's drift score.
 * Call this from every touchpoint: website tracker, WhatsApp webhook, email pixel, etc.
 */
export async function recordSignal(params: {
  orgId: number;
  signalType: string;
  source: string;
  channel: string;
  leadId?: number;
  visitorId?: string;
  projectId?: number;
  signalData?: Record<string, any>;
}) {
  const db = getDb();

  // 1. Store the signal
  const [signal] = await db.insert(intentSignals).values({
    orgId: params.orgId,
    leadId: params.leadId ?? null,
    visitorId: params.visitorId ?? null,
    projectId: params.projectId ?? null,
    signalType: params.signalType as any,
    source: params.source,
    channel: params.channel as any,
    signalData: params.signalData ?? null,
    driftScoreDelta: SCORE_WEIGHTS[params.signalType] ?? 5,
    processedAt: new Date(),
  });

  // 2. If we have a leadId, recalculate drift score
  if (params.leadId) {
    await recalculateDriftScore(params.orgId, params.leadId);
  }

  return signal;
}

/**
 * Recalculate a lead's drift score from all their signals.
 * This is called after every signal, and can also be run as a batch job.
 */
export async function recalculateDriftScore(orgId: number, leadId: number) {
  const db = getDb();

  // Get all signals for this lead in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - DECAY_DAYS * 24 * 3600 * 1000);
  const signals = await db.select().from(intentSignals)
    .where(eq(intentSignals.leadId, leadId))
    .orderBy(desc(intentSignals.createdAt));

  const recentSignals = signals.filter(s => s.createdAt && s.createdAt >= thirtyDaysAgo);

  // Calculate components
  const factors = calculateFactors(recentSignals);

  // Base score from weighted signals
  let score = Math.min(100, Math.max(0,
    factors.recencyScore * 0.35 +
    factors.frequencyScore * 0.25 +
    factors.depthScore * 0.25 +
    factors.channelScore * 0.15
  ));

  // Round to integer
  score = Math.round(score);

  // Determine trend
  const oldScore = await db.select().from(driftScores)
    .where(eq(driftScores.leadId, leadId))
    .orderBy(desc(driftScores.computedAt))
    .limit(1);

  let trend: "rising" | "steady" | "cooling" | "cold" = "cold";
  if (oldScore[0]) {
    const delta = score - oldScore[0].score;
    if (delta > 10) trend = "rising";
    else if (delta > -5) trend = "steady";
    else if (delta > -20) trend = "cooling";
    else trend = "cold";
  }

  // Upsert drift score
  const existing = await db.select().from(driftScores)
    .where(eq(driftScores.leadId, leadId))
    .limit(1);

  if (existing[0]) {
    await db.update(driftScores).set({
      score,
      factors: factors as any,
      trend,
      lastSignalAt: new Date(),
      computedAt: new Date(),
    }).where(eq(driftScores.id, existing[0].id));
  } else {
    await db.insert(driftScores).values({
      orgId,
      leadId,
      score,
      factors: factors as any,
      trend,
      lastSignalAt: new Date(),
      computedAt: new Date(),
    });
  }

  // 3. Check for hot route
  if (score >= 80 && (!existing[0] || !existing[0].hotRoutedAt)) {
    await triggerHotRoute(orgId, leadId, score, signals);
  }

  return { score, trend, factors };
}

function calculateFactors(signals: typeof intentSignals.$inferSelect[]): ScoreFactors {
  const now = Date.now();
  const weights: number[] = [];
  const depthSignals = ["pricing_click", "3d_model_interact", "mortgage_calc", "viewing_request"];
  const highValueChannels = ["referral", "whatsapp"];

  for (const s of signals) {
    const age = s.createdAt ? (now - s.createdAt.getTime()) / (1000 * 3600 * 24) : 30;
    const decay = Math.exp(-age / DECAY_DAYS);
    const weight = (SCORE_WEIGHTS[s.signalType] ?? 5) * decay;
    weights.push(weight);
  }

  const recencyScore = Math.min(100, weights.reduce((a, b) => a + b, 0));
  const frequencyScore = Math.min(100, signals.length * 8);
  const depthScore = Math.min(100, signals.filter(s => depthSignals.includes(s.signalType)).length * 20);
  const channelScore = Math.min(100, signals.filter(s => highValueChannels.includes(s.channel)).length * 25);

  return { recencyScore, frequencyScore, depthScore, channelScore, signalCount: signals.length };
}

/**
 * When a lead's score crosses 80, create tasks for the sales team.
 */
async function triggerHotRoute(
  orgId: number,
  leadId: number,
  score: number,
  signals: typeof intentSignals.$inferSelect[]
) {
  const db = getDb();

  // Get lead info
  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead[0]) return;

  // Find which project they're interested in
  const projectSignals = signals.filter(s => s.projectId);
  const topProjectId = projectSignals[0]?.projectId;

  // 1. Create hot route notification task
  await db.insert(agentTasks).values({
    orgId,
    leadId,
    taskType: "hot_route_notify",
    status: "pending",
    draftContent: `HOT LEAD ALERT: ${lead[0].name || "Unknown"} has drift score ${score}/100. ` +
      `Recent signals: ${signals.slice(0, 3).map(s => s.signalType).join(", ")}. ` +
      `Interest: ${topProjectId ? "Project " + topProjectId : "General"}`,
    suggestedAction: "Contact immediately — optimal within 2 hours",
    metadata: { score, topSignalTypes: signals.slice(0, 5).map(s => s.signalType) },
    dueAt: new Date(Date.now() + 2 * 3600 * 1000), // 2 hours
  });

  // 2. Mark drift score as hot routed
  await db.update(driftScores).set({
    hotRoutedAt: new Date(),
  }).where(eq(driftScores.leadId, leadId));

  // 3. Create viewing task if they showed viewing intent
  const hasViewingIntent = signals.some(s =>
    s.signalType === "viewing_request" || s.signalType === "3d_model_interact"
  );
  if (hasViewingIntent) {
    await db.insert(agentTasks).values({
      orgId,
      leadId,
      taskType: "schedule_viewing",
      status: "pending",
      draftContent: `${lead[0].name || "Lead"} has shown viewing intent. ` +
        `Score: ${score}. Schedule a site visit or virtual tour.`,
      suggestedAction: "Schedule viewing within 24 hours",
      dueAt: new Date(Date.now() + 24 * 3600 * 1000),
    });
  }

  // 4. Update lead stage
  if (lead[0].stage !== "reserved" && lead[0].stage !== "converted") {
    await db.update(leads).set({ stage: "qualified" }).where(eq(leads.id, leadId));
  }
}

/**
 * Get top leads by drift score for an org.
 */
export async function getHotLeads(orgId: number, limit = 20) {
  const db = getDb();
  return db.select().from(driftScores)
    .where(eq(driftScores.orgId, orgId))
    .orderBy(desc(driftScores.score))
    .limit(limit);
}

/**
 * Get signal history for a lead.
 */
export async function getLeadSignals(leadId: number, limit = 50) {
  const db = getDb();
  return db.select().from(intentSignals)
    .where(eq(intentSignals.leadId, leadId))
    .orderBy(desc(intentSignals.createdAt))
    .limit(limit);
}
