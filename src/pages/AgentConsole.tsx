import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Building2, Users, TrendingUp, FileText,
  Wand2, BarChart3, ArrowRight, Check, Loader2, Bot,
  Zap, Eye, Clock, DollarSign, AlertTriangle,
  CircleDot, Mail
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface AgentMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  actions?: AgentAction[];
  cards?: DataCard[];
  status?: "thinking" | "done" | "error";
}

interface AgentAction {
  id: string;
  label: string;
  icon: any;
  status: "pending" | "running" | "done" | "needs_approval";
  description?: string;
}

interface DataCard {
  type: "project" | "unit" | "lead" | "analytics" | "alert";
  title: string;
  subtitle?: string;
  metric?: string;
  trend?: "up" | "down" | "neutral";
  status?: string;
  actions?: { label: string; onClick: () => void }[];
}

/* ═══════════════════════════════════════════
   MOCK AGENT ENGINE
   ═══════════════════════════════════════════ */
function generateAgentResponse(input: string): AgentMessage {
  const lower = input.toLowerCase();

  // Project creation intent
  if (lower.includes("new project") || lower.includes("create") && lower.includes("project")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      content: "I'll set up your new project. Based on your conversation, I'm preparing:\n\n**Azure Heights Tower** — 45-unit residential development in Sydney CBD.\n\nI've analyzed comparable projects in the area and have recommendations for pricing, unit mix, and marketing strategy. Here's what I'm building:",
      timestamp: new Date(),
      status: "done",
      actions: [
        { id: "a1", label: "Generating 3D site model", icon: Building2, status: "running", description: "Converting floor plans to interactive 3D" },
        { id: "a2", label: "Creating unit inventory", icon: FileText, status: "running", description: "45 units: 12x 1BR, 22x 2BR, 8x 3BR, 3x Penthouse" },
        { id: "a3", label: "Analyzing market comparables", icon: TrendingUp, status: "done", description: "Median $/sqm: $14,200 (CBD range $12K-$16.5K)" },
        { id: "a4", label: "Drafting pricing strategy", icon: DollarSign, status: "needs_approval", description: "Recommended: $1.2M-$4.8M range, 8% premium vs market" },
        { id: "a5", label: "Generating marketing content", icon: Wand2, status: "pending", description: "Listing copy, social posts, email templates" },
      ],
      cards: [
        { type: "analytics", title: "Market Position", metric: "Top 15%", trend: "up", subtitle: "vs comparable CBD developments" },
        { type: "alert", title: "Supply Alert", subtitle: "3 competing towers launching Q3 2026", status: "warning" },
      ],
    };
  }

  // Lead management intent
  if (lower.includes("lead") || lower.includes("prospect") || lower.includes("buyer")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      content: "I've analyzed your lead pipeline. Here's the intelligence:\n\n**Drift Scores Updated** — 3 leads moved into 'hot' territory based on recent engagement patterns.\n\nOne lead (James Chen, james@email.com) has visited the 3D model 4 times this week, spent 12+ minutes on the penthouse level, and compared pricing twice. I'm recommending immediate outreach.",
      timestamp: new Date(),
      status: "done",
      actions: [
        { id: "l1", label: "Scoring lead engagement", icon: TrendingUp, status: "done", description: "Drift Score: 87/100 (↑23 this week)" },
        { id: "l2", label: "Drafting personalized email", icon: Mail, status: "running", description: "Referencing his penthouse interest" },
        { id: "l3", label: "Scheduling follow-up", icon: Clock, status: "pending", description: "Optimal window: Tuesday 10am" },
        { id: "l4", label: "Preparing unit comparison", icon: FileText, status: "needs_approval", description: "Penthouse A vs B side-by-side" },
      ],
      cards: [
        { type: "lead", title: "James Chen", metric: "87", trend: "up", subtitle: "Drift Score — Hot lead", status: "hot" },
        { type: "lead", title: "Sarah Kim", metric: "64", trend: "up", subtitle: "Drift Score — Warming", status: "warm" },
        { type: "analytics", title: "Pipeline Value", metric: "$2.4M", trend: "up", subtitle: "Estimated from active leads" },
      ],
    };
  }

  // Analytics intent
  if (lower.includes("analytics") || lower.includes("report") || lower.includes("how are we")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      content: "Here's your project health summary:\n\n**Azure Heights is tracking 12% ahead of forecast.** 8 units reserved in the first 3 weeks vs. 6 projected. The 2BR units are moving fastest — I'm recommending we adjust pricing on remaining 1BR units to accelerate those.\n\n**Key insight:** Weekend engagement on the 3D viewer is 3.2x weekday engagement. I'm preparing a weekend-targeted email campaign.",
      timestamp: new Date(),
      status: "done",
      actions: [
        { id: "r1", label: "Compiling performance data", icon: BarChart3, status: "done" },
        { id: "r2", label: "Identifying pricing opportunities", icon: TrendingUp, status: "done" },
        { id: "r3", label: "Drafting weekend campaign", icon: Mail, status: "needs_approval" },
      ],
      cards: [
        { type: "analytics", title: "Units Reserved", metric: "8/45", trend: "up", subtitle: "18% — 3 weeks in" },
        { type: "analytics", title: "Avg. Time to Reserve", metric: "9 days", trend: "down", subtitle: "vs 14 days industry avg" },
        { type: "analytics", title: "3D Engagement", metric: "3.2x", trend: "up", subtitle: "Weekend vs weekday" },
      ],
    };
  }

  // Default intelligent response
  return {
    id: crypto.randomUUID(),
    role: "agent",
    content: "I understand. Let me handle that for you.\n\nI'm analyzing your request across all project data — units, leads, market signals, and engagement patterns. I'll have a complete action plan ready in a moment.\n\n**What would you like me to prioritize?** I can execute automatically or walk you through each step for approval.",
    timestamp: new Date(),
    status: "done",
    actions: [
      { id: "d1", label: "Analyzing your request", icon: Sparkles, status: "done" },
      { id: "d2", label: "Scanning project data", icon: Eye, status: "done" },
      { id: "d3", label: "Preparing action plan", icon: Zap, status: "needs_approval" },
    ],
  };
}

/* ═══════════════════════════════════════════
   ACTION BADGE
   ═══════════════════════════════════════════ */
function ActionBadge({ status }: { status: AgentAction["status"] }) {
  const config = {
    pending: { bg: "bg-white/[0.03]", text: "text-white/25", dot: "bg-white/10" },
    running: { bg: "bg-[#6b7280]/10", text: "text-[#6b7280]", dot: "bg-[#6b7280] animate-pulse" },
    done: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
    needs_approval: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500 animate-pulse" },
  };
  const c = config[status];
  const label = status === "needs_approval" ? "Needs approval" : status === "running" ? "In progress" : status === "done" ? "Complete" : "Pending";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════
   DATA CARD
   ═══════════════════════════════════════════ */
function DataCardView({ card }: { card: DataCard }) {
  const navigate = useNavigate();

  const statusColors: Record<string, string> = {
    hot: "bg-red-500/10 text-red-400 border-red-500/20",
    warm: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cold: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer min-w-[160px]"
      onClick={() => card.type === "lead" ? navigate("/admin/leads") : navigate("/admin/analytics")}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-white/40">{card.type}</span>
        {card.trend && (
          <span className={`text-[10px] ${card.trend === "up" ? "text-emerald-400" : card.trend === "down" ? "text-red-400" : "text-white/30"}`}>
            {card.trend === "up" ? "↑" : card.trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      <p className="text-[13px] font-semibold text-white/90 mb-0.5">{card.title}</p>
      {card.metric && <p className="text-[18px] font-bold text-white/80 tabular-nums">{card.metric}</p>}
      {card.subtitle && <p className="text-[10px] text-white/30 mt-1">{card.subtitle}</p>}
      {card.status && (
        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-medium border ${statusColors[card.status] || ""}`}>
          {card.status}
        </span>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SUGGESTION CHIP
   ═══════════════════════════════════════════ */
function SuggestionChip({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#6b7280]/20 text-white/50 hover:text-white/80 text-[12px] transition-all group"
    >
      <Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-[#6b7280]" />
      {label}
      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

/* ═══════════════════════════════════════════
   MAIN AGENT CONSOLE
   ═══════════════════════════════════════════ */
export default function AgentConsole() {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: "",
      timestamp: new Date(),
      actions: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: AgentMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate agent thinking
    setTimeout(() => {
      const agentMsg = generateAgentResponse(userMsg.content);
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  }, [input]);

  const quickSend = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const userMsg: AgentMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setTimeout(() => {
        const agentMsg = generateAgentResponse(text);
        setMessages((prev) => [...prev, agentMsg]);
        setIsTyping(false);
      }, 1000);
    }, 50);
  };

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 h-[52px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <span className="text-[13px] font-semibold text-white/80">Axis Agent</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-medium">
              <CircleDot className="w-2 h-2" />
              Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-1.5 rounded-lg text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-colors"
            >
              Dashboard view
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {/* Welcome state */}
          {messages.length === 1 && messages[0].role === "system" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mt-8"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center mx-auto mb-5"
                >
                  <Sparkles className="w-7 h-7 text-[#0A0A0A]" />
                </motion.div>
                <h1 className="text-[22px] font-semibold text-white/90 mb-2">Good morning, Alex</h1>
                <p className="text-[13px] text-white/35">I'm your Axis Agent. I handle 90% of the work — you make the decisions.</p>
              </div>

              {/* Quick actions grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {[
                  { label: "Launch new project", desc: "Auto-setup from plans", icon: Building2 },
                  { label: "Review hot leads", desc: "3 need attention now", icon: Users },
                  { label: "Check project health", desc: "Azure Heights +12%", icon: TrendingUp },
                  { label: "Generate campaign", desc: "Weekend push ready", icon: Wand2 },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    onClick={() => quickSend(item.label)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.05] hover:border-white/[0.08] text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-[#6b7280]/10 transition-colors">
                      <item.icon className="w-4 h-4 text-white/30 group-hover:text-[#6b7280]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-white/70 group-hover:text-white/90">{item.label}</p>
                      <p className="text-[11px] text-white/25 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                <SuggestionChip label="Price the remaining units" icon={DollarSign} onClick={() => quickSend("Price the remaining units optimally")} />
                <SuggestionChip label="Who's my hottest lead?" icon={Users} onClick={() => quickSend("Who's my hottest lead right now?")} />
                <SuggestionChip label="Draft weekend email" icon={Mail} onClick={() => quickSend("Draft a weekend promotional email campaign")} />
                <SuggestionChip label="Compare with competitors" icon={BarChart3} onClick={() => quickSend("How are we performing vs competitors?")} />
              </div>
            </motion.div>
          )}

          {/* Message history */}
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.filter(m => m.role !== "system").map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* User message */}
                {msg.role === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[#6b7280]/15 text-[13px] text-white/90 leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                )}

                {/* Agent message */}
                {msg.role === "agent" && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#0A0A0A]" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Text */}
                      <div className="text-[13px] text-white/70 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Action cards */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="space-y-2">
                          {msg.actions.map((action) => (
                            <motion.div
                              key={action.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.03] bg-white/[0.015]"
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                action.status === "done" ? "bg-emerald-500/10" :
                                action.status === "running" ? "bg-[#6b7280]/10" :
                                action.status === "needs_approval" ? "bg-amber-500/10" :
                                "bg-white/[0.03]"
                              }`}>
                                {action.status === "running" ? (
                                  <Loader2 className="w-3.5 h-3.5 text-[#6b7280] animate-spin" />
                                ) : action.status === "done" ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : action.status === "needs_approval" ? (
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <action.icon className="w-3.5 h-3.5 text-white/25" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12px] font-medium text-white/70">{action.label}</span>
                                  <ActionBadge status={action.status} />
                                </div>
                                {action.description && (
                                  <p className="text-[11px] text-white/30 mt-0.5">{action.description}</p>
                                )}
                              </div>
                              {action.status === "needs_approval" && (
                                <div className="flex gap-1.5 flex-shrink-0">
                                  <button className="px-3 py-1.5 rounded-lg bg-[#6b7280] hover:bg-[#52525b] text-[#0A0A0A] text-[11px] font-medium transition-colors">
                                    Approve
                                  </button>
                                  <button className="px-3 py-1.5 rounded-lg border border-white/[0.06] text-white/40 hover:text-white/70 text-[11px] transition-colors">
                                    Review
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Data cards */}
                      {msg.cards && msg.cards.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {msg.cards.map((card, ci) => (
                            <DataCardView key={ci} card={card} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#0A0A0A]" />
                </div>
                <div className="flex items-center gap-1.5 py-3">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4 pt-2 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 p-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] focus-within:border-[#6b7280]/20 focus-within:bg-white/[0.03] transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask me to do anything — create projects, analyze leads, price units, draft campaigns..."
                className="flex-1 bg-transparent text-[13px] text-white/80 placeholder:text-white/20 px-3 py-2.5 outline-none resize-none leading-relaxed"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-[#6b7280] hover:bg-[#52525b] disabled:opacity-30 disabled:hover:bg-[#6b7280] flex items-center justify-center transition-all flex-shrink-0 mb-0.5"
              >
                <ArrowRight className="w-4 h-4 text-[#0A0A0A]" />
              </button>
            </div>
            <p className="text-[10px] text-white/15 text-center mt-2">
              Axis Agent autonomously handles tasks. Key decisions require your approval.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
