import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, DollarSign, MapPin, Hash, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Lot } from '@/types';

const STATUS_CONFIG = {
  available: { color: '#10b981', label: 'Available', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  sold:      { color: '#ef4444', label: 'Sold',      bg: 'bg-red-500/15',      text: 'text-red-400',      border: 'border-red-500/30' },
  reserved:  { color: '#f59e0b', label: 'Reserved',  bg: 'bg-amber-500/15',    text: 'text-amber-400',    border: 'border-amber-500/30' },
  hold:      { color: '#6b7280', label: 'Hold',      bg: 'bg-gray-500/15',     text: 'text-gray-400',     border: 'border-gray-500/30' },
};

type SortKey = 'number' | 'area' | 'price' | 'status' | 'stage';
type SortDir = 'asc' | 'desc';

interface Props {
  lots?: Lot[];
  onSelectLot?: (lot: Lot) => void;
}

// ─── DEFAULT DEMO LOTS (same data as ingestion engine) ───
export const DEFAULT_LOTS: Lot[] = [
  { id: 'l1',  lotNumber: '1',  number: '1',  area: 525, price: 450000, status: 'sold',      stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 15, depth: 35, features: ['corner','river-view'] },
  { id: 'l2',  lotNumber: '2',  number: '2',  area: 540, price: 475000, status: 'sold',      stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 15, depth: 36, features: ['river-view'] },
  { id: 'l3',  lotNumber: '3',  number: '3',  area: 555, price: 490000, status: 'available', stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 15, depth: 37, features: ['river-view'] },
  { id: 'l4',  lotNumber: '4',  number: '4',  area: 570, price: 510000, status: 'available', stage: 'Phase 1', bedrooms: 4, bathrooms: 3, frontage: 15, depth: 38, features: ['river-view','corner'] },
  { id: 'l5',  lotNumber: '5',  number: '5',  area: 585, price: 525000, status: 'reserved',  stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 39, features: ['river-view','premium'] },
  { id: 'l6',  lotNumber: '6',  number: '6',  area: 600, price: 550000, status: 'available', stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 40, features: ['river-view','premium'] },
  { id: 'l7',  lotNumber: '7',  number: '7',  area: 615, price: 575000, status: 'available', stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 41, features: ['river-view','corner'] },
  { id: 'l8',  lotNumber: '8',  number: '8',  area: 630, price: 600000, status: 'sold',      stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 42, features: ['river-view','premium'] },
  { id: 'l18', lotNumber: '18', number: '18', area: 510, price: 420000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 36, features: ['park-view'] },
  { id: 'l19', lotNumber: '19', number: '19', area: 525, price: 440000, status: 'sold',      stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 37, features: ['park-view'] },
  { id: 'l20', lotNumber: '20', number: '20', area: 540, price: 460000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 38, features: ['park-view','corner'] },
  { id: 'l21', lotNumber: '21', number: '21', area: 555, price: 480000, status: 'reserved',  stage: 'Phase 2', bedrooms: 4, bathrooms: 3, frontage: 14, depth: 39, features: ['park-view'] },
  { id: 'l22', lotNumber: '22', number: '22', area: 570, price: 500000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 3, frontage: 14, depth: 40, features: ['park-view','corner'] },
  { id: 'l23', lotNumber: '23', number: '23', area: 585, price: 520000, status: 'available', stage: 'Phase 2', bedrooms: 5, bathrooms: 3, frontage: 14, depth: 41, features: ['park-view'] },
  { id: 'l24', lotNumber: '24', number: '24', area: 600, price: 540000, status: 'sold',      stage: 'Phase 2', bedrooms: 5, bathrooms: 3, frontage: 14, depth: 42, features: ['park-view'] },
  { id: 'l25', lotNumber: '25', number: '25', area: 615, price: 560000, status: 'available', stage: 'Phase 2', bedrooms: 5, bathrooms: 3, frontage: 14, depth: 43, features: ['park-view','corner'] },
  { id: 'l26', lotNumber: '26', number: '26', area: 480, price: 380000, status: 'available', stage: 'Phase 1', bedrooms: 3, bathrooms: 2, frontage: 14, depth: 34, features: ['entry-level'] },
  { id: 'l27', lotNumber: '27', number: '27', area: 495, price: 395000, status: 'available', stage: 'Phase 1', bedrooms: 3, bathrooms: 2, frontage: 14, depth: 35, features: ['entry-level'] },
  { id: 'l28', lotNumber: '28', number: '28', area: 510, price: 410000, status: 'hold',      stage: 'Phase 1', bedrooms: 3, bathrooms: 2, frontage: 14, depth: 36, features: ['entry-level'] },
  { id: 'l29', lotNumber: '29', number: '29', area: 525, price: 425000, status: 'available', stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 37, features: [] },
  { id: 'l30', lotNumber: '30', number: '30', area: 540, price: 440000, status: 'sold',      stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 38, features: [] },
  { id: 'l40', lotNumber: '40', number: '40', area: 465, price: 365000, status: 'available', stage: 'Phase 2', bedrooms: 3, bathrooms: 2, frontage: 13, depth: 35, features: ['courtyard'] },
  { id: 'l41', lotNumber: '41', number: '41', area: 480, price: 380000, status: 'available', stage: 'Phase 2', bedrooms: 3, bathrooms: 2, frontage: 13, depth: 36, features: ['courtyard'] },
  { id: 'l42', lotNumber: '42', number: '42', area: 495, price: 395000, status: 'reserved',  stage: 'Phase 2', bedrooms: 3, bathrooms: 2, frontage: 13, depth: 37, features: ['courtyard','corner'] },
  { id: 'l43', lotNumber: '43', number: '43', area: 510, price: 410000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 13, depth: 38, features: ['courtyard'] },
  { id: 'l44', lotNumber: '44', number: '44', area: 525, price: 425000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 13, depth: 39, features: ['courtyard'] },
  { id: 'l45', lotNumber: '45', number: '45', area: 540, price: 440000, status: 'sold',      stage: 'Phase 2', bedrooms: 4, bathrooms: 3, frontage: 13, depth: 40, features: ['courtyard','corner'] },
  { id: 'l50', lotNumber: '50', number: '50', area: 600, price: 520000, status: 'available', stage: 'Phase 3', bedrooms: 4, bathrooms: 2, frontage: 16, depth: 37, features: ['main-road','high-visibility'] },
  { id: 'l51', lotNumber: '51', number: '51', area: 615, price: 540000, status: 'available', stage: 'Phase 3', bedrooms: 4, bathrooms: 3, frontage: 16, depth: 38, features: ['main-road','high-visibility'] },
  { id: 'l52', lotNumber: '52', number: '52', area: 630, price: 560000, status: 'available', stage: 'Phase 3', bedrooms: 5, bathrooms: 3, frontage: 16, depth: 39, features: ['main-road','high-visibility','corner'] },
];

export default function LotArrayView({ lots: propLots, onSelectLot }: Props) {
  const lots = propLots || DEFAULT_LOTS;
  const [sortKey, setSortKey] = useState<SortKey>('number');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLot, setSelectedLot] = useState<string | null>(null);

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Sorted + filtered lots
  const displayLots = useMemo(() => {
    let filtered = filterStatus === 'all' ? [...lots] : lots.filter((l) => l.status === filterStatus);
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'number':  cmp = parseInt(a.number || '0') - parseInt(b.number || '0'); break;
        case 'area':    cmp = a.area - b.area; break;
        case 'price':   cmp = a.price - b.price; break;
        case 'stage':   cmp = (a.stage || '').localeCompare(b.stage || ''); break;
        case 'status':  cmp = a.status.localeCompare(b.status); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [lots, sortKey, sortDir, filterStatus]);

  // Stats
  const stats = useMemo(() => ({
    total: lots.length,
    available: lots.filter((l) => l.status === 'available').length,
    sold: lots.filter((l) => l.status === 'sold').length,
    reserved: lots.filter((l) => l.status === 'reserved').length,
    hold: lots.filter((l) => l.status === 'hold').length,
    totalValue: lots.reduce((sum, l) => sum + l.price, 0),
  }), [lots]);

  const activeLot = lots.find((l) => l.id === selectedLot);

  // Sort button component
  const SortBtn = ({ k, label, icon: Icon }: { k: SortKey; label: string; icon: any }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        sortKey === k ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon className="w-3 h-3" />
      {label}
      {sortKey === k && <span className="text-[10px] opacity-60">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0c111f] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-sm">Lot Array View</span>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{stats.available} of {stats.total} available</Badge>
        </div>
        <div className="text-xs text-gray-500">
          Total Value: <span className="text-emerald-400 font-semibold">${(stats.totalValue / 1000000).toFixed(1)}M</span>
        </div>
      </div>

      {/* Filter + Sort Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#0a0e1a] border-b border-gray-800 flex-wrap">
        {/* Status filters */}
        <div className="flex items-center gap-1.5">
          {(['all', 'available', 'sold', 'reserved', 'hold'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterStatus === s ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}>
              <span className="capitalize">{s}</span>
              <span className="text-gray-600 ml-1">{s === 'all' ? stats.total : stats[s]}</span>
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-gray-800" />
        {/* Sort buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-[10px] mr-1">SORT BY</span>
          <SortBtn k="number" label="Lot #" icon={Hash} />
          <SortBtn k="area" label="Area" icon={Maximize2} />
          <SortBtn k="price" label="Price" icon={DollarSign} />
          <SortBtn k="stage" label="Stage" icon={ArrowUpDown} />
          <SortBtn k="status" label="Status" icon={ArrowUpDown} />
        </div>
      </div>

      {/* Lot Grid */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {displayLots.map((lot) => {
              const sk = lot.status as keyof typeof STATUS_CONFIG;
              const cfg = STATUS_CONFIG[sk];
              const isSelected = selectedLot === lot.id;
              return (
                <motion.div
                  key={lot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedLot(isSelected ? null : lot.id);
                    onSelectLot?.(lot);
                  }}
                  className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-500/10' : `${cfg.border} ${cfg.bg} hover:brightness-110`
                  }`}
                >
                  {/* Lot number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-bold ${cfg.text}`}>Lot {lot.number}</span>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  </div>
                  {/* Stage badge */}
                  <div className="text-[10px] text-gray-500 mb-2">{lot.stage}</div>
                  {/* Key metrics */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Area</span>
                      <span className="text-white font-medium">{lot.area}m²</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Price</span>
                      <span className="text-emerald-400 font-medium">${(lot.price / 1000).toFixed(0)}k</span>
                    </div>
                    {lot.frontage && lot.depth && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Size</span>
                        <span className="text-gray-300">{lot.frontage}×{lot.depth}m</span>
                      </div>
                    )}
                  </div>
                  {/* Features */}
                  {lot.features && lot.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-700/50">
                      {lot.features.slice(0, 2).map((f) => (
                        <span key={f} className="px-1.5 py-0.5 bg-gray-800/60 rounded text-[9px] text-gray-400 capitalize">{f.replace('-', ' ')}</span>
                      ))}
                      {lot.features.length > 2 && (
                        <span className="px-1.5 py-0.5 text-[9px] text-gray-500">+{lot.features.length - 2}</span>
                      )}
                    </div>
                  )}
                  {/* Status label at bottom */}
                  <div className={`mt-2 text-center text-[10px] font-medium py-0.5 rounded ${cfg.text} bg-gray-900/40`}>
                    {cfg.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {displayLots.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              No lots match the selected filter.
            </div>
          )}
        </div>

        {/* Selected Lot Detail (right panel) */}
        <AnimatePresence>
          {activeLot && (
            <motion.div
              key={activeLot.id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="border-l border-gray-800 bg-[#0c111f] overflow-hidden"
            >
              <div className="w-[280px] p-4">
                {(() => {
                  const lot = activeLot;
                  const sk = lot.status as keyof typeof STATUS_CONFIG;
                  const c = STATUS_CONFIG[sk];
                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-lg">Lot {lot.number}</h3>
                        <button onClick={() => setSelectedLot(null)} className="text-gray-500 hover:text-white text-sm">✕</button>
                      </div>
                      <div className={`p-3 rounded-lg border mb-4 ${c.bg} ${c.border}`}>
                        <div className={`text-sm font-semibold ${c.text}`}>{c.label}</div>
                        <div className="text-gray-400 text-xs">{lot.stage}</div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          ['Area', `${lot.area} m²`],
                          ['Frontage', `${lot.frontage}m`],
                          ['Depth', `${lot.depth}m`],
                          ['Bedrooms', `${lot.bedrooms || '-'}`],
                          ['Bathrooms', `${lot.bathrooms || '-'}`],
                          ['Price', `$${(lot.price / 1000).toFixed(0)}k`, 'text-emerald-400'],
                        ].map(([label, value, color]) => (
                          <div key={label} className="flex justify-between py-1 border-b border-gray-800/50">
                            <span className="text-gray-500">{label}</span>
                            <span className={`text-white font-medium ${color || ''}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                      {lot.features && lot.features.length > 0 && (
                        <div className="mt-4">
                          <div className="text-gray-500 text-xs mb-2">Features</div>
                          <div className="flex flex-wrap gap-1.5">
                            {lot.features.map((f) => (
                              <span key={f} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 capitalize">{f.replace('-', ' ')}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
