import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Heart, Clock, Eye, CheckCircle2, AlertTriangle,
  ChevronRight, X, Building2, Bed, Bath, Square, Car,
  DollarSign, ArrowRight, Sparkles, TrendingUp, Zap
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   MOCK DATA — "Welcome Back" Experience
   ═══════════════════════════════════════════ */
const VISITOR = {
  name: "James",
  lastVisit: "3 days ago",
  visitCount: 7,
  totalTime: "42 minutes",
};

const SHORTLIST = [
  { id: "A1402", unit: "A1402", type: "2 Bed + Study", area: 98, price: 1820000, status: "available" as const, floor: 14, view: "Harbour", lastViewed: "3 days ago", fav: true },
  { id: "A1203", unit: "A1203", type: "2 Bed", area: 95, price: 1650000, status: "sold" as const, floor: 12, view: "Harbour + City", lastViewed: "1 week ago", fav: true },
  { id: "A1501", unit: "A1501", type: "3 Bed", area: 128, price: 2680000, status: "available" as const, floor: 15, view: "City + Harbour", lastViewed: "3 days ago", fav: false },
  { id: "A1002", unit: "A1002", type: "2 Bed", area: 85, price: 1380000, status: "reserved" as const, floor: 10, view: "Park", lastViewed: "2 weeks ago", fav: true },
];

const INSIGHTS = [
  { type: "alert", message: "A1203 sold 2 days ago — similar units: A1204, A1402", icon: AlertTriangle, color: "amber" },
  { type: "insight", message: "A1402 price reduced 3% since your last visit", icon: TrendingUp, color: "emerald" },
  { type: "tip", message: "3Bed units on Level 15+ have 85% harbour view rating", icon: Sparkles, color: "blue" },
];

const RECENTLY_VIEWED = [
  { unit: "A1402", time: "3 days ago", action: "Floor plan · 4 min" },
  { unit: "A1501", time: "3 days ago", action: "Gallery · 2 min" },
  { unit: "A1203", time: "1 week ago", action: "Pricing · 1 min" },
];

const CONFIG_CHOICES = {
  kitchen: "Premium White",
  flooring: "European Oak",
  bathroom: "Matte Black",
};

const fmtPrice = (n: number) => `$${(n / 1000000).toFixed(2)}M`;

const statusColors: Record<string, { bg: string; text: string }> = {
  available: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  sold: { bg: "bg-red-500/10", text: "text-red-400" },
  reserved: { bg: "bg-amber-500/10", text: "text-amber-400" },
};

export default function ItRemembers() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const availableShortlist = SHORTLIST.filter(u => u.status === "available");
  const changedShortlist = SHORTLIST.filter(u => u.status !== "available");

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">It Remembers</h1>
              <p className="text-[10px] text-white/25">Identity + continuity across visits</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Welcome back banner */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-violet-500/[0.06] to-purple-500/[0.02] border border-violet-500/10 rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <h2 className="text-[16px] font-bold text-white/90 mb-1">
                          Welcome back, {VISITOR.name}
                        </h2>
                        <p className="text-[12px] text-white/30 mb-2">
                          Your {VISITOR.visitCount}th visit · Last here {VISITOR.lastVisit} · {VISITOR.totalTime} total engagement
                        </p>
                        {changedShortlist.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <p className="text-[11px] text-amber-400/70">
                              {changedShortlist.length} unit{changedShortlist.length > 1 ? "s" : ""} on your shortlist {changedShortlist.length > 1 ? "have" : "has"} changed status since your last visit
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setShowWelcome(false)} className="text-white/15 hover:text-white/30">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Shortlist */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-medium text-white/50 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-white/20" /> Your Shortlist
                </h3>
                <span className="text-[10px] text-white/15">{availableShortlist.length} available · {changedShortlist.length} changed</span>
              </div>

              {SHORTLIST.map((unit, i) => {
                const st = statusColors[unit.status];
                const changed = unit.status !== "available";
                return (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                    className={`bg-white/[0.02] border rounded-xl p-4 cursor-pointer transition-all ${
                      changed ? "border-red-500/10" : "border-white/[0.04] hover:border-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {changed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0"
                          >
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                          </motion.div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-white/80">{unit.unit}</span>
                            <span className={`px-1.5 py-0.5 rounded-full ${st.bg} ${st.text} text-[8px] font-semibold uppercase`}>
                              {unit.status}
                            </span>
                            {changed && (
                              <span className="text-[8px] text-red-400/60 font-medium">Status changed</span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/25">{unit.type} · {unit.area}m² · Floor {unit.floor} · {unit.view} view</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-semibold text-white/70">{fmtPrice(unit.price)}</p>
                        <p className="text-[9px] text-white/15">Viewed {unit.lastViewed}</p>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {selectedUnit === unit.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-3">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 text-[10px] hover:bg-white/[0.1] transition-colors">
                              <Eye className="w-3 h-3" /> View Unit
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] hover:bg-emerald-500/15 transition-colors">
                              <DollarSign className="w-3 h-3" /> Reserve
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/30 text-[10px] hover:bg-white/[0.08] transition-colors">
                              <ArrowRight className="w-3 h-3" /> Share
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Insights */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h3 className="text-[11px] font-medium text-white/40 mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> Insights
                </h3>
                <div className="space-y-3">
                  {INSIGHTS.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <insight.icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-${insight.color}-400`} style={{ color: insight.color === "amber" ? "#f59e0b" : insight.color === "emerald" ? "#10b981" : "#3b82f6" }} />
                      <p className="text-[10px] text-white/35 leading-relaxed">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved config */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h3 className="text-[11px] font-medium text-white/40 mb-3">Saved Configuration</h3>
                <div className="space-y-2">
                  {Object.entries(CONFIG_CHOICES).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-1 border-b border-white/[0.03] last:border-0">
                      <span className="text-[10px] text-white/25 capitalize">{key}</span>
                      <span className="text-[10px] text-white/50">{value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 py-1.5 rounded-lg bg-white/[0.04] text-white/30 text-[10px] hover:bg-white/[0.08] transition-colors">
                  Resume Configuring
                </button>
              </div>

              {/* Recently viewed */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h3 className="text-[11px] font-medium text-white/40 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Recently Viewed
                </h3>
                <div className="space-y-2">
                  {RECENTLY_VIEWED.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-[11px] text-white/50">{item.unit}</p>
                        <p className="text-[9px] text-white/15">{item.action}</p>
                      </div>
                      <span className="text-[9px] text-white/15">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
