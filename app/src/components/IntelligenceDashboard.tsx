import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingDown, DollarSign, BarChart3, AlertTriangle, Users, Eye, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DRIFT_BUYERS = [
  { name: 'Sarah Chen', score: 87, trend: 'up', sessions: 12, time: 145, risk: 'low' },
  { name: 'James Wilson', score: 64, trend: 'stable', sessions: 7, time: 68, risk: 'medium' },
  { name: 'Raj Patel', score: 41, trend: 'down', sessions: 15, time: 210, risk: 'high' },
  { name: 'Lisa Wong', score: 72, trend: 'up', sessions: 9, time: 95, risk: 'low' },
  { name: 'Ahmed Hassan', score: 38, trend: 'down', sessions: 4, time: 22, risk: 'high' },
  { name: 'Maria Garcia', score: 55, trend: 'stable', sessions: 6, time: 55, risk: 'medium' },
];

const STALL_PREDICTIONS = [
  { unit: '805', floor: 8, daysOnMarket: 45, watchers: 3, prediction: 'likely', price: 1650000 },
  { unit: '906', floor: 9, daysOnMarket: 38, watchers: 2, prediction: 'at-risk', price: 1820000 },
  { unit: '1205', floor: 12, daysOnMarket: 12, watchers: 8, prediction: 'fast', price: 2780000 },
  { unit: '1501', floor: 15, daysOnMarket: 21, watchers: 6, prediction: 'normal', price: 5200000 },
];

const PRICE_RECS = [
  { unit: '1204', currentPrice: 2850000, watchers: 12, recommendation: 'hold', reason: 'High interest — 12 watchers in 7 days' },
  { unit: '805', currentPrice: 1650000, watchers: 3, recommendation: 'reduce', reason: 'Stalling at 45 days — consider -5%' },
  { unit: '1501', currentPrice: 5200000, watchers: 8, recommendation: 'increase', reason: 'Premium demand — model supports +3%' },
];

export default function IntelligenceDashboard() {
  const [tab, setTab] = useState<'drift' | 'revenue' | 'sellthrough' | 'pricing'>('drift');

  const totalRevenue = STALL_PREDICTIONS.reduce((s, u) => s + u.price, 0);
  const atRiskRevenue = STALL_PREDICTIONS.filter((u) => u.prediction === 'at-risk').reduce((s, u) => s + u.price, 0);
  const avgDrift = Math.round(DRIFT_BUYERS.reduce((s, b) => s + b.score, 0) / DRIFT_BUYERS.length);

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" />Intelligence Dashboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">Drift scores, revenue at risk, predictive sell-through, demand-based pricing</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 px-6 py-4">
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1"><Activity className="w-4 h-4 text-purple-400" /><span className="text-xs text-gray-500">Avg Drift Score</span></div>
          <div className="text-2xl font-bold text-white">{avgDrift}</div>
          <div className={`text-xs flex items-center gap-1 ${avgDrift >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {avgDrift >= 60 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{avgDrift >= 60 ? 'Healthy' : 'Attention needed'}
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-emerald-400" /><span className="text-xs text-gray-500">Total Pipeline</span></div>
          <div className="text-2xl font-bold text-white">${(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-500">{STALL_PREDICTIONS.length} units tracked</div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-500">Revenue at Risk</span></div>
          <div className="text-2xl font-bold text-red-400">${(atRiskRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-red-400/70">{STALL_PREDICTIONS.filter((u) => u.prediction === 'at-risk').length} units stalling</div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-400" /><span className="text-xs text-gray-500">Active Buyers</span></div>
          <div className="text-2xl font-bold text-white">{DRIFT_BUYERS.length}</div>
          <div className="text-xs text-gray-500">{DRIFT_BUYERS.filter((b) => b.risk === 'high').length} need attention</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 mb-4">
        {[
          { k: 'drift', label: 'Drift Scores', icon: TrendingDown },
          { k: 'revenue', label: 'Revenue at Risk', icon: DollarSign },
          { k: 'sellthrough', label: 'Sell-Through', icon: BarChart3 },
          { k: 'pricing', label: 'Pricing Recs', icon: Eye },
        ].map((t) => {
          const I = t.icon;
          return (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.k ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              <I className="w-3.5 h-3.5" />{t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* DRIFT TAB */}
        {tab === 'drift' && (
          <div className="space-y-2">
            {DRIFT_BUYERS.sort((a, b) => b.score - a.score).map((b, i) => (
              <motion.div key={b.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-gray-900/30 rounded-xl border border-gray-800 p-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${b.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' : b.score >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                  {b.score}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{b.name}</div>
                  <div className="text-gray-500 text-xs">{b.sessions} sessions | {b.time}m on site</div>
                </div>
                <div className="flex items-center gap-1">
                  {b.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : b.trend === 'down' ? <ArrowDownRight className="w-4 h-4 text-red-400" /> : <div className="w-4 h-4 rounded-full bg-amber-400/30" />}
                </div>
                <Badge className={`${b.risk === 'low' ? 'bg-emerald-500/10 text-emerald-400' : b.risk === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'} border-0 text-xs`}>
                  {b.risk}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {/* REVENUE AT RISK */}
        {tab === 'revenue' && (
          <div className="space-y-4">
            <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-5">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-semibold">Settlement Risk Warning</span></div>
              <p className="text-sm text-gray-300 leading-relaxed">2 exchanged buyers showing engagement decay. Predicted 15% default probability if no intervention by week 6 post-exchange. Recommend: schedule face-to-face reassurance meeting.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STALL_PREDICTIONS.map((u) => (
                <div key={u.unit} className={`rounded-xl border p-4 ${u.prediction === 'at-risk' ? 'bg-red-500/5 border-red-500/20' : u.prediction === 'likely' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-gray-900/30 border-gray-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold">Unit {u.unit}</span>
                    <Badge className={`${u.prediction === 'fast' ? 'bg-emerald-500/10 text-emerald-400' : u.prediction === 'normal' ? 'bg-blue-500/10 text-blue-400' : u.prediction === 'likely' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'} border-0 text-xs`}>
                      {u.prediction}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">{u.daysOnMarket} days | {u.watchers} watchers</div>
                  <div className="text-emerald-400 font-bold mt-1">${(u.price / 1000000).toFixed(2)}M</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SELL-THROUGH */}
        {tab === 'sellthrough' && (
          <div className="space-y-4">
            <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-5">
              <div className="text-sm font-medium text-white mb-4">Absorption Forecast (12 months)</div>
              <div className="flex items-end gap-2 h-32">
                {[15, 22, 35, 48, 55, 62, 68, 75, 82, 88, 92, 95].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] text-gray-500">{v}%</div>
                    <motion.div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                      initial={{ height: 0 }} animate={{ height: `${v * 1.2}px` }} transition={{ delay: i * 0.05 }} />
                    <div className="text-[9px] text-gray-600">M{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4 text-center"><div className="text-2xl font-bold text-emerald-400">18</div><div className="text-xs text-gray-500">Expected sales (next 90 days)</div></div>
              <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4 text-center"><div className="text-2xl font-bold text-amber-400">4.2</div><div className="text-xs text-gray-500">Avg days to sell (available)</div></div>
              <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4 text-center"><div className="text-2xl font-bold text-blue-400">$42M</div><div className="text-xs text-gray-500">Projected revenue (12mo)</div></div>
            </div>
          </div>
        )}

        {/* PRICING RECOMMENDATIONS */}
        {tab === 'pricing' && (
          <div className="space-y-3">
            {PRICE_RECS.map((rec) => (
              <div key={rec.unit} className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">Unit {rec.unit}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">${(rec.currentPrice / 1000000).toFixed(2)}M</span>
                    <Badge className={`${rec.recommendation === 'hold' ? 'bg-blue-500/10 text-blue-400' : rec.recommendation === 'increase' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-0 text-xs uppercase`}>
                      {rec.recommendation}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{rec.reason}</p>
                {rec.recommendation === 'increase' && <div className="text-emerald-400 text-xs font-medium mt-1">+3% = +${(rec.currentPrice * 0.03 / 1000).toFixed(0)}k revenue</div>}
                {rec.recommendation === 'reduce' && <div className="text-red-400 text-xs font-medium mt-1">-5% = ${(rec.currentPrice * 0.95 / 1000000).toFixed(2)}M new price</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
