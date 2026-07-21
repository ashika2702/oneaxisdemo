import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Sparkles, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CAMPAIGNS = [
  { id: 'c1', name: 'Marina View Push', status: 'active', channel: 'email', sent: 1240, opened: 892, clicked: 234, conversions: 12, lastRun: '2 hours ago' },
  { id: 'c2', name: 'Weekend Viewing Blitz', status: 'scheduled', channel: 'whatsapp', sent: 0, opened: 0, clicked: 0, conversions: 0, lastRun: 'Tomorrow 9am' },
  { id: 'c3', name: 'Price Drop Alert — Unit 805', status: 'completed', channel: 'sms', sent: 450, opened: 380, clicked: 89, conversions: 3, lastRun: '3 days ago' },
  { id: 'c4', name: 'Referral Drive', status: 'active', channel: 'social', sent: 2800, opened: 1200, clicked: 340, conversions: 8, lastRun: 'Running' },
];

const AUTO_CAMPAIGNS = [
  { trigger: 'New unit becomes available', action: 'Notify waitlist + post to portals', status: 'enabled' },
  { trigger: 'Price reduction', action: 'Alert saved-search users + run retargeting', status: 'enabled' },
  { trigger: 'Buyer viewing completed', action: 'Send follow-up within 2 hours', status: 'enabled' },
  { trigger: 'Buyer drift score drops below 50', action: 'Alert agent + send re-engagement email', status: 'enabled' },
  { trigger: 'Milestone photo uploaded', action: 'Notify all buyers + post to portal', status: 'enabled' },
];

export default function CampaignManager() {
  const [tab, setTab] = useState<'active' | 'autopilot'>('active');

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Megaphone className="w-5 h-5 text-pink-400" />Campaign Manager</h2>
        <p className="text-gray-500 text-sm mt-0.5">Autonomous campaign creation, execution, and optimisation</p>
      </div>
      <div className="flex gap-1 px-6 py-3">
        {[{ k: 'active', l: 'Campaigns' }, { k: 'autopilot', l: 'Autopilot Rules' }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k as any)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.k ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{t.l}</button>
        ))}
      </div>
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-3">
        {tab === 'active' ? (
          CAMPAIGNS.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{c.name}</span>
                  <Badge className={`${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : c.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-700 text-gray-400'} border-0 text-[10px]`}>{c.status}</Badge>
                </div>
                <span className="text-[10px] text-gray-500">{c.lastRun}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-xs text-gray-500">Sent</div><div className="text-sm font-bold text-white">{c.sent.toLocaleString()}</div></div>
                <div><div className="text-xs text-gray-500">Opened</div><div className="text-sm font-bold text-blue-400">{c.opened > 0 ? Math.round((c.opened / c.sent) * 100) + '%' : '-'}</div></div>
                <div><div className="text-xs text-gray-500">Clicked</div><div className="text-sm font-bold text-amber-400">{c.clicked > 0 ? Math.round((c.clicked / c.sent) * 100) + '%' : '-'}</div></div>
                <div><div className="text-xs text-gray-500">Converted</div><div className="text-sm font-bold text-emerald-400">{c.conversions}</div></div>
              </div>
            </motion.div>
          ))
        ) : (
          <>
            <div className="bg-pink-500/5 rounded-xl border border-pink-500/20 p-4 mb-3">
              <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-pink-400" /><span className="text-sm font-medium text-pink-400">Autonomous Mode Active</span></div>
              <p className="text-xs text-gray-400">The platform automatically creates, runs, and optimises campaigns based on triggers. No manual intervention required.</p>
            </div>
            <div className="space-y-2">
              {AUTO_CAMPAIGNS.map((rule, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-white">When: <span className="text-blue-400">{rule.trigger}</span></div>
                    <div className="text-xs text-gray-400">Then: {rule.action}</div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
