import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  json,
  boolean,
  bigint,
  uniqueIndex,
  index,
  char,
} from "drizzle-orm/mysql-core";

/* ═══════════════════════════════════════════
   CORE IDENTITY
   ═══════════════════════════════════════════ */

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ═══════════════════════════════════════════
   ORGANISATIONS (Tenants) — D6 currency added
   ═══════════════════════════════════════════ */

export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  primaryColor: varchar("primary_color", { length: 7 }).default("#C8B89A"),
  accentColor: varchar("accent_color", { length: 7 }).default("#A89478"),
  timezone: varchar("timezone", { length: 50 }).default("Australia/Sydney"),
  currency: char("currency", { length: 3 }).default("AUD").notNull(),
  language: char("language", { length: 2 }).default("en"),
  plan: mysqlEnum("plan", ["starter", "professional", "studio", "enterprise"]).default("starter").notNull(),
  logoUrl: text("logo_url"),
  settings: json("settings"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   ORG MEMBERS — RBAC (unchanged, referenced by middleware)
   ═══════════════════════════════════════════ */

export const orgMembers = mysqlTable("org_members", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  workspaceRole: mysqlEnum("workspace_role", [
    "owner", "admin", "project_manager", "sales_agent", "designer", "viewer"
  ]).default("viewer").notNull(),
  permissions: json("permissions"),
  isActive: boolean("is_active").default(true).notNull(),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  joinedAt: timestamp("joined_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uniq_org_user").on(table.orgId, table.userId),
]);

/* ═══════════════════════════════════════════
   PROJECTS — D6 currency, D7 counts removed (computed), D8 soft-delete
   ═══════════════════════════════════════════ */

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("project_type", [
    "real-estate", "residential", "land-development",
    "construction", "manufacturing", "industrial", "oil-gas"
  ]).notNull(),
  stage: mysqlEnum("stage", [
    "planning", "design", "pre-construction", "construction",
    "marketing", "sales", "settlement", "complete", "archived"
  ]).default("planning").notNull(),
  status: mysqlEnum("status", ["active", "paused", "archived"]).default("active").notNull(),
  location: json("location"),
  metadata: json("metadata"),
  settings: json("settings"),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   PROJECT MODELS — D4 version integrity
   ═══════════════════════════════════════════ */

export const projectModels = mysqlTable("project_models", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  version: int("version").notNull(),
  sourceFileIds: json("source_file_ids"),
  status: mysqlEnum("model_status", [
    "processing", "review", "approved", "published", "superseded"
  ]).default("processing").notNull(),
  geometryUrl: text("geometry_url"),
  unitGraph: json("unit_graph"),
  approvedBy: bigint("approved_by", { mode: "number", unsigned: true }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   UNITS — D8 soft-delete, D4 publishedModelId
   ═══════════════════════════════════════════ */

export const units = mysqlTable("units", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  publishedModelId: bigint("published_model_id", { mode: "number", unsigned: true }),
  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  floor: int("floor").default(1),
  unitType: varchar("unit_type", { length: 100 }),
  status: mysqlEnum("unit_status", [
    "available", "sold", "reserved", "coming-soon", "held"
  ]).default("available").notNull(),
  area: decimal("area", { precision: 10, scale: 2 }),
  bedrooms: int("bedrooms").default(0),
  bathrooms: int("bathrooms").default(0),
  price: decimal("price", { precision: 15, scale: 2 }),
  basePrice: decimal("base_price", { precision: 15, scale: 2 }),
  customizationPrice: decimal("customization_price", { precision: 15, scale: 2 }).default("0"),
  unitView: varchar("unit_view", { length: 100 }),
  facing: varchar("facing", { length: 50 }),
  materials: json("materials"),
  metadata: json("metadata"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   LEADS — D3 progressive capture (buyers ≠ prospects)
   driftScore is COMPUTED by the scoring job — UI reads only
   ═══════════════════════════════════════════ */

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  visitorId: varchar("visitor_id", { length: 64 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  name: varchar("name", { length: 255 }),
  stage: mysqlEnum("lead_stage", [
    "anonymous", "identified", "qualified", "reserved", "converted", "lost"
  ]).default("anonymous").notNull(),
  interestedUnitIds: json("interested_unit_ids"),
  attribution: json("attribution"),
  assignedAgentId: bigint("assigned_agent_id", { mode: "number", unsigned: true }),
  driftScore: int("drift_score"),
  driftTrend: mysqlEnum("drift_trend", ["rising", "steady", "cooling", "cold"]),
  scoreUpdatedAt: timestamp("score_updated_at"),
  region: char("region", { length: 2 }).default("au"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   BUYERS — post-contract only, linked to lead
   ═══════════════════════════════════════════ */

export const buyers = mysqlTable("buyers", {
  id: serial("id").primaryKey(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  unitId: bigint("unit_id", { mode: "number", unsigned: true }),
  fullName: varchar("full_name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  status: mysqlEnum("buyer_status", [
    "contracted", "deposit-paid", "settled", "at-risk"
  ]).default("contracted").notNull(),
  notes: text("notes"),
  assignedAgentId: bigint("assigned_agent_id", { mode: "number", unsigned: true }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   RESERVATIONS — D2 hold→confirm flow, A3 idempotency
   ═══════════════════════════════════════════ */

export const reservations = mysqlTable("reservations", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  unitId: bigint("unit_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  status: mysqlEnum("reservation_status", [
    "hold", "pending_payment", "confirmed", "expired", "cancelled", "converted"
  ]).default("hold").notNull(),
  holdExpiresAt: timestamp("hold_expires_at"),
  idempotencyKey: varchar("idempotency_key", { length: 64 }).unique(),
  createdBy: mysqlEnum("created_by_role", ["buyer", "agent"]).default("agent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("uniq_active_unit").on(table.unitId, table.status),
]);

/* ═══════════════════════════════════════════
   PAYMENTS — D2 Stripe/manual
   ═══════════════════════════════════════════ */

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  reservationId: bigint("reservation_id", { mode: "number", unsigned: true }).notNull(),
  provider: mysqlEnum("provider", ["stripe", "manual"]).default("stripe").notNull(),
  providerIntentId: varchar("provider_intent_id", { length: 255 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: char("currency", { length: 3 }).default("AUD").notNull(),
  status: mysqlEnum("payment_status", [
    "requires_action", "processing", "succeeded", "failed", "refunded"
  ]).default("requires_action").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   ACTIVITY EVENTS — D1 v2 (the moat's raw material)
   ═══════════════════════════════════════════ */

export const activityEvents = mysqlTable("activity_events", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  unitId: bigint("unit_id", { mode: "number", unsigned: true }),
  actorType: mysqlEnum("actor_type", ["operator", "buyer", "anonymous"]).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  visitorId: varchar("visitor_id", { length: 64 }),
  sessionId: varchar("session_id", { length: 64 }),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventData: json("event_data"),
  dwellMs: int("dwell_ms"),
  source: varchar("source", { length: 50 }),
  attribution: json("attribution"),
  device: json("device"),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_ae_project_created").on(table.projectId, table.createdAt),
  index("idx_ae_lead").on(table.leadId),
  index("idx_ae_visitor").on(table.visitorId),
  index("idx_ae_unit").on(table.unitId),
]);

/* ═══════════════════════════════════════════
   PROJECT MODULE SETTINGS
   ═══════════════════════════════════════════ */

export const projectModuleSettings = mysqlTable("project_module_settings", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull().unique(),
  enabledModules: json("enabled_modules"),
  moduleOrder: json("module_order"),
  visibilityRules: json("visibility_rules"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   FILES / ASSETS — D8 soft-delete
   ═══════════════════════════════════════════ */

export const projectFiles = mysqlTable("project_files", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileType: mysqlEnum("file_type", [
    "site-plan", "floor-plan", "elevation", "3d-model",
    "document", "image", "video", "other"
  ]).notNull(),
  fileFormat: varchar("file_format", { length: 20 }),
  fileSize: bigint("file_size", { mode: "number", unsigned: true }),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  extractedData: json("extracted_data"),
  status: mysqlEnum("file_status", ["processing", "ready", "error"]).default("processing").notNull(),
  uploadedBy: bigint("uploaded_by", { mode: "number", unsigned: true }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════
   WORKFLOWS
   ═══════════════════════════════════════════ */

export const workflows = mysqlTable("workflows", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  trigger: varchar("trigger", { length: 100 }).notNull(),
  conditions: json("conditions"),
  actions: json("actions"),
  recipients: json("recipients"),
  status: mysqlEnum("workflow_status", ["draft", "live", "archived"]).default("draft").notNull(),
  runCount: int("run_count").default(0),
  lastRunAt: timestamp("last_run_at"),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   REPORTS
   ═══════════════════════════════════════════ */

export const reports = mysqlTable("reports", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  template: varchar("template", { length: 100 }).notNull(),
  sections: json("sections"),
  downloadUrl: text("download_url"),
  status: mysqlEnum("report_status", ["generating", "ready", "error"]).default("generating").notNull(),
  fileSize: bigint("file_size", { mode: "number", unsigned: true }),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════
   CHAT MESSAGES
   ═══════════════════════════════════════════ */

export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  orgId: bigint("org_id", { mode: "number", unsigned: true }),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  sessionId: varchar("session_id", { length: 255 }),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 50 }).default("text"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════
   NOTIFICATIONS — D5 (NotificationCenter backend)
   ═══════════════════════════════════════════ */

export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  payload: json("payload"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_notif_user_unread").on(table.userId, table.readAt),
]);

/* ═══════════════════════════════════════════
   AUDIT LOG — D5 (enterprise + debugging)
   ═══════════════════════════════════════════ */

export const auditLog = mysqlTable("audit_log", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 100 }).notNull(),
  entityId: bigint("entity_id", { mode: "number", unsigned: true }),
  before: json("before"),
  after: json("after"),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_audit_org_entity").on(table.orgId, table.entity, table.createdAt),
]);

/* ═══════════════════════════════════════════
   AI USAGE — D5 (cost tracking, COGS < 8%)
   ═══════════════════════════════════════════ */

export const aiUsage = mysqlTable("ai_usage", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  provider: varchar("provider", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  tokensIn: int("tokens_in").default(0),
  tokensOut: int("tokens_out").default(0),
  costUsd: decimal("cost_usd", { precision: 10, scale: 6 }).default("0"),
  feature: varchar("feature", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════
   EMBED TOKENS — A2 (public widget security)
   ═══════════════════════════════════════════ */

export const embedTokens = mysqlTable("embed_tokens", {
  id: serial("id").primaryKey(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  allowedDomains: json("allowed_domains"),
  scopes: json("scopes"),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════
   IDEMPOTENCY KEYS — A3 (money mutations)
   ═══════════════════════════════════════════ */

export const idempotencyKeys = mysqlTable("idempotency_keys", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  resourceId: bigint("resource_id", { mode: "number", unsigned: true }),
  status: mysqlEnum("idempotency_status", ["pending", "processed"]).default("pending").notNull(),
  response: json("response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════
   LEAD TIMELINE — every interaction in chronological order
   The complete contact history that makes CRM valuable
   ═══════════════════════════════════════════ */

export const leadTimeline = mysqlTable("lead_timeline", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }).notNull(),
  eventType: mysqlEnum("event_type", [
    "page_view", "pricing_click", "floor_plan_view", "brochure_download",
    "mortgage_calc", "viewing_request", "viewing_scheduled", "viewing_completed",
    "viewing_cancelled", "whatsapp_message", "whatsapp_reply",
    "email_sent", "email_opened", "email_clicked",
    "call_made", "call_received", "voicemail_left",
    "stage_changed", "note_added", "task_created", "task_completed",
    "campaign_touched", "ad_clicked", "widget_interact",
    "hot_routed", "reserved", "converted", "lost"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  metadata: json("metadata"),
  agentId: bigint("agent_id", { mode: "number", unsigned: true }),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  unitId: bigint("unit_id", { mode: "number", unsigned: true }),
  channel: mysqlEnum("channel", ["website", "whatsapp", "email", "phone", "in_person", "widget", "social", "system"]).default("system"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_timeline_lead").on(table.leadId, table.createdAt),
  index("idx_timeline_org").on(table.orgId, table.createdAt),
  index("idx_timeline_type").on(table.eventType),
]);

/* ═══════════════════════════════════════════
   LEAD NOTES — agent call notes, meeting records
   ═══════════════════════════════════════════ */

export const leadNotes = mysqlTable("lead_notes", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }).notNull(),
  content: text("content").notNull(),
  noteType: mysqlEnum("note_type", ["call", "meeting", "email", "general", "system"]).default("general"),
  agentId: bigint("agent_id", { mode: "number", unsigned: true }),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   VIEWINGS — property viewing scheduling & tracking
   The #1 activity for property developers
   ═══════════════════════════════════════════ */

export const viewings = mysqlTable("viewings", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull(),
  unitId: bigint("unit_id", { mode: "number", unsigned: true }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: int("duration_minutes").default(30),
  status: mysqlEnum("viewing_status", [
    "requested", "confirmed", "completed", "no_show", "cancelled", "rescheduled"
  ]).default("requested").notNull(),
  meetingType: mysqlEnum("meeting_type", ["in_person", "video_call", "phone_call"]).default("in_person"),
  location: varchar("location", { length: 255 }),
  agentId: bigint("agent_id", { mode: "number", unsigned: true }),
  feedback: text("feedback"),
  rating: int("rating"),
  interestedUnits: json("interested_units"),
  nextSteps: text("next_steps"),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   CAMPAIGNS — marketing campaign management
   ═══════════════════════════════════════════ */

export const campaigns = mysqlTable("campaigns", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  objective: mysqlEnum("objective", [
    "brand_awareness", "lead_generation", "engagement", "conversions", "retargeting"
  ]).default("lead_generation").notNull(),
  status: mysqlEnum("campaign_status", [
    "draft", "planned", "active", "paused", "completed", "archived"
  ]).default("draft").notNull(),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  spent: decimal("spent", { precision: 15, scale: 2 }).default("0"),
  currency: char("currency", { length: 3 }).default("AUD"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  targetAudience: json("target_audience"),
  aiPlan: json("ai_plan"),
  performance: json("performance"),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   AD CREATIVES — platform-specific ad content
   ═══════════════════════════════════════════ */

export const adCreatives = mysqlTable("ad_creatives", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  campaignId: bigint("campaign_id", { mode: "number", unsigned: true }),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  platform: mysqlEnum("platform", ["google", "meta", "whatsapp", "native", "display"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  headline: varchar("headline", { length: 120 }),
  description: text("description"),
  ctaText: varchar("cta_text", { length: 50 }),
  imageUrl: text("image_url"),
  destinationUrl: text("destination_url"),
  status: mysqlEnum("creative_status", ["draft", "review", "approved", "live", "paused"]).default("draft"),
  performance: json("performance"),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   KEYWORDS — SEO keyword management
   ═══════════════════════════════════════════ */

export const keywords = mysqlTable("keywords", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  searchVolume: int("search_volume"),
  difficulty: int("difficulty"),
  cpc: decimal("cpc", { precision: 10, scale: 2 }),
  currentRank: int("current_rank"),
  targetRank: int("target_rank"),
  status: mysqlEnum("keyword_status", ["pending", "approved", "rejected", "active", "paused"]).default("pending"),
  source: mysqlEnum("source", ["ai_suggested", "manual", "imported"]).default("ai_suggested"),
  intent: mysqlEnum("intent", ["informational", "navigational", "commercial", "transactional"]),
  contentUrl: text("content_url"),
  notes: text("notes"),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   WIDGET CONFIGS — embed widget settings per project
   ═══════════════════════════════════════════ */

export const widgetConfigs = mysqlTable("widget_configs", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull().unique(),
  theme: mysqlEnum("theme", ["light", "dark", "auto"]).default("auto"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#C8B89A"),
  features: json("features"),
  amenities: json("amenities"),
  displayOptions: json("display_options"),
  leadFormFields: json("lead_form_fields"),
  autoOpen: boolean("auto_open").default(false),
  greetingMessage: varchar("greeting_message", { length: 500 }),
  embedCode: text("embed_code"),
  installInstructions: text("install_instructions"),
  analyticsEnabled: boolean("analytics_enabled").default(true),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  leadsCaptured: int("leads_captured").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

/* ═══════════════════════════════════════════
   SCORING RULES — configurable drift scoring per org
   ═══════════════════════════════════════════ */

export const scoringRules = mysqlTable("scoring_rules", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  signalType: mysqlEnum("signal_type", [
    "page_view", "pricing_click", "floor_plan_view", "3d_model_interact",
    "comparison", "brochure_download", "mortgage_calc", "viewing_request",
    "whatsapp_message", "email_open", "social_click", "search_arrival",
    "return_visit", "referral", "partner_embed"
  ]).notNull(),
  weight: int("weight").default(10).notNull(),
  decayDays: int("decay_days").default(30),
  cap: int("cap").default(100),
  hotRouteThreshold: int("hot_route_threshold").default(80),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("uniq_org_signal").on(table.orgId, table.signalType),
]);

/* ═══════════════════════════════════════════
   DEMAND ENGINE TABLES
   intent_signals, drift_scores, nurture, tasks
   ═══════════════════════════════════════════ */

export const intentSignals = mysqlTable("intent_signals", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  visitorId: varchar("visitor_id", { length: 64 }),
  signalType: mysqlEnum("signal_type", [
    "page_view", "pricing_click", "floor_plan_view", "3d_model_interact",
    "comparison", "brochure_download", "mortgage_calc", "viewing_request",
    "whatsapp_message", "email_open", "social_click", "search_arrival",
    "return_visit", "referral", "partner_embed"
  ]).notNull(),
  source: varchar("source", { length: 50 }).notNull(),
  channel: mysqlEnum("channel", ["website", "whatsapp", "email", "social", "search", "referral", "partner", "direct"]).default("website").notNull(),
  signalData: json("signal_data"),
  driftScoreDelta: int("drift_score_delta").default(0),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_signals_org_created").on(table.orgId, table.createdAt),
  index("idx_signals_lead").on(table.leadId),
  index("idx_signals_visitor").on(table.visitorId),
  index("idx_signals_type").on(table.signalType),
]);

export const driftScores = mysqlTable("drift_scores", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }).notNull(),
  projectId: bigint("project_id", { mode: "number", unsigned: true }),
  score: int("score").default(0).notNull(),
  factors: json("factors"),
  trend: mysqlEnum("drift_trend", ["rising", "steady", "cooling", "cold"]).default("cold"),
  lastSignalAt: timestamp("last_signal_at"),
  hotRoutedAt: timestamp("hot_routed_at"),
  assignedAgentId: bigint("assigned_agent_id", { mode: "number", unsigned: true }),
  computedAt: timestamp("computed_at").defaultNow().notNull(),
});

export const nurtureSequences = mysqlTable("nurture_sequences", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  triggerStage: mysqlEnum("trigger_stage", ["captured", "identified", "qualified", "hot"]).notNull(),
  steps: json("steps").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nurtureJobs = mysqlTable("nurture_jobs", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }).notNull(),
  sequenceId: bigint("sequence_id", { mode: "number", unsigned: true }).notNull(),
  currentStep: int("current_step").default(0).notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: mysqlEnum("nurture_status", ["pending", "sent", "completed", "cancelled"]).default("pending").notNull(),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentTasks = mysqlTable("agent_tasks", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  taskType: mysqlEnum("task_type", [
    "hot_route_notify", "schedule_viewing", "draft_proposal",
    "pricing_review", "follow_up_call", "send_brochure"
  ]).notNull(),
  status: mysqlEnum("agent_task_status", ["pending", "in_progress", "done", "cancelled"]).default("pending"),
  assignedTo: bigint("assigned_to", { mode: "number", unsigned: true }),
  draftContent: text("draft_content"),
  suggestedAction: varchar("suggested_action", { length: 255 }),
  metadata: json("metadata"),
  dueAt: timestamp("due_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tasks_org_status").on(table.orgId, table.status),
  index("idx_tasks_assigned").on(table.assignedTo),
]);

export const whatsappSessions = mysqlTable("whatsapp_sessions", {
  id: serial("id").primaryKey(),
  orgId: bigint("org_id", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("lead_id", { mode: "number", unsigned: true }),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
  waId: varchar("wa_id", { length: 50 }),
  lastMessageAt: timestamp("last_message_at"),
  messageCount: int("message_count").default(0),
  context: json("context"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
