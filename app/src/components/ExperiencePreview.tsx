import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Monitor, Tablet, Smartphone, Eye, Building2, TrendingUp,
  FileText, BarChart3, Bell, Home, User,
  Clock, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';
type Persona = 'buyer' | 'agent' | 'investor';

export default function ExperiencePreview({ open, onClose }: Props) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [persona, setPersona] = useState<Persona>('buyer');
  const [previewTab, setPreviewTab] = useState('overview');

  const viewportWidths: Record<Viewport, string> = {
    desktop: 'w-full max-w-5xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  const personaConfig = {
    buyer: {
      name: 'Sarah Chen',
      role: 'Buyer — Unit 12C',
      color: 'blue',
      visibleModules: ['overview', 'timeline', 'documents', 'messages'],
      hiddenNotice: 'Pricing details and sales analytics are hidden for buyers.',
    },
    agent: {
      name: 'Marcus Johnson',
      role: 'External Sales Agent',
      color: 'purple',
      visibleModules: ['overview', 'pricing', 'analytics', 'documents', 'messages'],
      hiddenNotice: 'Full platform data except financial projections and audit logs.',
    },
    investor: {
      name: 'David Park',
      role: 'Portfolio Investor',
      color: 'emerald',
      visibleModules: ['overview', 'analytics', 'financials', 'documents'],
      hiddenNotice: 'Full analytics and financials. Sales tools and unit reservations hidden.',
    },
  };

  const config = personaConfig[persona];

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0f1629] border border-gray-700 rounded-2xl overflow-hidden flex flex-col max-h-[90vh] w-full max-w-6xl"
        >
          {/* Preview Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Eye className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Experience Preview</h3>
              <div className="h-4 w-px bg-gray-700" />
              {/* Persona Selector */}
              <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5">
                {([
                  { key: 'buyer', label: 'End-Customer', icon: User },
                  { key: 'agent', label: 'Agent', icon: Building2 },
                  { key: 'investor', label: 'Investor', icon: TrendingUp },
                ] as { key: Persona; label: string; icon: any }[]).map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
                      persona === p.key
                        ? `bg-${config.color}-500/20 text-${config.color}-400`
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <p.icon className="w-3 h-3" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Viewport Selector */}
              <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5">
                {([
                  { key: 'desktop', icon: Monitor },
                  { key: 'tablet', icon: Tablet },
                  { key: 'mobile', icon: Smartphone },
                ] as { key: Viewport; icon: any }[]).map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setViewport(v.key)}
                    className={`p-1.5 rounded transition-all ${
                      viewport === v.key ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <v.icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Body */}
          <div className="flex-1 overflow-hidden flex">
            {/* Simulated Portal */}
            <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-[#0a0e1a]">
              <div className={`${viewportWidths[viewport]} transition-all duration-300`}>
                {/* Mock Stakeholder Portal */}
                <div className="bg-[#0f1629] border border-gray-800 rounded-xl overflow-hidden">
                  {/* Portal Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-${config.color}-500/20 flex items-center justify-center`}>
                        <Building2 className={`w-4 h-4 text-${config.color}-400`} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Azure Heights Tower</div>
                        <div className="text-[10px] text-gray-500">Stedaxis Development</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-white font-medium">{config.name}</div>
                        <div className="text-[10px] text-gray-500">{config.role}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-${config.color}-500/20 flex items-center justify-center text-xs font-bold text-${config.color}-400`}>
                        {config.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    </div>
                  </div>

                  {/* Portal Nav */}
                  <div className="flex border-b border-gray-800 px-5 overflow-x-auto">
                    {[
                      { id: 'overview', label: 'Overview', icon: Home },
                      ...(config.visibleModules.includes('timeline') ? [{ id: 'timeline', label: 'Timeline', icon: Clock }] : []),
                      ...(config.visibleModules.includes('pricing') ? [{ id: 'pricing', label: 'Pricing', icon: BarChart3 }] : []),
                      ...(config.visibleModules.includes('analytics') ? [{ id: 'analytics', label: 'Analytics', icon: TrendingUp }] : []),
                      ...(config.visibleModules.includes('financials') ? [{ id: 'financials', label: 'Financials', icon: TrendingUp }] : []),
                      ...(config.visibleModules.includes('documents') ? [{ id: 'documents', label: 'Documents', icon: FileText }] : []),
                      ...(config.visibleModules.includes('messages') ? [{ id: 'messages', label: 'Messages', icon: Bell }] : []),
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setPreviewTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                          previewTab === tab.id
                            ? `border-${config.color}-500 text-${config.color}-400`
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Portal Content */}
                  <div className="p-5 min-h-[300px]">
                    {previewTab === 'overview' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Total Units', value: '48', color: config.color },
                            { label: 'Available', value: '29', color: 'emerald' },
                            { label: 'Your Unit', value: '12C', color: config.color },
                          ].map((stat) => (
                            <div key={stat.label} className={`bg-${stat.color}-500/5 border border-${stat.color}-500/20 rounded-lg p-3`}>
                              <div className="text-[10px] text-gray-500 uppercase">{stat.label}</div>
                              <div className={`text-xl font-bold text-${stat.color}-400 mt-1`}>{stat.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-white mb-2">Project Status</h4>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-gray-300">Foundation complete. Level 5 construction in progress.</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {previewTab === 'timeline' && (
                      <div className="space-y-3">
                        {[
                          { phase: 'Foundation', status: 'complete', date: 'Jan 2026' },
                          { phase: 'Level 1-5', status: 'complete', date: 'Mar 2026' },
                          { phase: 'Level 6-10', status: 'in-progress', date: 'Jun 2026' },
                          { phase: 'Level 11-15', status: 'pending', date: 'Sep 2026' },
                          { phase: 'Handover', status: 'pending', date: 'Dec 2026' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              item.status === 'complete' ? 'bg-emerald-500' :
                              item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-600'
                            }`} />
                            <span className="text-sm text-white flex-1">{item.phase}</span>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {previewTab === 'pricing' && persona !== 'buyer' && (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-300">Unit pricing visible for agents only.</div>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500">Type A — 1 Bedroom</span>
                            <span className="text-white">$485,000</span>
                          </div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500">Type B — 2 Bedroom</span>
                            <span className="text-white">$720,000</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Type C — 3 Bedroom</span>
                            <span className="text-white">$1,050,000</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {previewTab === 'analytics' && (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-300">Sales velocity and market position.</div>
                        <div className="bg-gray-800/30 rounded-lg p-4 h-32 flex items-end gap-2">
                          {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-purple-500/30 rounded-t" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    {previewTab === 'documents' && (
                      <div className="space-y-2">
                        {[
                          { name: 'Floor_Plan_Unit_12C.pdf', size: '2.4 MB' },
                          { name: 'Contract_of_Sale.pdf', size: '1.8 MB' },
                          { name: 'Project_Brochure.pdf', size: '5.2 MB' },
                        ].map((doc) => (
                          <div key={doc.name} className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-xs text-white">{doc.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{doc.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {previewTab === 'messages' && (
                      <div className="space-y-3">
                        <div className="bg-gray-800/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400">AM</div>
                            <span className="text-xs text-white font-medium">Alex Morgan</span>
                            <span className="text-[10px] text-gray-500">2 hours ago</span>
                          </div>
                          <p className="text-xs text-gray-300">Your kitchen upgrade selection has been confirmed. The Italian walnut finish will be applied.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden Elements Notice */}
                <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-amber-400">Hidden from this persona</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{config.hiddenNotice}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
