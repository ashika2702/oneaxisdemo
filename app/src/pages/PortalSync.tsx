import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Globe, RefreshCw,
  ToggleLeft, ToggleRight, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ────────────────────────────────────────────────
   PROPERTY PORTAL SYNC SETTINGS
   Sync listings to Property Finder, Bayut, Dubizzle,
   and other regional portals. Auto-publish, price sync,
   status sync, and photo upload.
   ──────────────────────────────────────────── */

interface Portal {
  id: string;
  name: string;
  region: string;
  connected: boolean;
  lastSync: string | null;
  listingsSynced: number;
  autoPublish: boolean;
  autoPriceSync: boolean;
  autoStatusSync: boolean;
  logo: string;
}

export default function PortalSync() {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [portals, setPortals] = useState<Portal[]>([
    { id: 'pf', name: 'Property Finder', region: 'UAE', connected: true, lastSync: '2025-06-21 09:30', listingsSynced: 48, autoPublish: true, autoPriceSync: true, autoStatusSync: true, logo: 'PF' },
    { id: 'bayut', name: 'Bayut', region: 'UAE', connected: true, lastSync: '2025-06-21 09:31', listingsSynced: 48, autoPublish: true, autoPriceSync: true, autoStatusSync: false, logo: 'B' },
    { id: 'dubizzle', name: 'Dubizzle', region: 'UAE', connected: false, lastSync: null, listingsSynced: 0, autoPublish: false, autoPriceSync: false, autoStatusSync: false, logo: 'DZ' },
    { id: 'zoopla', name: 'Zoopla', region: 'UK', connected: false, lastSync: null, listingsSynced: 0, autoPublish: false, autoPriceSync: false, autoStatusSync: false, logo: 'Z' },
    { id: 'rightmove', name: 'Rightmove', region: 'UK', connected: false, lastSync: null, listingsSynced: 0, autoPublish: false, autoPriceSync: false, autoStatusSync: false, logo: 'RM' },
    { id: 'realtor', name: 'Realtor.com', region: 'US', connected: false, lastSync: null, listingsSynced: 0, autoPublish: false, autoPriceSync: false, autoStatusSync: false, logo: 'R' },
  ]);

  const [syncLog, setSyncLog] = useState([
    { time: '2025-06-21 09:31', portal: 'Bayut', action: 'Price update synced for Unit 12B', status: 'success' as const },
    { time: '2025-06-21 09:30', portal: 'Property Finder', action: '48 listings synced', status: 'success' as const },
    { time: '2025-06-20 18:00', portal: 'Property Finder', action: 'Status change: Unit 8A → Sold', status: 'success' as const },
    { time: '2025-06-20 14:00', portal: 'Bayut', action: 'Failed to sync: API timeout', status: 'error' as const },
  ]);

  const togglePortal = (id: string) => {
    setPortals((prev) => prev.map((p) => p.id === id ? { ...p, connected: !p.connected } : p));
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncLog((prev) => [{ time: new Date().toISOString().slice(0,16).replace('T',' '), portal: 'All', action: 'Manual sync: 48 listings across 2 portals', status: 'success' as const }, ...prev]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/integrations')} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Globe className="w-5 h-5" /></div>
            <div>
              <h1 className="text-lg font-bold">Property Portals</h1>
              <p className="text-gray-500 text-xs">Sync listings to property portals automatically</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Sync Now */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <RefreshCw className={`w-5 h-5 text-blue-400 ${syncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="text-sm font-semibold">{portals.filter(p=>p.connected).length} portals connected</div>
              <div className="text-[10px] text-gray-500">{portals.filter(p=>p.connected).reduce((a,p)=>a+p.listingsSynced,0)} listings synced total</div>
            </div>
          </div>
          <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Sync All Now'}
          </Button>
        </div>

        {/* Portals */}
        <div className="space-y-3">
          {portals.map((portal) => (
            <motion.div key={portal.id} layout className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">{portal.logo}</div>
                  <div>
                    <h3 className="text-sm font-semibold">{portal.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <MapPin className="w-3 h-3" /> {portal.region}
                      {portal.connected && <><span className="mx-1">•</span><span className="text-emerald-400">{portal.listingsSynced} listings</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {portal.connected && (
                    <span className="text-[10px] text-gray-500">Last sync: {portal.lastSync}</span>
                  )}
                  <button onClick={() => togglePortal(portal.id)} className={portal.connected ? 'text-emerald-400' : 'text-gray-600'}>
                    {portal.connected ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>
              </div>

              {portal.connected && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t border-gray-800">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'autoPublish', label: 'Auto-Publish' },
                      { key: 'autoPriceSync', label: 'Price Sync' },
                      { key: 'autoStatusSync', label: 'Status Sync' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                        <span className="text-[10px] text-gray-400">{setting.label}</span>
                        <button onClick={() => setPortals((prev) => prev.map((p) => p.id === portal.id ? { ...p, [setting.key]: !p[setting.key as keyof Portal] } : p))} className={portal[setting.key as keyof Portal] as boolean ? 'text-emerald-400' : 'text-gray-600'}>
                          <div className={`w-6 h-3 rounded-full ${portal[setting.key as keyof Portal] ? 'bg-emerald-500' : 'bg-gray-700'} relative`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-white absolute top-0.25 transition-all ${portal[setting.key as keyof Portal] ? 'right-0.25' : 'left-0.25'}`} />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sync Log */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mt-4">
          <h4 className="text-sm font-semibold mb-3">Sync Activity</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
            {syncLog.map((log, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-gray-500 w-20 flex-shrink-0">{log.time}</span>
                <span className="text-blue-400 w-24 flex-shrink-0">{log.portal}</span>
                <span className="text-gray-400">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
