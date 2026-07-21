import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Zap, TrendingUp, ArrowRight, CheckCircle,
  DollarSign, Leaf, Compass, Home
} from 'lucide-react';

interface PanelZone {
  id: string;
  name: string;
  area: number;
  orientation: string;
  tilt: number;
  shading: string;
  annualKwh: number;
  peakHours: number;
  efficiency: number;
  recommended: boolean;
  paybackYears: number;
}

const ZONES: PanelZone[] = [
  { id: 'z1', name: 'Rooftop — North Face', area: 285, orientation: 'N', tilt: 22, shading: 'None', annualKwh: 42500, peakHours: 5.2, efficiency: 94, recommended: true, paybackYears: 3.8 },
  { id: 'z2', name: 'Rooftop — East Face', area: 120, orientation: 'E', tilt: 22, shading: 'Partial AM', annualKwh: 14200, peakHours: 3.8, efficiency: 78, recommended: true, paybackYears: 4.5 },
  { id: 'z3', name: 'Rooftop — West Face', area: 120, orientation: 'W', tilt: 22, shading: 'Partial PM', annualKwh: 15800, peakHours: 4.1, efficiency: 82, recommended: true, paybackYears: 4.2 },
  { id: 'z4', name: 'Pavilion Canopy', area: 180, orientation: 'N', tilt: 5, shading: 'None', annualKwh: 24600, peakHours: 4.8, efficiency: 88, recommended: true, paybackYears: 3.5 },
  { id: 'z5', name: 'Car Park Solar', area: 420, orientation: 'N', tilt: 10, shading: 'None', annualKwh: 58200, peakHours: 5.0, efficiency: 91, recommended: true, paybackYears: 3.2 },
  { id: 'z6', name: 'South Facade (BIPV)', area: 95, orientation: 'S', tilt: 90, shading: 'High', annualKwh: 4800, peakHours: 2.1, efficiency: 45, recommended: false, paybackYears: 8.5 },
];

const MONTHLY_SOLAR = [
  { month: 'Jan', kwh: 5200 },
  { month: 'Feb', kwh: 4800 },
  { month: 'Mar', kwh: 4200 },
  { month: 'Apr', kwh: 3600 },
  { month: 'May', kwh: 3100 },
  { month: 'Jun', kwh: 2600 },
  { month: 'Jul', kwh: 2800 },
  { month: 'Aug', kwh: 3400 },
  { month: 'Sep', kwh: 4100 },
  { month: 'Oct', kwh: 4800 },
  { month: 'Nov', kwh: 5400 },
  { month: 'Dec', kwh: 5600 },
];

export default function SolarOptimizer() {
  const [selectedZones, setSelectedZones] = useState<string[]>(ZONES.filter(z => z.recommended).map(z => z.id));

  const toggleZone = (id: string) => {
    setSelectedZones(prev => prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]);
  };

  const selectedData = ZONES.filter(z => selectedZones.includes(z.id));
  const totalArea = selectedData.reduce((a, z) => a + z.area, 0);
  const totalKwh = selectedData.reduce((a, z) => a + z.annualKwh, 0);
  const totalPanels = Math.floor(totalArea / 2.2); // ~2.2 m² per panel
  const systemCost = totalPanels * 450; // $450/panel installed
  const annualSavings = totalKwh * 0.28; // $0.28/kWh
  const weightedPayback = selectedData.length > 0
    ? (selectedData.reduce((a, z) => a + z.paybackYears * z.annualKwh, 0) / totalKwh).toFixed(1)
    : '0';
  const co2Offset = totalKwh * 0.85 / 1000; // 0.85 kg CO₂ per kWh

  const maxSolar = Math.max(...MONTHLY_SOLAR.map(d => d.kwh));

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Solar Optimizer</h2>
            <p className="text-gray-400 text-sm">Panel placement, efficiency scoring & ROI analysis</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Annual Output</span>
          </div>
          <div className="text-xl font-bold text-white">{(totalKwh / 1000).toFixed(1)}M</div>
          <div className="text-[10px] text-gray-500">kWh / year</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Panels</span>
          </div>
          <div className="text-xl font-bold text-white">{totalPanels.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">{totalArea} m² total</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">System Cost</span>
          </div>
          <div className="text-xl font-bold text-emerald-400">${(systemCost / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-gray-500">installed</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Payback</span>
          </div>
          <div className="text-xl font-bold text-purple-400">{weightedPayback} yrs</div>
          <div className="text-[10px] text-gray-500">weighted average</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">CO₂ Offset</span>
          </div>
          <div className="text-xl font-bold text-green-400">{co2Offset.toFixed(1)}t</div>
          <div className="text-[10px] text-gray-500">per year</div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Zone selector */}
        <div className="space-y-2">
          <h4 className="text-sm text-white font-medium mb-2">Select Zones</h4>
          {ZONES.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => toggleZone(zone.id)}
              className={`glass-panel rounded-xl p-3 cursor-pointer transition-all border ${
                selectedZones.includes(zone.id)
                  ? 'border-yellow-500/30 bg-yellow-500/5'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    selectedZones.includes(zone.id) ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                  }`}>
                    {selectedZones.includes(zone.id) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-white">{zone.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{zone.area}m²</span>
                  <span className={`text-xs ${zone.efficiency >= 85 ? 'text-emerald-400' : zone.efficiency >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {zone.efficiency}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1.5 ml-6">
                <span className="text-[10px] text-gray-500">{zone.orientation}-facing • {zone.tilt}° tilt</span>
                <span className="text-[10px] text-gray-500">{zone.shading}</span>
                <span className="text-[10px] text-yellow-400">{(zone.annualKwh / 1000).toFixed(1)}M kWh/yr</span>
              </div>
              {selectedZones.includes(zone.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-6 mt-2 flex gap-2"
                >
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden flex-1">
                    <motion.div
                      className="h-full bg-yellow-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.efficiency}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Analysis */}
        <div className="space-y-4">
          {/* Monthly generation */}
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-3">Monthly Generation</h4>
            <div className="flex items-end gap-1 h-32">
              {MONTHLY_SOLAR.map((m, i) => {
                const selectedFactor = totalKwh / 158300; // ratio of selected vs total
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                    <motion.div
                      className="w-full bg-yellow-500/50 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.kwh * selectedFactor / maxSolar) * 100}%` }}
                      transition={{ delay: i * 0.02, duration: 0.4 }}
                    />
                    <span className="text-[8px] text-gray-500">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROI summary */}
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-3">Financial Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">System Cost (installed)</span>
                <span className="text-white">${systemCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Annual Generation</span>
                <span className="text-white">{(totalKwh / 1000).toFixed(1)}M kWh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Annual Savings</span>
                <span className="text-emerald-400">${annualSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Government Rebate (STCs)</span>
                <span className="text-emerald-400">-${(systemCost * 0.25).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-sm">
                <span className="text-gray-300 font-medium">Net Payback</span>
                <span className="text-purple-400 font-bold">{weightedPayback} years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 font-medium">25-Year Savings</span>
                <span className="text-emerald-400 font-bold">${(annualSavings * 25 - systemCost * 0.75).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-panel rounded-xl p-4 border-yellow-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">Optimization Tips</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <ArrowRight className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                Car park solar produces the highest yield per m² — prioritize this zone
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <ArrowRight className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                South facade BIPV has low efficiency — consider only for Green Star points
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <ArrowRight className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                Add battery storage (100kWh) to increase self-consumption from 35% to 72%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
