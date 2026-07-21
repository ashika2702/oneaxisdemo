import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Eye, Compass, Mountain, Sun, Droplets,
  Check, X, Ruler, Layers, Maximize2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import type { Lot } from '@/types';

interface Props {
  lots: Lot[];
  onSelectLot: (lotId: string | null) => void;
  selectedLot: string | null;
  showBeforeAfter?: boolean;
}

/* ────────────────────────────────────────────────
   AERIAL LOT MAP OVERLAY
   Color-coded lot markers on satellite-style
   aerial imagery. Shows current land state with
   lot boundaries, availability status, and
   detailed info on selection.
   ──────────────────────────────────────────── */

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  available: { color: '#10B981', bg: 'bg-emerald-500', label: 'Available' },
  sold: { color: '#EF4444', bg: 'bg-red-500', label: 'Sold' },
  reserved: { color: '#F59E0B', bg: 'bg-amber-500', label: 'Reserved' },
  hold: { color: '#6B7280', bg: 'bg-gray-500', label: 'Hold' },
};

export default function AerialLotMap({ lots, onSelectLot, selectedLot, showBeforeAfter = true }: Props) {
  const [viewMode, setViewMode] = useState<'aerial' | '3d' | 'beforeafter'>('aerial');
  const [hoveredLot, setHoveredLot] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeLot = lots.find((l) => l.id === selectedLot);

  const filteredLots = useMemo(() => {
    return filterStatus === 'all' ? lots : lots.filter((l) => l.status === filterStatus);
  }, [lots, filterStatus]);

  const stats = useMemo(() => ({
    total: lots.length,
    available: lots.filter((l) => l.status === 'available').length,
    sold: lots.filter((l) => l.status === 'sold').length,
    reserved: lots.filter((l) => l.status === 'reserved').length,
    totalValue: lots.reduce((a, l) => a + l.price, 0),
  }), [lots]);

  // Normalize lot positions to fit the map
  const normalizeX = (x: number) => ((x + 50) / 100) * 100;
  const normalizeZ = (z: number) => ((z + 60) / 120) * 100;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Aerial Masterplan
          </h3>
          <p className="text-gray-500 text-xs">{stats.available} of {stats.total} lots available</p>
        </div>
        <div className="flex gap-1 bg-gray-800/80 rounded-lg p-0.5">
          {[
            { key: 'aerial' as const, label: 'Aerial', icon: <MapPin className="w-3 h-3" /> },
            { key: '3d' as const, label: '3D View', icon: <Layers className="w-3 h-3" /> },
            ...(showBeforeAfter ? [{ key: 'beforeafter' as const, label: 'Before/After', icon: <Maximize2 className="w-3 h-3" /> }] : []),
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setViewMode(v.key)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all ${
                viewMode === v.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2 mb-3 px-2">
        {[
          { label: 'Available', value: stats.available, color: 'text-emerald-400', dot: '#10B981' },
          { label: 'Sold', value: stats.sold, color: 'text-red-400', dot: '#EF4444' },
          { label: 'Reserved', value: stats.reserved, color: 'text-amber-400', dot: '#F59E0B' },
          { label: 'Total Value', value: `$${(stats.totalValue / 1000000).toFixed(1)}M`, color: 'text-blue-400', dot: '#3B82F6' },
        ].map((s) => (
          <div key={s.label} className="flex-1 bg-gray-800/50 rounded-lg px-2.5 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.dot }} />
              <span className={`text-sm font-semibold ${s.color}`}>{s.value}</span>
            </div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-3 px-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
            filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          All Lots
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 ${
              filterStatus === status ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
            {config.label}
          </button>
        ))}
      </div>

      {/* Map Area */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Main Map */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-700 bg-[#1a1f2e]">
          {viewMode === 'aerial' && (
            <>
              {/* Satellite-style background */}
              <div className="absolute inset-0" style={{
                background: `linear-gradient(180deg, 
                  #87CEEB 0%, #87CEEB 15%, 
                  #4A7C59 15%, #5A8A5A 20%, 
                  #C4A96E 20%, #C4A96E 35%, 
                  #B8A05E 35%, #B8A05E 50%, 
                  #A89150 50%, #A89150 70%, 
                  #8B7A4A 70%, #8B7A4A 85%,
                  #6B8E6B 85%, #6B8E6B 100%)`
              }}>
                {/* Road network */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect x="0" y="48" width="100" height="4" fill="#808080" opacity="0.6" />
                  <rect x="48" y="0" width="4" height="100" fill="#808080" opacity="0.6" />
                  <rect x="0" y="78" width="100" height="3" fill="#707070" opacity="0.5" />
                  <rect x="23" y="0" width="2.5" height="100" fill="#707070" opacity="0.5" />
                  <rect x="73" y="0" width="2.5" height="100" fill="#707070" opacity="0.5" />
                  
                  {/* Water body */}
                  <ellipse cx="80" cy="12" rx="15" ry="8" fill="#4A90D9" opacity="0.5" />
                  
                  {/* Trees */}
                  {[
                    [8, 30], [15, 55], [35, 18], [35, 42], [60, 18],
                    [90, 35], [90, 65], [8, 88], [50, 88], [85, 88]
                  ].map(([x, y], i) => (
                    <circle key={`t-${i}`} cx={x} cy={y} r="2" fill="#2D5A3D" opacity="0.6" />
                  ))}
                </svg>
              </div>

              {/* Lot markers */}
              {filteredLots.map((lot) => {
                const pos = lot.position || { x: 0, z: 0, width: 0, depth: 0 };
                const cx = normalizeX(pos.x);
                const cy = normalizeZ(pos.z);
                const isSelected = selectedLot === lot.id;
                const isHovered = hoveredLot === lot.id;
                const config = statusConfig[lot.status];

                return (
                  <motion.div
                    key={lot.id}
                    className="absolute"
                    style={{ left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={(e) => { e.stopPropagation(); onSelectLot(isSelected ? null : lot.id); }}
                    onMouseEnter={() => setHoveredLot(lot.id)}
                    onMouseLeave={() => setHoveredLot(null)}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    {/* Lot boundary */}
                    <div
                      className="absolute rounded-sm border-2"
                      style={{
                        width: `${((lot.position?.width || 0) / 100) * 80}px`,
                        height: `${((lot.position?.depth || 0) / 100) * 80}px`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderColor: config.color,
                        backgroundColor: config.color + '15',
                        opacity: isSelected ? 0.6 : 0.2,
                      }}
                    />
                    
                    {/* Status dot */}
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: config.color }}
                    >
                      <span className="text-white text-[8px] font-bold">{(lot.lotNumber || '').split('-')[1] || lot.lotNumber}</span>
                    </div>

                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {isHovered && !isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 whitespace-nowrap z-20 border border-gray-700"
                        >
                          <div className="text-white text-[10px] font-semibold">Lot {lot.lotNumber}</div>
                          <div className="text-gray-400 text-[9px]">{lot.area}m² • {lot.zone}</div>
                          <div className="text-amber-400 text-[9px] font-semibold">${(lot.price / 1000000).toFixed(1)}M</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg p-2.5 border border-gray-800">
                <div className="text-[9px] text-gray-400 mb-1.5 font-semibold">Legend</div>
                <div className="space-y-1">
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <div key={status} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      <span className="text-[9px] text-gray-400">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compass */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-gray-700 flex items-center justify-center">
                <Compass className="w-4 h-4 text-gray-400" />
              </div>

              {/* Scale */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                <div className="text-white text-[9px]">100m</div>
                <div className="w-12 h-0.5 bg-white mt-0.5" />
              </div>
            </>
          )}

          {viewMode === '3d' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Layers className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">3D masterplan view</p>
                <p className="text-gray-600 text-[10px] mt-1">Interactive 3D model with lot overlays</p>
              </div>
            </div>
          )}

          {viewMode === 'beforeafter' && (
            <div className="absolute inset-0 p-2">
              <BeforeAfterPreview lots={lots} />
            </div>
          )}
        </div>

        {/* Selected Lot Detail Panel */}
        <AnimatePresence>
          {activeLot && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden flex-shrink-0"
            >
              <div className="w-[280px] glass-panel border border-gray-700 rounded-xl h-full overflow-y-auto scrollbar-thin p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold text-lg">Lot {activeLot.lotNumber}</h4>
                  <button onClick={() => onSelectLot(null)} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Badge className={`${statusConfig[activeLot.status].bg} text-white text-[10px]`}>
                  {statusConfig[activeLot.status].label}
                </Badge>

                <div className="text-2xl font-bold text-white">${(activeLot.price / 1000000).toFixed(1)}M</div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-800/50 rounded-lg p-2.5">
                    <div className="text-gray-500 text-[9px] flex items-center gap-1"><Ruler className="w-3 h-3" /> Area</div>
                    <div className="text-white text-sm font-semibold">{activeLot.area} m²</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2.5">
                    <div className="text-gray-500 text-[9px] flex items-center gap-1"><Eye className="w-3 h-3" /> Frontage</div>
                    <div className="text-white text-sm font-semibold">{activeLot.frontage}m</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2.5">
                    <div className="text-gray-500 text-[9px] flex items-center gap-1"><Sun className="w-3 h-3" /> Sun</div>
                    <div className="text-white text-sm font-semibold capitalize">{activeLot.sunExposure}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2.5">
                    <div className="text-gray-500 text-[9px] flex items-center gap-1"><Mountain className="w-3 h-3" /> Slope</div>
                    <div className="text-white text-sm font-semibold capitalize">{activeLot.slope}</div>
                  </div>
                </div>

                {/* View Rating */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-400 text-[10px] flex items-center gap-1"><Eye className="w-3 h-3" /> View Rating</span>
                    <span className="text-white text-sm font-semibold">{activeLot.viewRating || 0}/10</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style={{ width: `${(activeLot.viewRating || 0) * 10}%` }} />
                  </div>
                </div>

                {/* Build Parameters */}
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-1.5">
                  <h5 className="text-white text-xs font-medium">Build Parameters</h5>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Max Height</span><span className="text-gray-300">{activeLot.maxHeight}m</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Max Coverage</span><span className="text-gray-300">{activeLot.maxCoverage}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Soil Type</span><span className="text-gray-300">{activeLot.soilType}</span></div>
                </div>

                {/* Utilities */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="text-white text-xs font-medium mb-2">Utilities</h5>
                  <div className="flex flex-wrap gap-1">
                    {(activeLot.utilities || []).map((u) => (
                      <span key={u} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> {u}
                      </span>
                    ))}
                  </div>
                </div>

                {activeLot.floodZone && (
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Droplets className="w-3 h-3" /> Flood zone — drainage required
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Mini before/after for the aerial map tab
function BeforeAfterPreview({ lots }: { lots: Lot[] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    setSliderPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden cursor-ew-resize relative"
      onMouseMove={(e) => dragging.current && handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
    >
      {/* After - developed view */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-blue-900/30">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <rect x="20" y="20" width="25" height="20" fill="#E8E0D4" opacity="0.6" rx="2" />
          <rect x="55" y="20" width="25" height="20" fill="#E8E0D4" opacity="0.6" rx="2" />
          <rect x="20" y="55" width="25" height="20" fill="#DDD5C5" opacity="0.6" rx="2" />
          <rect x="55" y="55" width="25" height="20" fill="#DDD5C5" opacity="0.6" rx="2" />
          {lots.filter(l => l.status === 'available').map((lot, i) => (
            <circle key={lot.id} cx={30 + (i % 3) * 25} cy={35 + Math.floor(i / 3) * 35} r="3" fill="#10B981" opacity="0.8" />
          ))}
        </svg>
      </div>
      
      {/* Before - empty land */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-yellow-900/30"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {[20, 55].map((x) => [20, 55].map((y) => (
            <rect key={`p-${x}-${y}`} x={x} y={y} width="25" height="20" fill="#C4A96E" opacity="0.5" strokeDasharray="4,2" rx="2" />
          )))}
        </svg>
      </div>

      {/* Slider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${sliderPos}%` }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center"
          onMouseDown={() => { dragging.current = true; }}
          onTouchStart={() => { dragging.current = true; }}
        >
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-gray-400" />
            <div className="w-0.5 h-3 bg-gray-400" />
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-2 bg-amber-600/80 text-white text-[9px] px-2 py-0.5 rounded">Current</div>
      <div className="absolute top-2 right-2 bg-emerald-600/80 text-white text-[9px] px-2 py-0.5 rounded">Vision</div>
    </div>
  );
}
