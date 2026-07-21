import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign,
  ArrowUpRight, Percent, Target, Clock, Activity
} from 'lucide-react';

interface ProjectionScenario {
  id: string;
  name: string;
  irr: number;
  roi: number;
  npv: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  paybackPeriod: number;
  color: string;
}

const SCENARIOS: ProjectionScenario[] = [
  { id: 'conservative', name: 'Conservative', irr: 14.2, roi: 18.5, npv: 8.4, totalRevenue: 42.8, totalCost: 36.1, profit: 6.7, paybackPeriod: 3.8, color: 'bg-blue-500' },
  { id: 'base', name: 'Base Case', irr: 18.6, roi: 24.2, npv: 12.8, totalRevenue: 48.5, totalCost: 36.1, profit: 12.4, paybackPeriod: 2.9, color: 'bg-emerald-500' },
  { id: 'optimistic', name: 'Optimistic', irr: 24.8, roi: 32.1, npv: 18.6, totalRevenue: 55.2, totalCost: 36.1, profit: 19.1, paybackPeriod: 2.1, color: 'bg-purple-500' },
];

const CASHFLOW = [
  { quarter: 'Q1 2026', inflow: 4.2, outflow: 8.5, cumulative: -4.3 },
  { quarter: 'Q2 2026', inflow: 6.8, outflow: 5.2, cumulative: -2.7 },
  { quarter: 'Q3 2026', inflow: 9.5, outflow: 3.8, cumulative: 3.0 },
  { quarter: 'Q4 2026', inflow: 12.1, outflow: 2.1, cumulative: 13.0 },
  { quarter: 'Q1 2027', inflow: 8.4, outflow: 1.5, cumulative: 19.9 },
  { quarter: 'Q2 2027', inflow: 5.2, outflow: 0.8, cumulative: 24.3 },
  { quarter: 'Q3 2027', inflow: 2.3, outflow: 0.3, cumulative: 26.3 },
  { quarter: 'Q4 2027', inflow: 0.5, outflow: 0.1, cumulative: 26.7 },
];

const SENSITIVITY = [
  { variable: 'Sale Price -10%', irr: 12.4, roi: 14.8, npv: 4.2 },
  { variable: 'Sale Price -5%', irr: 15.8, roi: 19.8, npv: 8.8 },
  { variable: 'Base Case', irr: 18.6, roi: 24.2, npv: 12.8 },
  { variable: 'Sale Price +5%', irr: 21.4, roi: 28.6, npv: 16.8 },
  { variable: 'Sale Price +10%', irr: 24.2, roi: 32.8, npv: 20.8 },
  { variable: 'Cost +10%', irr: 15.2, roi: 18.4, npv: 7.2 },
  { variable: 'Cost -10%', irr: 22.4, roi: 30.8, npv: 18.4 },
];

export default function FinancialProjections() {
  const [activeScenario, setActiveScenario] = useState('base');
  const [activeTab, setActiveTab] = useState<'overview' | 'cashflow' | 'sensitivity'>('overview');
  const scenario = SCENARIOS.find(s => s.id === activeScenario) || SCENARIOS[1];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Financial Projections Engine</h2>
            <p className="text-gray-400 text-sm">IRR, NPV, ROI, cash flow modeling & sensitivity analysis</p>
          </div>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="flex gap-2 mb-6">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(s.id)}
            className={`flex-1 glass-panel rounded-xl p-3 text-left transition-all border ${
              activeScenario === s.id ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-sm text-white font-medium">{s.name}</span>
            </div>
            <div className="text-lg font-bold text-white">{s.irr}% <span className="text-xs text-gray-500 font-normal">IRR</span></div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['overview', 'cashflow', 'sensitivity'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'cashflow' ? 'Cash Flow' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'IRR', value: `${scenario.irr}%`, icon: <Percent className="w-4 h-4" />, color: 'text-emerald-400', change: '+2.4%' },
              { label: 'ROI', value: `${scenario.roi}%`, icon: <Target className="w-4 h-4" />, color: 'text-blue-400', change: '+3.1%' },
              { label: 'NPV', value: `$${scenario.npv}M`, icon: <DollarSign className="w-4 h-4" />, color: 'text-purple-400', change: '+$1.2M' },
              { label: 'Payback', value: `${scenario.paybackPeriod} yrs`, icon: <Clock className="w-4 h-4" />, color: 'text-amber-400', change: '-0.4 yrs' },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{kpi.icon}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                    <ArrowUpRight className="w-3 h-3" />
                    {kpi.change}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-[10px] text-gray-500">{kpi.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-5">
              <h4 className="text-sm text-white font-medium mb-4">Revenue & Cost Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Total Revenue</span>
                    <span className="text-white font-medium">${scenario.totalRevenue}M</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Total Cost</span>
                    <span className="text-white font-medium">${scenario.totalCost}M</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(scenario.totalCost / scenario.totalRevenue) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Net Profit</span>
                    <span className="text-emerald-400 font-medium">${scenario.profit}M</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(scenario.profit / scenario.totalRevenue) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Profit Margin</span>
                    <span className="text-white font-bold">{((scenario.profit / scenario.totalRevenue) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-5">
              <h4 className="text-sm text-white font-medium mb-4">Cost Structure</h4>
              <div className="space-y-3">
                {[
                  { label: 'Land & Acquisition', value: 12.5, color: 'bg-amber-500' },
                  { label: 'Construction', value: 14.2, color: 'bg-blue-500' },
                  { label: 'Financing & Holding', value: 4.8, color: 'bg-purple-500' },
                  { label: 'Marketing & Sales', value: 2.4, color: 'bg-pink-500' },
                  { label: 'Professional Fees', value: 1.6, color: 'bg-cyan-500' },
                  { label: 'Contingency (5%)', value: 0.6, color: 'bg-gray-500' },
                ].map((cost, i) => (
                  <div key={cost.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{cost.label}</span>
                      <span className="text-gray-300">${cost.value}M</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${cost.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(cost.value / 14.2) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cashflow' && (
        <div className="glass-panel rounded-xl p-5">
          <h4 className="text-sm text-white font-medium mb-4">Quarterly Cash Flow Projection</h4>
          <div className="space-y-3">
            {CASHFLOW.map((q, i) => (
              <motion.div
                key={q.quarter}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300 w-20">{q.quarter}</span>
                  <div className="flex-1 mx-3">
                    <div className="flex gap-0.5 h-6">
                      <div
                        className="bg-emerald-500/60 rounded-l"
                        style={{ width: `${(q.inflow / 15) * 100}%` }}
                      />
                      <div
                        className="bg-red-500/40 rounded-r"
                        style={{ width: `${(q.outflow / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-medium w-16 text-right ${q.cumulative >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${q.cumulative}M
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-500/60 rounded" />
              <span className="text-gray-400">Inflow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500/40 rounded" />
              <span className="text-gray-400">Outflow</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-gray-400">Cumulative</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensitivity' && (
        <div className="glass-panel rounded-xl p-5">
          <h4 className="text-sm text-white font-medium mb-4">Sensitivity Analysis</h4>
          <div className="space-y-2">
            {SENSITIVITY.map((row, i) => (
              <motion.div
                key={row.variable}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-4 gap-3 p-3 rounded-lg ${
                  row.variable === 'Base Case' ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-gray-800/30'
                }`}
              >
                <span className="text-sm text-gray-300">{row.variable}</span>
                <div className="text-center">
                  <div className="text-sm text-white font-medium">{row.irr}%</div>
                  <div className="text-[10px] text-gray-500">IRR</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white font-medium">{row.roi}%</div>
                  <div className="text-[10px] text-gray-500">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white font-medium">${row.npv}M</div>
                  <div className="text-[10px] text-gray-500">NPV</div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Sensitivity shows how IRR, ROI, and NPV respond to changes in key variables.
            Base case highlighted in green.
          </p>
        </div>
      )}
    </div>
  );
}
