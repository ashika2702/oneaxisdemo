import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, TrendingDown, TrendingUp, MousePointer, Clock,
  DollarSign, Palette, Target, Users, ArrowRight, Eye,
  Zap, Filter
} from 'lucide-react';

interface AttentionSegment {
  name: string;
  visitors: number;
  avgDwell: number;
  dropOff: number;
  trend: number;
}

interface FinishPreference {
  finish: string;
  selections: number;
  revenue: number;
  popularity: number;
}

interface PriceSensitivity {
  range: string;
  enquiries: number;
  conversions: number;
  rate: number;
}

const ATTENTION_SEGMENTS: AttentionSegment[] = [
  { name: '3D Model Explorer', visitors: 1240, avgDwell: 245, dropOff: 12, trend: 8.5 },
  { name: 'Stack Plan Viewer', visitors: 890, avgDwell: 180, dropOff: 18, trend: -2.1 },
  { name: 'Unit Configurator', visitors: 567, avgDwell: 320, dropOff: 8, trend: 15.3 },
  { name: 'Pricing/What-If', visitors: 423, avgDwell: 150, dropOff: 35, trend: -5.2 },
  { name: 'Comparison Cart', visitors: 312, avgDwell: 210, dropOff: 22, trend: 4.8 },
  { name: 'Brochure Download', visitors: 678, avgDwell: 45, dropOff: 5, trend: 2.1 },
  { name: 'Viewing Booking', visitors: 189, avgDwell: 120, dropOff: 28, trend: 12.4 },
  { name: 'Reservation Start', visitors: 94, avgDwell: 380, dropOff: 42, trend: -8.7 },
];

const FINISH_PREFERENCES: FinishPreference[] = [
  { finish: 'Oak Timber Flooring', selections: 87, revenue: 156600, popularity: 94 },
  { finish: 'Marble Benchtop', selections: 72, revenue: 187200, popularity: 78 },
  { finish: 'Brass Fixtures', selections: 68, revenue: 95200, popularity: 73 },
  { finish: 'Smart Home Pack', selections: 91, revenue: 227500, popularity: 98 },
  { finish: 'Storage Upgrade', selections: 54, revenue: 81000, popularity: 58 },
  { finish: 'Air Conditioning L2', selections: 63, revenue: 94500, popularity: 68 },
  { finish: 'Curtain Wall Upgrade', selections: 41, revenue: 123000, popularity: 44 },
  { finish: 'Wine Storage', selections: 29, revenue: 58000, popularity: 31 },
];

const PRICE_SENSITIVITY: PriceSensitivity[] = [
  { range: '$800K-$1M', enquiries: 234, conversions: 45, rate: 19.2 },
  { range: '$1M-$1.2M', enquiries: 312, conversions: 52, rate: 16.7 },
  { range: '$1.2M-$1.5M', enquiries: 287, conversions: 38, rate: 13.2 },
  { range: '$1.5M-$2M', enquiries: 198, conversions: 28, rate: 14.1 },
  { range: '$2M-$2.5M', enquiries: 124, conversions: 22, rate: 17.7 },
  { range: '$2.5M+', enquiries: 67, conversions: 14, rate: 20.9 },
];

const FUNNEL = [
  { stage: 'Unique Visitors', count: 4520, color: 'bg-blue-500' },
  { stage: 'Engaged (>30s)', count: 2890, color: 'bg-indigo-500' },
  { stage: 'Configured Unit', count: 567, color: 'bg-purple-500' },
  { stage: 'Added to Cart', count: 312, color: 'bg-pink-500' },
  { stage: 'Booked Viewing', count: 189, color: 'bg-amber-500' },
  { stage: 'Reserved', count: 94, color: 'bg-emerald-500' },
];

export default function PulseDashboard() {
  const [activeTab, setActiveTab] = useState<'attention' | 'funnel' | 'finishes' | 'pricing'>('attention');

  const totalVisitors = ATTENTION_SEGMENTS.reduce((a, s) => a + s.visitors, 0);
  const avgDwell = Math.round(ATTENTION_SEGMENTS.reduce((a, s) => a + s.avgDwell * s.visitors, 0) / totalVisitors);
  const conversionRate = ((FUNNEL[FUNNEL.length - 1].count / FUNNEL[0].count) * 100).toFixed(1);
  const totalUpgradeRevenue = FINISH_PREFERENCES.reduce((a, f) => a + f.revenue, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pulse Dashboard</h2>
            <p className="text-gray-400 text-sm">Attention, drop-off, finish preference & price sensitivity</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Visitors (7d)</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalVisitors.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />+12.4% vs last week
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Avg. Dwell Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{Math.floor(avgDwell / 60)}m{avgDwell % 60}s</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />+8.2% vs last week
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Visitor → Reserve</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{conversionRate}%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />+2.1pp vs last week
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Upgrade Revenue</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">${(totalUpgradeRevenue / 1000).toFixed(0)}K</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />+18.5% vs last week
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {([
          { key: 'attention' as const, label: 'Attention Flow', icon: <Eye className="w-3.5 h-3.5" /> },
          { key: 'funnel' as const, label: 'Conversion Funnel', icon: <Filter className="w-3.5 h-3.5" /> },
          { key: 'finishes' as const, label: 'Finish Preferences', icon: <Palette className="w-3.5 h-3.5" /> },
          { key: 'pricing' as const, label: 'Price Sensitivity', icon: <DollarSign className="w-3.5 h-3.5" /> },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'attention' && (
        <div className="space-y-2">
          {ATTENTION_SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                    <MousePointer className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <span className="text-sm text-white font-medium">{seg.name}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{seg.visitors.toLocaleString()} visitors</span>
                      <span>{Math.floor(seg.avgDwell / 60)}m{seg.avgDwell % 60}s avg dwell</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-red-400">{seg.dropOff}%</span>
                    </div>
                    <div className="text-[10px] text-gray-500">drop-off</div>
                  </div>
                  <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-xs ${
                    seg.trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {seg.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {seg.trend > 0 ? '+' : ''}{seg.trend}%
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Traffic share</span>
                    <span className="text-gray-400">{((seg.visitors / totalVisitors) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(seg.visitors / totalVisitors) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="w-24">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Dwell</span>
                    <span className="text-gray-400">{seg.avgDwell}s</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(seg.avgDwell / 400) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'funnel' && (
        <div className="flex justify-center">
          <div className="w-full max-w-lg space-y-2">
            {FUNNEL.map((step, i) => {
              const prevCount = i > 0 ? FUNNEL[i - 1].count : step.count;
              const dropRate = i > 0 ? (((prevCount - step.count) / prevCount) * 100).toFixed(0) : '0';
              const widthPct = 100 - (i * 12);
              return (
                <motion.div
                  key={step.stage}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ width: `${widthPct}%`, marginLeft: 'auto', marginRight: 'auto' }}
                >
                  <div className={`${step.color} rounded-xl p-3 text-center`}>
                    <div className="text-white font-bold text-lg">{step.count.toLocaleString()}</div>
                    <div className="text-white/70 text-xs">{step.stage}</div>
                  </div>
                  {i < FUNNEL.length - 1 && (
                    <div className="flex items-center justify-center py-1">
                      <ArrowRight className="w-4 h-4 text-red-400 rotate-90" />
                      <span className="text-[10px] text-red-400 ml-1">-{dropRate}% drop</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'finishes' && (
        <div className="space-y-3">
          {FINISH_PREFERENCES.map((fp, i) => (
            <motion.div
              key={fp.finish}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white font-medium">{fp.finish}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-emerald-400 font-medium">${fp.revenue.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">{fp.selections} selections</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Popularity</span>
                    <span className="text-gray-400">{fp.popularity}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${fp.popularity}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
                <div className="w-24">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Revenue</span>
                    <span className="text-gray-400">${(fp.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(fp.revenue / 250000) * 100}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="glass-panel rounded-xl p-5">
          <h4 className="text-sm text-white font-medium mb-4">Conversion Rate by Price Range</h4>
          <div className="space-y-3">
            {PRICE_SENSITIVITY.map((ps, i) => (
              <motion.div
                key={ps.range}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{ps.range}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{ps.enquiries} enquiries</span>
                    <span className="text-xs text-emerald-400">{ps.conversions} conv.</span>
                    <span className="text-xs text-white font-medium">{ps.rate}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(ps.rate / 25) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Insight: Premium units ($2.5M+) convert at 20.9% — highest rate. Consider pushing more buyers upmarket.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
