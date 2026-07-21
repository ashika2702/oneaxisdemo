import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Calculator, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const SCENARIOS = [
  { id: "base", name: "Base Case", revenue: 28400000, cost: 19800000, profit: 8600000, margin: 30.3, units: 120, pricePerUnit: 236667 },
  { id: "optimistic", name: "Optimistic", revenue: 34200000, cost: 21500000, profit: 12700000, margin: 37.1, units: 140, pricePerUnit: 244286 },
  { id: "pessimistic", name: "Pessimistic", revenue: 22100000, cost: 18200000, profit: 3900000, margin: 17.6, units: 100, pricePerUnit: 221000 },
];

const COST_BREAKDOWN = [
  { category: "Construction", amount: 14200000, pct: 71.7 },
  { category: "Land & Acquisition", amount: 2800000, pct: 14.1 },
  { category: "Marketing & Sales", amount: 1200000, pct: 6.1 },
  { category: "Professional Fees", amount: 780000, pct: 3.9 },
  { category: "Contingency", amount: 820000, pct: 4.1 },
];

function StatCard({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
      <p className="text-[10px] text-white/25 mb-2 uppercase tracking-wider">{label}</p>
      <p className="text-[20px] font-bold text-white/90 tabular-nums">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {up ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
        <span className={`text-[10px] ${up ? "text-emerald-400" : "text-red-400"}`}>{change}</span>
      </div>
    </div>
  );
}

export default function FinancialModelling() {
  const [scenario, setScenario] = useState("base");
  const s = SCENARIOS.find(x => x.id === scenario) || SCENARIOS[0];

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Calculator className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Financial Modelling</h1>
              <p className="text-[10px] text-white/25">Scenario planning & projections</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {SCENARIOS.map(sc => (
              <button key={sc.id} onClick={() => setScenario(sc.id)}
                className={`px-3 h-8 rounded-lg border text-[11px] transition-all ${scenario === sc.id ? "border-white/[0.12] bg-white/[0.05] text-white/80" : "border-transparent text-white/30 hover:bg-white/[0.02]"}`}>
                {sc.name}
              </button>
            ))}
            <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/50 text-[11px]">
              <Download className="w-3 h-3" />Export
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="Gross Revenue" value={`$${(s.revenue / 1000000).toFixed(1)}M`} change="+8.2%" up={true} />
            <StatCard label="Total Cost" value={`$${(s.cost / 1000000).toFixed(1)}M`} change="+4.1%" up={false} />
            <StatCard label="Gross Profit" value={`$${(s.profit / 1000000).toFixed(1)}M`} change="+15.3%" up={true} />
            <StatCard label="Profit Margin" value={`${s.margin.toFixed(1)}%`} change="+2.8pp" up={true} />
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
              <p className="text-[11px] text-white/30 mb-4 uppercase tracking-wider">Cost Breakdown</p>
              <div className="space-y-3">
                {COST_BREAKDOWN.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/50">{c.category}</span>
                      <span className="text-[11px] text-white/40 tabular-nums">${(c.amount / 1000000).toFixed(1)}M ({c.pct}%)</span>
                    </div>
                    <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="h-full rounded-full bg-white/[0.12]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
              <p className="text-[11px] text-white/30 mb-4 uppercase tracking-wider">Unit Economics</p>
              <div className="space-y-4">
                {[
                  { label: "Units in Scenario", value: s.units.toString() },
                  { label: "Avg Price / Unit", value: `$${s.pricePerUnit.toLocaleString()}` },
                  { label: "Revenue / Unit", value: `$${(s.revenue / s.units).toLocaleString()}` },
                  { label: "Cost / Unit", value: `$${(s.cost / s.units).toLocaleString()}` },
                  { label: "Profit / Unit", value: `$${(s.profit / s.units).toLocaleString()}`, highlight: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <span className="text-[11px] text-white/40">{item.label}</span>
                    <span className={`text-[13px] font-medium tabular-nums ${item.highlight ? "text-emerald-400" : "text-white/80"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
