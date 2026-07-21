import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MessageCircle, Phone, Send,
  CheckCircle, Settings, FileText,
  Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ────────────────────────────────────────────────
   WHATSAPP BUSINESS INTEGRATION
   WhatsApp API setup, auto-reply templates,
   lead capture forms, and conversation preview.
   Critical for UAE market where 90% of leads
   arrive via WhatsApp.
   ──────────────────────────────────────────── */

interface Template {
  id: string;
  name: string;
  trigger: string;
  content: string;
  active: boolean;
  language: string;
}

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'lead' | 'hot' | 'closed';
}

export default function WhatsAppIntegration() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [phoneNumber] = useState('+971 50 123 4567');
  const [activeTab, setActiveTab] = useState<'setup' | 'templates' | 'conversations'>('setup');
  const [copied, setCopied] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', name: 'Welcome Message', trigger: 'First contact', content: 'Thank you for your interest in {{project_name}}! I can help you explore available units, pricing, and book a site visit. What would you like to know?', active: true, language: 'en' },
    { id: '2', name: 'Unit Availability', trigger: 'Asks about units', content: 'We have {{available_count}} units available at {{project_name}}. Would you like me to share our interactive 3D catalog? You can explore every unit, view, and floor plan: {{catalog_link}}', active: true, language: 'en' },
    { id: '3', name: 'Site Visit Booking', trigger: 'Wants to visit', content: 'I would be happy to arrange a site visit for you. Our sales gallery is open Saturday-Thursday, 10 AM - 7 PM. What day works best for you?', active: true, language: 'en' },
    { id: '4', name: 'Arabic Welcome', trigger: 'First contact (AR)', content: 'شكراً لاهتمامكم بمشروع {{project_name}}! يمكنني مساعدتكم في استكشاف الوحدات المتاحة والأسعار وحجز زيارة للموقع. ما الذي تودون معرفته؟', active: true, language: 'ar' },
    { id: '5', name: 'Pricing Request', trigger: 'Asks about price', content: 'Here is the pricing for {{unit_type}} at {{project_name}}: Starting from {{price}}. This includes premium finishes and parking. Shall I reserve a unit for you?', active: false, language: 'en' },
  ]);

  const [conversations] = useState<Conversation[]>([
    { id: '1', name: 'Ahmed Al-Rashid', phone: '+971 55 234 5678', lastMessage: 'Can you share the 3BR unit prices?', time: '2 min ago', unread: 1, status: 'hot' },
    { id: '2', name: 'Sarah Chen', phone: '+971 50 876 5432', lastMessage: 'Booked site visit for Thursday 3pm', time: '15 min ago', unread: 0, status: 'lead' },
    { id: '3', name: 'Mohammed Al-Farsi', phone: '+971 56 345 6789', lastMessage: 'Thank you for the brochure', time: '1 hr ago', unread: 0, status: 'lead' },
    { id: '4', name: 'Fatima Al-Zahra', phone: '+971 54 987 6543', lastMessage: 'Interested in the penthouse unit', time: '3 hrs ago', unread: 2, status: 'hot' },
    { id: '5', name: 'Robert Johnson', phone: '+971 52 456 7890', lastMessage: 'Payment confirmed for reservation', time: '1 day ago', unread: 0, status: 'closed' },
  ]);

  const toggleTemplate = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, active: !t.active } : t));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=I'm%20interested%20in%20learning%20more`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors: Record<string, string> = {
    lead: 'bg-blue-500',
    hot: 'bg-amber-500',
    closed: 'bg-emerald-500',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/integrations')} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400"><MessageCircle className="w-5 h-5" /></div>
            <div>
              <h1 className="text-lg font-bold">WhatsApp Business</h1>
              <p className="text-gray-500 text-xs">Capture leads and close deals via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Connection Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{phoneNumber}</h3>
                <span className={`text-xs flex items-center gap-1 ${connected ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {connected ? <><CheckCircle className="w-3 h-3" /> Connected</> : 'Disconnected'}
                </span>
              </div>
            </div>
            <Button size="sm" className={`h-8 text-xs ${connected ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`} onClick={() => setConnected(!connected)}>
              {connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>

        {/* Quick Link */}
        {connected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Send className="w-4 h-4 text-green-400" /> WhatsApp Click-to-Chat Link</h4>
            <p className="text-gray-500 text-xs mb-2">Share this link anywhere to start WhatsApp conversations with leads.</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-950 rounded-lg px-3 py-2 text-xs text-gray-400 font-mono truncate">
                wa.me/{phoneNumber.replace(/\D/g, '')}?text=...
              </div>
              <Button size="sm" variant="outline" className="h-8 border-gray-700 text-xs" onClick={handleCopyLink}>
                {copied ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        {connected && (
          <div className="flex gap-1 mb-4 bg-gray-900 p-1 rounded-lg">
            {[
              { key: 'setup' as const, label: 'Setup', icon: <Settings className="w-3.5 h-3.5" /> },
              { key: 'templates' as const, label: 'Templates', icon: <FileText className="w-3.5 h-3.5" /> },
              { key: 'conversations' as const, label: 'Conversations', icon: <MessageCircle className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Setup Tab */}
        {connected && activeTab === 'setup' && (
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">Auto-Reply Settings</h4>
              <div className="space-y-2">
                {[
                  { label: 'Auto-reply to first message', desc: 'Send welcome template when someone messages first time', active: true },
                  { label: 'Auto-share catalog link', desc: 'Include interactive 3D catalog link in responses', active: true },
                  { label: 'Business hours auto-reply', desc: 'Send "We will respond during business hours" outside hours', active: false },
                  { label: 'Lead capture form', desc: 'Collect name, email, budget before human handoff', active: true },
                  { label: 'CRM auto-sync', desc: 'Every WhatsApp lead auto-creates contact in CRM', active: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/50">
                    <div>
                      <div className="text-xs font-medium">{setting.label}</div>
                      <div className="text-[10px] text-gray-500">{setting.desc}</div>
                    </div>
                    <div className={`w-8 h-4 rounded-full ${setting.active ? 'bg-green-500' : 'bg-gray-700'} relative cursor-pointer`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${setting.active ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {connected && activeTab === 'templates' && (
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold">{template.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{template.trigger}</span>
                      <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{template.language.toUpperCase()}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleTemplate(template.id)} className={template.active ? 'text-green-400' : 'text-gray-600'}>
                    <div className={`w-8 h-4 rounded-full ${template.active ? 'bg-green-500' : 'bg-gray-700'} relative`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${template.active ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>
                <div className="bg-gray-950 rounded-lg p-2.5 text-xs text-gray-400 leading-relaxed">{template.content}</div>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full h-9 text-xs border-gray-700 text-gray-400">
              + Create Custom Template
            </Button>
          </div>
        )}

        {/* Conversations Tab */}
        {connected && activeTab === 'conversations' && (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div key={conv.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-center gap-3 hover:border-gray-700 cursor-pointer transition-all">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {conv.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{conv.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusColors[conv.status]}`} />
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-gray-500">{conv.time}</div>
                  {conv.unread > 0 && (
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white text-[9px] flex items-center justify-center ml-auto mt-0.5">{conv.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Not Connected State */}
        {!connected && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Connect WhatsApp Business</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto mb-4">
              In the UAE, 90% of real estate inquiries arrive via WhatsApp. Connect your WhatsApp Business API to capture leads automatically.
            </p>
            <ol className="text-left max-w-sm mx-auto space-y-2 mb-4">
              {['Register WhatsApp Business API account', 'Verify your business phone number', 'Set up auto-reply templates', 'Start receiving leads'].map((step, i) => (
                <li key={step} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
