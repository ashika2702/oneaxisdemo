import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, Car, Factory, Wind, Droplets, Flame, TreePine,
  Recycle, TrendingDown, CheckCircle,
  Zap, Cloud
} from 'lucide-react';

interface EmissionSource {
  id: string;
  source: string;
  category: 'traffic' | 'building' | 'waste' | 'energy';
  co2Hourly: number;
  co2Daily: number;
  co2Annual: number;
  trend: number;
  status: 'good' | 'warning' | 'critical';
}

const EMISSION_SOURCES: EmissionSource[] = [
  { id: 'e1', source: 'Eastern Distributor Traffic', category: 'traffic', co2Hourly: 2233, co2Daily: 53.6, co2Annual: 19564, trend: -2.4, status: 'warning' },
  { id: 'e2', source: 'Anzac Parade Traffic', category: 'traffic', co2Hourly: 1450, co2Daily: 34.8, co2Annual: 12702, trend: -1.8, status: 'good' },
  { id: 'e3', source: 'Southern Cross Dr', category: 'traffic', co2Hourly: 3800, co2Daily: 91.2, co2Annual: 33288, trend: 5.2, status: 'critical' },
  { id: 'e4', source: 'Building HVAC Systems', category: 'building', co2Hourly: 890, co2Daily: 21.4, co2Annual: 7810, trend: -8.5, status: 'good' },
  { id: 'e5', source: 'Construction Waste', category: 'waste', co2Hourly: 340, co2Daily: 8.2, co2Annual: 2993, trend: -12.1, status: 'good' },
  { id: 'e6', source: 'Grid Electricity', category: 'energy', co2Hourly: 1250, co2Daily: 30.0, co2Annual: 10950, trend: -15.3, status: 'warning' },
  { id: 'e7', source: 'Foreshore Parkway', category: 'traffic', co2Hourly: 1680, co2Daily: 40.3, co2Annual: 14709, trend: -3.1, status: 'good' },
  { id: 'e8', source: 'Solid Waste Transport', category: 'waste', co2Hourly: 210, co2Daily: 5.0, co2Annual: 1825, trend: -5.7, status: 'good' },
];

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  traffic: { icon: <Car className="w-4 h-4" />, color: 'bg-red-500/20 text-red-400', label: 'Traffic' },
  building: { icon: <Factory className="w-4 h-4" />, color: 'bg-orange-500/20 text-orange-400', label: 'Building' },
  waste: { icon: <Recycle className="w-4 h-4" />, color: 'bg-amber-500/20 text-amber-400', label: 'Waste' },
  energy: { icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-500/20 text-yellow-400', label: 'Energy' },
};

const STATUS_COLORS: Record<string, string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
};

const HOURLY_BREAKDOWN = [
  { hour: '06:00', traffic: 1200, building: 890, energy: 1250, waste: 180 },
  { hour: '08:00', traffic: 3200, building: 890, energy: 1450, waste: 210 },
  { hour: '10:00', traffic: 2800, building: 890, energy: 1350, waste: 200 },
  { hour: '12:00', traffic: 2400, building: 890, energy: 1300, waste: 190 },
  { hour: '14:00', traffic: 2600, building: 890, energy: 1320, waste: 195 },
  { hour: '16:00', traffic: 3800, building: 890, energy: 1400, waste: 220 },
  { hour: '18:00', traffic: 4200, building: 890, energy: 1380, waste: 230 },
  { hour: '20:00', traffic: 2100, building: 890, energy: 1200, waste: 170 },
  { hour: '22:00', traffic: 800, building: 890, energy: 1100, waste: 150 },
];

export default function EnvironmentalImpact() {
  const [activeTab, setActiveTab] = useState<'overview' | 'hourly' | 'mitigation'>('overview');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const totalHourly = EMISSION_SOURCES.reduce((a, s) => a + s.co2Hourly, 0);
  const totalDaily = EMISSION_SOURCES.reduce((a, s) => a + s.co2Daily, 0);
  const totalAnnual = EMISSION_SOURCES.reduce((a, s) => a + s.co2Annual, 0);
  const avgTrend = (EMISSION_SOURCES.reduce((a, s) => a + s.trend, 0) / EMISSION_SOURCES.length).toFixed(1);

  const trafficTotal = EMISSION_SOURCES.filter(s => s.category === 'traffic').reduce((a, s) => a + s.co2Hourly, 0);
  const buildingTotal = EMISSION_SOURCES.filter(s => s.category === 'building').reduce((a, s) => a + s.co2Hourly, 0);
  const wasteTotal = EMISSION_SOURCES.filter(s => s.category === 'waste').reduce((a, s) => a + s.co2Hourly, 0);
  const energyTotal = EMISSION_SOURCES.filter(s => s.category === 'energy').reduce((a, s) => a + s.co2Hourly, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Environmental Impact</h2>
            <p className="text-gray-400 text-sm">Real-time carbon emissions, fuel & waste tracking</p>
          </div>
        </div>
      </div>

      {/* Top KPIs — matching Fable 5 style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4 border-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">CO₂ / Hour</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalHourly.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">kg CO₂ equivalent</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-xl p-4 border-amber-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Fuel / Hour</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{(totalHourly * 0.435).toFixed(0)}</div>
          <div className="text-[10px] text-gray-500">litres consumed</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4 border-emerald-500/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Trend (YoY)</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{avgTrend}%</div>
          <div className="text-[10px] text-gray-500">reduction vs. baseline</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-xl p-4 border-blue-500/10">
          <div className="flex items-center gap-2 mb-2">
            <TreePine className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Offset Required</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{Math.ceil(totalAnnual / 21)}</div>
          <div className="text-[10px] text-gray-500">trees to offset annual</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['overview', 'hourly', 'mitigation'] as const).map(tab => (
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
        <div className="space-y-4">
          {/* Emission sources breakdown */}
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-4">Emission Sources</h4>
            <div className="space-y-3">
              {EMISSION_SOURCES.map((src, i) => (
                <motion.div
                  key={src.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSource(selectedSource === src.id ? null : src.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[src.status]}`} />
                      <span className="text-sm text-gray-300">{src.source}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${CATEGORY_CONFIG[src.category]?.color}`}>
                        {CATEGORY_CONFIG[src.category]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white font-medium">{src.co2Hourly} kg/h</span>
                      <span className={`text-xs ${src.trend < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {src.trend > 0 ? '+' : ''}{src.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden ml-4">
                    <motion.div
                      className={`h-full rounded-full ${STATUS_COLORS[src.status]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(src.co2Hourly / 4500) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>

                  {selectedSource === src.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 ml-4 grid grid-cols-3 gap-2"
                    >
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-xs text-white font-medium">{src.co2Hourly}</div>
                        <div className="text-[9px] text-gray-500">kg/hr</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-xs text-white font-medium">{src.co2Daily}t</div>
                        <div className="text-[9px] text-gray-500">/day</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-xs text-white font-medium">{src.co2Annual}t</div>
                        <div className="text-[9px] text-gray-500">/year</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Category pie */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-5">
              <h4 className="text-sm text-white font-medium mb-3">By Category</h4>
              <div className="space-y-2">
                {[
                  { label: 'Traffic', value: trafficTotal, color: 'bg-red-500', pct: ((trafficTotal / totalHourly) * 100).toFixed(0) },
                  { label: 'Energy', value: energyTotal, color: 'bg-yellow-500', pct: ((energyTotal / totalHourly) * 100).toFixed(0) },
                  { label: 'Building', value: buildingTotal, color: 'bg-orange-500', pct: ((buildingTotal / totalHourly) * 100).toFixed(0) },
                  { label: 'Waste', value: wasteTotal, color: 'bg-amber-500', pct: ((wasteTotal / totalHourly) * 100).toFixed(0) },
                ].map(cat => (
                  <div key={cat.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{cat.label}</span>
                      <span className="text-gray-300">{cat.value} kg/h ({cat.pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${cat.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-5">
              <h4 className="text-sm text-white font-medium mb-3">Daily Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Total CO₂</span>
                  </div>
                  <span className="text-sm text-white font-medium">{totalDaily}t / day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-300">Fuel Equivalent</span>
                  </div>
                  <span className="text-sm text-white font-medium">{(totalDaily * 435).toFixed(0)}L / day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Vehicle Trips</span>
                  </div>
                  <span className="text-sm text-white font-medium">~{(totalDaily * 100).toFixed(0)} / day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">Water Usage</span>
                  </div>
                  <span className="text-sm text-white font-medium">{(totalDaily * 18.5).toFixed(0)}kL / day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hourly' && (
        <div className="glass-panel rounded-xl p-5">
          <h4 className="text-sm text-white font-medium mb-4">Hourly Emissions Profile</h4>
          <div className="space-y-4">
            {HOURLY_BREAKDOWN.map((h, i) => {
              const total = h.traffic + h.building + h.energy + h.waste;
              return (
                <motion.div
                  key={h.hour}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-12">{h.hour}</span>
                    <div className="flex-1 h-6 bg-gray-700/50 rounded-full overflow-hidden flex">
                      <motion.div
                        className="h-full bg-red-500/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${(h.traffic / 7000) * 100}%` }}
                        transition={{ duration: 0.4, delay: i * 0.02 }}
                      />
                      <motion.div
                        className="h-full bg-orange-500/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${(h.building / 7000) * 100}%` }}
                        transition={{ duration: 0.4, delay: i * 0.02 + 0.05 }}
                      />
                      <motion.div
                        className="h-full bg-yellow-500/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${(h.energy / 7000) * 100}%` }}
                        transition={{ duration: 0.4, delay: i * 0.02 + 0.1 }}
                      />
                      <motion.div
                        className="h-full bg-amber-500/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${(h.waste / 7000) * 100}%` }}
                        transition={{ duration: 0.4, delay: i * 0.02 + 0.15 }}
                      />
                    </div>
                    <span className="text-xs text-white w-16 text-right">{total} kg</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500/70 rounded" /><span className="text-gray-400">Traffic</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-500/70 rounded" /><span className="text-gray-400">Building</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-500/70 rounded" /><span className="text-gray-400">Energy</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500/70 rounded" /><span className="text-gray-400">Waste</span></div>
          </div>
        </div>
      )}

      {activeTab === 'mitigation' && (
        <div className="space-y-3">
          {[
            { icon: <TreePine className="w-5 h-5" />, title: 'Urban Tree Canopy', impact: '-12% CO₂', status: 'implemented', detail: '2,400 trees planted across development. Projected 45t CO₂ absorption annually.' },
            { icon: <Zap className="w-5 h-5" />, title: 'Solar PV Retrofit', impact: '-18% grid energy', status: 'in-progress', detail: '145-panel rooftop array generating 42.5kWh/day. Reducing grid dependency.' },
            { icon: <Car className="w-5 h-5" />, title: 'EV Charging Network', impact: '-8% traffic emissions', status: 'planned', detail: '48 EV charging bays across basement levels. Target 30% EV uptake by 2028.' },
            { icon: <Wind className="w-5 h-5" />, title: 'Building Ventilation Optimization', impact: '-15% HVAC load', status: 'implemented', detail: 'Natural ventilation strategies reducing mechanical cooling by 1,200hrs/year.' },
            { icon: <Recycle className="w-5 h-5" />, title: 'Construction Waste Diversion', impact: '-85% landfill', status: 'implemented', detail: '35% recycled materials. 85% construction waste diverted from landfill.' },
            { icon: <Droplets className="w-5 h-5" />, title: 'Rainwater Harvesting', impact: '-45% potable water', status: 'implemented', detail: '50,000L storage capacity. 850L/day average harvest for irrigation and toilets.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      item.status === 'implemented' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">{item.impact}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Target summary */}
          <div className="glass-panel rounded-xl p-4 border-emerald-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">Net Zero Target</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">2040</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '35%' }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>2026: 35% reduction achieved</span>
              <span>Target: 100% by 2040</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
