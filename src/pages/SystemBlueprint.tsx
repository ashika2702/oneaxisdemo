import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Network, GitBranch, Layers, Cpu, Globe,
  MessageSquare, Target, Users, FileText, Box, Shield,
  Zap, ArrowRight, ChevronDown, ChevronRight, Search,
  Table, Code, Activity, Brain, Workflow, FolderKanban
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const TABS = [
  { id: "overview", label: "Overview", icon: Network },
  { id: "database", label: "Database (35 Tables)", icon: Database },
  { id: "api", label: "API (12 Routers)", icon: Code },
  { id: "flow", label: "Data Flow", icon: Workflow },
  { id: "ai", label: "AI Engine", icon: Brain },
  { id: "components", label: "Components", icon: Layers },
] as const;

/* ═══════════════════════════════════════════
   DATABASE SCHEMA DATA
   ═══════════════════════════════════════════ */
const TABLE_GROUPS = [
  {
    name: "Authentication & Org",
    color: "#3b82f6",
    tables: [
      { name: "users", cols: ["id PK", "name", "email", "avatarUrl", "role"], desc: "OAuth users from Kimi" },
      { name: "organizations", cols: ["id PK", "name", "subdomain", "plan", "timezone"], desc: "Customer tenant" },
      { name: "orgMembers", cols: ["id PK", "orgId FK", "userId FK", "role"], desc: "User↔Org membership" },
    ]
  },
  {
    name: "Core Platform",
    color: "#10b981",
    tables: [
      { name: "projects", cols: ["id PK", "orgId FK", "name", "slug", "type", "status"], desc: "Property projects" },
      { name: "units", cols: ["id PK", "projectId FK", "unitNumber", "type", "price", "status"], desc: "Lots & apartments" },
      { name: "leads", cols: ["id PK", "orgId FK", "name", "email", "phone", "stage", "driftScore"], desc: "Prospective buyers" },
      { name: "buyers", cols: ["id PK", "orgId FK", "name", "email", "phone", "status"], desc: "Converted buyers" },
    ]
  },
  {
    name: "Demand Intelligence",
    color: "#ef4444",
    tables: [
      { name: "intentSignals", cols: ["id PK", "orgId FK", "leadId FK", "signalType", "driftScoreDelta"], desc: "15 signal types tracked" },
      { name: "driftScores", cols: ["id PK", "orgId FK", "leadId FK", "totalScore", "signalCount"], desc: "Aggregated lead scores" },
      { name: "scoringRules", cols: ["id PK", "orgId FK", "signalType", "weight", "hotRouteThreshold"], desc: "Configurable scoring per org" },
      { name: "agentTasks", cols: ["id PK", "orgId FK", "leadId FK", "taskType", "status", "dueAt"], desc: "AI-generated sales tasks" },
    ]
  },
  {
    name: "Communication",
    color: "#8b5cf6",
    tables: [
      { name: "whatsappSessions", cols: ["id PK", "orgId FK", "leadId FK", "phone", "status"], desc: "WhatsApp conversations" },
      { name: "nurtureSequences", cols: ["id PK", "orgId FK", "name", "triggerStage", "isActive"], desc: "Message sequences" },
      { name: "nurtureJobs", cols: ["id PK", "orgId FK", "leadId FK", "sequenceId FK", "status"], desc: "Scheduled nurture sends" },
      { name: "leadTimeline", cols: ["id PK", "orgId FK", "leadId FK", "eventType", "title"], desc: "28 event types, chronological" },
      { name: "leadNotes", cols: ["id PK", "orgId FK", "leadId FK", "content", "noteType"], desc: "Agent call/meeting notes" },
      { name: "viewings", cols: ["id PK", "orgId FK", "leadId FK", "scheduledAt", "status"], desc: "Property viewing schedule" },
    ]
  },
  {
    name: "Marketing",
    color: "#f59e0b",
    tables: [
      { name: "campaigns", cols: ["id PK", "orgId FK", "name", "budget", "status", "aiPlan"], desc: "Marketing campaigns" },
      { name: "adCreatives", cols: ["id PK", "orgId FK", "campaignId FK", "platform", "headline"], desc: "Platform-specific ads" },
      { name: "keywords", cols: ["id PK", "orgId FK", "keyword", "searchVolume", "difficulty", "status"], desc: "SEO keyword management" },
      { name: "widgetConfigs", cols: ["id PK", "orgId FK", "projectId FK", "features", "embedCode"], desc: "Embed widget settings" },
    ]
  },
  {
    name: "Legacy / Specialized",
    color: "#6b7280",
    tables: [
      { name: "phases", cols: ["id PK", "projectId FK", "name", "status", "progress"], desc: "Construction phases" },
      { name: "files", cols: ["id PK", "projectId FK", "name", "type", "url"], desc: "Document vault" },
      { name: "settlements", cols: ["id PK", "unitId FK", "buyerId FK", "status", "settlementDate"], desc: "Settlement tracking" },
      { name: "holds", cols: ["id PK", "projectId FK", "unitId FK", "status", "expiresAt"], desc: "Unit holds" },
      { name: "lots", cols: ["id PK", "projectId FK", "lotNumber", "area", "status"], desc: "Lot inventory" },
      { name: "projectModels", cols: ["id PK", "projectId FK", "version", "status", "geometryUrl"], desc: "3D model metadata" },
      { name: "floorPlans", cols: ["id PK", "projectId FK", "unitId FK", "svgUrl"], desc: "Floor plan storage" },
    ]
  },
];

/* ═══════════════════════════════════════════
   API ROUTER DATA
   ═══════════════════════════════════════════ */
const API_ROUTERS = [
  {
    name: "project",
    icon: FolderKanban,
    color: "#10b981",
    endpoints: ["list", "getById", "create", "update", "delete"],
    desc: "Project CRUD with soft delete",
  },
  {
    name: "unit",
    icon: Box,
    color: "#10b981",
    endpoints: ["list", "getById", "create", "update", "delete"],
    desc: "Unit inventory management",
  },
  {
    name: "lead",
    icon: Users,
    color: "#3b82f6",
    endpoints: ["list", "getById", "create", "update", "delete"],
    desc: "Lead database operations",
  },
  {
    name: "buyer",
    icon: Users,
    color: "#3b82f6",
    endpoints: ["list", "getById", "create", "update"],
    desc: "Buyer management",
  },
  {
    name: "demand",
    icon: Target,
    color: "#ef4444",
    endpoints: ["trackSignal", "hotLeads", "driftScore", "recalculate", "funnelStats", "tasks", "updateTask", "nurtureSequences", "createNurtureSequence", "processNurture", "startNurture", "agentChat"],
    desc: "Drift scoring, hot routing, nurture, AI chat",
  },
  {
    name: "whatsapp",
    icon: MessageSquare,
    color: "#25D366",
    endpoints: ["verifyWebhook", "receiveMessage", "sendMessage", "sessions"],
    desc: "Meta Cloud API integration",
  },
  {
    name: "crm",
    icon: Users,
    color: "#8b5cf6",
    endpoints: ["timeline", "addTimelineEvent", "notes", "addNote", "viewings", "scheduleViewing", "updateViewing", "updateLead", "stats"],
    desc: "Lead timeline, notes, viewings, stage management",
  },
  {
    name: "campaign",
    icon: Target,
    color: "#f59e0b",
    endpoints: ["list", "getById", "create", "update", "delete", "creatives", "createCreative", "updateCreative"],
    desc: "Campaign + ad creative management",
  },
  {
    name: "keyword",
    icon: Search,
    color: "#06b6d4",
    endpoints: ["list", "getById", "create", "createBatch", "update", "delete", "stats"],
    desc: "SEO keyword CRUD + AI batch",
  },
  {
    name: "widget",
    icon: Globe,
    color: "#ec4899",
    endpoints: ["get", "upsert", "trackImpression", "trackClick", "trackLead"],
    desc: "Widget config + analytics tracking",
  },
  {
    name: "analytics",
    icon: Activity,
    color: "#94a3b8",
    endpoints: ["summary", "projects", "trends", "revenue"],
    desc: "Cross-module analytics",
  },
  {
    name: "workflow",
    icon: Workflow,
    color: "#94a3b8",
    endpoints: ["list", "getById", "create", "update", "delete"],
    desc: "Automation workflows",
  },
];

/* ═══════════════════════════════════════════
   DATA FLOW STEPS
   ═══════════════════════════════════════════ */
const DATA_FLOWS = [
  {
    name: "Visitor → Hot Lead",
    steps: [
      { label: "Visitor lands", system: "Website/Widget", action: "Page view signal" },
      { label: "Drift Engine", system: "Demand Intelligence", action: "Score += 5, track signal" },
      { label: "Re-engagement", system: "Demand Intelligence", action: "Return visit +15, pricing click +25" },
      { label: "Identity captured", system: "WhatsApp/Form", action: "Lead auto-created" },
      { label: "Score >= 80", system: "Hot Route Trigger", action: "Agent task created" },
      { label: "Agent acts", system: "CRM + Tasks", action: "Call, viewing, note" },
    ]
  },
  {
    name: "Campaign → Conversion",
    steps: [
      { label: "AI Plan", system: "Campaign Builder", action: "Audience + budget + timeline" },
      { label: "Human Review", system: "Campaign Builder", action: "Admin approves/edits" },
      { label: "Ads Created", system: "Ad Studio", action: "Platform-specific creatives" },
      { label: "Launch", system: "Campaign Router", action: "Saved to DB, tracking on" },
      { label: "Lead Captured", system: "Widget/WhatsApp", action: "Flows into CRM" },
      { label: "Nurture", system: "Nurture Engine", action: "Scheduled WhatsApp sequences" },
    ]
  },
  {
    name: "Signal → Score → Action",
    steps: [
      { label: "Signal fires", system: "Any channel", action: "intentSignals row created" },
      { label: "Score recalc", system: "Drift Engine", action: "Weighted sum + time decay" },
      { label: "Threshold check", system: "Hot Route", action: "If >= 80: trigger" },
      { label: "Task created", system: "Agent Tasks", action: "Urgent: contact within 2h" },
      { label: "Timeline event", system: "Lead Timeline", action: "hot_routed recorded" },
      { label: "Nurture stops", system: "Nurture Engine", action: "Sequence paused for lead" },
    ]
  },
];

/* ═══════════════════════════════════════════
   COMPONENT HIERARCHY
   ═══════════════════════════════════════════ */
const COMPONENT_TREE = [
  {
    name: "App.tsx",
    type: "root",
    children: [
      { name: "LandingPage", type: "page", desc: "Public marketing page" },
      { name: "NeuralDashboard", type: "page", desc: "Radial canvas visualization" },
      { name: "SuperAdmin", type: "page", desc: "Platform management" },
      {
        name: "AdminLayout", type: "layout",
        children: [
          { name: "AdminDashboard", type: "page", api: "project.list + funnelStats", desc: "Stats cards, project list, charts" },
          { name: "DemandEngine", type: "page", api: "funnelStats + hotLeads", desc: "Funnel, signals, sources tabs" },
          { name: "AdminCRM", type: "page", api: "hotLeads + crm.*", desc: "Kanban + lead detail panel" },
          { name: "AdminTasks", type: "page", api: "demand.tasks", desc: "Priority-filtered task list" },
          { name: "AdminProjects", type: "page", api: "project.list", desc: "Project grid" },
          { name: "AdminUnits", type: "page", api: "unit.list", desc: "Unit inventory grid" },
          { name: "CampaignBuilder", type: "page", api: "campaign.*", desc: "5-step campaign wizard" },
          { name: "AdEditor", type: "page", api: "campaign.creatives", desc: "Platform ad editor" },
          { name: "SEOKewords", type: "page", api: "keyword.*", desc: "Keyword management" },
          { name: "WidgetConfig", type: "page", api: "widget.*", desc: "Widget configurator" },
          { name: "AdminSettlements", type: "page", desc: "SettlementRadar component" },
          { name: "AdminHold", type: "page", desc: "HOLDSuite component" },
          { name: "AdminAlgorithms", type: "page", desc: "AlgorithmPanel component" },
          { name: "AdminPhasing", type: "page", desc: "ConstructionPhasing component" },
          { name: "DocumentVault", type: "page", desc: "File management" },
          { name: "FinancialModelling", type: "page", desc: "Scenario planning" },
          { name: "FloorPlanViewer", type: "page", desc: "Unit floor plan viewer" },
          { name: "DigitalTwin", type: "page", desc: "Building systems monitor" },
          { name: "ThreeViewer", type: "page", desc: "3D model viewer" },
          { name: "AgentConsole", type: "page", desc: "AI chat interface" },
        ]
      },
    ]
  }
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function SystemBlueprint() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]["id"]>("overview");
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Authentication & Org");
  const [expandedRouter, setExpandedRouter] = useState<string | null>("demand");
  const [selectedFlow, setSelectedFlow] = useState(0);
  const [expandedTreeNode, setExpandedTreeNode] = useState<string | null>("AdminLayout");

  const toggleGroup = (name: string) => setExpandedGroup(expandedGroup === name ? null : name);
  const toggleRouter = (name: string) => setExpandedRouter(expandedRouter === name ? null : name);
  const toggleTree = (name: string) => setExpandedTreeNode(expandedTreeNode === name ? null : name);

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Network className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">System Blueprint</h1>
              <p className="text-[10px] text-white/25">Complete architecture documentation</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/25">
            <span className="px-2 py-1 rounded-full bg-white/[0.04]">35 Tables</span>
            <span className="px-2 py-1 rounded-full bg-white/[0.04]">12 Routers</span>
            <span className="px-2 py-1 rounded-full bg-white/[0.04]">20 Pages</span>
            <span className="px-2 py-1 rounded-full bg-white/[0.04]">4 AI Engines</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 px-6 border-b border-white/[0.04] flex-shrink-0">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[12px] font-medium border-b-2 transition-all ${
                activeTab === tab.id ? "border-white/30 text-white/80" : "border-transparent text-white/30 hover:text-white/50"
              }`}>
              <tab.icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 max-w-4xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Database Tables", value: "35", icon: Database, color: "#3b82f6" },
                    { label: "API Routers", value: "12", icon: Code, color: "#10b981" },
                    { label: "Frontend Pages", value: "20", icon: Layers, color: "#8b5cf6" },
                    { label: "AI Engines", value: "4", icon: Brain, color: "#ef4444" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                      <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                      <p className="text-[24px] font-bold text-white/90">{s.value}</p>
                      <p className="text-[10px] text-white/25">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Architecture Diagram */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
                  <p className="text-[11px] text-white/30 mb-4 uppercase tracking-wider">System Architecture</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {/* Layers */}
                    {[
                      { label: "Frontend", items: ["React", "Canvas 2D", "Three.js", "Tailwind"], color: "#8b5cf6" },
                      { label: "API Layer", items: ["tRPC", "orgProcedure", "Zod"], color: "#3b82f6" },
                      { label: "AI Engine", items: ["Drift", "Agent", "WhatsApp", "Nurture"], color: "#ef4444" },
                      { label: "Database", items: ["MySQL", "Drizzle ORM", "35 Tables"], color: "#10b981" },
                      { label: "External", items: ["OpenAI", "Meta Cloud", "OAuth"], color: "#6b7280" },
                    ].map((layer, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="rounded-lg border px-4 py-3 min-w-[140px]" style={{ borderColor: layer.color + "30", backgroundColor: layer.color + "08" }}>
                          <p className="text-[11px] font-semibold mb-1.5" style={{ color: layer.color }}>{layer.label}</p>
                          <div className="space-y-0.5">
                            {layer.items.map((item, j) => (
                              <p key={j} className="text-[10px] text-white/40">{item}</p>
                            ))}
                          </div>
                        </div>
                        {i < 4 && <ArrowRight className="w-4 h-4 text-white/10 my-1 rotate-90" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Principles */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Tenant Isolation", desc: "Every request verified via orgProcedure. Zero trust client orgId." },
                    { title: "Soft Delete", desc: "deletedAt timestamp on all tables. No data is ever truly lost." },
                    { title: "AI-Native", desc: "AI suggests → human approves → system executes. Not bolted-on." },
                    { title: "Hot Routing", desc: "Drift score >= 80 auto-creates agent tasks. No lead goes cold." },
                  ].map((p, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                      <p className="text-[12px] font-semibold text-white/80 mb-1">{p.title}</p>
                      <p className="text-[11px] text-white/40">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DATABASE */}
            {activeTab === "database" && (
              <motion.div key="database" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 max-w-4xl">
                {TABLE_GROUPS.map(group => (
                  <div key={group.name} className="rounded-xl border border-white/[0.04] overflow-hidden">
                    <button onClick={() => toggleGroup(group.name)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                        <span className="text-[12px] font-medium text-white/80">{group.name}</span>
                        <span className="text-[10px] text-white/25">{group.tables.length} tables</span>
                      </div>
                      {expandedGroup === group.name ? <ChevronDown className="w-3.5 h-3.5 text-white/20" /> : <ChevronRight className="w-3.5 h-3.5 text-white/20" />}
                    </button>
                    <AnimatePresence>
                      {expandedGroup === group.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-3 space-y-2">
                            {group.tables.map(table => (
                              <div key={table.name} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/[0.015]">
                                <Table className="w-3.5 h-3.5 text-white/20 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono font-medium text-white/70">{table.name}</span>
                                    <span className="text-[9px] text-white/20">{table.cols.length} cols</span>
                                  </div>
                                  <p className="text-[10px] text-white/25">{table.desc}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {table.cols.slice(0, 5).map(col => (
                                      <span key={col} className="text-[8px] px-1 py-[1px] rounded bg-white/[0.03] text-white/20 font-mono">{col}</span>
                                    ))}
                                    {table.cols.length > 5 && <span className="text-[8px] text-white/15">+{table.cols.length - 5}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* API */}
            {activeTab === "api" && (
              <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 max-w-4xl">
                {API_ROUTERS.map(router => (
                  <div key={router.name} className="rounded-xl border border-white/[0.04] overflow-hidden">
                    <button onClick={() => toggleRouter(router.name)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: router.color + "15" }}>
                          <router.icon className="w-3.5 h-3.5" style={{ color: router.color }} />
                        </div>
                        <div className="text-left">
                          <span className="text-[12px] font-medium text-white/80">{router.name}</span>
                          <span className="text-[10px] text-white/25 ml-2">{router.endpoints.length} endpoints</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/25">{router.desc}</span>
                        {expandedRouter === router.name ? <ChevronDown className="w-3.5 h-3.5 text-white/20" /> : <ChevronRight className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedRouter === router.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                            {router.endpoints.map(ep => (
                              <span key={ep} className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.04] text-[10px] text-white/40 font-mono">{ep}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DATA FLOW */}
            {activeTab === "flow" && (
              <motion.div key="flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-4xl">
                {/* Flow selector */}
                <div className="flex items-center gap-2">
                  {DATA_FLOWS.map((flow, i) => (
                    <button key={flow.name} onClick={() => setSelectedFlow(i)}
                      className={`px-3 h-8 rounded-lg border text-[11px] transition-all ${selectedFlow === i ? "border-white/[0.12] bg-white/[0.05] text-white/80" : "border-transparent text-white/30 hover:bg-white/[0.02]"}`}>
                      {flow.name}
                    </button>
                  ))}
                </div>

                {/* Flow visualization */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
                  <div className="space-y-3">
                    {DATA_FLOWS[selectedFlow].steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/50">{i + 1}</div>
                          {i < DATA_FLOWS[selectedFlow].steps.length - 1 && <div className="w-[1px] h-6 bg-white/[0.06]" />}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[12px] font-medium text-white/80">{step.label}</span>
                            <span className="text-[9px] px-1.5 py-[1px] rounded-full bg-white/[0.04] text-white/30">{step.system}</span>
                          </div>
                          <p className="text-[11px] text-white/40">{step.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI ENGINE */}
            {activeTab === "ai" && (
              <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-4xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Drift Scoring", file: "api/lib/drift.ts", color: "#ef4444", inputs: "15 signal types", outputs: "driftScore 0-100", logic: "Weighted sum + 30-day exponential decay + recency/frequency/depth factors" },
                    { name: "Axis Agent", file: "api/lib/agent.ts", color: "#3b82f6", inputs: "User message + project context", outputs: "JSON intent block + response", logic: "OpenAI GPT-4o-mini with project context system prompt" },
                    { name: "WhatsApp Helper", file: "api/lib/whatsapp.ts", color: "#10b981", inputs: "phone + text", outputs: "sent/not sent", logic: "Meta Cloud API HTTP POST with auth token" },
                    { name: "Nurture Engine", file: "api/lib/nurture.ts", color: "#8b5cf6", inputs: "leadId + triggerStage", outputs: "6-step message sequence", logic: "DB-driven cron: processNurture every hour" },
                  ].map((engine, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: engine.color }} />
                        <p className="text-[12px] font-semibold text-white/80">{engine.name}</p>
                      </div>
                      <p className="text-[9px] text-white/20 font-mono mb-2">{engine.file}</p>
                      <div className="space-y-1.5">
                        <div><span className="text-[9px] text-white/20">INPUT:</span><span className="text-[10px] text-white/40 ml-1.5">{engine.inputs}</span></div>
                        <div><span className="text-[9px] text-white/20">OUTPUT:</span><span className="text-[10px] text-white/40 ml-1">{engine.outputs}</span></div>
                        <div><span className="text-[9px] text-white/20">LOGIC:</span><span className="text-[10px] text-white/40 ml-1.5">{engine.logic}</span></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Signal Weights Table */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
                  <p className="text-[11px] text-white/30 mb-3 uppercase tracking-wider">Drift Score Weights</p>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-1.5">
                    {[
                      ["viewing_request", 40], ["mortgage_calc", 30], ["pricing_click", 25],
                      ["3d_model_interact", 20], ["whatsapp_message", 20], ["comparison", 20],
                      ["brochure_download", 15], ["return_visit", 15], ["search_arrival", 15],
                      ["referral", 35], ["social_click", 10], ["partner_embed", 10],
                      ["email_open", 5], ["page_view", 5], ["floor_plan_view", 10],
                    ].map(([signal, weight]) => (
                      <div key={signal} className="flex items-center justify-between">
                        <span className="text-[10px] text-white/40 capitalize">{(signal as string).replace(/_/g, " ")}</span>
                        <span className="text-[10px] text-white/60 font-mono">+{weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* COMPONENTS */}
            {activeTab === "components" && (
              <motion.div key="components" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl">
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
                  <p className="text-[11px] text-white/30 mb-4 uppercase tracking-wider">Component Hierarchy</p>
                  <div className="space-y-1">
                    {[
                      { name: "App.tsx", level: 0, type: "root", desc: "HashRouter, tRPC provider, auth check" },
                      { name: "LandingPage", level: 1, type: "page", desc: "Public marketing page" },
                      { name: "NeuralDashboard", level: 1, type: "page", api: "funnelStats + tasks", desc: "Canvas 2D radial visualization" },
                      { name: "SuperAdmin", level: 1, type: "page", desc: "Platform management" },
                      { name: "AdminLayout", level: 1, type: "layout", desc: "Sidebar + content area" },
                      { name: "├─ AdminDashboard", level: 2, type: "page", api: "project.list + funnelStats", desc: "Stats, project list, charts" },
                      { name: "├─ DemandEngine", level: 2, type: "page", api: "funnelStats + hotLeads", desc: "3-tab: Funnel / Signals / Sources" },
                      { name: "├─ AdminCRM", level: 2, type: "page", api: "hotLeads + crm.*", desc: "Kanban + LeadDetail panel" },
                      { name: "├─ AdminTasks", level: 2, type: "page", api: "demand.tasks", desc: "Priority-filtered task list" },
                      { name: "├─ AdminProjects", level: 2, type: "page", api: "project.list", desc: "Project grid with stats" },
                      { name: "├─ AdminUnits", level: 2, type: "page", api: "unit.list", desc: "Unit inventory with filters" },
                      { name: "├─ CampaignBuilder", level: 2, type: "page", api: "campaign.*", desc: "5-step wizard + AI plan" },
                      { name: "├─ AdEditor", level: 2, type: "page", api: "campaign.creatives", desc: "4-platform ad editor" },
                      { name: "├─ SEOKewords", level: 2, type: "page", api: "keyword.*", desc: "AI suggest + approve/reject" },
                      { name: "├─ WidgetConfig", level: 2, type: "page", api: "widget.*", desc: "Toggle features, embed code" },
                      { name: "├─ AdminSettlements", level: 2, type: "page", desc: "SettlementRadar component" },
                      { name: "├─ AdminHold", level: 2, type: "page", desc: "HOLDSuite component" },
                      { name: "├─ AdminAlgorithms", level: 2, type: "page", desc: "AlgorithmPanel component" },
                      { name: "├─ AdminPhasing", level: 2, type: "page", desc: "ConstructionPhasing component" },
                      { name: "├─ DocumentVault", level: 2, type: "page", desc: "File management" },
                      { name: "├─ FinancialModelling", level: 2, type: "page", desc: "Scenario planning" },
                      { name: "├─ FloorPlanViewer", level: 2, type: "page", desc: "SVG unit layouts" },
                      { name: "├─ DigitalTwin", level: 2, type: "page", desc: "Building systems monitor" },
                      { name: "├─ ThreeViewer", level: 2, type: "page", desc: "3D wireframe viewer" },
                      { name: "└─ AgentConsole", level: 2, type: "page", api: "demand.agentChat", desc: "AI chat interface" },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center gap-3 py-1" style={{ paddingLeft: node.level * 20 }}>
                        <span className="text-[11px] text-white/70 whitespace-nowrap">{node.name}</span>
                        {node.api && <span className="text-[8px] px-1.5 py-[1px] rounded-full bg-blue-500/10 text-blue-400 font-mono">{node.api}</span>}
                        {node.type === "page" && !node.api && <span className="text-[8px] px-1.5 py-[1px] rounded-full bg-white/[0.04] text-white/25">UI</span>}
                        <span className="text-[10px] text-white/25 ml-auto">{node.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
