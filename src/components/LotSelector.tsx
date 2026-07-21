import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Droplets, Mountain, Eye, Maximize, Ruler,
  Check, X, Filter, Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Lot {
  id: string;
  lotNumber: string;
  area: number;
  frontage: number;
  depth: number;
  price: number;
  status: 'available' | 'sold' | 'reserved' | 'hold';
  zone: string;
  setbacks: { front: number; rear: number; side: number };
  maxHeight: number;
  maxCoverage: number;
  viewRating: number;
  sunExposure: 'full' | 'partial' | 'shaded';
  slope: 'flat' | 'gentle' | 'moderate' | 'steep';
  utilities: string[];
  position: { x: number; z: number; width: number; depth: number };
  soilType: string;
  floodZone: boolean;
}

interface Props {
  lots: Lot[];
  onSelectLot: (lotId: string | null) => void;
  selectedLot: string | null;
}

/* ────────────────────────────────────────────────
   LOT SELECTOR / CONFIGURATOR
   Interactive masterplan for land developments.
   Top-down SVG view with filtering, comparison,
   sun path overlay, and lot detail panel.
   ──────────────────────────────────────────────── */

const statusColors = {
  available: '#10B981',
  sold: '#6B7280',
  reserved: '#3B82F6',
  hold: '#F59E0B',
};

const statusBg = {
  available: 'bg-emerald-500',
  sold: 'bg-gray-500',
  reserved: 'bg-blue-500',
  hold: 'bg-amber-500',
};

export default function LotSelector({ lots, onSelectLot, selectedLot }: Props) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterMinArea, setFilterMinArea] = useState<number>(0);
  const [showSunPath, setShowSunPath] = useState(false);
  const [showViewLines, setShowViewLines] = useState(false);
  const [compareLots, setCompareLots] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeLot = lots.find((l) => l.id === selectedLot);

  const filteredLots = useMemo(() => {
    return lots.filter((l) => {
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (filterZone !== 'all' && l.zone !== filterZone) return false;
      if (l.area < filterMinArea) return false;
      return true;
    });
  }, [lots, filterStatus, filterZone, filterMinArea]);

  const stats = useMemo(() => ({
    total: lots.length,
    available: lots.filter((l) => l.status === 'available').length,
    sold: lots.filter((l) => l.status === 'sold').length,
    reserved: lots.filter((l) => l.status === 'reserved').length,
    avgPrice: lots.reduce((a, l) => a + l.price, 0) / lots.length,
    totalArea: lots.reduce((a, l) => a + l.area, 0),
  }), [lots]);

  const toggleCompare = (lotId: string) => {
    setCompareLots((prev) =>
      prev.includes(lotId)
        ? prev.filter((id) => id !== lotId)
        : prev.length < 3
        ? [...prev, lotId]
        : prev
    );
  };

  const compareLotData = lots.filter((l) => compareLots.includes(l.id));

  // Masterplan SVG dimensions
  const svgWidth = 900;
  const svgHeight = 700;
  const scale = 4; // pixels per meter

  // Normalize positions to fit SVG
  const normalizeX = (x: number) => (x + 50) * scale + svgWidth / 2;
  const normalizeZ = (z: number) => (z + 40) * scale + svgHeight / 2;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h3 className="text-white font-semibold text-lg">Lot Selector</h3>
          <p className="text-gray-500 text-xs">{stats.available} of {stats.total} lots available</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showSunPath ? 'default' : 'outline'}
            className={`text-xs ${showSunPath ? 'bg-amber-600' : 'border-gray-700 text-gray-400'}`}
            onClick={() => setShowSunPath(!showSunPath)}
          >
            <Sun className="w-3.5 h-3.5 mr-1" />
            Sun Path
          </Button>
          <Button
            size="sm"
            variant={showViewLines ? 'default' : 'outline'}
            className={`text-xs ${showViewLines ? 'bg-blue-600' : 'border-gray-700 text-gray-400'}`}
            onClick={() => setShowViewLines(!showViewLines)}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Views
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 text-gray-400 text-xs"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-xl p-4 mb-4 flex flex-wrap gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                  <option value="hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Zone</label>
                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300"
                >
                  <option value="all">All Zones</option>
                  <option value="R-1">R-1 Residential</option>
                  <option value="R-2">R-2 Residential</option>
                  <option value="Estate">Estate</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Min Area (sqm)</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={filterMinArea}
                  onChange={(e) => setFilterMinArea(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
                <span className="text-xs text-gray-400 ml-2">{filterMinArea}+</span>
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 text-xs"
                  onClick={() => { setFilterStatus('all'); setFilterZone('all'); setFilterMinArea(0); }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      <div className="flex gap-4 mb-4 px-2">
        {[
          { label: 'Available', value: stats.available, color: 'text-emerald-400' },
          { label: 'Sold', value: stats.sold, color: 'text-gray-400' },
          { label: 'Reserved', value: stats.reserved, color: 'text-blue-400' },
          { label: 'Avg Price', value: `$${(stats.avgPrice / 1000).toFixed(0)}K`, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-800/50 rounded-lg px-3 py-2">
            <div className={`text-sm font-semibold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content: SVG map + Detail panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* SVG Masterplan */}
        <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-700 overflow-auto relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            style={{ minWidth: svgWidth, minHeight: svgHeight }}
          >
            {/* Background */}
            <rect width={svgWidth} height={svgHeight} fill="#1a1f2e" />

            {/* Road network */}
            <rect x={0} y={svgHeight / 2 - 15} width={svgWidth} height={30} fill="#374151" />
            <rect x={svgWidth / 2 - 15} y={0} width={30} height={svgHeight} fill="#374151" />
            <rect x={svgWidth / 3 - 10} y={0} width={20} height={svgHeight} fill="#374151" opacity={0.6} />
            <rect x={0} y={svgHeight / 3 - 10} width={svgWidth} height={20} fill="#374151" opacity={0.6} />

            {/* Road labels */}
            <text x={svgWidth / 2} y={svgHeight / 2 - 20} textAnchor="middle" fill="#9CA3AF" fontSize="10">Main Boulevard</text>
            <text x={svgWidth / 2 + 20} y={svgHeight / 3} textAnchor="start" fill="#9CA3AF" fontSize="10" transform={`rotate(90, ${svgWidth / 2 + 20}, ${svgHeight / 3})`}>Park Avenue</text>

            {/* Green spaces */}
            <rect x={50} y={50} width={120} height={100} rx={8} fill="#064E3B" opacity={0.4} />
            <text x={110} y={105} textAnchor="middle" fill="#6EE7B7" fontSize="10">Central Park</text>

            <rect x={svgWidth - 170} y={svgHeight - 150} width={120} height={100} rx={8} fill="#064E3B" opacity={0.4} />
            <text x={svgWidth - 110} y={svgHeight - 95} textAnchor="middle" fill="#6EE7B7" fontSize="10">Community Garden</text>

            {/* Lake / water feature */}
            <ellipse cx={svgWidth - 100} cy={120} rx={70} ry={50} fill="#1E3A5F" opacity={0.6} />
            <text x={svgWidth - 100} y={125} textAnchor="middle" fill="#7DD3FC" fontSize="10">Serenity Lake</text>

            {/* Sun path overlay */}
            {showSunPath && (
              <g opacity={0.3}>
                <path
                  d={`M 50 ${svgHeight - 50} Q ${svgWidth / 2} 50 ${svgWidth - 50} ${svgHeight - 50}`}
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text x={svgWidth / 2} y={60} textAnchor="middle" fill="#FCD34D" fontSize="9">Summer Solstice Sun Path</text>
                {/* Direction indicator */}
                <g transform={`translate(${svgWidth - 80}, ${svgHeight - 80})`}>
                  <polygon points="0,-20 6,6 -6,6" fill="#FCD34D" />
                  <text x={0} y={-25} textAnchor="middle" fill="#FCD34D" fontSize="8">N</text>
                </g>
              </g>
            )}

            {/* View corridor lines */}
            {showViewLines && activeLot && (
              <g opacity={0.4}>
                {/* Line to lake */}
                <line
                  x1={normalizeX(activeLot.position.x)}
                  y1={normalizeZ(activeLot.position.z)}
                  x2={svgWidth - 100}
                  y2={120}
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                {/* Line to park */}
                <line
                  x1={normalizeX(activeLot.position.x)}
                  y1={normalizeZ(activeLot.position.z)}
                  x2={110}
                  y2={100}
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              </g>
            )}

            {/* Lot polygons */}
            {filteredLots.map((lot) => {
              const x = normalizeX(lot.position.x);
              const z = normalizeZ(lot.position.z);
              const w = lot.position.width * scale;
              const d = lot.position.depth * scale;
              const isSelected = selectedLot === lot.id;
              const isCompared = compareLots.includes(lot.id);

              return (
                <g
                  key={lot.id}
                  onClick={() => onSelectLot(isSelected ? null : lot.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Lot fill */}
                  <rect
                    x={x - w / 2}
                    y={z - d / 2}
                    width={w}
                    height={d}
                    rx={2}
                    fill={statusColors[lot.status]}
                    opacity={isSelected ? 0.5 : 0.25}
                    stroke={isSelected ? '#FFFFFF' : isCompared ? '#F59E0B' : statusColors[lot.status]}
                    strokeWidth={isSelected ? 2.5 : isCompared ? 2 : 1}
                  />
                  {/* Lot number */}
                  <text
                    x={x}
                    y={z - 2}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#D1D5DB'}
                    fontSize={w > 30 ? '11' : '8'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {lot.lotNumber}
                  </text>
                  {/* Area label */}
                  <text
                    x={x}
                    y={z + 10}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="8"
                  >
                    {lot.area}m²
                  </text>
                  {/* Price tag */}
                  {lot.status === 'available' && (
                    <text
                      x={x}
                      y={z + 20}
                      textAnchor="middle"
                      fill="#FCD34D"
                      fontSize="8"
                    >
                      ${(lot.price / 1000).toFixed(0)}K
                    </text>
                  )}
                  {/* Compare checkbox */}
                  <g
                    transform={`translate(${x + w / 2 - 12}, ${z - d / 2 + 4})`}
                    onClick={(e) => { e.stopPropagation(); toggleCompare(lot.id); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect width={10} height={10} rx={2} fill={isCompared ? '#F59E0B' : 'transparent'} stroke="#9CA3AF" strokeWidth={1} />
                    {isCompared && <text x={5} y={9} textAnchor="middle" fill="#FFFFFF" fontSize="8">✓</text>}
                  </g>
                </g>
              );
            })}

            {/* Legend */}
            <g transform={`translate(20, ${svgHeight - 110})`}>
              <rect x={-10} y={-15} width={130} height={95} rx={8} fill="#111827" opacity={0.8} />
              <text x={0} y={0} fill="#F3F4F6" fontSize="10" fontWeight="bold">Legend</text>
              {Object.entries(statusColors).map(([status, color], i) => (
                <g key={status} transform={`translate(0, ${18 + i * 16})`}>
                  <rect width={10} height={10} rx={2} fill={color} opacity={0.5} />
                  <text x={16} y={9} fill="#D1D5DB" fontSize="9" textAnchor="start" style={{ textTransform: 'capitalize' }}>{status}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Right: Detail or Comparison Panel */}
        <AnimatePresence mode="wait">
          {compareLots.length > 0 ? (
            <motion.div
              key="compare"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-80 glass-panel border-l border-gray-700 rounded-xl overflow-y-auto scrollbar-thin"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Compare ({compareLots.length})
                </h4>
                <button onClick={() => setCompareLots([])} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {compareLotData.map((lot) => (
                  <div key={lot.id} className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm">Lot {lot.lotNumber}</span>
                      <Badge className={statusBg[lot.status] + ' text-white text-[10px]'}>
                        {lot.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-gray-500">Area</span><span className="text-gray-300 text-right">{lot.area} m²</span>
                      <span className="text-gray-500">Frontage</span><span className="text-gray-300 text-right">{lot.frontage}m</span>
                      <span className="text-gray-500">Depth</span><span className="text-gray-300 text-right">{lot.depth}m</span>
                      <span className="text-gray-500">Max Height</span><span className="text-gray-300 text-right">{lot.maxHeight}m</span>
                      <span className="text-gray-500">Coverage</span><span className="text-gray-300 text-right">{lot.maxCoverage}%</span>
                      <span className="text-gray-500">Slope</span><span className="text-gray-300 text-right capitalize">{lot.slope}</span>
                    </div>
                    <div className="text-amber-400 font-semibold text-sm text-right">${(lot.price / 1000).toFixed(0)}K</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : activeLot ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-80 glass-panel border-l border-gray-700 rounded-xl overflow-y-auto scrollbar-thin"
            >
              {/* Lot Detail Panel */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold text-lg">Lot {activeLot.lotNumber}</h4>
                  <p className="text-gray-500 text-xs">{activeLot.zone} Zone</p>
                </div>
                <button onClick={() => onSelectLot(null)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Status & Price */}
                <div className="flex items-center justify-between">
                  <Badge className={statusBg[activeLot.status] + ' text-white'}>
                    {activeLot.status}
                  </Badge>
                  <div className="text-2xl font-bold text-white">${(activeLot.price / 1000).toFixed(0)}K</div>
                </div>

                {/* Key specs grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs flex items-center gap-1"><Ruler className="w-3 h-3" /> Area</div>
                    <div className="text-white font-semibold">{activeLot.area} m²</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs flex items-center gap-1"><Maximize className="w-3 h-3" /> Frontage</div>
                    <div className="text-white font-semibold">{activeLot.frontage}m</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs flex items-center gap-1"><Sun className="w-3 h-3" /> Sun</div>
                    <div className="text-white font-semibold capitalize">{activeLot.sunExposure}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs flex items-center gap-1"><Mountain className="w-3 h-3" /> Slope</div>
                    <div className="text-white font-semibold capitalize">{activeLot.slope}</div>
                  </div>
                </div>

                {/* View Rating */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs flex items-center gap-1"><Eye className="w-3 h-3" /> View Rating</span>
                    <span className="text-white font-semibold text-sm">{activeLot.viewRating}/10</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style={{ width: `${activeLot.viewRating * 10}%` }} />
                  </div>
                </div>

                {/* Build Parameters */}
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                  <h5 className="text-white text-sm font-medium">Build Parameters</h5>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Max Building Height</span>
                    <span className="text-gray-300">{activeLot.maxHeight}m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Max Site Coverage</span>
                    <span className="text-gray-300">{activeLot.maxCoverage}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Setbacks (F/R/S)</span>
                    <span className="text-gray-300">{activeLot.setbacks.front}m / {activeLot.setbacks.rear}m / {activeLot.setbacks.side}m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Soil Type</span>
                    <span className="text-gray-300">{activeLot.soilType}</span>
                  </div>
                  {activeLot.floodZone && (
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Droplets className="w-3 h-3" />
                      Flood zone - additional drainage required
                    </div>
                  )}
                </div>

                {/* Utilities */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="text-white text-sm font-medium mb-2">Available Utilities</h5>
                  <div className="flex flex-wrap gap-2">
                    {activeLot.utilities.map((u) => (
                      <span key={u} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" /> {u}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                    Reserve This Lot
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-amber-600/50 text-amber-400 hover:bg-amber-600/10"
                    onClick={() => toggleCompare(activeLot.id)}
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    {compareLots.includes(activeLot.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
