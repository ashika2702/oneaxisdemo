import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, AlertTriangle, Calendar, TrendingDown,
  Phone, Mail, ChevronRight, Shield, CreditCard,
  FileText, Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/* ═══════════════════════════════════════════
   SETTLEMENT RADAR — Track all settlements
   Risk scoring, countdowns, actions
   ═══════════════════════════════════════════ */

interface Settlement {
  id: string;
  buyerName: string;
  unit: string;
  settlementDate: string;
  daysRemaining: number;
  depositPaid: boolean;
  financeApproved: boolean;
  insuranceInPlace: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastContact: string;
  notes: string;
  agent: string;
}

const settlements: Settlement[] = [
  { id: '1', buyerName: 'Sarah Chen', unit: '12C', settlementDate: '2026-11-30', daysRemaining: 147, depositPaid: true, financeApproved: false, insuranceInPlace: true, riskLevel: 'medium', lastContact: '2 days ago', notes: 'Finance approval pending — bank reviewing', agent: 'Alex Morgan' },
  { id: '2', buyerName: 'David Park', unit: '15A', settlementDate: '2026-10-15', daysRemaining: 101, depositPaid: true, financeApproved: true, insuranceInPlace: true, riskLevel: 'low', lastContact: '1 week ago', notes: 'On track', agent: 'Sarah Chen' },
  { id: '3', buyerName: 'Maria Garcia', unit: '8B', settlementDate: '2026-09-01', daysRemaining: 57, depositPaid: false, financeApproved: false, insuranceInPlace: false, riskLevel: 'critical', lastContact: '5 days ago', notes: 'Deposit overdue. No response to emails.', agent: 'James Wilson' },
  { id: '4', buyerName: 'Li Wei', unit: '12A', settlementDate: '2026-12-15', daysRemaining: 162, depositPaid: true, financeApproved: true, insuranceInPlace: false, riskLevel: 'low', lastContact: '3 days ago', notes: 'Insurance docs requested', agent: 'Alex Morgan' },
  { id: '5', buyerName: 'Emma Thompson', unit: '10D', settlementDate: '2026-08-15', daysRemaining: 40, depositPaid: true, financeApproved: false, insuranceInPlace: true, riskLevel: 'high', lastContact: '1 day ago', notes: 'Finance fell through — seeking alternative lender', agent: 'Sarah Chen' },
  { id: '6', buyerName: 'Khalid Al-Mansouri', unit: '15B', settlementDate: '2026-11-01', daysRemaining: 118, depositPaid: true, financeApproved: true, insuranceInPlace: true, riskLevel: 'low', lastContact: '4 days ago', notes: 'All checks complete', agent: 'James Wilson' },
  { id: '7', buyerName: 'Priya Sharma', unit: '6C', settlementDate: '2026-07-30', daysRemaining: 24, depositPaid: true, financeApproved: true, insuranceInPlace: false, riskLevel: 'medium', lastContact: 'Yesterday', notes: 'Insurance cert needed urgently', agent: 'Alex Morgan' },
];

const riskConfig = {
  low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'Low Risk' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Medium' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', label: 'High Risk' },
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Critical' },
};

export default function SettlementRadar() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'upcoming'>('all');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const filtered = filter === 'all' ? settlements :
    filter === 'critical' ? settlements.filter((s) => s.riskLevel === 'high' || s.riskLevel === 'critical') :
    settlements.filter((s) => s.daysRemaining <= 60);

  const criticalCount = settlements.filter((s) => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const upcoming30 = settlements.filter((s) => s.daysRemaining <= 30).length;
  const totalValue = settlements.reduce((s) => s + 850000, 0);

  return (
    <div className="h-full bg-[#0a0e1a] text-white overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold">Settlement Radar</h2>
            <p className="text-sm text-gray-400 mt-1">Track upcoming settlements and identify at-risk buyers.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>All ({settlements.length})</button>
            <button onClick={() => setFilter('critical')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'critical' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>At Risk ({criticalCount})</button>
            <button onClick={() => setFilter('upcoming')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'upcoming' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>Due Soon ({upcoming30})</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Settlements', value: settlements.length, color: 'blue', icon: FileText },
            { label: 'Critical/High Risk', value: criticalCount, color: 'red', icon: AlertTriangle },
            { label: 'Due within 30 days', value: upcoming30, color: 'amber', icon: Clock },
            { label: 'Total Value at Risk', value: `$${(totalValue / 1000000).toFixed(1)}M`, color: 'emerald', icon: CreditCard },
          ].map((stat) => (
            <div key={stat.label} className={`bg-${stat.color}-500/5 border border-${stat.color}-500/20 rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Settlement List */}
        <div className="space-y-3">
          {filtered.map((s) => {
            const rc = riskConfig[s.riskLevel];
            const progressItems = [
              { label: 'Deposit', done: s.depositPaid, icon: CreditCard },
              { label: 'Finance', done: s.financeApproved, icon: Shield },
              { label: 'Insurance', done: s.insuranceInPlace, icon: FileText },
            ];
            return (
              <motion.div
                key={s.id}
                layout
                onClick={() => setSelectedSettlement(selectedSettlement?.id === s.id ? null : s)}
                className={`bg-gray-800/40 border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-gray-600 ${
                  selectedSettlement?.id === s.id ? 'border-blue-500/30' : 'border-gray-700'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Days circle */}
                    <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0 ${
                      s.daysRemaining <= 30 ? 'bg-red-500/10 text-red-400' :
                      s.daysRemaining <= 90 ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      <span className="text-lg font-bold leading-none">{s.daysRemaining}</span>
                      <span className="text-[8px] uppercase">days</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold">{s.buyerName}</h4>
                        <Badge className={`${rc.bg} ${rc.text} ${rc.border} text-[9px]`}>{rc.label}</Badge>
                        {s.daysRemaining <= 30 && <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px]">URGENT</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>Unit {s.unit}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {s.settlementDate}</span>
                        <span>·</span>
                        <span>Agent: {s.agent}</span>
                      </div>
                    </div>

                    {/* Progress dots */}
                    <div className="hidden sm:flex items-center gap-2">
                      {progressItems.map((p) => (
                        <div key={p.label} className={`flex flex-col items-center gap-1 ${p.done ? 'text-emerald-400' : 'text-gray-600'}`}>
                          <p.icon className="w-4 h-4" />
                          <span className="text-[8px]">{p.label}</span>
                        </div>
                      ))}
                    </div>

                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${selectedSettlement?.id === s.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Detail */}
                {selectedSettlement?.id === s.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-gray-700/50 px-4 py-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs text-gray-500 uppercase mb-2">Notes</h5>
                        <p className="text-sm text-gray-300 bg-gray-900/50 rounded-lg p-3">{s.notes}</p>
                      </div>
                      <div>
                        <h5 className="text-xs text-gray-500 uppercase mb-2">Quick Actions</h5>
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors">
                            <Phone className="w-3 h-3" /> Call Buyer
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs hover:bg-purple-500/20 transition-colors">
                            <Mail className="w-3 h-3" /> Send Email
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs hover:bg-amber-500/20 transition-colors">
                            <Bell className="w-3 h-3" /> Send Reminder
                          </button>
                          {s.riskLevel === 'critical' && (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors">
                              <TrendingDown className="w-3 h-3" /> Escalate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
