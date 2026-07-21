/* ═══════════════════════════════════════════
   AXIS AI AGENT
   Conversational AI for WhatsApp, email, web.
   Uses OpenAI GPT-4o with project context.
   ═══════════════════════════════════════════ */

import { getDb } from "../queries/connection";
import { projects, units, leads, driftScores } from "@db/schema";
import { eq } from "drizzle-orm";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

interface AgentContext {
  orgId: number;
  leadId?: number;
  projectId?: number;
  channel: "whatsapp" | "email" | "web";
  history?: { role: string; content: string }[];
}

interface AgentResponse {
  text: string;
  intent: string;
  recommendedProjects?: number[];
  urgencyScore: number;
  suggestedAction?: string;
}

/**
 * Process an incoming message through the Axis Agent.
 * This is the core AI brain that powers all conversational channels.
 */
export async function axisAgent(
  message: string,
  ctx: AgentContext
): Promise<AgentResponse> {
  // 1. Gather context about the lead
  const leadContext = ctx.leadId ? await getLeadContext(ctx.leadId) : null;

  // 2. Gather context about available projects
  const projectList = await getProjectsContext(ctx.orgId, ctx.projectId);

  // 3. Build system prompt with all context
  const systemPrompt = buildSystemPrompt(projectList, leadContext, ctx.channel);

  // 4. Call OpenAI
  const response = await callOpenAI(systemPrompt, message, ctx.history);

  // 5. Parse structured response
  return parseAgentResponse(response);
}

async function getLeadContext(leadId: number) {
  const db = getDb();
  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  const score = await db.select().from(driftScores).where(eq(driftScores.leadId, leadId)).limit(1);
  return {
    lead: lead[0] ?? null,
    driftScore: score[0]?.score ?? 0,
    trend: score[0]?.trend ?? "cold",
  };
}

async function getProjectsContext(orgId: number, specificProjectId?: number) {
  const db = getDb();
  if (specificProjectId) {
    const project = await db.select().from(projects)
      .where(eq(projects.id, specificProjectId))
      .limit(1);
    const projectUnits = await db.select().from(units)
      .where(eq(units.projectId, specificProjectId));
    return [{ project: project[0], units: projectUnits }];
  }
  const allProjects = await db.select().from(projects)
    .where(eq(projects.orgId, orgId))
    .limit(5);
  const result = [];
  for (const p of allProjects) {
    const projectUnits = await db.select().from(units)
      .where(eq(units.projectId, p.id))
      .limit(10);
    result.push({ project: p, units: projectUnits });
  }
  return result;
}

function buildSystemPrompt(
  projectList: any[],
  leadContext: any,
  channel: string
) {
  const projectsDesc = projectList.map(({ project, units }) => {
    const availableUnits = units.filter((u: any) => u.status === "available");
    const priceRange = availableUnits.length > 0
      ? `$${Math.min(...availableUnits.map((u: any) => Number(u.price ?? 0)))} - $${Math.max(...availableUnits.map((u: any) => Number(u.price ?? 0)))}`
      : "Contact for pricing";
    return `- ${project.name} (${project.type}, ${project.location}): ${availableUnits.length} units available, ${priceRange}`;
  }).join("\n");

  const leadDesc = leadContext?.lead
    ? `Lead: ${leadContext.lead.name || "Unknown"}, Score: ${leadContext.driftScore}/100, Interest: ${leadContext.lead.interestedUnitIds || "general"}`
    : "New lead — no prior context";

  return `You are Axis, the AI assistant for OneAxis — a project experience platform for property developers.
You help potential buyers find their ideal property and assist developers with project management.

AVAILABLE PROJECTS:
${projectsDesc}

${leadDesc}

CHANNEL: ${channel}

RULES:
- Be conversational, warm, and professional. Use short paragraphs.
- Never make up prices or availability. Only use the data above.
- If asked about a specific unit, check the units list. If not available, say so.
- Always try to move the conversation forward: suggest viewing, send brochure, or schedule call.
- Detect buyer intent: pricing inquiry, viewing request, financing question, or ready to buy.
- Respond in the same language as the user.
- For WhatsApp: keep responses under 800 characters. Use emojis sparingly.

At the end of your response, add a JSON block:
{"intent": "pricing_inquiry|viewing_request|general_info|financing|ready_to_buy", "urgencyScore": 1-100, "suggestedAction": "..."}`;
}

async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  history?: { role: string; content: string }[]
) {
  if (!OPENAI_API_KEY) {
    // Fallback when no API key: return a structured mock response
    return generateFallbackResponse(userMessage);
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history ?? []).map(h => ({ role: h.role as any, content: h.content })),
    { role: "user", content: userMessage },
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI error:", await res.text());
      return generateFallbackResponse(userMessage);
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content ?? generateFallbackResponse(userMessage);
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return generateFallbackResponse(userMessage);
  }
}

function parseAgentResponse(raw: string): AgentResponse {
  // Extract JSON block from end of response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  let meta = { intent: "general_info", urgencyScore: 30, suggestedAction: "" };

  if (jsonMatch) {
    try {
      meta = JSON.parse(jsonMatch[0]);
    } catch {
      // ignore parse errors
    }
  }

  // Remove JSON block from displayed text
  const text = raw.replace(/\{[\s\S]*\}/, "").trim();

  return {
    text,
    intent: meta.intent || "general_info",
    urgencyScore: meta.urgencyScore || 30,
    suggestedAction: meta.suggestedAction || "",
  };
}

function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
    return `I'd be happy to share pricing details! We have several projects with units ranging across different budgets.\n\nCould you let me know:\n- What type of property you're looking for (1BR, 2BR, 3BR, penthouse)?\n- Your preferred area or project?\n- Your budget range?\n\nThis will help me find the best matches for you.\n\n{"intent": "pricing_inquiry", "urgencyScore": 60, "suggestedAction": "Ask for budget and preferences"}`;
  }

  if (lower.includes("view") || lower.includes("visit") || lower.includes("tour")) {
    return `Great that you'd like to view a property! I can arrange a site visit or virtual tour for you.\n\nWhich project are you interested in? I can check availability and book a time that works for you.\n\n{"intent": "viewing_request", "urgencyScore": 75, "suggestedAction": "Schedule viewing within 24 hours"}`;
  }

  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    return `Hello! Welcome to OneAxis. I'm Axis, your property assistant.\n\nI can help you:\n- Find available properties\n- Check pricing and availability\n- Schedule viewings\n- Answer questions about any project\n\nWhat are you looking for today?\n\n{"intent": "general_info", "urgencyScore": 20, "suggestedAction": "Discover buyer needs"}`;
  }

  return `Thanks for reaching out! I'm here to help you find the perfect property.\n\nTo give you the best recommendations, could you tell me:\n1. What type of property (apartment, house, commercial)?\n2. Preferred location or area?\n3. Budget range?\n4. Number of bedrooms?\n\nOr just tell me what you're looking for and I'll do the rest!\n\n{"intent": "general_info", "urgencyScore": 25, "suggestedAction": "Qualify lead preferences"}`;
}

/**
 * Generate a personalized nurture message for a specific step.
 */
export async function generateNurtureMessage(
  stepIndex: number,
  leadId: number,
  _orgId: number
): Promise<string> {
  const db = getDb();
  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);

  const templates = [
    `Hi ${lead[0]?.name || "there"}! Welcome to OneAxis. I've prepared a personalized brochure with our latest available units. Let me know if any catch your eye!`,
    `Hi ${lead[0]?.name || "there"}, based on your interest, here are 3 units that match what you're looking for. Would you like to schedule a virtual tour?`,
    `Market update: 2 similar units in your area sold this week. Demand is strong — would you like to discuss reserving a unit?`,
    `Hi ${lead[0]?.name || "there"}, a new 2-bedroom unit just became available in your preferred area. Shall I arrange a viewing?`,
    `Just checking in — I noticed you've been browsing our projects. Any questions I can answer? I'm here to help with pricing, financing, or scheduling a visit.`,
  ];

  return templates[stepIndex % templates.length] ?? templates[0];
}
