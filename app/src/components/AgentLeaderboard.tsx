import { motion } from 'framer-motion';
import { Trophy, TrendingUp, ArrowUpRight, Gift, Bell, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AGENTS = [
  { name: 'David Chen', sales: 12, revenue: 18200000, conversion: 68, leads: 45, avgResponse: 12, trend: 'up' },
  { name: 'Maria Santos', sales: 9, revenue: 14500000, conversion: 54, leads: 38, avgResponse: 18, trend: 'up' },
  { name: 'John O\'Brien', sales: 7, revenue: 11200000, conversion: 41, leads: 52, avgResponse: 45, trend: 'down' },
  { name: 'Aisha Khan', sales: 6, revenue: 9800000, conversion: 60, leads: 28, avgResponse: 8, trend: 'up' },
  { name: 'Tom Harris', sales: 4, revenue: 6200000, conversion: 31, leads: 41, avgResponse: 62, trend: 'down' },
];

const WAITLIST = [
  { name: 'Lisa Wong', email: 'lisa@email.com', date: '15 Jun 2026', unitType: '3BR Marina', priority: 'high' },
  { name: 'Robert Kim', email: 'rkim@email.com', date: '18 Jun 2026', unitType: '2BR Park', priority: 'medium' },
  { name: 'Emma Davis', email: 'emma.d@email.com', date: '20 Jun 2026', unitType: '4BR Penthouse', priority: 'high' },
];

export default function AgentLeaderboard() {
  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" />Agent Leaderboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">Performance rankings, waitlist, and referral engine</p>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-4">
        {/* Leaderboard */}
        <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
          <div className="text-sm font-medium text-white mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400" />This Month</div>
          <div className="space-y-2">
            {AGENTS.sort((a, b) => b.sales - a.sales).map((agent, i) => (
              <motion.div key={agent.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-500'}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.sales} sales | {agent.leads} leads</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 text-sm font-bold">${(agent.revenue / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-500">{agent.conversion}% conv</div>
                </div>
                <div className={`text-xs flex items-center gap-0.5 ${agent.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {agent.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}{agent.avgResponse}m
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Waitlist */}
        <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-white flex items-center gap-2"><Bell className="w-4 h-4 text-blue-400" />Waitlist ({WAITLIST.length})</div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Next Release</Badge>
          </div>
          <div className="space-y-2">
            {WAITLIST.map((w) => (
              <div key={w.email} className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <div><div className="text-sm text-white">{w.name}</div><div className="text-xs text-gray-500">{w.unitType} | {w.date}</div></div>
                <Badge className={`${w.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'} border-0 text-[10px]`}>{w.priority}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
          <div className="text-sm font-medium text-white mb-3 flex items-center gap-2"><Gift className="w-4 h-4 text-purple-400" />Referral Engine</div>
          <p className="text-xs text-gray-400 mb-3">Buyers who refer a friend who purchases receive $2,000 credit toward their settlement or upgrades.</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-800/50 rounded-lg p-2"><div className="text-lg font-bold text-white">24</div><div className="text-[10px] text-gray-500">Referrals sent</div></div>
            <div className="bg-gray-800/50 rounded-lg p-2"><div className="text-lg font-bold text-emerald-400">8</div><div className="text-[10px] text-gray-500">Converted</div></div>
            <div className="bg-gray-800/50 rounded-lg p-2"><div className="text-lg font-bold text-purple-400">$16k</div><div className="text-[10px] text-gray-500">Credits issued</div></div>
          </div>
          <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-xs"><UserPlus className="w-3.5 h-3.5 mr-1.5" />Generate Referral Link</Button>
        </div>
      </div>
    </div>
  );
}
