import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, CheckCircle, BarChart3, TrendingUp,
  Users, DollarSign, Home, Clock, PieChart, Activity, ArrowRight,
  Mail, Printer, Copy, Check, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  included: boolean;
}

const REPORT_SECTIONS: ReportSection[] = [
  { id: 'exec-summary', title: 'Executive Summary', icon: <FileText className="w-4 h-4" />, description: 'Project overview, key metrics, and headline findings', included: true },
  { id: 'financial', title: 'Financial Performance', icon: <DollarSign className="w-4 h-4" />, description: 'Revenue, costs, margins, and ROI analysis', included: true },
  { id: 'sales-velocity', title: 'Sales Velocity & Absorption', icon: <TrendingUp className="w-4 h-4" />, description: 'Unit sales rate, inventory turnover, time-to-sell', included: true },
  { id: 'buyer-insights', title: 'Buyer Demographics & Insights', icon: <Users className="w-4 h-4" />, description: 'Buyer profiles, engagement scores, conversion funnel', included: true },
  { id: 'competitive', title: 'Competitive Positioning', icon: <Activity className="w-4 h-4" />, description: 'Market comparison, pricing index, differentiation', included: false },
  { id: 'risk-assessment', title: 'Risk Assessment', icon: <BarChart3 className="w-4 h-4" />, description: 'Settlement risk, engagement decay, contingency plans', included: false },
  { id: 'projections', title: '12-Month Projections', icon: <PieChart className="w-4 h-4" />, description: 'Revenue forecast, absorption model, scenario analysis', included: true },
  { id: 'sustainability', title: 'Sustainability Scorecard', icon: <Home className="w-4 h-4" />, description: 'Green star rating, energy performance, carbon offset', included: false },
];

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly';
  audience: string;
}

const TEMPLATES: ReportTemplate[] = [
  { id: 'board', name: 'Board Report', description: 'High-level strategic overview for board members', sections: ['exec-summary', 'financial', 'projections', 'risk-assessment'], frequency: 'monthly', audience: 'Board of Directors' },
  { id: 'investor', name: 'Investor Update', description: 'Financial performance and returns for investors', sections: ['exec-summary', 'financial', 'sales-velocity', 'projections'], frequency: 'quarterly', audience: 'Investors' },
  { id: 'sales', name: 'Sales War Room', description: 'Daily sales metrics and buyer intelligence for sales teams', sections: ['sales-velocity', 'buyer-insights', 'competitive'], frequency: 'weekly', audience: 'Sales Team' },
  { id: 'marketing', name: 'Marketing Performance', description: 'Campaign results, lead quality, and brand metrics', sections: ['buyer-insights', 'competitive', 'projections'], frequency: 'monthly', audience: 'Marketing Team' },
  { id: 'full', name: 'Comprehensive Audit', description: 'Complete project audit with all sections', sections: REPORT_SECTIONS.map(s => s.id), frequency: 'one-time', audience: 'All Stakeholders' },
];

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [sections, setSections] = useState<ReportSection[]>(REPORT_SECTIONS);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, included: !s.included } : s));
  };

  const applyTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setSections(prev => prev.map(s => ({ ...s, included: template.sections.includes(s.id) })));
  };

  const includedCount = sections.filter(s => s.included).length;

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://oneaxis.live/reports/rpt-' + Date.now());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Stakeholder Report Generator</h2>
            <p className="text-gray-400 text-sm">One-click infographic reports with projections and KPIs</p>
          </div>
        </div>
      </div>

      {!generated ? (
        <div className="space-y-6">
          {/* Templates */}
          <div>
            <h3 className="text-sm text-white font-medium mb-3">Start from Template</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className={`glass-panel rounded-xl p-4 text-left transition-all border ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">{template.name}</span>
                    {selectedTemplate?.id === template.id && <CheckCircle className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400 capitalize">{template.frequency}</span>
                    <span className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400">{template.sections.length} sections</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-white font-medium">Report Sections</h3>
              <span className="text-xs text-gray-500">{includedCount} of {sections.length} selected</span>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    section.included
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-gray-700 bg-gray-800/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    section.included ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
                  }`}>
                    {section.included && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">{section.icon}</span>
                      <span className="text-sm text-white">{section.title}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{section.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-500"
              onClick={handleGenerate}
              disabled={generating || includedCount === 0}
            >
              {generating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => { setSelectedTemplate(null); setSections(REPORT_SECTIONS); }}
            >
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Success header */}
            <div className="glass-panel rounded-xl p-5 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Report Generated</h3>
                  <p className="text-xs text-gray-400">{includedCount} sections • {selectedTemplate?.name || 'Custom'} • {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Report preview cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">$42.8M</div>
                  <div className="text-[10px] text-gray-500">Project Value</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">68%</div>
                  <div className="text-[10px] text-gray-500">Sold / Reserved</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">847</div>
                  <div className="text-[10px] text-gray-500">Buyer Engagements</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">4.2mo</div>
                  <div className="text-[10px] text-gray-500">Avg. Settlement</div>
                </div>
              </div>

              {/* Mini charts */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-2">Revenue vs. Forecast</div>
                  <div className="flex items-end gap-1 h-16">
                    {[65, 72, 68, 85, 90, 88, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full bg-blue-500/40 rounded-t" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-600 mt-1">
                    <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-2">Unit Sales by Type</div>
                  <div className="space-y-2">
                    {[
                      { label: '2-Bed', value: 45, color: 'bg-blue-500' },
                      { label: '3-Bed', value: 32, color: 'bg-emerald-500' },
                      { label: 'Penthouse', value: 15, color: 'bg-purple-500' },
                      { label: 'Studio', value: 8, color: 'bg-amber-500' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-16">{item.label}</span>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 w-6 text-right">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300" onClick={handleCopyLink}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => setShowEmailInput(!showEmailInput)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>

              {showEmailInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    placeholder="Enter email addresses, separated by commas"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                    <SendIcon className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Section summary */}
            <div className="glass-panel rounded-xl p-4">
              <h4 className="text-sm text-white font-medium mb-3">Included Sections</h4>
              <div className="space-y-2">
                {sections.filter(s => s.included).map((section, i) => (
                  <div key={section.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-medium">
                      {i + 1}
                    </div>
                    <span className="text-gray-400">{section.icon}</span>
                    <span className="text-sm text-gray-300">{section.title}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300"
              onClick={() => { setGenerated(false); setShowEmailInput(false); }}
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Generate Another Report
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  );
}
