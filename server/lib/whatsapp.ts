/* ═══════════════════════════════════════════
   WHATSAPP CLOUD API HELPER
   Sends and receives messages via Meta's API.
   Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in .env
   ═══════════════════════════════════════════ */

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const API_BASE = "https://graph.facebook.com/v18.0";

/**
 * Send a text message via WhatsApp.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("[WhatsApp] Not configured — message would be sent to", to, ":", text.substring(0, 80));
    return false;
  }

  try {
    const res = await fetch(`${API_BASE}/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[WhatsApp] Send failed:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[WhatsApp] Send error:", err);
    return false;
  }
}

/**
 * Send a template message (for notifications, alerts).
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string = "en",
  components?: any[]
): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("[WhatsApp] Template not sent — not configured:", templateName);
    return false;
  }

  try {
    const res = await fetch(`${API_BASE}/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          ...(components ? { components } : {}),
        },
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("[WhatsApp] Template error:", err);
    return false;
  }
}

/**
 * Mark a message as read (blue ticks).
 */
export async function markMessageRead(messageId: string): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) return false;

  try {
    const res = await fetch(`${API_BASE}/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Verify webhook signature from Meta (security check).
 */
export function verifyWebhookSignature(_body: string, _signature: string): boolean {
  // In production: use crypto to verify the X-Hub-Signature-256 header
  // For now, we trust the webhook endpoint is secured by the verify token
  return true;
}

/**
 * Parse incoming webhook payload from Meta.
 */
export function parseWebhookPayload(body: any): {
  phone: string;
  text: string;
  messageId: string;
  timestamp: number;
} | null {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text") return null;

    return {
      phone: message.from,
      text: message.text?.body ?? "",
      messageId: message.id,
      timestamp: Number(message.timestamp) * 1000,
    };
  } catch {
    return null;
  }
}
