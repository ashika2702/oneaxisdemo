import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Anchor, Plane, Train, Truck, Car, Warehouse,
  Navigation, Clock, MapPin, Zap, Factory, HardHat,
  Route, Shield, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'port' | 'airport' | 'rail' | 'highway' | 'industrial' | 'warehouse' | 'utility' | 'logistics';
  distance: number;
  driveTime: number;
  status: 'operational' | 'construction' | 'planned' | 'upgrade';
  metrics: { label: string; value: string }[];
  description: string;
}

const ASSETS: InfrastructureAsset[] = [
  {
    id: 'a1', name: 'Port Botany Container Terminal', type: 'port', distance: 4.2, driveTime: 8,
    status: 'operational',
    metrics: [{ label: 'TEU Capacity', value: '2.4M/yr' }, { label: 'Berths', value: '6' }, { label: 'Crane Count', value: '22' }],
    description: 'Australia\'s second-largest container port. Handles 99% of NSW container trade. 24/7 operations. Direct motorway access via M1.',
  },
  {
    id: 'a2', name: 'Sydney Kingsford Smith Airport', type: 'airport', distance: 3.8, driveTime: 7,
    status: 'operational',
    metrics: [{ label: 'Passengers', value: '44.4M/yr' }, { label: 'Runways', value: '3' }, { label: 'Destinations', value: '100+' }],
    description: 'Australia\'s busiest airport. International and domestic terminals. 15min train to CBD via Airport Link.',
  },
  {
    id: 'a3', name: 'Moorebank Intermodal Terminal', type: 'rail', distance: 12, driveTime: 18,
    status: 'operational',
    metrics: [{ label: 'Freight Volume', value: '1.5M TEU' }, { label: 'Rail Lines', value: '4' }, { label: 'Warehousing', value: '850K m²' }],
    description: 'Australia\'s largest intermodal freight hub. Direct connection to Port Botany via dedicated freight rail. 24-hour operations.',
  },
  {
    id: 'a4', name: 'M1 Motorway (Princes Motorway)', type: 'highway', distance: 1.8, driveTime: 3,
    status: 'operational',
    metrics: [{ label: 'Daily Traffic', value: '95K veh' }, { label: 'Lanes', value: '6-8' }, { label: 'Avg Speed', value: '85 km/h' }],
    description: 'Primary arterial connecting Sydney CBD to Wollongong and south coast. 6-8 lanes. Direct port and airport access.',
  },
  {
    id: 'a5', name: 'Central Station Heavy Rail', type: 'rail', distance: 5.5, driveTime: 12,
    status: 'operational',
    metrics: [{ label: 'Daily Passengers', value: '340K' }, { label: 'Platforms', value: '25' }, { label: 'Lines', value: '8' }],
    description: 'NSW\'s primary rail hub. T4 Eastern Suburbs line direct access. Sydney Metro connection (2026).',
  },
  {
    id: 'a6', name: 'Alexandria Industrial Precinct', type: 'industrial', distance: 2.4, driveTime: 5,
    status: 'operational',
    metrics: [{ label: 'Industrial Stock', value: '450K m²' }, { label: 'Occupancy', value: '94%' }, { label: 'Avg Rent', value: '$285/m²' }],
    description: 'Established industrial zone with food processing, logistics, and light manufacturing. Strong tenant demand.',
  },
  {
    id: 'a7', name: 'St Peters Utility Substation', type: 'utility', distance: 1.2, driveTime: 3,
    status: 'operational',
    metrics: [{ label: 'Capacity', value: '132kV' }, { label: 'Redundancy', value: 'N+1' }, { label: 'Uptime', value: '99.97%' }],
    description: 'Ausgrid primary substation serving the precinct. N+1 redundancy. Direct connection to state transmission network.',
  },
  {
    id: 'a8', name: 'Sydney Water Treatment Plant', type: 'utility', distance: 6.8, driveTime: 14,
    status: 'operational',
    metrics: [{ label: 'Capacity', value: '180 ML/day' }, { label: 'Population', value: '850K' }, { label: 'Compliance', value: '100%' }],
    description: 'Primary water treatment facility for eastern Sydney. Meets all Australian Drinking Water Guidelines.',
  },
  {
    id: 'a9', name: 'Mascot Logistics Park', type: 'warehouse', distance: 3.5, driveTime: 6,
    status: 'operational',
    metrics: [{ label: 'Total Area', value: '120K m²' }, { label: 'Clearance', value: '12m' }, { label: 'Loading Docks', value: '48' }],
    description: 'Modern logistics facility with 12m clearance, 48 loading docks, and temperature-controlled zones.',
  },
  {
    id: 'a10', name: 'WestConnex M4-M5 Link', type: 'highway', distance: 2.1, driveTime: 4,
    status: 'construction',
    metrics: [{ label: 'Length', value: '6.5km tunnels' }, { label: 'Completion', value: '2026' }, { label: 'Cost', value: '$6.8B' }],
    description: 'Under construction. Will provide direct motorway tunnel connection from west to airport and port. Reduces surface traffic by 40%.',
  },
  {
    id: 'a11', name: 'Sydney Metro West', type: 'rail', distance: 0.8, driveTime: 2,
    status: 'construction',
    metrics: [{ label: 'Stations', value: '10' }, { label: 'Completion', value: '2032' }, { label: 'Capacity', value: '40K/hr' }],
    description: 'New underground metro line connecting Parramatta to CBD. Station planned 800m from site. 40,000 passengers per hour.',
  },
  {
    id: 'a12', name: 'Port Botany Expansion Stage 3', type: 'port', distance: 4.5, driveTime: 9,
    status: 'planned',
    metrics: [{ label: 'New Capacity', value: '+1.2M TEU' }, { label: 'Timeline', value: '2028-2032' }, { label: 'Investment', value: '$3.2B' }],
    description: 'Planned additional berth and automated stacking yard. Will increase total port capacity to 3.6M TEU annually.',
  },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  port: { icon: <Anchor className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Port' },
  airport: { icon: <Plane className="w-5 h-5" />, color: 'text-sky-400', bg: 'bg-sky-500/20', label: 'Airport' },
  rail: { icon: <Train className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Rail' },
  highway: { icon: <Car className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Road' },
  industrial: { icon: <Factory className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Industrial' },
  warehouse: { icon: <Warehouse className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Warehouse' },
  utility: { icon: <Zap className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Utility' },
  logistics: { icon: <Truck className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Logistics' },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  operational: { color: 'bg-emerald-500/20 text-emerald-400', label: 'Operational' },
  construction: { color: 'bg-blue-500/20 text-blue-400', label: 'Construction' },
  planned: { color: 'bg-amber-500/20 text-amber-400', label: 'Planned' },
  upgrade: { color: 'bg-purple-500/20 text-purple-400', label: 'Upgrade' },
};

export default function InfrastructureLayer() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);

  const filtered = activeFilter === 'all'
    ? ASSETS
    : ASSETS.filter(a => a.type === activeFilter || (activeFilter === 'active' && a.status === 'operational'));

  const operationalCount = ASSETS.filter(a => a.status === 'operational').length;
  const underConstruction = ASSETS.filter(a => a.status === 'construction').length;
  const plannedCount = ASSETS.filter(a => a.status === 'planned').length;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Infrastructure & Logistics</h2>
            <p className="text-gray-400 text-sm">Ports, airports, freight, utilities & supply chain</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Operational</span>
          </div>
          <div className="text-2xl font-bold text-white">{operationalCount}</div>
          <div className="text-[10px] text-gray-500">assets within 15km</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardHat className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Under Construction</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{underConstruction}</div>
          <div className="text-[10px] text-gray-500">major projects</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Planned / Pipeline</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{plannedCount}</div>
          <div className="text-[10px] text-gray-500">future developments</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-thin pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeFilter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          All ({ASSETS.length})
        </button>
        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {config.icon}
            {config.label} ({ASSETS.filter(a => a.type === key).length})
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        {filtered.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)}
            className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
              selectedAsset?.id === asset.id ? 'border-indigo-500/30' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${TYPE_CONFIG[asset.type]?.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={TYPE_CONFIG[asset.type]?.color}>{TYPE_CONFIG[asset.type]?.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm">{asset.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${STATUS_CONFIG[asset.status]?.color}`}>
                      {STATUS_CONFIG[asset.status]?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><Navigation className="w-3 h-3" />{asset.distance}km</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{asset.driveTime}min</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-700/50">{TYPE_CONFIG[asset.type]?.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics row */}
            <div className="flex gap-3 mt-3 ml-13">
              {asset.metrics.map(m => (
                <div key={m.label} className="bg-gray-800/50 rounded-lg px-2.5 py-1.5 text-center">
                  <div className="text-xs text-white font-medium">{m.value}</div>
                  <div className="text-[9px] text-gray-500">{m.label}</div>
                </div>
              ))}
            </div>

            {selectedAsset?.id === asset.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-gray-700"
              >
                <p className="text-xs text-gray-400 leading-relaxed">{asset.description}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-7 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    View on Map
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-7 text-xs">
                    <Route className="w-3 h-3 mr-1" />
                    Get Directions
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Supply chain proximity score */}
      <div className="glass-panel rounded-xl p-5 mt-6 border-indigo-500/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-white font-medium">Supply Chain Resilience Score</span>
          </div>
          <span className="text-lg font-bold text-indigo-400">9.1<span className="text-sm text-gray-500">/10</span></span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '91%' }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="text-center">
            <Anchor className="w-4 h-4 text-blue-400 mx-auto mb-0.5" />
            <div className="text-[10px] text-gray-400">Sea: 4.2km</div>
          </div>
          <div className="text-center">
            <Plane className="w-4 h-4 text-sky-400 mx-auto mb-0.5" />
            <div className="text-[10px] text-gray-400">Air: 3.8km</div>
          </div>
          <div className="text-center">
            <Train className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
            <div className="text-[10px] text-gray-400">Rail: 12km</div>
          </div>
          <div className="text-center">
            <Car className="w-4 h-4 text-red-400 mx-auto mb-0.5" />
            <div className="text-[10px] text-gray-400">Road: 1.8km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
