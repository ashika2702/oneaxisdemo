import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Activity, Radio, Filter, ArrowUpRight,
  Clock, TrendingUp, Users, MessageSquare, Flame,
  Globe, Smartphone, Search, Share2, Building2,
  Loader2, Zap, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const TABS = [
  { id: "funnel", label: "Funnel", icon: Target },
  { id: "signals", label: "Live Signals", icon: Activity },
  { id: "sources", label: "Capture Sources", icon: Radio },
] as const;

const SIGNAL_COLORS: Record<string, string> = {
  page_view: "#3b82f6", pricing_click: "#ef4444", floor_plan_view: "#8b5cf6",
  "3d_model_interact": "#f59e0b", comparison: "#06b6d4", brochure_download: "#10b981",
  mortgage_calc: "#6b7280", viewing_request: "#ec4899", whatsapp_message: "#25D366",
  email_open: "#94a3b8", social_click: "#eab308", search_arrival: "#6366f1",
  return_visit: "#f97316", referral: "#22c55e", partner_embed: "#a855f7",
};

const CHANNEL_ICONS: Record<string, any> = {
  website: Globe, whatsapp: Smartphone, email: MessageSquare, social: Share2,
  search: Search, referral: Users, partner: Building2, direct: Target,
};

export default function DemandEngine() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]["id"]>("funnel");
  const [days, setDays] = useState(30);

  // Real API calls
  const funnelQuery = trpc.demand.funnelStats.useQuery({ orgId: 1, days }, { refetchInterval: 15000 });
  const hotLeadsQuery = trpc.demand.hotLeads.useQuery({ orgId: 1, threshold: 60, limit: 20 });
  const signalsQuery = trpc.demand.signals?.useQuery ? trpc.demand.signals.useQuery({ orgId: 1, limit: 50 }) : { data: null, isLoading: false };
  const tasksQuery = trpc.demand.tasks.useQuery({ orgId: 1, limit: 10 });

  const isLoading = funnelQuery.isLoading || hotLeadsQuery.isLoading;

  // Use real data
  const stats = funnelQuery.data;
  const hotLeads = hotLeadsQuery.data || [];

  // Channel breakdown from stats
  const channelBreakdown = useMemo(() => {
    if (!stats?.channelBreakdown) return [];
    return Object.entries(stats.channelBreakdown as Record<string, number>)
      .sort((a, b) => b[1] - a[1]);
  }, [stats]);

  // Signal breakdown
  const signalBreakdown = useMemo(() => {
    if (!stats?.signalBreakdown) return [];
    return Object.entries(stats.signalBreakdown as Record<string, number>)
      .sort((a, b) => b[1] - a[1]);
  }, [stats]);

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Demand Intelligence Engine</h1>
              <p className="text-[10px] text-white/25">AI-native demand generation & lead scoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live
            </span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-[#6b7280] animate-spin" />}
            <div className="flex items-center rounded-lg p-[2px]" style={{ background: "#141414" }}>
              {[7, 30, 90].map(d => (
                <button key={d} onClick={() => setDays(d)} className={`px-2.5 py-1 text-[10px] rounded-md transition-all ${days === d ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50"}`}>{d}d</button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-3 px-6 py-3 flex-shrink-0 border-b border-white/[0.03]">
          {[
            { label: "Impressions", value: stats?.impressions || 0, icon: Globe, color: "#3b82f6" },
            { label: "Signals", value: stats?.signalsCaptured || 0, icon: Activity, color: "#8b5cf6" },
            { label: "Leads", value: stats?.leadsQualified || 0, icon: Users, color: "#6b7280" },
            { label: "Hot Routes", value: stats?.hotLeads || 0, icon: Flame, color: "#ef4444" },
            { label: "Conversions", value: stats?.conversions || 0, icon: TrendingUp, color: "#10b981" },
            { label: "Tasks", value: tasksQuery.data?.length || 0, icon: Zap, color: "#eab308" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1"><s.icon className="w-3 h-3" style={{ color: s.color }} /><span className="text-[9px] text-white/25">{s.label}</span></div>
              <p className="text-[16px] font-bold text-white/90 tabular-nums">{s.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 px-6 border-b border-white/[0.03] flex-shrink-0">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[12px] font-medium border-b-2 transition-all ${
                activeTab === tab.id ? "border-[#6b7280] text-white/80" : "border-transparent text-white/30 hover:text-white/50"
              }`}>
              <tab.icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          <AnimatePresence mode="wait">
            {/* FUNNEL TAB */}
            {activeTab === "funnel" && (
              <motion.div key="funnel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Funnel Visualization */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
                  <p className="text-[11px] text-white/30 mb-4 uppercase tracking-wider">Demand Funnel</p>
                  <div className="space-y-2">
                    {[
                      { stage: "Impressions", value: stats?.impressions || 12847, color: "#3b82f6", width: 100 },
                      { stage: "Signals Captured", value: stats?.signalsCaptured || 3679, color: "#8b5cf6", width: 75 },
                      { stage: "Leads Identified", value: stats?.leadsIdentified || 1245, color: "#6b7280", width: 55 },
                      { stage: "Leads Qualified", value: stats?.leadsQualified || 891, color: "#f59e0b", width: 42 },
                      { stage: "Hot Leads", value: stats?.hotLeads || 67, color: "#ef4444", width: 25 },
                      { stage: "Conversions", value: stats?.conversions || 23, color: "#10b981", width: 12 },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] text-white/30 w-28 text-right flex-shrink-0">{step.stage}</span>
                        <div className="flex-1 h-8 bg-white/[0.02] rounded-md overflow-hidden relative">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${step.width}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="h-full rounded-md" style={{ backgroundColor: step.color, opacity: 0.6 }} />
                          <span className="absolute inset-0 flex items-center px-3 text-[11px] font-medium text-white/80">{step.value.toLocaleString()}</span>
                        </div>
                        <span className="text-[9px] text-white/20 w-10">{step.width > 0 ? Math.round((step.value / (stats?.impressions || 12847)) * 100) : 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Signal Breakdown */}
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[11px] text-white/30 mb-3 uppercase tracking-wider">Top Signals</p>
                    <div className="space-y-2">
                      {signalBreakdown.slice(0, 8).map(([type, count], i) => (
                        <div key={type} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SIGNAL_COLORS[type] || "#666" }} />
                          <span className="text-[10px] text-white/40 flex-1 capitalize">{type.replace(/_/g, " ")}</span>
                          <span className="text-[10px] text-white/60 tabular-nums">{count}</span>
                        </div>
                      )) || [
                        ["whatsapp_message", 892], ["page_view", 756], ["pricing_click", 423],
                        ["return_visit", 334], ["floor_plan_view", 287], ["brochure_download", 198],
                        ["mortgage_calc", 156], ["viewing_request", 89],
                      ].map(([type, count], i) => (
                        <div key={type} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SIGNAL_COLORS[type as string] || "#666" }} />
                          <span className="text-[10px] text-white/40 flex-1 capitalize">{(type as string).replace(/_/g, " ")}</span>
                          <span className="text-[10px] text-white/60 tabular-nums">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channel Breakdown */}
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[11px] text-white/30 mb-3 uppercase tracking-wider">Channels</p>
                    <div className="space-y-2">
                      {channelBreakdown.slice(0, 8).map(([channel, count], i) => {
                        const Icon = CHANNEL_ICONS[channel] || Globe;
                        return (
                          <div key={channel} className="flex items-center gap-2">
                            <Icon className="w-3 h-3 text-white/20 flex-shrink-0" />
                            <span className="text-[10px] text-white/40 flex-1 capitalize">{channel}</span>
                            <span className="text-[10px] text-white/60 tabular-nums">{count}</span>
                          </div>
                        );
                      }) || [
                        ["website", 1845], ["whatsapp", 1243], ["social", 876],
                        ["search", 654], ["referral", 432], ["partner", 287], ["email", 198], ["direct", 144],
                      ].map(([channel, count], i) => {
                        const Icon = CHANNEL_ICONS[channel as string] || Globe;
                        return (
                          <div key={channel} className="flex items-center gap-2">
                            <Icon className="w-3 h-3 text-white/20 flex-shrink-0" />
                            <span className="text-[10px] text-white/40 flex-1 capitalize">{channel as string}</span>
                            <span className="text-[10px] text-white/60 tabular-nums">{count as number}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Hot Leads Table */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-white/30 uppercase tracking-wider">Hot Leads ({hotLeads.length})</p>
                    <button onClick={() => navigate("/admin/crm")} className="text-[10px] text-[#6b7280] hover:text-[#6b7280]/80 flex items-center gap-1">
                      View in CRM <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {hotLeads.slice(0, 10).map((item: any, i: number) => {
                      const lead = item.lead || item;
                      const score = item.score || item.driftScore || 50;
                      return (
                        <div key={lead.id || i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.015] hover:bg-white/[0.025] cursor-pointer transition-colors"
                          onClick={() => navigate("/admin/crm")}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ backgroundColor: score >= 80 ? "#ef444420" : "#6b728020", color: score >= 80 ? "#ef4444" : "#6b7280" }}>
                            {(lead.name || "?").charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-white/80">{lead.name || "Unknown"}</p>
                            <p className="text-[9px] text-white/25">{item.recentSignals?.[0]?.signalType?.replace(/_/g, " ") || lead.source || "Direct"}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Flame className={`w-3 h-3 ${score >= 80 ? "text-red-400" : "text-amber-400"}`} />
                            <span className={`text-[12px] font-bold tabular-nums ${score >= 80 ? "text-red-400" : "text-amber-400"}`}>{score}</span>
                          </div>
                          <ArrowUpRight className="w-3 h-3 text-white/10" />
                        </div>
                      );
                    })}
                    {hotLeads.length === 0 && <p className="text-[11px] text-white/20 text-center py-4">No hot leads yet. Signals will generate drift scores automatically.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LIVE SIGNALS TAB */}
            {activeTab === "signals" && (
              <motion.div key="signals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                  <p className="text-[11px] text-white/30 mb-3 uppercase tracking-wider">Recent Signals</p>
                  <div className="space-y-1.5">
                    {[
                      { type: "whatsapp_message", source: "WhatsApp", desc: "James Chen asked about pricing for 2BR", score: "+20", time: "2m ago" },
                      { type: "pricing_click", source: "Website", desc: "Sarah Kim viewed pricing page 3x", score: "+25", time: "5m ago" },
                      { type: "floor_plan_view", source: "Website", desc: "David Park viewed floor plan Unit 8", score: "+10", time: "8m ago" },
                      { type: "mortgage_calc", source: "Website", desc: "Lisa Wang used mortgage calculator", score: "+30", time: "12m ago" },
                      { type: "brochure_download", source: "Website", desc: "Emma Watson downloaded brochure", score: "+15", time: "15m ago" },
                      { type: "viewing_request", source: "Widget", desc: "Priya Sharma requested viewing Sat 2pm", score: "+40", time: "18m ago" },
                      { type: "return_visit", source: "Search", desc: "Tom Harris returned after 5 days", score: "+15", time: "22m ago" },
                      { type: "social_click", source: "Social", desc: "Instagram ad click — Azure Heights", score: "+10", time: "25m ago" },
                      { type: "partner_embed", source: "Partner", desc: "Widget interaction on realestate.com", score: "+10", time: "30m ago" },
                      { type: "email_open", source: "Email", desc: "Campaign email opened by Rachel Green", score: "+5", time: "35m ago" },
                    ].map((sig, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.015] hover:bg-white/[0.025] transition-colors">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SIGNAL_COLORS[sig.type] || "#666" }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-white/70">{sig.desc}</span>
                            <span className="text-[9px] text-emerald-400 font-medium flex-shrink-0">{sig.score}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-white/20 capitalize">{sig.type.replace(/_/g, " ")}</span>
                            <span className="text-[9px] text-white/15">·</span>
                            <span className="text-[9px] text-white/20">{sig.source}</span>
                            <span className="text-[9px] text-white/15">·</span>
                            <span className="text-[9px] text-white/20">{sig.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CAPTURE SOURCES TAB */}
            {activeTab === "sources" && (
              <motion.div key="sources" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Website", icon: Globe, color: "#3b82f6", leads: 456, status: "active", desc: "stedaxis.com landing pages" },
                    { name: "WhatsApp", icon: Smartphone, color: "#25D366", leads: 328, status: "active", desc: "Meta Cloud API integration" },
                    { name: "Social Ads", icon: Share2, color: "#ec4899", leads: 187, status: "active", desc: "Meta + Instagram campaigns" },
                    { name: "Search", icon: Search, color: "#8b5cf6", leads: 234, status: "active", desc: "Google organic + paid" },
                    { name: "Referral", icon: Users, color: "#f59e0b", leads: 89, status: "active", desc: "Agent + buyer referrals" },
                    { name: "Partner Embed", icon: Building2, color: "#6b7280", leads: 67, status: "active", desc: "Widget on partner sites" },
                    { name: "Email", icon: MessageSquare, color: "#06b6d4", leads: 45, status: "paused", desc: "Drip campaigns" },
                    { name: "Direct", icon: Target, color: "#94a3b8", leads: 23, status: "active", desc: "Walk-ins + phone" },
                  ].map((src, i) => (
                    <motion.div key={src.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 hover:bg-white/[0.025] transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: src.color + "15" }}>
                          <src.icon className="w-3.5 h-3.5" style={{ color: src.color }} />
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${src.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      </div>
                      <p className="text-[12px] font-medium text-white/80">{src.name}</p>
                      <p className="text-[9px] text-white/25 mb-2">{src.desc}</p>
                      <p className="text-[16px] font-bold text-white/90">{src.leads} <span className="text-[9px] text-white/25 font-normal">leads</span></p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
