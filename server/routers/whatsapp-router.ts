import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { leads, whatsappSessions } from "@db/schema";
import { axisAgent } from "../lib/agent";
import { sendWhatsAppMessage, parseWebhookPayload, markMessageRead } from "../lib/whatsapp";
import { recordSignal, recalculateDriftScore } from "../lib/drift";
import { startNurtureSequence } from "../lib/nurture";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "oneaxis-dev-token";

export const whatsappRouter = createRouter({
  /* ─── Meta webhook verification (GET) ─── */
  verifyWebhook: publicQuery
    .input(z.object({
      "hub.mode": z.string().optional(),
      "hub.verify_token": z.string().optional(),
      "hub.challenge": z.string().optional(),
    }))
    .query(async ({ input }) => {
      if (
        input["hub.mode"] === "subscribe" &&
        input["hub.verify_token"] === VERIFY_TOKEN
      ) {
        console.log("[WhatsApp] Webhook verified");
        return input["hub.challenge"] ?? "OK";
      }
      return "Verification failed";
    }),

  /* ─── Receive messages (POST) ─── */
  receiveMessage: publicQuery
    .input(z.object({}).passthrough())
    .mutation(async ({ input }) => {
      const parsed = parseWebhookPayload(input as Record<string, any>);
      if (!parsed) {
        return { ok: true, type: "non_message" };
      }

      const { phone, text, messageId } = parsed;
      console.log(`[WhatsApp] ${phone}: ${text.substring(0, 50)}`);

      await markMessageRead(messageId);

      const db = getDb();

      // Find or create lead
      let lead = await db.select().from(leads)
        .where(eq(leads.phone, phone))
        .limit(1);

      let leadId: number;
      let orgId: number;

      if (!lead[0]) {
        orgId = 1;
        const [newLead] = await db.insert(leads).values({
          orgId,
          phone,
          stage: "identified",
          attribution: { channel: "whatsapp", firstMessage: text },
        });
        leadId = Number((newLead as any).insertId);
        await startNurtureSequence(orgId, leadId, "captured");
      } else {
        leadId = lead[0].id;
        orgId = lead[0].orgId;
      }

      // Record signal
      await recordSignal({
        orgId,
        leadId,
        signalType: "whatsapp_message",
        source: "whatsapp_inbound",
        channel: "whatsapp",
        signalData: { message: text, direction: "inbound" },
      });
      await recalculateDriftScore(orgId, leadId);

      // Update or create session
      const existingSession = await db.select().from(whatsappSessions)
        .where(eq(whatsappSessions.phoneNumber, phone))
        .limit(1);

      if (existingSession[0]) {
        await db.update(whatsappSessions).set({
          lastMessageAt: new Date(),
          messageCount: (existingSession[0].messageCount ?? 0) + 1,
          context: { ...((existingSession[0].context ?? {}) as any), lastIntent: text.substring(0, 100) },
        }).where(eq(whatsappSessions.id, existingSession[0].id));
      } else {
        await db.insert(whatsappSessions).values({
          orgId,
          leadId,
          phoneNumber: phone,
          lastMessageAt: new Date(),
          messageCount: 1,
          context: { firstMessage: text },
        });
      }

      // Get AI response and send
      const aiResponse = await axisAgent(text, {
        orgId,
        leadId,
        channel: "whatsapp",
      });
      await sendWhatsAppMessage(phone, aiResponse.text);

      // Record outbound
      await recordSignal({
        orgId,
        leadId,
        signalType: "whatsapp_message",
        source: "axis_agent",
        channel: "whatsapp",
        signalData: { message: aiResponse.text.substring(0, 200), direction: "outbound", intent: aiResponse.intent },
      });
      await recalculateDriftScore(orgId, leadId);

      return { ok: true, leadId, intent: aiResponse.intent, urgencyScore: aiResponse.urgencyScore };
    }),

  /* ─── Send outbound message ─── */
  sendMessage: publicQuery
    .input(z.object({
      to: z.string().min(5),
      text: z.string().min(1).max(2000),
      orgId: z.number().int().positive(),
      leadId: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      const sent = await sendWhatsAppMessage(input.to, input.text);

      if (input.leadId) {
        await recordSignal({
          orgId: input.orgId,
          leadId: input.leadId,
          signalType: "whatsapp_message",
          source: "manual_outbound",
          channel: "whatsapp",
          signalData: { message: input.text.substring(0, 200), direction: "outbound" },
        });
      }

      return { ok: sent };
    }),

  /* ─── Get WhatsApp sessions ─── */
  sessions: publicQuery
    .input(z.object({
      orgId: z.number().int().positive(),
      limit: z.number().int().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(whatsappSessions)
        .where(eq(whatsappSessions.orgId, input.orgId))
        .orderBy(whatsappSessions.lastMessageAt)
        .limit(input.limit);
    }),
});
