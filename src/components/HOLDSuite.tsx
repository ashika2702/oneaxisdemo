import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Clock, FileText, AlertTriangle, CheckCircle,
  Package, TrendingUp, Home, Camera,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SunsetClause {
  id: string;
  name: string;
  deadline: string;
  daysRemaining: number;
  status: 'compliant' | 'warning' | 'overdue';
  description: string;
}

interface Variation {
  id: string;
  buyer: string;
  unit: string;
  type: string;
  value: number;
  status: 'requested' | 'approved' | 'in-progress' | 'completed';
  requestedAt: string;
}

interface ConstructionMilestone {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  evidence: string;
}

const SUNSET_CLAUSES: SunsetClause[] = [
  { id: 's1', name: 'NSW s.66ZL — Sunset Date', deadline: '15 Dec 2026', daysRemaining: 164, status: 'compliant', description: 'Project must be substantially complete by this date or buyers may rescind' },
  { id: 's2', name: 'BASIX Compliance Certificate', deadline: '30 Sep 2026', daysRemaining: 88, status: 'warning', description: 'Energy/water efficiency certificate required before occupation' },
  { id: 's3', name: 'OC — Occupation Certificate', deadline: '28 Feb 2027', daysRemaining: 239, status: 'compliant', description: 'Final inspection and sign-off for residential occupation' },
  { id: 's4', name: 'Warranty Insurance (DBI)', deadline: '1 Oct 2026', daysRemaining: 89, status: 'warning', description: 'Domestic Building Insurance must be in place before settlement' },
];

const VARIATIONS: Variation[] = [
  { id: 'v1', buyer: 'Chen Family', unit: '2401', type: 'Timber Flooring Upgrade', value: 18500, status: 'approved', requestedAt: '12 Jun 2026' },
  { id: 'v2', buyer: 'Mr. Patel', unit: '1502', type: 'Smart Home Package', value: 12500, status: 'in-progress', requestedAt: '18 Jun 2026' },
  { id: 'v3', buyer: 'Sydney Investments', unit: 'PH-B', type: 'Custom Kitchen', value: 45000, status: 'requested', requestedAt: '2 Jul 2026' },
  { id: 'v4', buyer: 'Williams Family', unit: '801', type: 'Storage Upgrade', value: 8200, status: 'completed', requestedAt: '1 Jun 2026' },
  { id: 'v5', buyer: 'Lee & Associates', unit: '1203', type: 'AC Level 2', value: 9800, status: 'approved', requestedAt: '28 Jun 2026' },
];

const MILESTONES: ConstructionMilestone[] = [
  { id: 'm1', name: 'Foundation Complete', date: 'Mar 2026', status: 'completed', evidence: 'Engineer sign-off + photos' },
  { id: 'm2', name: 'Level 10 Slab', date: 'Jun 2026', status: 'completed', evidence: 'Drone survey + concrete cert' },
  { id: 'm3', name: 'Level 20 Slab', date: 'Sep 2026', status: 'current', evidence: 'In progress — 80% complete' },
  { id: 'm4', name: 'Roof Structure', date: 'Nov 2026', status: 'upcoming', evidence: 'Steel delivery scheduled' },
  { id: 'm5', name: 'Cladding 50%', date: 'Jan 2027', status: 'upcoming', evidence: 'Curtain wall panels ordered' },
  { id: 'm6', name: 'Practical Completion', date: 'Jun 2027', status: 'upcoming', evidence: 'Target — on track' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  compliant: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'On Track' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Warning' },
  overdue: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Overdue' },
};

const VAR_STATUS: Record<string, { color: string; label: string }> = {
  requested: { color: 'text-blue-400', label: 'Requested' },
  approved: { color: 'text-emerald-400', label: 'Approved' },
  'in-progress': { color: 'text-amber-400', label: 'In Progress' },
  completed: { color: 'text-gray-400', label: 'Completed' },
};

export default function HOLDSuite() {
  const [activeTab, setActiveTab] = useState<'sunset' | 'variations' | 'milestones'>('sunset');

  const totalVariationRevenue = VARIATIONS.filter(v => v.status === 'completed' || v.status === 'approved' || v.status === 'in-progress').reduce((a, v) => a + v.value, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">HOLD Suite</h2>
            <p className="text-gray-400 text-sm">Settlement defence — compliance, variations & progress</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Compliance Items</span>
          </div>
          <div className="text-2xl font-bold text-white">{SUNSET_CLAUSES.length}</div>
          <div className="text-[10px] text-amber-400">2 approaching deadline</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Active Variations</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{VARIATIONS.filter(v => v.status !== 'completed').length}</div>
          <div className="text-[10px] text-gray-500">in pipeline</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Variation Revenue</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">${(totalVariationRevenue / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-gray-500">dead period income</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Est. Completion</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">Jun 2027</div>
          <div className="text-[10px] text-emerald-400">On track</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {([
          { key: 'sunset' as const, label: 'Sunset & Compliance', icon: <Clock className="w-3.5 h-3.5" /> },
          { key: 'variations' as const, label: 'Variations', icon: <Package className="w-3.5 h-3.5" /> },
          { key: 'milestones' as const, label: 'Construction Progress', icon: <Camera className="w-3.5 h-3.5" /> },
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

      {activeTab === 'sunset' && (
        <div className="space-y-3">
          {SUNSET_CLAUSES.map((clause, i) => (
            <motion.div
              key={clause.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel rounded-xl p-4 border ${
                clause.status === 'overdue' ? 'border-red-500/30' :
                clause.status === 'warning' ? 'border-amber-500/30' :
                'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${STATUS_CONFIG[clause.status]?.bg} flex items-center justify-center`}>
                    <Clock className={`w-4 h-4 ${STATUS_CONFIG[clause.status]?.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{clause.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${STATUS_CONFIG[clause.status]?.bg} ${STATUS_CONFIG[clause.status]?.color}`}>
                        {STATUS_CONFIG[clause.status]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{clause.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    clause.daysRemaining < 90 ? 'text-red-400' :
                    clause.daysRemaining < 180 ? 'text-amber-400' :
                    'text-emerald-400'
                  }`}>{clause.daysRemaining}</div>
                  <div className="text-[10px] text-gray-500">days left</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-gray-500">Deadline: {clause.deadline}</span>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-6 text-xs">
                  <FileText className="w-3 h-3 mr-1" />View Document
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'variations' && (
        <div className="space-y-3">
          {VARIATIONS.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{v.type}</span>
                    <span className={`text-[10px] ${VAR_STATUS[v.status]?.color}`}>{VAR_STATUS[v.status]?.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{v.buyer} • Unit {v.unit} • Requested {v.requestedAt}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">${v.value.toLocaleString()}</div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="glass-panel rounded-xl p-4 border-emerald-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white font-medium">Total Variation Revenue</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">${totalVariationRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Revenue during the "dead period" between exchange and settlement</p>
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div>
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700" />
            {MILESTONES.map((ms, i) => (
              <motion.div
                key={ms.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 ${
                  ms.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                  ms.status === 'current' ? 'bg-blue-500 border-blue-500 animate-pulse' :
                  'bg-gray-800 border-gray-600'
                }`} />
                <div className="glass-panel rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">{ms.name}</span>
                        {ms.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                        {ms.status === 'current' && <div className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">In Progress</div>}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{ms.evidence}</div>
                    </div>
                    <span className="text-xs text-gray-400">{ms.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
