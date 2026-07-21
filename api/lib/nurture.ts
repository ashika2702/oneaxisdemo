/* ═══════════════════════════════════════════
   NURTURE ENGINE
   Scheduled lead nurturing via WhatsApp + email.
   Runs every hour via cron. Manages job queue.
   ═══════════════════════════════════════════ */

import { eq, and, lte } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { nurtureJobs, nurtureSequences, leads, driftScores } from "@db/schema";
import { generateNurtureMessage } from "./agent";
import { sendWhatsAppMessage } from "./whatsapp";
import { recordSignal } from "./drift";

/**
 * Process all pending nurture jobs.
 * Call this every hour via cron job.
 */
export async function processNurtureJobs() {
  const db = getDb();
  const now = new Date();

  // Find all jobs that are due
  const jobs = await db.select().from(nurtureJobs)
    .where(
      and(
        eq(nurtureJobs.status, "pending"),
        lte(nurtureJobs.scheduledFor, now)
      )
    );

  const results = [];

  for (const job of jobs) {
    try {
      // Get the sequence
      const sequence = await db.select().from(nurtureSequences)
        .where(eq(nurtureSequences.id, job.sequenceId))
        .limit(1);

      if (!sequence[0] || !sequence[0].isActive) {
        await db.update(nurtureJobs).set({ status: "cancelled" })
          .where(eq(nurtureJobs.id, job.id));
        continue;
      }

      const steps = sequence[0].steps as any[];
      const currentStep = steps[job.currentStep];

      if (!currentStep) {
        // No more steps — mark complete
        await db.update(nurtureJobs).set({ status: "completed" })
          .where(eq(nurtureJobs.id, job.id));
        continue;
      }

      // Get lead info
      const lead = await db.select().from(leads)
        .where(eq(leads.id, job.leadId))
        .limit(1);

      if (!lead[0]) {
        await db.update(nurtureJobs).set({ status: "cancelled" })
          .where(eq(nurtureJobs.id, job.id));
        continue;
      }

      // Check if lead is still at the right stage
      const score = await db.select().from(driftScores)
        .where(eq(driftScores.leadId, job.leadId))
        .limit(1);

      // Don't nurture if already hot (human takes over)
      if (score[0]?.score && score[0].score >= 80) {
        await db.update(nurtureJobs).set({ status: "completed" })
          .where(eq(nurtureJobs.id, job.id));
        continue;
      }

      // Generate and send message
      const message = await generateNurtureMessage(job.currentStep, job.leadId, job.orgId);

      let sent = false;
      if (currentStep.channel === "whatsapp" && lead[0].phone) {
        sent = await sendWhatsAppMessage(lead[0].phone, message);
      }

      // Record signal
      await recordSignal({
        orgId: job.orgId,
        leadId: job.leadId,
        signalType: "whatsapp_message",
        source: "nurture_engine",
        channel: currentStep.channel ?? "whatsapp",
        signalData: { step: job.currentStep, sequenceId: job.sequenceId, sent },
      });

      // Schedule next step or complete
      const nextStep = job.currentStep + 1;
      const nextStepDef = steps[nextStep];

      if (nextStepDef && nextStepDef.delayHours) {
        const nextScheduled = new Date(now.getTime() + nextStepDef.delayHours * 3600 * 1000);
        await db.update(nurtureJobs).set({
          currentStep: nextStep,
          scheduledFor: nextScheduled,
          lastMessageAt: now,
          status: "pending",
        }).where(eq(nurtureJobs.id, job.id));
      } else {
        await db.update(nurtureJobs).set({
          status: "completed",
          lastMessageAt: now,
        }).where(eq(nurtureJobs.id, job.id));
      }

      results.push({ jobId: job.id, sent, step: job.currentStep });
    } catch (err) {
      console.error("[Nurture] Job failed:", job.id, err);
      results.push({ jobId: job.id, sent: false, step: job.currentStep, error: true });
    }
  }

  return results;
}

/**
 * Start a nurture sequence for a lead.
 * Called when a new lead is captured.
 */
export async function startNurtureSequence(
  orgId: number,
  leadId: number,
  triggerStage: string
) {
  const db = getDb();

  // Find active sequence for this trigger stage
  const sequences = await db.select().from(nurtureSequences)
    .where(
      and(
        eq(nurtureSequences.orgId, orgId),
        eq(nurtureSequences.triggerStage, triggerStage as any),
        eq(nurtureSequences.isActive, true)
      )
    );

  const defaultSequence = sequences[0];

  // If no custom sequence, use the default
  if (!defaultSequence) {
    // Use hardcoded default sequence
    const steps = getDefaultSequence(triggerStage);
    const firstDelay = steps[0]?.delayHours ?? 0;

    await db.insert(nurtureJobs).values({
      orgId,
      leadId,
      sequenceId: 0, // 0 = default hardcoded sequence
      currentStep: 0,
      scheduledFor: new Date(Date.now() + firstDelay * 3600 * 1000),
      status: "pending",
    });

    return;
  }

  const steps = defaultSequence.steps as any[];
  const firstDelay = steps[0]?.delayHours ?? 0;

  await db.insert(nurtureJobs).values({
    orgId,
    leadId,
    sequenceId: defaultSequence.id,
    currentStep: 0,
    scheduledFor: new Date(Date.now() + firstDelay * 3600 * 1000),
    status: "pending",
  });
}

/**
 * Get the default nurture sequence (hardcoded fallback).
 */
function getDefaultSequence(triggerStage: string): Array<{ delayHours: number; channel: string }> {
  const captured = [
    { delayHours: 0, channel: "whatsapp" },     // Welcome immediately
    { delayHours: 24, channel: "whatsapp" },    // Day 1: matching units
    { delayHours: 72, channel: "whatsapp" },    // Day 3: market update
    { delayHours: 168, channel: "whatsapp" },   // Day 7: viewing offer
    { delayHours: 336, channel: "whatsapp" },   // Day 14: urgency
    { delayHours: 504, channel: "whatsapp" },   // Day 21: check-in
  ];

  const hot = [
    { delayHours: 0, channel: "whatsapp" },     // Immediate: viewing scheduled
    { delayHours: 24, channel: "whatsapp" },    // Day 1: follow up
    { delayHours: 48, channel: "whatsapp" },    // Day 2: proposal ready
  ];

  return triggerStage === "hot" ? hot : captured;
}

/**
 * Cancel all nurture jobs for a lead (e.g., when converted).
 */
export async function cancelNurtureForLead(leadId: number) {
  const db = getDb();
  await db.update(nurtureJobs)
    .set({ status: "cancelled" })
    .where(eq(nurtureJobs.leadId, leadId));
}
