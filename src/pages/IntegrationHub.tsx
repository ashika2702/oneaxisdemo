import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Calendar, FileText,
  Globe, Code, ArrowLeft, ChevronRight, CheckCircle,
  Settings, Database, Lock, Zap,
  ExternalLink, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ────────────────────────────────────────────────
   INTEGRATION HUB
   Central dashboard for all integrations:
   CRM, WhatsApp, API, Portal Sync, Calendar,
   Document, and Security settings.
   ──────────────────────────────────────────── */

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  category: string;
  route?: string;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: 'crm',
    name: 'CRM Sync',
    description: 'Connect Salesforce or HubSpot to sync leads, contacts, and deals automatically.',
    icon: <Database className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Sales',
    route: '/integrations/crm',
    features: ['Bidirectional sync', 'Lead auto-import', 'Deal tracking', 'Activity logging'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Capture leads via WhatsApp. Auto-reply, send updates, and close deals in chat.',
    icon: <MessageCircle className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Sales',
    route: '/integrations/whatsapp',
    features: ['Lead capture', 'Auto-reply templates', 'Unit catalog sharing', 'Appointment booking'],
  },
  {
    id: 'portals',
    name: 'Property Portals',
    description: 'Sync listings to Property Finder, Bayut, Dubizzle automatically.',
    icon: <Globe className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Sales',
    route: '/integrations/portals',
    features: ['Auto-publish listings', 'Price sync', 'Status sync', 'Photo upload'],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Google Calendar and Outlook integration for site visit scheduling.',
    icon: <Calendar className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Productivity',
    features: ['Site visit booking', 'Reminder notifications', 'Availability check', 'Team scheduling'],
  },
  {
    id: 'documents',
    name: 'Document Signing',
    description: 'Digital signatures for SPAs, reservation forms, and handoff documents.',
    icon: <FileText className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Productivity',
    features: ['E-signature collection', 'SPA generation', 'Audit trail', 'PDF export'],
  },
  {
    id: 'payment',
    name: 'Payment Gateway',
    description: 'Collect reservation deposits and installments via Stripe and regional gateways.',
    icon: <Zap className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Finance',
    features: ['Reservation deposits', 'Installment plans', 'Receipt generation', 'Refund handling'],
  },
  {
    id: 'api',
    name: 'Developer API',
    description: 'Full REST API access for custom integrations, webhooks, and third-party apps.',
    icon: <Code className="w-5 h-5" />,
    status: 'connected',
    category: 'Developer',
    route: '/developers',
    features: ['REST API', 'Webhooks', 'SDK', 'Rate limiting'],
  },
  {
    id: 'embed',
    name: 'Embed Widget',
    description: 'Generate embed codes for client websites with customizable styling.',
    icon: <ExternalLink className="w-5 h-5" />,
    status: 'connected',
    category: 'Developer',
    features: ['Script tag embed', 'iFrame embed', 'Custom theming', 'White-label option'],
  },
  {
    id: 'security',
    name: 'SSO & Security',
    description: 'SAML 2.0, OAuth 2.0, and role-based access control for enterprise teams.',
    icon: <Lock className="w-5 h-5" />,
    status: 'disconnected',
    category: 'Security',
    features: ['SAML SSO', 'OAuth 2.0', 'Role-based access', 'Audit logs'],
  },
];

export default function IntegrationHub() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(integrations.map((i) => i.category)))];
  const filtered = filter === 'all' ? integrations : integrations.filter((i) => i.category === filter);
  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold">Integrations</h1>
              <p className="text-gray-500 text-xs">Connect your tools to OneAxis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium">
              {connectedCount} of {integrations.length} connected
            </div>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${
                    filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((integration) => {
            const isExpanded = expandedId === integration.id;
            return (
              <motion.div
                key={integration.id}
                layout
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {integration.icon}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                      integration.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' :
                      integration.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {integration.status === 'connected' && <CheckCircle className="w-3 h-3" />}
                      {integration.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {integration.status === 'disconnected' && <Settings className="w-3 h-3" />}
                      {integration.status}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{integration.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{integration.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {integration.features.slice(0, 2).map((f) => (
                      <span key={f} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{f}</span>
                    ))}
                    {integration.features.length > 2 && (
                      <span className="text-[10px] text-gray-500 px-1">+{integration.features.length - 2}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {integration.route ? (
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-gray-700 hover:bg-gray-800" onClick={() => navigate(integration.route!)}>
                        Configure <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-gray-700 hover:bg-gray-800" onClick={() => setExpandedId(isExpanded ? null : integration.id)}>
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </Button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                        <div className="space-y-2 mb-3">
                          {integration.features.map((f) => (
                            <div key={f} className="flex items-center gap-2 text-xs text-gray-400">
                              <CheckCircle className="w-3 h-3 text-blue-400" /> {f}
                            </div>
                          ))}
                        </div>
                        <Button size="sm" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-500" onClick={() => { /* Connect flow */ }}>
                          {integration.status === 'connected' ? 'Disconnect' : 'Connect Integration'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* API Quick Reference */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">Quick API Reference</h3>
          </div>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-[11px] text-gray-400 overflow-x-auto">
            <div className="text-blue-400">GET <span className="text-gray-500">/api/v1/projects</span> <span className="text-emerald-400">List all projects</span></div>
            <div className="text-blue-400 mt-1">GET <span className="text-gray-500">/api/v1/projects/{'{id}'}</span> <span className="text-emerald-400">Get project details</span></div>
            <div className="text-blue-400 mt-1">GET <span className="text-gray-500">/api/v1/projects/{'{id}'}/units</span> <span className="text-emerald-400">List project units</span></div>
            <div className="text-blue-400 mt-1">POST <span className="text-gray-500">/api/v1/leads</span> <span className="text-emerald-400">Create lead</span></div>
            <div className="text-blue-400 mt-1">POST <span className="text-gray-500">/api/v1/reservations</span> <span className="text-emerald-400">Create reservation</span></div>
          </div>
          <Button size="sm" variant="outline" className="mt-3 border-gray-700 text-gray-400 text-xs" onClick={() => navigate('/developers')}>
            <ExternalLink className="w-3 h-3 mr-1" /> Full API Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}
