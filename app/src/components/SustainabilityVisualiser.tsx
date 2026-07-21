import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, Sun, Droplets, Zap, TrendingDown,
  Award, BarChart3, Home, TreePine, Recycle, Gauge
} from 'lucide-react';

interface EnergyMetric {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  saving: number;
}

interface CertItem {
  name: string;
  level: string;
  score: number;
  maxScore: number;
  status: 'achieved' | 'pending' | 'target';
}

const ENERGY_METRICS: EnergyMetric[] = [
  { label: 'Solar Generation', value: 42.5, unit: 'kWh/day', icon: <Sun className="w-5 h-5" />, color: 'text-amber-400', saving: 68 },
  { label: 'Rainwater Harvest', value: 850, unit: 'L/day', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-400', saving: 45 },
  { label: 'Energy Rating', value: 8.2, unit: 'NatHERS Stars', icon: <Zap className="w-5 h-5" />, color: 'text-yellow-400', saving: 32 },
  { label: 'Carbon Offset', value: 12.4, unit: 'tCO2e/yr', icon: <Leaf className="w-5 h-5" />, color: 'text-emerald-400', saving: 85 },
];

const CERTIFICATIONS: CertItem[] = [
  { name: 'Green Star', level: '5 Star', score: 62, maxScore: 75, status: 'target' },
  { name: 'NABERS Energy', level: '4.5 Star', score: 4.5, maxScore: 6, status: 'target' },
  { name: 'NatHERS', level: '8.2 Star', score: 8.2, maxScore: 10, status: 'achieved' },
  { name: 'WELL Building', level: 'Silver', score: 45, maxScore: 100, status: 'pending' },
  { name: 'Passive House', level: 'Classic', score: 12, maxScore: 30, status: 'pending' },
];

const MONTHLY_DATA = [
  { month: 'Jan', solar: 520, usage: 680, water: 24000 },
  { month: 'Feb', solar: 480, usage: 620, water: 22000 },
  { month: 'Mar', solar: 420, usage: 580, water: 20000 },
  { month: 'Apr', solar: 380, usage: 540, water: 18000 },
  { month: 'May', solar: 310, usage: 620, water: 16000 },
  { month: 'Jun', solar: 260, usage: 740, water: 14000 },
  { month: 'Jul', solar: 280, usage: 780, water: 13000 },
  { month: 'Aug', solar: 340, usage: 720, water: 14000 },
  { month: 'Sep', solar: 410, usage: 600, water: 16000 },
  { month: 'Oct', solar: 480, usage: 560, water: 19000 },
  { month: 'Nov', solar: 540, usage: 580, water: 21000 },
  { month: 'Dec', solar: 560, usage: 640, water: 23000 },
];

export default function SustainabilityVisualiser() {
  const [activeTab, setActiveTab] = useState<'overview' | 'energy' | 'water' | 'certifications'>('overview');

  const maxSolar = Math.max(...MONTHLY_DATA.map(d => d.solar));
  const maxUsage = Math.max(...MONTHLY_DATA.map(d => d.usage));

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sustainability Visualiser</h2>
            <p className="text-gray-400 text-sm">Energy, water & environmental performance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['overview', 'energy', 'water', 'certifications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ENERGY_METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl p-4"
              >
                <div className={`${m.color} mb-2`}>{m.icon}</div>
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-gray-500">{m.unit}</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">{m.saving}% reduction</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Annual comparison */}
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-4">Annual Solar Generation vs. Usage</h4>
            <div className="flex items-end gap-2 h-40">
              {MONTHLY_DATA.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: 120 }}>
                    <motion.div
                      className="flex-1 bg-amber-500/60 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.solar / maxSolar) * 100}%` }}
                      transition={{ delay: i * 0.03, duration: 0.5 }}
                    />
                    <motion.div
                      className="flex-1 bg-gray-600/40 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.usage / maxUsage) * 100}%` }}
                      transition={{ delay: i * 0.03, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-500">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500/60 rounded" />
                <span className="text-gray-400">Solar Generated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-600/40 rounded" />
                <span className="text-gray-400">Energy Used</span>
              </div>
            </div>
          </div>

          {/* Green features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <Sun className="w-5 h-5" />, label: 'Solar Panels', value: '145 units', detail: '42.5kWh/day' },
              { icon: <Droplets className="w-5 h-5" />, label: 'Rainwater Tanks', value: '50,000L', detail: '850L/day harvest' },
              { icon: <TreePine className="w-5 h-5" />, label: 'Green Roof', value: '280 m²', detail: 'R-6.5 insulation' },
              { icon: <Recycle className="w-5 h-5" />, label: 'Recycled Materials', value: '35%', detail: 'Of total build' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-panel rounded-xl p-4 border border-emerald-500/10"
              >
                <div className="text-emerald-400 mb-2">{f.icon}</div>
                <div className="text-white font-medium text-sm">{f.label}</div>
                <div className="text-lg font-bold text-white">{f.value}</div>
                <div className="text-[10px] text-gray-500">{f.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'energy' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-4">Energy Breakdown by Source</h4>
            <div className="space-y-3">
              {[
                { label: 'Solar PV (Rooftop)', value: 42.5, total: 65, color: 'bg-amber-500', icon: <Sun className="w-4 h-4" /> },
                { label: 'Green Grid Power', value: 15.2, total: 65, color: 'bg-green-500', icon: <Zap className="w-4 h-4" /> },
                { label: 'Battery Storage', value: 5.8, total: 65, color: 'bg-blue-500', icon: <Gauge className="w-4 h-4" /> },
                { label: 'Grid Import (Peak)', value: 1.5, total: 65, color: 'bg-gray-500', icon: <Home className="w-4 h-4" /> },
              ].map((source, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{source.icon}</span>
                      <span className="text-sm text-gray-300">{source.label}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{source.value} kWh/day</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${source.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(source.value / source.total) * 100}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Annual Energy Cost</div>
              <div className="text-2xl font-bold text-white">$8,420</div>
              <div className="text-xs text-emerald-400 mt-1">vs $24,600 conventional</div>
            </div>
            <div className="glass-panel rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Payback Period</div>
              <div className="text-2xl font-bold text-white">4.2 years</div>
              <div className="text-xs text-emerald-400 mt-1">For solar+battery system</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'water' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-4">Water Usage by Category</h4>
            <div className="space-y-3">
              {[
                { label: 'Rainwater (Irrigation)', value: 35, color: 'bg-blue-400' },
                { label: 'Rainwater (Toilets)', value: 25, color: 'bg-cyan-400' },
                { label: 'Mains (Potable)', value: 30, color: 'bg-sky-400' },
                { label: 'Recycled Greywater', value: 10, color: 'bg-teal-400' },
              ].map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-gray-400 text-right">{cat.label}</div>
                  <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${cat.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.value}%` }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                  <div className="w-10 text-xs text-white">{cat.value}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">85%</div>
              <div className="text-[10px] text-gray-500">Irrigation from rain</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              <Recycle className="w-6 h-6 text-teal-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">60%</div>
              <div className="text-[10px] text-gray-500">Non-potable usage</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              <TrendingDown className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">-45%</div>
              <div className="text-[10px] text-gray-500">vs. typical building</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      cert.status === 'achieved' ? 'bg-emerald-500/20 text-emerald-400' :
                      cert.status === 'target' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{cert.name}</h4>
                      <span className={`text-xs ${
                        cert.status === 'achieved' ? 'text-emerald-400' :
                        cert.status === 'target' ? 'text-amber-400' :
                        'text-gray-500'
                      }`}>
                        {cert.level} — {cert.status === 'achieved' ? 'Achieved' : cert.status === 'target' ? 'Target' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{cert.score}</div>
                    <div className="text-xs text-gray-500">/ {cert.maxScore}</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      cert.status === 'achieved' ? 'bg-emerald-500' :
                      cert.status === 'target' ? 'bg-amber-500' :
                      'bg-gray-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cert.score / cert.maxScore) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-panel rounded-xl p-5 border-emerald-500/10">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-medium">Combined Sustainability Score</span>
            </div>
            <div className="flex items-end gap-3">
              <div className="text-4xl font-bold text-emerald-400">78</div>
              <div className="text-sm text-gray-400 mb-1">/ 100</div>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Rated "Excellent" — Top 15% of residential developments in sustainability performance
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
