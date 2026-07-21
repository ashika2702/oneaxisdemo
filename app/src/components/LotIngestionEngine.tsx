import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, MapPin, X, Edit3, Save,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Lot } from '@/types';

const STATUS_CONFIG = {
  available: { color: '#10b981', label: 'Available', bg: 'rgba(16,185,129,0.15)' },
  sold:      { color: '#ef4444', label: 'Sold',      bg: 'rgba(239,68,68,0.15)' },
  reserved:  { color: '#f59e0b', label: 'Reserved',  bg: 'rgba(245,158,11,0.15)' },
  hold:      { color: '#6b7280', label: 'Hold',      bg: 'rgba(107,114,128,0.15)' },
};

// ─── DEMO LOTS: Strathlone Estate (30 lots) ───
export const DEMO_LOTS: Lot[] = [
  { id: 'l1',  lotNumber: '1',  number: '1',  area: 525, price: 450000, status: 'sold',      stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 15, depth: 35, features: ['corner','river-view'], path: 'M 180 380 L 230 370 L 240 420 L 190 430 Z', cx: 210, cy: 400 },
  { id: 'l2',  lotNumber: '2',  number: '2',  area: 540, price: 475000, status: 'sold',      stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 15, depth: 36, features: ['river-view'],          path: 'M 230 370 L 280 360 L 290 410 L 240 420 Z', cx: 260, cy: 390 },
  { id: 'l3',  lotNumber: '3',  number: '3',  area: 555, price: 490000, status: 'available', stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 15, depth: 37, features: ['river-view'],          path: 'M 280 360 L 330 350 L 340 400 L 290 410 Z', cx: 310, cy: 380 },
  { id: 'l4',  lotNumber: '4',  number: '4',  area: 570, price: 510000, status: 'available', stage: 'Phase 1', bedrooms: 4, bathrooms: 3, frontage: 15, depth: 38, features: ['river-view','corner'], path: 'M 330 350 L 380 340 L 390 390 L 340 400 Z', cx: 360, cy: 370 },
  { id: 'l5',  lotNumber: '5',  number: '5',  area: 585, price: 525000, status: 'reserved',  stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 39, features: ['river-view','premium'],path: 'M 380 340 L 430 330 L 440 380 L 390 390 Z', cx: 410, cy: 360 },
  { id: 'l6',  lotNumber: '6',  number: '6',  area: 600, price: 550000, status: 'available', stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 40, features: ['river-view','premium'],path: 'M 430 330 L 480 320 L 490 370 L 440 380 Z', cx: 460, cy: 350 },
  { id: 'l7',  lotNumber: '7',  number: '7',  area: 615, price: 575000, status: 'available', stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 41, features: ['river-view','corner'], path: 'M 480 320 L 530 310 L 540 360 L 490 370 Z', cx: 510, cy: 340 },
  { id: 'l8',  lotNumber: '8',  number: '8',  area: 630, price: 600000, status: 'sold',      stage: 'Phase 1', bedrooms: 5, bathrooms: 3, frontage: 15, depth: 42, features: ['river-view','premium'],path: 'M 530 310 L 580 300 L 590 350 L 540 360 Z', cx: 560, cy: 330 },
  { id: 'l18', lotNumber: '18', number: '18', area: 510, price: 420000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 36, features: ['park-view'],            path: 'M 620 280 L 670 270 L 680 320 L 630 330 Z', cx: 650, cy: 300 },
  { id: 'l19', lotNumber: '19', number: '19', area: 525, price: 440000, status: 'sold',      stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 37, features: ['park-view'],            path: 'M 670 270 L 720 260 L 730 310 L 680 320 Z', cx: 700, cy: 290 },
  { id: 'l20', lotNumber: '20', number: '20', area: 540, price: 460000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 38, features: ['park-view','corner'],  path: 'M 720 260 L 770 250 L 780 300 L 730 310 Z', cx: 750, cy: 280 },
  { id: 'l21', lotNumber: '21', number: '21', area: 555, price: 480000, status: 'reserved',  stage: 'Phase 2', bedrooms: 4, bathrooms: 3, frontage: 14, depth: 39, features: ['park-view'],            path: 'M 770 250 L 820 240 L 830 290 L 780 300 Z', cx: 800, cy: 270 },
  { id: 'l22', lotNumber: '22', number: '22', area: 570, price: 500000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 3, frontage: 14, depth: 40, features: ['park-view','corner'],  path: 'M 820 240 L 870 230 L 880 280 L 830 290 Z', cx: 850, cy: 260 },
  { id: 'l23', lotNumber: '23', number: '23', area: 585, price: 520000, status: 'available', stage: 'Phase 2', bedrooms: 5, bathrooms: 3, frontage: 14, depth: 41, features: ['park-view'],            path: 'M 870 230 L 920 220 L 930 270 L 880 280 Z', cx: 900, cy: 250 },
  { id: 'l24', lotNumber: '24', number: '24', area: 600, price: 540000, status: 'sold',      stage: 'Phase 2', bedrooms: 5, bathrooms: 3, frontage: 14, depth: 42, features: ['park-view'],            path: 'M 920 220 L 970 210 L 980 260 L 930 270 Z', cx: 950, cy: 240 },
  { id: 'l25', lotNumber: '25', number: '25', area: 615, price: 560000, status: 'available', stage: 'Phase 2', bedrooms: 5, bathrooms: 3, frontage: 14, depth: 43, features: ['park-view','corner'],  path: 'M 970 210 L 1020 200 L 1030 250 L 980 260 Z', cx: 1000, cy: 230 },
  { id: 'l26', lotNumber: '26', number: '26', area: 480, price: 380000, status: 'available', stage: 'Phase 1', bedrooms: 3, bathrooms: 2, frontage: 14, depth: 34, features: ['entry-level'],          path: 'M 180 480 L 230 470 L 240 520 L 190 530 Z', cx: 210, cy: 500 },
  { id: 'l27', lotNumber: '27', number: '27', area: 495, price: 395000, status: 'available', stage: 'Phase 1', bedrooms: 3, bathrooms: 2, frontage: 14, depth: 35, features: ['entry-level'],          path: 'M 230 470 L 280 460 L 290 510 L 240 520 Z', cx: 260, cy: 490 },
  { id: 'l28', lotNumber: '28', number: '28', area: 510, price: 410000, status: 'hold',      stage: 'Phase 1', bedrooms: 3, bathrooms: 2, frontage: 14, depth: 36, features: ['entry-level'],          path: 'M 280 460 L 330 450 L 340 500 L 290 510 Z', cx: 310, cy: 480 },
  { id: 'l29', lotNumber: '29', number: '29', area: 525, price: 425000, status: 'available', stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 37, features: [],                       path: 'M 330 450 L 380 440 L 390 490 L 340 500 Z', cx: 360, cy: 470 },
  { id: 'l30', lotNumber: '30', number: '30', area: 540, price: 440000, status: 'sold',      stage: 'Phase 1', bedrooms: 4, bathrooms: 2, frontage: 14, depth: 38, features: [],                       path: 'M 380 440 L 430 430 L 440 480 L 390 490 Z', cx: 410, cy: 460 },
  { id: 'l40', lotNumber: '40', number: '40', area: 465, price: 365000, status: 'available', stage: 'Phase 2', bedrooms: 3, bathrooms: 2, frontage: 13, depth: 35, features: ['courtyard'],            path: 'M 620 380 L 670 370 L 680 420 L 630 430 Z', cx: 650, cy: 400 },
  { id: 'l41', lotNumber: '41', number: '41', area: 480, price: 380000, status: 'available', stage: 'Phase 2', bedrooms: 3, bathrooms: 2, frontage: 13, depth: 36, features: ['courtyard'],            path: 'M 670 370 L 720 360 L 730 410 L 680 420 Z', cx: 700, cy: 390 },
  { id: 'l42', lotNumber: '42', number: '42', area: 495, price: 395000, status: 'reserved',  stage: 'Phase 2', bedrooms: 3, bathrooms: 2, frontage: 13, depth: 37, features: ['courtyard','corner'],  path: 'M 720 360 L 770 350 L 780 400 L 730 410 Z', cx: 750, cy: 380 },
  { id: 'l43', lotNumber: '43', number: '43', area: 510, price: 410000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 13, depth: 38, features: ['courtyard'],            path: 'M 770 350 L 820 340 L 830 390 L 780 400 Z', cx: 800, cy: 370 },
  { id: 'l44', lotNumber: '44', number: '44', area: 525, price: 425000, status: 'available', stage: 'Phase 2', bedrooms: 4, bathrooms: 2, frontage: 13, depth: 39, features: ['courtyard'],            path: 'M 820 340 L 870 330 L 880 380 L 830 390 Z', cx: 850, cy: 360 },
  { id: 'l45', lotNumber: '45', number: '45', area: 540, price: 440000, status: 'sold',      stage: 'Phase 2', bedrooms: 4, bathrooms: 3, frontage: 13, depth: 40, features: ['courtyard','corner'],  path: 'M 870 330 L 920 320 L 930 370 L 880 380 Z', cx: 900, cy: 350 },
  { id: 'l50', lotNumber: '50', number: '50', area: 600, price: 520000, status: 'available', stage: 'Phase 3', bedrooms: 4, bathrooms: 2, frontage: 16, depth: 37, features: ['main-road','high-visibility'], path: 'M 1050 300 L 1100 290 L 1110 340 L 1060 350 Z', cx: 1080, cy: 320 },
  { id: 'l51', lotNumber: '51', number: '51', area: 615, price: 540000, status: 'available', stage: 'Phase 3', bedrooms: 4, bathrooms: 3, frontage: 16, depth: 38, features: ['main-road','high-visibility'], path: 'M 1100 290 L 1150 280 L 1160 330 L 1110 340 Z', cx: 1130, cy: 310 },
  { id: 'l52', lotNumber: '52', number: '52', area: 630, price: 560000, status: 'available', stage: 'Phase 3', bedrooms: 5, bathrooms: 3, frontage: 16, depth: 39, features: ['main-road','high-visibility','corner'], path: 'M 1150 280 L 1200 270 L 1210 320 L 1160 330 Z', cx: 1180, cy: 300 },
];

// ─── LOT DETAIL PANEL ───
function LotDetailPanel({ lot, onUpdate, onClose }: {
  lot: Lot;
  onUpdate: (lot: Lot) => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Lot>({ ...lot });
  const s = lot.status as keyof typeof STATUS_CONFIG;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-80 bg-[#0c111f] border-l border-gray-800 h-full overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold">Lot {lot.number || lot.lotNumber}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Badge style={{ backgroundColor: STATUS_CONFIG[s].bg, color: STATUS_CONFIG[s].color, borderColor: STATUS_CONFIG[s].color }}>
            {STATUS_CONFIG[s].label}
          </Badge>
          <span className="text-gray-500 text-xs">{lot.stage}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Area', value: `${lot.area} m²` },
            { label: 'Price', value: `$${(lot.price / 1000).toFixed(0)}k`, color: 'text-emerald-400' },
            { label: 'Frontage', value: `${lot.frontage}m` },
            { label: 'Depth', value: `${lot.depth}m` },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-gray-500 text-xs mb-1">{item.label}</div>
              <div className={`text-white font-semibold ${item.color || ''}`}>{item.value}</div>
            </div>
          ))}
        </div>
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Lot['status'] })}
                className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
              >
                {(['available', 'sold', 'reserved', 'hold'] as const).map((st) => (
                  <option key={st} value={st}>{STATUS_CONFIG[st].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs">Price ($)</label>
              <Input type="number" value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="mt-1 bg-gray-900 border-gray-700 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-xs">Stage</label>
              <Input value={formData.stage || ''}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="mt-1 bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500"
                onClick={() => { onUpdate(formData); setEditing(false); }}>
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setFormData({ ...lot }); setEditing(false); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => setEditing(true)}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Lot Data
          </Button>
        )}
        {lot.features && lot.features.length > 0 && (
          <div>
            <div className="text-gray-500 text-xs mb-2">Features</div>
            <div className="flex flex-wrap gap-1.5">
              {lot.features.map((f) => (
                <span key={f} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 capitalize">{f.replace('-', ' ')}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───
export default function LotIngestionEngine() {
  const [selectedLot, setSelectedLot] = useState<string | null>(null);
  const [hoveredLot, setHoveredLot] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [lots, setLots] = useState<Lot[]>(DEMO_LOTS);

  const selectedLotData = lots.find((l) => l.id === selectedLot) || null;

  const stats = useMemo(() => ({
    total: lots.length,
    available: lots.filter((l) => l.status === 'available').length,
    sold: lots.filter((l) => l.status === 'sold').length,
    reserved: lots.filter((l) => l.status === 'reserved').length,
    hold: lots.filter((l) => l.status === 'hold').length,
    totalValue: lots.reduce((sum, l) => sum + l.price, 0),
  }), [lots]);

  const handleLotUpdate = (updatedLot: Lot) => {
    setLots((prev) => prev.map((l) => (l.id === updatedLot.id ? updatedLot : l)));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert(`Uploading ${file.name}... In production, this triggers the AI extraction pipeline.`);
  };

  const filteredLots = lots.filter((l) => filterStatus === 'all' || l.status === filterStatus);

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0c111f] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-sm">Strathlone Estate</span>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{stats.available} of {stats.total} available</Badge>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input type="file" accept=".pdf,.dwg,.dxf,.png,.jpg,.svg" className="hidden" onChange={handleFileUpload} />
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs" asChild>
              <span><Upload className="w-3.5 h-3.5 mr-1" />Import Plan</span>
            </Button>
          </label>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#0a0e1a] border-b border-gray-800 overflow-x-auto">
        {(['all', 'available', 'sold', 'reserved', 'hold'] as const).map((status) => (
          <button key={status} onClick={() => setFilterStatus(status)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all flex-shrink-0 ${
              filterStatus === status ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status === 'all' ? '#6b7280' : STATUS_CONFIG[status].color }} />
            <span className="capitalize">{status}</span>
            <span className="text-gray-600 ml-1">{status === 'all' ? stats.total : stats[status]}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Total: <span className="text-emerald-400 font-semibold">${(stats.totalValue / 1000000).toFixed(1)}M</span></span>
        </div>
      </div>

      {/* SVG Viewer + Detail Panel */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <svg viewBox="0 0 1280 720" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {filteredLots.map((lot) => {
              const isSel = selectedLot === lot.id;
              const isHov = hoveredLot === lot.id;
              const sKey = lot.status as keyof typeof STATUS_CONFIG;
              const c = STATUS_CONFIG[sKey].color;
              return (
                <g key={lot.id} opacity={1}
                  onMouseEnter={() => setHoveredLot(lot.id)}
                  onMouseLeave={() => setHoveredLot(null)}
                  onClick={() => setSelectedLot(isSel ? null : lot.id)}
                  style={{ cursor: 'pointer' }}>
                  <path d={lot.path || ''}
                    fill={isSel ? 'rgba(59,130,246,0.4)' : isHov ? `${c}40` : `${c}20`}
                    stroke={isSel ? '#3b82f6' : isHov ? c : `${c}60`}
                    strokeWidth={isSel ? 3 : isHov ? 2.5 : 1.5}
                    style={{ transition: 'all 0.15s ease' }} />
                  <text x={lot.cx || 0} y={(lot.cy || 0) + 5}
                    textAnchor="middle" fill="white" fontSize="14" fontWeight="bold"
                    style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                    {lot.number}
                  </text>
                </g>
              );
            })}
          </svg>
          {/* Hover tooltip */}
          {hoveredLot && !selectedLot && (() => {
            const lot = lots.find((l) => l.id === hoveredLot);
            if (!lot) return null;
            const sk = lot.status as keyof typeof STATUS_CONFIG;
            return (
              <div className="absolute top-4 right-4 bg-gray-900/90 border border-gray-700 rounded-lg p-3 pointer-events-none z-10">
                <div className="text-white font-semibold text-sm">Lot {lot.number}</div>
                <div className="text-gray-400 text-xs">{lot.area}m² | ${(lot.price / 1000).toFixed(0)}k</div>
                <Badge className="mt-1 text-xs" style={{ backgroundColor: STATUS_CONFIG[sk].bg, color: STATUS_CONFIG[sk].color }}>{STATUS_CONFIG[sk].label}</Badge>
              </div>
            );
          })()}
        </div>
        <AnimatePresence>
          {selectedLotData && (
            <LotDetailPanel lot={selectedLotData} onUpdate={handleLotUpdate} onClose={() => setSelectedLot(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
