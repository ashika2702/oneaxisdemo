import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building2, TrendingUp,
  FileText, BarChart3, Bell, Globe,
  AlertTriangle
} from 'lucide-react';
import { StatusBadge } from './SettingsHub';

interface VisibilityRule {
  id: string;
  label: string;
  description: string;
  category: 'project' | 'financial' | 'document' | 'analytics' | 'communication';
  endCustomer: boolean;
  externalAgent: boolean;
  investor: boolean;
  contractor: boolean;
  status: 'draft' | 'live' | 'pending-review';
}

const categoryIcons: Record<string, any> = {
  project: Building2,
  financial: TrendingUp,
  document: FileText,
  analytics: BarChart3,
  communication: Bell,
};

const categoryLabels: Record<string, string> = {
  project: 'Project Data',
  financial: 'Financial Information',
  document: 'Documents & Files',
  analytics: 'Analytics & Reports',
  communication: 'Communication',
};

const defaultRules: VisibilityRule[] = [
  { id: '1', label: 'View project timelines', description: 'Construction phases and milestone dates', category: 'project', endCustomer: true, externalAgent: true, investor: true, contractor: true, status: 'live' },
  { id: '2', label: 'View unit pricing', description: 'Individual unit prices and premiums', category: 'financial', endCustomer: true, externalAgent: true, investor: true, contractor: false, status: 'live' },
  { id: '3', label: 'View total project value', description: 'Aggregate project valuation', category: 'financial', endCustomer: false, externalAgent: true, investor: true, contractor: false, status: 'live' },
  { id: '4', label: 'View sold/available units', description: 'Real-time inventory status', category: 'project', endCustomer: true, externalAgent: true, investor: true, contractor: false, status: 'live' },
  { id: '5', label: 'Download floor plans', description: 'Unit-level floor plan PDFs', category: 'document', endCustomer: true, externalAgent: true, investor: false, contractor: true, status: 'live' },
  { id: '6', label: 'View site documents', description: 'Engineering reports, permits', category: 'document', endCustomer: false, externalAgent: false, investor: true, contractor: true, status: 'pending-review' },
  { id: '7', label: 'View sales analytics', description: 'Sell-through rates, velocity', category: 'analytics', endCustomer: false, externalAgent: true, investor: true, contractor: false, status: 'live' },
  { id: '8', label: 'View market comparisons', description: 'Comp pricing and demand', category: 'analytics', endCustomer: false, externalAgent: true, investor: true, contractor: false, status: 'live' },
  { id: '9', label: 'Send messages to team', description: 'In-app communication', category: 'communication', endCustomer: true, externalAgent: true, investor: false, contractor: true, status: 'live' },
  { id: '10', label: 'View AI insights', description: 'Automated recommendations', category: 'analytics', endCustomer: false, externalAgent: true, investor: true, contractor: false, status: 'draft' },
  { id: '11', label: 'View reservation status', description: 'Own reservation details', category: 'project', endCustomer: true, externalAgent: true, investor: false, contractor: false, status: 'live' },
  { id: '12', label: 'View environmental data', description: 'Emissions, sustainability', category: 'analytics', endCustomer: false, externalAgent: false, investor: true, contractor: true, status: 'pending-review' },
];

export default function StakeholderVisibilityPanel() {
  const [rules, setRules] = useState<VisibilityRule[]>(defaultRules);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showSummary] = useState(true);

  const toggleRole = (ruleId: string, role: keyof Omit<VisibilityRule, 'id' | 'label' | 'description' | 'category' | 'status'>) => {
    setRules(rules.map((r) => r.id === ruleId ? { ...r, [role]: !r[role] } : r));
  };

  const filteredRules = activeCategory === 'all' ? rules : rules.filter((r) => r.category === activeCategory);
  const categories = [...new Set(rules.map((r) => r.category))];

  const roleColumns = [
    { key: 'endCustomer' as const, label: 'End-Customer', color: 'blue', icon: Users },
    { key: 'externalAgent' as const, label: 'External Agent', color: 'purple', icon: Globe },
    { key: 'investor' as const, label: 'Investor', color: 'emerald', icon: TrendingUp },
    { key: 'contractor' as const, label: 'Contractor', color: 'amber', icon: Building2 },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Stakeholder Visibility Controls</h2>
          <p className="text-sm text-gray-400 mt-1">
            Determine what data your end-customers and stakeholders can view and interact with.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400">Changes apply immediately to live portals</span>
        </div>
      </div>

      {/* Summary Bar */}
      {showSummary && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="grid grid-cols-4 gap-3"
        >
          {roleColumns.map((role) => {
            const visibleCount = rules.filter((r) => r[role.key]).length;
            return (
              <div key={role.key} className={`bg-${role.color}-500/5 border border-${role.color}-500/20 rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <role.icon className={`w-4 h-4 text-${role.color}-400`} />
                  <span className="text-xs font-medium text-gray-300">{role.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{visibleCount}<span className="text-sm text-gray-500">/{rules.length}</span></div>
                <div className="text-[10px] text-gray-500 mt-1">data points visible</div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'all' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          All ({rules.length})
        </button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          const count = rules.filter((r) => r.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              {categoryLabels[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Visibility Matrix */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_110px_110px_110px_110px_90px] gap-2 px-5 py-3 border-b border-gray-700 text-xs text-gray-500 font-medium uppercase items-center">
          <span>Data Access Rule</span>
          {roleColumns.map((role) => (
            <span key={role.key} className={`text-${role.color}-400 text-center`}>{role.label}</span>
          ))}
          <span className="text-center">Status</span>
        </div>

        {/* Rules */}
        {filteredRules.map((rule, idx) => {
          const Icon = categoryIcons[rule.category];
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="grid grid-cols-[1fr_110px_110px_110px_110px_90px] gap-2 px-5 py-3 border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors items-center"
            >
              {/* Rule Info */}
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-white font-medium truncate">{rule.label}</div>
                  <div className="text-[10px] text-gray-500 truncate">{rule.description}</div>
                </div>
              </div>

              {/* Role Toggles */}
              {roleColumns.map((role) => {
                const isEnabled = rule[role.key];
                return (
                  <div key={role.key} className="flex justify-center">
                    <button
                      onClick={() => toggleRole(rule.id, role.key)}
                      className={`w-9 h-5 rounded-full transition-all relative ${
                        isEnabled ? `bg-${role.color}-500` : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          isEnabled ? 'left-[18px]' : 'left-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}

              {/* Status */}
              <div className="flex justify-center">
                <StatusBadge status={rule.status} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-3 bg-blue-500 rounded-full" />
          <span>End-Customer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-3 bg-purple-500 rounded-full" />
          <span>External Agent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-3 bg-emerald-500 rounded-full" />
          <span>Investor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-3 bg-amber-500 rounded-full" />
          <span>Contractor</span>
        </div>
      </div>
    </div>
  );
}
