import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Mail, Instagram, Facebook, Linkedin,
  Users, Eye, DollarSign, BarChart3, ArrowUpRight,
  Sparkles, Calendar, Target, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CampaignChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'active' | 'paused' | 'scheduled';
  leads: number;
  cost: number;
  conversion: number;
  color: string;
}

const CHANNELS: CampaignChannel[] = [
  { id: 'email', name: 'Email Nurture', icon: <Mail className="w-4 h-4" />, status: 'active', leads: 234, cost: 420, conversion: 4.2, color: 'bg-blue-500' },
  { id: 'instagram', name: 'Instagram Ads', icon: <Instagram className="w-4 h-4" />, status: 'active', leads: 567, cost: 2800, conversion: 2.8, color: 'bg-pink-500' },
  { id: 'facebook', name: 'Facebook Ads', icon: <Facebook className="w-4 h-4" />, status: 'active', leads: 412, cost: 1950, conversion: 3.1, color: 'bg-indigo-500' },
  { id: 'linkedin', name: 'LinkedIn Ads', icon: <Linkedin className="w-4 h-4" />, status: 'paused', leads: 189, cost: 3200, conversion: 5.4, color: 'bg-sky-500' },
  { id: 'google', name: 'Google Search', icon: <Globe className="w-4 h-4" />, status: 'active', leads: 378, cost: 4500, conversion: 3.8, color: 'bg-emerald-500' },
];

const WEEKLY_TREND = [
  { week: 'W1', impressions: 12000, clicks: 340, leads: 42 },
  { week: 'W2', impressions: 15400, clicks: 420, leads: 58 },
  { week: 'W3', impressions: 18900, clicks: 510, leads: 67 },
  { week: 'W4', impressions: 22100, clicks: 680, leads: 89 },
  { week: 'W5', impressions: 25600, clicks: 740, leads: 102 },
  { week: 'W6', impressions: 28400, clicks: 820, leads: 118 },
  { week: 'W7', impressions: 31200, clicks: 950, leads: 134 },
  { week: 'W8', impressions: 35800, clicks: 1100, leads: 156 },
];

const TOP_PERFORMING = [
  { asset: 'Drone Flythrough Video', channel: 'Instagram', impressions: 45200, engagement: 8.4, leads: 34 },
  { asset: 'Floorplan Carousel', channel: 'Facebook', impressions: 28400, engagement: 6.2, leads: 28 },
  { asset: 'Investor One-Pager', channel: 'Email', impressions: 12400, engagement: 12.1, leads: 45 },
  { asset: 'Agent Walkthrough', channel: 'LinkedIn', impressions: 18900, engagement: 4.8, leads: 22 },
];

export default function MarketingCommandCenter() {
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'content'>('overview');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const totalLeads = CHANNELS.reduce((a, c) => a + c.leads, 0);
  const totalCost = CHANNELS.reduce((a, c) => a + c.cost, 0);
  const avgConversion = (CHANNELS.reduce((a, c) => a + c.conversion, 0) / CHANNELS.length).toFixed(1);
  const cpl = Math.round(totalCost / totalLeads);

  const filteredChannels = channelFilter === 'all'
    ? CHANNELS
    : CHANNELS.filter(c => c.status === channelFilter);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Marketing Command Center</h2>
            <p className="text-gray-400 text-sm">Campaign analytics, lead attribution & content performance</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: <Users className="w-4 h-4" />, color: 'text-blue-400', change: '+24%' },
          { label: 'Ad Spend', value: `$${(totalCost / 1000).toFixed(1)}K`, icon: <DollarSign className="w-4 h-4" />, color: 'text-emerald-400', change: '+12%' },
          { label: 'Avg. Conv. Rate', value: `${avgConversion}%`, icon: <Target className="w-4 h-4" />, color: 'text-purple-400', change: '+0.8%' },
          { label: 'Cost Per Lead', value: `$${cpl}`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-amber-400', change: '-8%' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">{kpi.icon}</span>
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
            </div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-gray-500">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['overview', 'channels', 'content'] as const).map(tab => (
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
          {/* Trend chart */}
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-4">8-Week Lead Generation Trend</h4>
            <div className="flex items-end gap-2 h-40">
              {WEEKLY_TREND.map((w, i) => (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: 120 }}>
                    <motion.div
                      className="flex-1 bg-blue-500/30 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(w.impressions / 40000) * 100}%` }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                    />
                    <motion.div
                      className="flex-1 bg-purple-500/50 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(w.leads / 180) * 100}%` }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-500">{w.week}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500/30 rounded" />
                <span className="text-gray-400">Impressions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-purple-500/50 rounded" />
                <span className="text-gray-400">Leads</span>
              </div>
            </div>
          </div>

          {/* Channel summary */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {CHANNELS.map((ch, i) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-panel rounded-xl p-3"
              >
                <div className={`${ch.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
                  {ch.icon}
                </div>
                <div className="text-sm text-white font-medium">{ch.leads}</div>
                <div className="text-[10px] text-gray-500">{ch.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${ch.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-[9px] text-gray-500 capitalize">{ch.status}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button className="bg-pink-600 hover:bg-pink-500">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Social Content
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <Mail className="w-4 h-4 mr-2" />
              Create Email Campaign
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Posts
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="space-y-3">
          <div className="flex gap-1 mb-3">
            {['all', 'active', 'paused'].map(f => (
              <button
                key={f}
                onClick={() => setChannelFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  channelFilter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredChannels.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${ch.color} text-white w-10 h-10 rounded-xl flex items-center justify-center`}>
                    {ch.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{ch.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        ch.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ch.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{ch.leads} leads</span>
                      <span>${ch.cost.toLocaleString()} spent</span>
                      <span>{ch.conversion}% conversion</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">${Math.round(ch.cost / ch.leads)}/lead</div>
                  <div className="text-[10px] text-gray-500">cost per lead</div>
                </div>
              </div>

              {/* Mini metric bars */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Leads</span>
                    <span className="text-gray-400">{ch.leads}</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full`} style={{ width: `${(ch.leads / 600) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Budget Used</span>
                    <span className="text-gray-400">${(ch.cost / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full opacity-60`} style={{ width: `${(ch.cost / 5000) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Conversion</span>
                    <span className="text-gray-400">{ch.conversion}%</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(ch.conversion / 8) * 100}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-white font-medium">Top Performing Content</h4>
            <Button size="sm" className="bg-pink-600 hover:bg-pink-500">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Generate New
            </Button>
          </div>

          {TOP_PERFORMING.map((asset, i) => (
            <motion.div
              key={asset.asset}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                    {i === 0 ? <Eye className="w-5 h-5 text-blue-400" /> :
                     i === 1 ? <ImageIcon className="w-5 h-5 text-purple-400" /> :
                     i === 2 ? <Mail className="w-5 h-5 text-emerald-400" /> :
                     <BarChart3 className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">{asset.asset}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{asset.channel}</span>
                      <span>•</span>
                      <span>{asset.impressions.toLocaleString()} impressions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-sm text-white font-medium">{asset.engagement}%</div>
                    <div className="text-[10px] text-gray-500">engagement</div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-400 font-medium">{asset.leads}</div>
                    <div className="text-[10px] text-gray-500">leads</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Content calendar teaser */}
          <div className="glass-panel rounded-xl p-4 border-pink-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-white font-medium">This Week's Content Calendar</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500">{day}</div>
                  <div className="text-xs text-white mt-1">{3 - (i % 3)} posts</div>
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
