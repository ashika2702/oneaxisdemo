import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, DollarSign, TrendingDown, Shield,
  Clock, Phone, Mail, ChevronRight, Flame, Activity,
  BarChart3, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RiskBuyer {
  id: string;
  name: string;
  unit: string;
  value: number;
  riskScore: number;
  riskType: 'drift' | 'settlement' | 'finance' | 'engagement';
  daysSinceContact: number;
  lastActivity: string;
  recommendedAction: string;
}

const RISK_BUYERS: RiskBuyer[] = [
  { id: 'b1', name: 'Chen Family', unit: '2401 / 3-Bed', value: 2850000, riskScore: 92, riskType: 'drift', daysSinceContact: 18, lastActivity: 'Viewed model 3x, no return in 14d', recommendedAction: 'Call today — offer private viewing' },
  { id: 'b2', name: 'Mr. Patel', unit: '1502 / 2-Bed', value: 1650000, riskScore: 87, riskType: 'finance', daysSinceContact: 12, lastActivity: 'Pre-qual flagged: serviceability tight', recommendedAction: 'Introduce broker, discuss deposit structure' },
  { id: 'b3', name: 'Sydney Investments', unit: 'Penthouse B', value: 4200000, riskScore: 78, riskType: 'settlement', daysSinceContact: 5, lastActivity: 'Portal login declining, 45 days to settlement', recommendedAction: 'Schedule settlement readiness call' },
  { id: 'b4', name: 'Lee & Associates', unit: '1203 / 2-Bed', value: 1580000, riskScore: 71, riskType: 'engagement', daysSinceContact: 9, lastActivity: 'No portal activity in 21 days', recommendedAction: 'Send construction update + milestone photos' },
  { id: 'b5', name: 'Williams Family', unit: '801 / 3-Bed', value: 2100000, riskScore: 65, riskType: 'drift', daysSinceContact: 7, lastActivity: 'Compared units 5x, no configurator use', recommendedAction: 'Offer configuration session with agent' },
  { id: 'b6', name: 'Park Holdings', unit: '602 / 2-Bed', value: 1420000, riskScore: 58, riskType: 'finance', daysSinceContact: 4, lastActivity: 'Broker inquiry pending 8 days', recommendedAction: 'Follow up broker directly' },
  { id: 'b7', name: 'Zhang Family', unit: '1901 / 3-Bed', value: 2350000, riskScore: 52, riskType: 'settlement', daysSinceContact: 2, lastActivity: 'Standard engagement, 62 days to settlement', recommendedAction: 'Automated 60-day settlement reminder' },
];

const RISK_TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  drift: { color: 'text-red-400', bg: 'bg-red-500/20', icon: <TrendingDown className="w-3 h-3" />, label: 'Drift' },
  settlement: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Clock className="w-3 h-3" />, label: 'Settlement' },
  finance: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: <DollarSign className="w-3 h-3" />, label: 'Finance' },
  engagement: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Activity className="w-3 h-3" />, label: 'Engagement' },
};

export default function RevenueAtRisk() {
  const [selectedBuyer, setSelectedBuyer] = useState<RiskBuyer | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const totalAtRisk = RISK_BUYERS.reduce((a, b) => a + b.value, 0);
  const highRiskCount = RISK_BUYERS.filter(b => b.riskScore >= 75).length;
  const filtered = filter === 'all' ? RISK_BUYERS : RISK_BUYERS.filter(b => b.riskType === filter);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Revenue at Risk</h2>
            <p className="text-gray-400 text-sm">One number every morning. Buyers about to slip.</p>
          </div>
        </div>
      </div>

      {/* The Big Number */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-6 mb-6 border-red-500/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400 font-semibold">Total Revenue at Risk</span>
            </div>
            <div className="text-5xl font-bold text-white">${(totalAtRisk / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-400 mt-1">across {RISK_BUYERS.length} buyers • {highRiskCount} critical (score ≥75)</div>
          </div>
          <div className="text-right">
            <div className="w-24 h-24 rounded-full border-4 border-red-500/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{RISK_BUYERS.length}</div>
                <div className="text-[10px] text-gray-500">at risk</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="bg-red-600 hover:bg-red-500">
            <Phone className="w-3.5 h-3.5 mr-1" />
            Call All Critical
          </Button>
          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
            <Mail className="w-3.5 h-3.5 mr-1" />
            Email Batch
          </Button>
          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          All ({RISK_BUYERS.length})
        </button>
        {Object.entries(RISK_TYPE_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {config.icon}
            {config.label} ({RISK_BUYERS.filter(b => b.riskType === key).length})
          </button>
        ))}
      </div>

      {/* Risk list */}
      <div className="space-y-2">
        {filtered.map((buyer, i) => (
          <motion.div
            key={buyer.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedBuyer(selectedBuyer?.id === buyer.id ? null : buyer)}
            className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
              selectedBuyer?.id === buyer.id ? 'border-red-500/30' :
              buyer.riskScore >= 75 ? 'border-red-500/10' :
              'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${RISK_TYPE_CONFIG[buyer.riskType]?.bg} flex items-center justify-center`}>
                  <span className={RISK_TYPE_CONFIG[buyer.riskType]?.color}>
                    {RISK_TYPE_CONFIG[buyer.riskType]?.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{buyer.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${RISK_TYPE_CONFIG[buyer.riskType]?.bg} ${RISK_TYPE_CONFIG[buyer.riskType]?.color}`}>
                      {RISK_TYPE_CONFIG[buyer.riskType]?.label}
                    </span>
                    {buyer.riskScore >= 75 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 animate-pulse">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{buyer.unit} • ${(buyer.value / 1000000).toFixed(2)}M</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    buyer.riskScore >= 80 ? 'text-red-400' :
                    buyer.riskScore >= 60 ? 'text-amber-400' :
                    'text-yellow-400'
                  }`}>{buyer.riskScore}</div>
                  <div className="text-[10px] text-gray-500">risk score</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {selectedBuyer?.id === buyer.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-gray-700 space-y-2"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-white font-medium">{buyer.daysSinceContact} days</div>
                    <div className="text-[10px] text-gray-500">since contact</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-white font-medium">${(buyer.value / 1000000).toFixed(2)}M</div>
                    <div className="text-[10px] text-gray-500">unit value</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-white font-medium">{buyer.riskScore}/100</div>
                    <div className="text-[10px] text-gray-500">composite score</div>
                  </div>
                </div>
                <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">Recommended Action</span>
                  </div>
                  <p className="text-xs text-gray-300">{buyer.recommendedAction}</p>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">Last activity:</span> {buyer.lastActivity}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-500 flex-1">
                    <Phone className="w-3.5 h-3.5 mr-1" />Call Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 flex-1">
                    <Mail className="w-3.5 h-3.5 mr-1" />Send Email
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                    <Shield className="w-3.5 h-3.5 mr-1" />Mark Safe
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
