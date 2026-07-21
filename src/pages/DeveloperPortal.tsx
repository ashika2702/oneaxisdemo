import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Code, Key, Copy, Check, Globe, Lock,
  Server, Zap, FileText, Terminal, Webhook, Shield, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ────────────────────────────────────────────────
   DEVELOPER PORTAL
   API documentation, key management, webhook
   configuration, and SDK download for third-party
   developers integrating with OneAxis.
   ──────────────────────────────────────────── */

interface Endpoint {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  params?: string[];
}

const endpoints: Record<string, Endpoint[]> = {
  Projects: [
    { method: 'GET', path: '/api/v1/projects', description: 'List all projects', auth: true },
    { method: 'POST', path: '/api/v1/projects', description: 'Create a new project', auth: true, params: ['name', 'type', 'status'] },
    { method: 'GET', path: '/api/v1/projects/{id}', description: 'Get project details', auth: true },
    { method: 'PUT', path: '/api/v1/projects/{id}', description: 'Update project', auth: true },
    { method: 'DELETE', path: '/api/v1/projects/{id}', description: 'Delete project', auth: true },
  ],
  Units: [
    { method: 'GET', path: '/api/v1/projects/{id}/units', description: 'List project units', auth: true },
    { method: 'GET', path: '/api/v1/projects/{id}/units/{unitId}', description: 'Get unit details', auth: true },
    { method: 'PATCH', path: '/api/v1/projects/{id}/units/{unitId}', description: 'Update unit (status, price)', auth: true, params: ['status', 'price'] },
  ],
  Lots: [
    { method: 'GET', path: '/api/v1/projects/{id}/lots', description: 'List project lots', auth: true },
    { method: 'PATCH', path: '/api/v1/projects/{id}/lots/{lotId}', description: 'Update lot status', auth: true, params: ['status'] },
  ],
  Leads: [
    { method: 'POST', path: '/api/v1/leads', description: 'Create a lead', auth: true, params: ['name', 'phone', 'email', 'projectId'] },
    { method: 'GET', path: '/api/v1/leads', description: 'List leads', auth: true },
  ],
  Reservations: [
    { method: 'POST', path: '/api/v1/reservations', description: 'Create reservation', auth: true, params: ['unitId', 'clientName', 'deposit'] },
    { method: 'GET', path: '/api/v1/reservations', description: 'List reservations', auth: true },
  ],
  Embed: [
    { method: 'GET', path: '/api/v1/embed/{projectId}', description: 'Get embed widget config', auth: false, params: ['theme', 'accent', 'pricing'] },
  ],
};

const methodColors: Record<string, string> = {
  GET: 'text-blue-400',
  POST: 'text-emerald-400',
  PUT: 'text-amber-400',
  PATCH: 'text-purple-400',
  DELETE: 'text-red-400',
};

export default function DeveloperPortal() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Projects');
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'docs' | 'keys' | 'webhooks'>('docs');

  const apiKey = 'oa_live_xxxxxxxxxxxx_xxxxxxxxxxxxxxxx';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlExample = `curl -X GET "https://api.oneaxis.live/v1/projects" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`;

  const embedExample = `<iframe 
  src="https://app.oneaxis.live/embed/{PROJECT_ID}?theme=dark&accent=%233B82F6&pricing=true" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>`;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Code className="w-5 h-5" /></div>
            <div>
              <h1 className="text-lg font-bold">Developer Portal</h1>
              <p className="text-gray-500 text-xs">API docs, keys, and SDK for building with OneAxis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'API Version', value: 'v1.0', icon: <Terminal className="w-4 h-4" /> },
            { label: 'Uptime', value: '99.9%', icon: <Clock className="w-4 h-4" /> },
            { label: 'Rate Limit', value: '1K/min', icon: <Zap className="w-4 h-4" /> },
            { label: 'Latency', value: '<50ms', icon: <Server className="w-4 h-4" /> },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-purple-400 flex justify-center mb-1">{s.icon}</div>
              <div className="text-sm font-bold">{s.value}</div>
              <div className="text-[10px] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-lg">
          {[
            { key: 'docs' as const, label: 'API Reference', icon: <FileText className="w-3.5 h-3.5" /> },
            { key: 'keys' as const, label: 'API Keys', icon: <Key className="w-3.5 h-3.5" /> },
            { key: 'webhooks' as const, label: 'Webhooks', icon: <Webhook className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* API Reference */}
        {activeTab === 'docs' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-1">
              {Object.keys(endpoints).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeSection === section ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">{activeSection}</h3>
              {endpoints[activeSection]?.map((ep) => (
                <div key={ep.path} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${methodColors[ep.method]}`}>{ep.method}</span>
                    <code className="text-xs text-gray-300">{ep.path}</code>
                    {ep.auth && <Lock className="w-3 h-3 text-amber-400" />}
                  </div>
                  <p className="text-gray-500 text-xs">{ep.description}</p>
                  {ep.params && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ep.params.map((p) => (
                        <span key={p} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Code Examples */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-800">
                  {['cURL', 'JavaScript', 'Embed'].map((lang) => (
                    <button key={lang} className="px-4 py-2 text-xs text-gray-400 hover:text-white">{lang}</button>
                  ))}
                </div>
                <pre className="p-4 text-[11px] text-gray-400 overflow-x-auto"><code>{curlExample}</code></pre>
              </div>

              {/* Embed Example */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Embed Widget</h4>
                <p className="text-gray-500 text-xs mb-2">Add this iframe to any website to show the interactive unit/lot selector.</p>
                <div className="bg-gray-950 rounded-lg p-3 text-[11px] text-gray-400 font-mono">{embedExample}</div>
                <Button size="sm" variant="outline" className="mt-2 border-gray-700 text-xs" onClick={() => handleCopy(embedExample)}>
                  {copied ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy Code</>}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === 'keys' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Key className="w-4 h-4 text-amber-400" /> Production API Key</h4>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-950 rounded-lg px-3 py-2 text-xs font-mono text-gray-400">
                  {showKey ? apiKey : 'oa_live_xxxxxxxxxxxx_xxxxxxxxxxxxxxxx'}
                </div>
                <Button size="sm" variant="outline" className="h-8 border-gray-700 text-xs" onClick={() => setShowKey(!showKey)}>
                  {showKey ? 'Hide' : 'Show'}
                </Button>
                <Button size="sm" variant="outline" className="h-8 border-gray-700 text-xs" onClick={() => handleCopy(apiKey)}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Created: Jun 2025</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Never expires</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 1,000 req/min</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">API Key Usage</h4>
              <div className="space-y-2">
                {[
                  { endpoint: 'GET /projects', calls: 1240, limit: 60000 },
                  { endpoint: 'GET /units', calls: 8920, limit: 60000 },
                  { endpoint: 'POST /leads', calls: 340, limit: 10000 },
                  { endpoint: 'POST /reservations', calls: 89, limit: 5000 },
                ].map((usage) => (
                  <div key={usage.endpoint} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-32">{usage.endpoint}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(usage.calls / usage.limit) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 w-20 text-right">{usage.calls.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Webhooks */}
        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Webhook className="w-4 h-4 text-purple-400" /> Webhook Endpoints</h4>
              <div className="flex gap-2 mb-3">
                <input type="url" placeholder="https://your-app.com/webhooks/oneaxis" className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300" />
                <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-xs">Add Endpoint</Button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">Available Events</h4>
              <div className="space-y-2">
                {[
                  { event: 'unit.reserved', desc: 'Fired when a unit is reserved' },
                  { event: 'unit.sold', desc: 'Fired when unit status changes to sold' },
                  { event: 'lead.created', desc: 'Fired when a new lead is captured' },
                  { event: 'price.changed', desc: 'Fired when unit pricing is updated' },
                  { event: 'project.updated', desc: 'Fired when project details change' },
                ].map((e) => (
                  <div key={e.event} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/50">
                    <div>
                      <code className="text-xs text-blue-400">{e.event}</code>
                      <p className="text-[10px] text-gray-500">{e.desc}</p>
                    </div>
                    <div className="w-8 h-4 rounded-full bg-blue-500 relative cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <h4 className="text-xs font-semibold mb-2 text-gray-400">Webhook Payload Example</h4>
              <pre className="text-[11px] text-gray-400 overflow-x-auto">{JSON.stringify({
                event: 'unit.reserved',
                timestamp: '2025-06-21T10:30:00Z',
                project: { id: 'demo-1', name: 'Azure Heights Tower' },
                unit: { id: 'unit-12', number: '12B', price: 850000 },
                client: { name: 'Ahmed Al-Rashid', phone: '+971552345678' },
              }, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
