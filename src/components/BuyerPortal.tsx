import { useState } from 'react';
import {
  Home, Calendar, FileText, MessageSquare, Bell,
  CheckCircle2, AlertTriangle, Bed, Bath,
  Maximize, MapPin, Phone, Mail,
  Shield, CreditCard, Download
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/* ═══════════════════════════════════════════
   BUYER PORTAL — End-Customer Stakeholder View
   ═══════════════════════════════════════════ */

const milestones = [
  { id: '1', title: 'Reservation Confirmed', date: '15 Jan 2026', status: 'completed', icon: CheckCircle2 },
  { id: '2', title: 'Contract of Sale Signed', date: '28 Jan 2026', status: 'completed', icon: FileText },
  { id: '3', title: 'Deposit Paid (10%)', date: '5 Feb 2026', status: 'completed', icon: CreditCard },
  { id: '4', title: 'Finance Approval', date: 'Pending', status: 'in-progress', icon: Shield },
  { id: '5', title: 'Pre-Settlement Inspection', date: '15 Nov 2026', status: 'upcoming', icon: Home },
  { id: '6', title: 'Settlement Day', date: '30 Nov 2026', status: 'upcoming', icon: CheckCircle2 },
];

const documents = [
  { id: '1', name: 'Contract of Sale', type: 'pdf', status: 'signed', date: '28 Jan 2026' },
  { id: '2', name: 'Floor Plan — Unit 12C', type: 'pdf', status: 'available', date: '20 Jan 2026' },
  { id: '3', name: 'Section 32 Statement', type: 'pdf', status: 'available', date: '15 Jan 2026' },
  { id: '4', name: 'Building Insurance Cert', type: 'pdf', status: 'pending', date: '—' },
  { id: '5', name: 'Kitchen Selection Guide', type: 'pdf', status: 'action-required', date: 'Due 15 Jul' },
];

const messages = [
  { id: '1', from: 'Alex Morgan', fromRole: 'Project Manager', content: 'Your kitchen upgrade to Italian walnut has been confirmed. Installation scheduled for September.', time: '2 hours ago', read: true },
  { id: '2', from: 'Sarah Chen', fromRole: 'Sales Agent', content: 'Reminder: Please submit your finance approval by end of month to avoid delays.', time: '1 day ago', read: false },
  { id: '3', from: 'OneAxis AI', fromRole: 'Assistant', content: 'Construction Update: Level 12 slab pour completed ahead of schedule. Your floor is next.', time: '3 days ago', read: true },
];

export default function BuyerPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'messages'>('overview');

  const tabs = [
    { id: 'overview', label: 'My Unit', icon: Home },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="h-full bg-[#0a0e1a] text-white overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Buyer Portal</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active Buyer</Badge>
            </div>
            <h2 className="text-xl font-bold">Welcome back, Sarah</h2>
            <p className="text-sm text-gray-400">Unit 12C, Azure Heights Tower — Level 12</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center">{messages.filter((m) => !m.read).length}</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-all flex-1 justify-center ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Unit Card */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-400" /> My Unit Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Bed, label: 'Bedrooms', value: '2', color: 'blue' },
                  { icon: Bath, label: 'Bathrooms', value: '2', color: 'purple' },
                  { icon: Maximize, label: 'Area', value: '94m²', color: 'emerald' },
                  { icon: MapPin, label: 'View', value: 'Harbour', color: 'amber' },
                ].map((item) => (
                  <div key={item.label} className={`bg-${item.color}-500/5 border border-${item.color}-500/20 rounded-lg p-3 text-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-400 mx-auto mb-1`} />
                    <div className="text-lg font-bold">{item.value}</div>
                    <div className="text-[10px] text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settlement Countdown */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Settlement in</div>
                  <div className="text-3xl font-bold">147 <span className="text-lg text-gray-400">days</span></div>
                  <div className="text-xs text-gray-500 mt-1">Target: 30 November 2026</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Progress</div>
                  <div className="text-2xl font-bold text-emerald-400">50%</div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full mt-2">
                    <div className="w-1/2 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Documents</span>
                </div>
                <div className="text-2xl font-bold">{documents.filter((d) => d.status === 'signed' || d.status === 'available').length}<span className="text-sm text-gray-500">/{documents.length}</span></div>
                <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 1 action required
                </div>
              </div>
              <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Messages</span>
                </div>
                <div className="text-2xl font-bold">{messages.filter((m) => !m.read).length}<span className="text-sm text-gray-500"> unread</span></div>
                <div className="text-xs text-gray-500 mt-1">Last: 2 hours ago</div>
              </div>
            </div>

            {/* Agent Contact */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Your Sales Agent</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">SC</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Sarah Chen</div>
                  <div className="text-xs text-gray-500">Stedaxis Development</div>
                </div>
                <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"><Phone className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"><Mail className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    m.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-500'
                  }`}>
                    <m.icon className="w-4 h-4" />
                  </div>
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-gray-700 my-1" />}
                </div>
                <div className={`pb-6 flex-1 ${m.status === 'upcoming' ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{m.title}</h4>
                    {m.status === 'in-progress' && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px]">In Progress</Badge>}
                    {m.status === 'completed' && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px]">Done</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors">
                <FileText className={`w-5 h-5 ${doc.status === 'action-required' ? 'text-amber-400' : doc.status === 'signed' ? 'text-emerald-400' : 'text-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.date}</div>
                </div>
                {doc.status === 'action-required' && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px]">Action Required</Badge>}
                {doc.status === 'signed' && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px]">Signed</Badge>}
                <button className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-4 rounded-xl border transition-colors ${
                !msg.read ? 'bg-blue-500/5 border-blue-500/20' : 'bg-gray-800/40 border-gray-700'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {msg.from.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {msg.from}
                      {!msg.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <div className="text-xs text-gray-500">{msg.fromRole} · {msg.time}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
