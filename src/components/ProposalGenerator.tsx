import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, Eye, Share2, Copy, Check,
  ChevronRight, Building2, DollarSign, Clock,
  X, Globe, Lock, Mail, Send, TrendingUp, Star,
  LayoutGrid, List, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

export default function ProposalGenerator({ onClose }: { onClose: () => void }) {
  const { projects, activeProjectId } = useStore();
  const project = projects.find(p => p.id === activeProjectId);
  const [step, setStep] = useState<'configure' | 'preview' | 'share'>('configure');
  const [copied, setCopied] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  const [config, setConfig] = useState({
    title: `${project?.name} — Interactive Proposal`,
    subtitle: 'Explore, configure, and reserve your unit in real-time',
    include3D: true,
    includeStackPlan: true,
    includePricing: true,
    includeBOM: false,
    includeTimeline: true,
    includeTestimonials: true,
    branding: 'oneaxis', // 'oneaxis' | 'white-label'
    access: 'anyone', // 'anyone' | 'password' | 'email'
    password: '',
    expiryDays: 30,
    allowComments: true,
    allowDownload: true,
    accentColor: '#3b82f6',
    coverImage: '3d', // '3d' | 'stack' | 'none'
  });

  const proposalUrl = `https://proposals.oneaxis.live/p/${activeProjectId}?v=${Date.now()}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(proposalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendProposal = () => {
    setProposalSent(true);
    setTimeout(() => setProposalSent(false), 3000);
  };

  const availableUnits = project?.units.filter(u => u.status === 'available').length || 0;
  const totalValue = project?.units.reduce((a, u) => a + u.price, 0) || 0;

  const testimonials = [
    { name: 'Ahmed Al-Rashid', role: 'CEO, Azure Developments', text: 'OneAxis helped us sell 40% of units before construction even started.', rating: 5 },
    { name: 'Sarah Chen', role: 'Investment Director', text: 'The interactive proposals made our decision process 10x faster.', rating: 5 },
  ];

  const proposalSections = [
    { key: 'include3D', label: '3D Interactive Model', icon: <Eye className="w-4 h-4" />, desc: 'Explorable 3D building with unit selection' },
    { key: 'includeStackPlan', label: 'Stack Plan', icon: <LayoutGrid className="w-4 h-4" />, desc: 'Floor-by-floor unit availability map' },
    { key: 'includePricing', label: 'Dynamic Pricing', icon: <DollarSign className="w-4 h-4" />, desc: 'Live price updates with customization' },
    { key: 'includeTimeline', label: 'Project Timeline', icon: <Clock className="w-4 h-4" />, desc: 'Construction phases and delivery dates' },
    { key: 'includeBOM', label: 'Material Specifications', icon: <List className="w-4 h-4" />, desc: 'Detailed finish and material catalog' },
    { key: 'includeTestimonials', label: 'Client Testimonials', icon: <Star className="w-4 h-4" />, desc: 'Social proof from past clients' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Proposal Generator</h2>
            <p className="text-xs text-gray-400">Create shareable interactive proposals</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex border-b border-gray-800">
        {[
          { key: 'configure', label: 'Configure', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { key: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
          { key: 'share', label: 'Share', icon: <Share2 className="w-3.5 h-3.5" /> },
        ].map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(s.key as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
              step === s.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === s.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'
            }`}>
              {i + 1}
            </div>
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: CONFIGURE */}
          {step === 'configure' && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto scrollbar-thin p-6"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Proposal Title</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Subtitle</label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>

                {/* Sections */}
                <div>
                  <label className="text-sm text-gray-300 font-medium mb-3 block">Include Sections</label>
                  <div className="space-y-2">
                    {proposalSections.map(section => (
                      <label
                        key={section.key}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          config[section.key as keyof typeof config] as boolean
                            ? 'border-blue-500/50 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-800/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          config[section.key as keyof typeof config] as boolean ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">{section.label}</div>
                          <div className="text-xs text-gray-500">{section.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={config[section.key as keyof typeof config] as boolean}
                          onChange={(e) => setConfig({ ...config, [section.key]: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Access Settings */}
                <div>
                  <label className="text-sm text-gray-300 font-medium mb-3 block">Access Control</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'anyone', label: 'Anyone with link', icon: <Globe className="w-4 h-4" /> },
                      { key: 'password', label: 'Password protected', icon: <Lock className="w-4 h-4" /> },
                      { key: 'email', label: 'Email invitation', icon: <Mail className="w-4 h-4" /> },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setConfig({ ...config, access: opt.key })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all ${
                          config.access === opt.key ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branding */}
                <div>
                  <label className="text-sm text-gray-300 font-medium mb-3 block">Branding</label>
                  <div className="flex gap-2">
                    {[
                      { key: 'oneaxis', label: 'OneAxis branded' },
                      { key: 'white-label', label: 'White-label' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setConfig({ ...config, branding: opt.key })}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                          config.branding === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6" onClick={() => setStep('preview')}>
                  Preview Proposal
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto scrollbar-thin bg-gray-950"
            >
              {/* Proposal Preview */}
              <div className="max-w-3xl mx-auto bg-[#0a0e1a] min-h-full">
                {/* Cover */}
                <div className="relative h-64 bg-gradient-to-br from-blue-950 via-gray-900 to-cyan-950 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500 rounded-full blur-3xl" />
                  </div>
                  <div className="relative z-10 text-center px-6">
                    {config.branding === 'oneaxis' && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm text-gray-400">OneAxis Interactive Proposal</span>
                      </div>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{config.title}</h1>
                    <p className="text-gray-400 text-sm">{config.subtitle}</p>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-800">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{project?.units.length}</div>
                    <div className="text-xs text-gray-500">Total Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-400">{availableUnits}</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">${(totalValue / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-gray-500">Total Value</div>
                  </div>
                </div>

                {/* 3D Preview Placeholder */}
                {config.include3D && (
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      Interactive 3D Model
                    </h3>
                    <div className="aspect-video bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
                      <div className="relative z-10 text-center">
                        <Building2 className="w-12 h-12 text-blue-500/30 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Click to explore the full 3D model</p>
                        <p className="text-gray-600 text-xs mt-1">Orbit, zoom, and select units</p>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-blue-600/20 text-blue-400 border-blue-500/30">
                        Interactive
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Stack Plan Preview */}
                {config.includeStackPlan && (
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-blue-400" />
                      Stack Plan
                    </h3>
                    <div className="space-y-1.5">
                      {Array.from({ length: 8 }, (_, i) => {
                        const floor = 12 - i;
                        const floorUnits = project?.units.filter(u => u.floor === floor) || [];
                        return (
                          <div key={floor} className="flex items-center gap-2">
                            <span className="w-6 text-xs text-gray-500 text-right">{floor}</span>
                            <div className="flex-1 flex gap-1">
                              {floorUnits.slice(0, 4).map((unit, ui) => (
                                <div
                                  key={ui}
                                  className={`flex-1 h-8 rounded flex items-center justify-center text-[10px] font-medium ${
                                    unit.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    unit.status === 'sold' ? 'bg-gray-700/50 text-gray-500' :
                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  }`}
                                >
                                  {unit.unitNumber}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                {config.includePricing && (
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      Pricing Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {project?.units.slice(0, 4).map(unit => (
                        <div key={unit.id} className="glass-panel rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white font-medium">Unit {unit.unitNumber}</span>
                            <Badge className={`text-[10px] ${unit.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                              {unit.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{unit.type} • {unit.area} m²</div>
                          <div className="text-lg font-bold text-white">${(unit.price / 1000).toFixed(0)}K</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {config.includeTimeline && (
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Project Timeline
                    </h3>
                    <div className="space-y-3">
                      {[
                        { phase: 'Foundation', date: 'Jun 2025', status: 'complete' },
                        { phase: 'Structure', date: 'Sep 2025', status: 'complete' },
                        { phase: 'Facade', date: 'Dec 2025', status: 'in-progress' },
                        { phase: 'Interior', date: 'Mar 2026', status: 'pending' },
                        { phase: 'Handover', date: 'Jun 2026', status: 'pending' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            item.status === 'complete' ? 'bg-emerald-400' :
                            item.status === 'in-progress' ? 'bg-blue-400 animate-pulse' :
                            'bg-gray-700'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm text-white">{item.phase}</div>
                          </div>
                          <div className="text-xs text-gray-500">{item.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonials */}
                {config.includeTestimonials && (
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Client Stories
                    </h3>
                    <div className="space-y-3">
                      {testimonials.map((t, i) => (
                        <div key={i} className="glass-panel rounded-lg p-4">
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: t.rating }, (_, ri) => (
                              <Star key={ri} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-gray-300 mb-2">"{t.text}"</p>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                              {t.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-xs text-white font-medium">{t.name}</div>
                              <div className="text-[10px] text-gray-500">{t.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="p-6 text-center">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg">
                    Reserve Your Unit
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-gray-500 mt-3">Prices subject to availability. Reserve to lock in pricing.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SHARE */}
          {step === 'share' && (
            <motion.div
              key="share"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col items-center justify-center p-6"
            >
              <div className="max-w-md w-full space-y-6">
                {/* URL */}
                <div className="glass-panel rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Shareable Link
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400 truncate font-mono">
                      {proposalUrl}
                    </div>
                    <Button onClick={copyUrl} size="sm" className={copied ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Expires in {config.expiryDays} days
                    {config.access === 'password' && (
                      <>
                        <span className="mx-1">•</span>
                        <Lock className="w-3 h-3" />
                        Password protected
                      </>
                    )}
                  </div>
                </div>

                {/* Send via Email */}
                <div className="glass-panel rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Send via Email
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="client@example.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600"
                    />
                    <textarea
                      placeholder="Optional message..."
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 resize-none"
                    />
                    <Button
                      className={`w-full ${proposalSent ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-500'} text-white`}
                      onClick={sendProposal}
                    >
                      {proposalSent ? <><Check className="w-4 h-4 mr-2" /> Sent!</> : <><Send className="w-4 h-4 mr-2" /> Send Proposal</>}
                    </Button>
                  </div>
                </div>

                {/* Analytics Preview */}
                <div className="glass-panel rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Proposal Analytics
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">0</div>
                      <div className="text-[10px] text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">0</div>
                      <div className="text-[10px] text-gray-500">Unique</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">0m</div>
                      <div className="text-[10px] text-gray-500">Avg Time</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300" onClick={() => setStep('configure')}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Edit Proposal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        {step !== 'configure' && (
          <Button variant="ghost" className="text-gray-400" onClick={() => setStep(step === 'preview' ? 'configure' : 'preview')}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        {step === 'configure' && (
          <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setStep('preview')}>
            Preview
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {step === 'preview' && (
          <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setStep('share')}>
            Publish & Share
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
