import { useState } from 'react';
import {
  Brain, Clock, Eye, Phone, Mail,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  ArrowRight, Lightbulb, BarChart3, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: 'hot' | 'warm' | 'cooling' | 'cold';
  driftScore: number; // 0-100
  firstContact: string;
  lastActive: string;
  sessions: number;
  totalDwellTime: number; // minutes
  pagesViewed: number;
  unitsExplored: string[];
  favoriteUnit: string;
  priceRange: { min: number; max: number };
  financing: 'cash' | 'pre-approved' | 'mortgage' | 'exploring';
  familySize: string;
  mustHaves: string[];
  objections: string[];
  nextAction: string;
  suggestedApproach: string;
  riskFlags: string[];
  recentActivity: { time: string; action: string }[];
  comparisonUnits: string[];
  viewingsBooked: number;
  viewingsAttended: number;
}

const DEMO_BUYERS: BuyerProfile[] = [
  {
    id: 'b1', name: 'Sarah Chen', email: 'sarah.chen@email.com', phone: '+61 412 345 678',
    stage: 'hot', driftScore: 87, firstContact: '2026-06-15', lastActive: '2 hours ago',
    sessions: 12, totalDwellTime: 145, pagesViewed: 34,
    unitsExplored: ['1204', '1205', '1501', '1102'], favoriteUnit: '1204',
    priceRange: { min: 2500000, max: 3500000 }, financing: 'pre-approved',
    familySize: '3 (couple + 1 child)', mustHaves: ['Marina view', '3+ bedrooms', 'Corner unit'],
    objections: ['Parking allocation', 'Settlement timeline'],
    nextAction: 'Offer private viewing of 1204 with marina view demo. She has asked about parking twice — have allocation sheet ready.',
    suggestedApproach: 'Lead with the corner aspect and marina view. Mention the corner windows in the master bedroom. Address parking proactively: "You asked about parking — I can confirm two spaces with visitor access." No pressure on timeline — she is pre-approved and ready.',
    riskFlags: [],
    recentActivity: [
      { time: '2h ago', action: 'Revisited Unit 1204 for 18 minutes' },
      { time: '5h ago', action: 'Compared 1204 vs 1205 side-by-side' },
      { time: '1d ago', action: 'Downloaded floor plan PDF' },
      { time: '2d ago', action: 'Booked viewing (attended)' },
      { time: '3d ago', action: 'Viewed marina view simulation' },
    ],
    comparisonUnits: ['1204', '1205'], viewingsBooked: 2, viewingsAttended: 2,
  },
  {
    id: 'b2', name: 'James & Emma Wilson', email: 'j.wilson@email.com', phone: '+61 423 456 789',
    stage: 'warm', driftScore: 64, firstContact: '2026-06-20', lastActive: '1 day ago',
    sessions: 7, totalDwellTime: 68, pagesViewed: 19,
    unitsExplored: ['805', '906', '1204'], favoriteUnit: '906',
    priceRange: { min: 1500000, max: 2200000 }, financing: 'mortgage',
    familySize: '2 (couple)', mustHaves: ['2 bedrooms', 'City access', 'Under $2M'],
    objections: ['Price per sqm seems high', 'Concerned about construction noise'],
    nextAction: 'Follow up on the price-per-sqm concern. Show comparable sales data. Offer to arrange a site visit during construction hours so they can hear actual noise levels.',
    suggestedApproach: 'They are price-sensitive but motivated. Lead with value: price per sqm is 8% below comparable sales in the precinct. Acknowledge construction noise — offer a "construction hours tour" as transparency. Do not push for commitment; provide data and let them decide.',
    riskFlags: ['Price sensitivity', 'Noise concern'],
    recentActivity: [
      { time: '1d ago', action: 'Viewed pricing page for 8 minutes' },
      { time: '2d ago', action: 'Checked construction timeline' },
      { time: '3d ago', action: 'Viewed Unit 906 details' },
      { time: '5d ago', action: 'First visit — spent 12 min on site map' },
    ],
    comparisonUnits: ['805', '906'], viewingsBooked: 1, viewingsAttended: 1,
  },
  {
    id: 'b3', name: 'Raj Patel', email: 'raj.patel@email.com', phone: '+61 434 567 890',
    stage: 'cooling', driftScore: 41, firstContact: '2026-06-10', lastActive: '5 days ago',
    sessions: 15, totalDwellTime: 210, pagesViewed: 52,
    unitsExplored: ['1501', '1204', '1205', '1102', '906'], favoriteUnit: '1501',
    priceRange: { min: 4000000, max: 6000000 }, financing: 'cash',
    familySize: '4 (couple + 2 children)', mustHaves: ['4 bedrooms', 'Penthouse', 'Private outdoor space'],
    objections: ['Settling on 1501 vs waiting for Phase 2 penthouse'],
    nextAction: 'URGENT: Drift score dropped 23 points in 5 days. He is hesitating between 1501 and waiting. Create scarcity: "1501 has 2 other active viewers this week." Offer exclusive preview of Phase 2 floor plans to keep him engaged.',
    suggestedApproach: 'This is a save call. He was highly engaged (15 sessions, 210 min) but has gone cold. Do not sell — re-engage. "Raj, you spent more time exploring 1501 than any other buyer. What changed?" Listen first. Then offer: exclusive Phase 2 preview + guaranteed first right of refusal on 1501 for 48 hours.',
    riskFlags: ['DRIFTING — score dropped 23pts in 5 days', 'Decision paralysis', 'Gone cold after high engagement'],
    recentActivity: [
      { time: '5d ago', action: 'Last active — viewed penthouse gallery' },
      { time: '6d ago', action: 'Spent 25 min on 1501 view simulation' },
      { time: '8d ago', action: 'Downloaded all penthouse floor plans' },
      { time: '10d ago', action: 'Requested Phase 2 pricing (no response to reply)' },
      { time: '12d ago', action: 'Booked second viewing (did not attend)' },
    ],
    comparisonUnits: ['1501'], viewingsBooked: 3, viewingsAttended: 1,
  },
];

const STAGE_CONFIG = {
  hot: { color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', label: 'HOT — Ready to buy', icon: TrendingUp },
  warm: { color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'WARM — Interested', icon: TrendingUp },
  cooling: { color: '#6b7280', bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'COOLING — Re-engage needed', icon: TrendingDown },
  cold: { color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'COLD — Long-term nurture', icon: TrendingDown },
};

export default function AgentCopilot() {
  const [selectedBuyer, setSelectedBuyer] = useState<string>('b1');
  const buyer = DEMO_BUYERS.find((b) => b.id === selectedBuyer)!;
  const stage = STAGE_CONFIG[buyer.stage];
  const StageIcon = stage.icon;

  // Drift score color
  const driftColor = buyer.driftScore >= 70 ? 'text-emerald-400' : buyer.driftScore >= 50 ? 'text-amber-400' : 'text-red-400';
  const driftBg = buyer.driftScore >= 70 ? 'bg-emerald-500/10' : buyer.driftScore >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10';

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Agent Copilot
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Pre-call AI brief with buyer behavioural story and suggested approach</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Buyer list */}
        <div className="w-80 border-r border-gray-800 overflow-y-auto p-4 space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Active Buyers ({DEMO_BUYERS.length})</div>
          {DEMO_BUYERS.map((b) => {
            const s = STAGE_CONFIG[b.stage];
            const SI = s.icon;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuyer(b.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedBuyer === b.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{b.name}</span>
                  <span className={`text-xs font-bold ${b.driftScore >= 70 ? 'text-emerald-400' : b.driftScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {b.driftScore}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <SI className="w-3 h-3" style={{ color: s.color }} />
                  <span className="text-[10px]" style={{ color: s.color }}>{s.label.split(' — ')[0]}</span>
                  <span className="text-gray-600 text-[10px] ml-auto">{b.lastActive}</span>
                </div>
                {b.riskFlags.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] text-red-400">{b.riskFlags.length} flag{b.riskFlags.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Score legend */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Drift Score</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-gray-400">70-100: Highly engaged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-[10px] text-gray-400">50-69: Moderate interest</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-[10px] text-gray-400">0-49: Cooling or cold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brief panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Top stats bar */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className={`${stage.bg} rounded-xl p-4 border border-gray-800`}>
              <div className="flex items-center gap-2 mb-1">
                <StageIcon className="w-4 h-4" style={{ color: stage.color }} />
                <span className="text-xs text-gray-500">Stage</span>
              </div>
              <div className="text-sm font-bold" style={{ color: stage.color }}>{stage.label}</div>
            </div>
            <div className={`${driftBg} rounded-xl p-4 border border-gray-800`}>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className={`w-4 h-4 ${driftColor}`} />
                <span className="text-xs text-gray-500">Drift Score</span>
              </div>
              <div className={`text-2xl font-bold ${driftColor}`}>{buyer.driftScore}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-500">Sessions</span>
              </div>
              <div className="text-2xl font-bold text-white">{buyer.sessions}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-500">Time on Site</span>
              </div>
              <div className="text-2xl font-bold text-white">{buyer.totalDwellTime}m</div>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {buyer.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{buyer.name}</div>
                  <div className="text-gray-500 text-xs">{buyer.familySize} | {buyer.financing} buyer</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 text-xs">
                  <Phone className="w-3 h-3 mr-1" /> Call
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 text-xs">
                  <Mail className="w-3 h-3 mr-1" /> Email
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Budget: ${(buyer.priceRange.min / 1000000).toFixed(1)}M - ${(buyer.priceRange.max / 1000000).toFixed(1)}M</Badge>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">Favorite: Unit {buyer.favoriteUnit}</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Viewings: {buyer.viewingsAttended}/{buyer.viewingsBooked} attended</Badge>
            </div>
          </div>

          {/* Must-haves & objections */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
              <div className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Must-Haves
              </div>
              <div className="flex flex-wrap gap-1.5">
                {buyer.mustHaves.map((m) => (
                  <span key={m} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">{m}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
              <div className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Objections
              </div>
              <div className="flex flex-wrap gap-1.5">
                {buyer.objections.map((o) => (
                  <span key={o} className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-xs">{o}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Risk flags */}
          {buyer.riskFlags.length > 0 && (
            <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-4 mb-4">
              <div className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Risk Flags
              </div>
              <div className="space-y-1.5">
                {buyer.riskFlags.map((flag) => (
                  <div key={flag} className="flex items-center gap-2 text-xs text-red-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {flag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested approach */}
          <div className="bg-purple-500/5 rounded-xl border border-purple-500/20 p-4 mb-4">
            <div className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Suggested Approach
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{buyer.suggestedApproach}</p>
          </div>

          {/* Next action */}
          <div className="bg-blue-500/5 rounded-xl border border-blue-500/20 p-4 mb-4">
            <div className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> Recommended Next Action
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{buyer.nextAction}</p>
          </div>

          {/* Recent activity */}
          <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
            <div className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
            </div>
            <div className="space-y-2">
              {buyer.recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white">{act.action}</div>
                    <div className="text-[10px] text-gray-500">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
