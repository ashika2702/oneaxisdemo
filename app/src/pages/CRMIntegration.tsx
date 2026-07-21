import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Database, Link2, CheckCircle, AlertCircle,
  RefreshCw, Settings, ChevronDown, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ────────────────────────────────────────────────
   CRM INTEGRATION PAGE
   Salesforce and HubSpot connection with field
   mapping, sync rules, and activity logging.
   ──────────────────────────────────────────── */

interface CRMProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  connected: boolean;
  lastSync: string | null;
  syncDirection: 'bidirectional' | 'to-crm' | 'from-crm';
}

interface SyncRule {
  id: string;
  source: string;
  target: string;
  active: boolean;
  direction: string;
}

export default function CRMIntegration() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<CRMProvider[]>([
    { id: 'salesforce', name: 'Salesforce', logo: 'SF', description: 'Sync leads, contacts, opportunities, and activities with Salesforce CRM.', connected: false, lastSync: null, syncDirection: 'bidirectional' },
    { id: 'hubspot', name: 'HubSpot', logo: 'HS', description: 'Sync contacts, deals, and engagement data with HubSpot CRM.', connected: false, lastSync: null, syncDirection: 'bidirectional' },
    { id: 'pipedrive', name: 'Pipedrive', logo: 'PD', description: 'Sync deals, contacts, and activities with Pipedrive.', connected: false, lastSync: null, syncDirection: 'to-crm' },
  ]);

  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<{time: string; action: string; status: 'success' | 'error'}[]>([
    { time: '2025-06-21 10:30', action: 'Auto-sync: 3 leads imported from HubSpot', status: 'success' },
    { time: '2025-06-21 09:15', action: 'Unit status change synced to Salesforce', status: 'success' },
    { time: '2025-06-20 18:00', action: 'Failed to sync: API rate limit', status: 'error' },
  ]);

  const [syncRules, setSyncRules] = useState<SyncRule[]>([
    { id: '1', source: 'OneAxis Lead', target: 'CRM Contact + Deal', active: true, direction: 'OneAxis → CRM' },
    { id: '2', source: 'Unit Reservation', target: 'CRM Opportunity', active: true, direction: 'OneAxis → CRM' },
    { id: '3', source: 'CRM Contact Update', target: 'OneAxis Stakeholder', active: false, direction: 'CRM → OneAxis' },
    { id: '4', source: 'Price Change', target: 'CRM Product Update', active: true, direction: 'OneAxis → CRM' },
    { id: '5', source: 'Site Visit Booking', target: 'CRM Activity', active: true, direction: 'OneAxis → CRM' },
  ]);

  const toggleRule = (id: string) => {
    setSyncRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleConnect = (id: string) => {
    setProviders((prev) => prev.map((p) => p.id === id ? { ...p, connected: !p.connected, lastSync: p.connected ? null : 'Just now' } : p));
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncLog((prev) => [{ time: new Date().toISOString().slice(0,16).replace('T',' '), action: 'Manual sync: 5 leads, 2 deals synced', status: 'success' }, ...prev]);
    }, 2000);
  };

  const current = providers.find((p) => p.id === activeProvider);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/integrations')} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Database className="w-5 h-5" /></div>
            <div>
              <h1 className="text-lg font-bold">CRM Integration</h1>
              <p className="text-gray-500 text-xs">Sync leads, contacts, and deals with your CRM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Provider Selection */}
        {!activeProvider && (
          <div className="space-y-3">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{provider.logo}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{provider.name}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{provider.description}</p>
                  {provider.connected && <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3" /> Last synced: {provider.lastSync}</span>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className={`h-8 text-xs ${provider.connected ? 'border-emerald-600 text-emerald-400' : 'border-gray-700 text-gray-400'}`} onClick={() => handleConnect(provider.id)}>
                    {provider.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                  {provider.connected && (
                    <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500" onClick={() => setActiveProvider(provider.id)}>
                      Configure
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Configuration */}
        {activeProvider && current && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => setActiveProvider(null)} className="text-gray-400 text-xs mb-4 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back to providers</button>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">{current.logo}</div>
                  <div>
                    <h3 className="font-semibold">{current.name}</h3>
                    <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Connected</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs border-gray-700" onClick={handleSync} disabled={syncing}>
                    <RefreshCw className={`w-3 h-3 mr-1 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-red-800 text-red-400" onClick={() => handleConnect(current.id)}>
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>

            {/* Sync Rules */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-400" /> Sync Rules</h4>
              <div className="space-y-2">
                {syncRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/50">
                    <div className="flex-1">
                      <div className="text-xs font-medium">{rule.source} → {rule.target}</div>
                      <div className="text-[10px] text-gray-500">{rule.direction}</div>
                    </div>
                    <button onClick={() => toggleRule(rule.id)} className={rule.active ? 'text-emerald-400' : 'text-gray-600'}>
                      {rule.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Mapping */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
              <button onClick={() => setShowMapping(!showMapping)} className="w-full flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2"><Settings className="w-4 h-4 text-blue-400" /> Field Mapping</h4>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMapping ? 'rotate-180' : ''}`} />
              </button>
              {showMapping && (
                <div className="mt-3 space-y-2">
                  {[
                    { oneaxis: 'Lead Name', crm: 'Contact Name', mapped: true },
                    { oneaxis: 'Unit Number', crm: 'Product Code', mapped: true },
                    { oneaxis: 'Reservation Price', crm: 'Deal Amount', mapped: true },
                    { oneaxis: 'Phone / WhatsApp', crm: 'Phone', mapped: false },
                    { oneaxis: 'View Preference', crm: 'Custom Field', mapped: false },
                  ].map((field) => (
                    <div key={field.oneaxis} className="flex items-center justify-between p-2 rounded bg-gray-800/30 text-xs">
                      <span className="text-gray-400">{field.oneaxis}</span>
                      <span className="text-gray-600">→</span>
                      <span className={field.mapped ? 'text-emerald-400' : 'text-gray-500'}>{field.crm}</span>
                      {field.mapped ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-amber-400" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sync Log */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">Sync Activity Log</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                {syncLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-gray-500 w-28 flex-shrink-0">{log.time}</span>
                    <span className="text-gray-400">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
