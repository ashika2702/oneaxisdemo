import { useState } from 'react';
import {
  Eye, Compass, ArrowUp, Sun, Building2,
  Waves, Trees, Mountain,
  Star, MapPin, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViewData {
  direction: 'north' | 'south' | 'east' | 'west';
  label: string;
  viewType: 'park' | 'sea' | 'city' | 'marina' | 'garden' | 'street' | 'mountain';
  quality: number; // 1-10
  description: string;
  features: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  sunExposure: 'full' | 'partial' | 'shaded';
}

interface UnitView {
  unitId: string;
  unitNumber: string;
  floor: number;
  views: ViewData[];
  primaryView: ViewData;
}

// ─── DEMO DATA ───
const UNIT_VIEWS: UnitView[] = [
  {
    unitId: 'u1', unitNumber: '1204', floor: 12,
    primaryView: { direction: 'north', label: 'North', viewType: 'marina', quality: 9, description: 'Direct marina view over the promenade. Full view of the yacht club and waterfront dining.', features: ['Marina', 'Waterfront', 'Yacht Club'], timeOfDay: 'afternoon', sunExposure: 'full' },
    views: [
      { direction: 'north', label: 'North', viewType: 'marina', quality: 9, description: 'Direct marina view over the promenade. Full view of the yacht club and waterfront dining.', features: ['Marina', 'Waterfront', 'Yacht Club'], timeOfDay: 'afternoon', sunExposure: 'full' },
      { direction: 'east', label: 'East', viewType: 'sea', quality: 8, description: 'Coastal view with horizon line. Morning sun rises over the water.', features: ['Ocean', 'Horizon', 'Sunrise'], timeOfDay: 'morning', sunExposure: 'full' },
      { direction: 'south', label: 'South', viewType: 'city', quality: 6, description: 'Urban skyline toward the business district. Evening city lights.', features: ['City', 'Skyline', 'Night Lights'], timeOfDay: 'evening', sunExposure: 'partial' },
      { direction: 'west', label: 'West', viewType: 'garden', quality: 7, description: 'Overlooks the communal gardens and children\'s play area. Quiet and green.', features: ['Gardens', 'Park', 'Green Space'], timeOfDay: 'afternoon', sunExposure: 'partial' },
    ],
  },
  {
    unitId: 'u2', unitNumber: '1205', floor: 12,
    primaryView: { direction: 'north', label: 'North', viewType: 'marina', quality: 8, description: 'Marina view slightly angled. Still captures the waterfront and promenade.', features: ['Marina', 'Waterfront'], timeOfDay: 'afternoon', sunExposure: 'partial' },
    views: [
      { direction: 'north', label: 'North', viewType: 'marina', quality: 8, description: 'Marina view slightly angled. Still captures the waterfront and promenade.', features: ['Marina', 'Waterfront'], timeOfDay: 'afternoon', sunExposure: 'partial' },
      { direction: 'east', label: 'East', viewType: 'city', quality: 6, description: 'Neighbouring development and street view.', features: ['Street', 'Urban'], timeOfDay: 'morning', sunExposure: 'shaded' },
      { direction: 'south', label: 'South', viewType: 'city', quality: 7, description: 'Business district skyline with evening illumination.', features: ['City', 'Skyline'], timeOfDay: 'evening', sunExposure: 'partial' },
      { direction: 'west', label: 'West', viewType: 'park', quality: 9, description: 'Unobstructed park view. Mature trees and walking trails.', features: ['Park', 'Trees', 'Nature'], timeOfDay: 'afternoon', sunExposure: 'full' },
    ],
  },
  {
    unitId: 'u3', unitNumber: '805', floor: 8,
    primaryView: { direction: 'south', label: 'South', viewType: 'city', quality: 7, description: 'Mid-level city view. Good balance of skyline and street activity.', features: ['City', 'Skyline', 'Street Life'], timeOfDay: 'evening', sunExposure: 'partial' },
    views: [
      { direction: 'north', label: 'North', viewType: 'garden', quality: 7, description: 'Communal garden view from above. Landscaped terraces visible.', features: ['Gardens', 'Landscaping'], timeOfDay: 'morning', sunExposure: 'partial' },
      { direction: 'east', label: 'East', viewType: 'street', quality: 5, description: 'Street-level view of the avenue. Some traffic noise.', features: ['Street', 'Avenue'], timeOfDay: 'morning', sunExposure: 'shaded' },
      { direction: 'south', label: 'South', viewType: 'city', quality: 7, description: 'Mid-level city view. Good balance of skyline and street activity.', features: ['City', 'Skyline', 'Street Life'], timeOfDay: 'evening', sunExposure: 'partial' },
      { direction: 'west', label: 'West', viewType: 'park', quality: 8, description: 'Park edge view. Mature canopy at eye level.', features: ['Park', 'Trees'], timeOfDay: 'afternoon', sunExposure: 'partial' },
    ],
  },
  {
    unitId: 'u4', unitNumber: '1501', floor: 15,
    primaryView: { direction: 'east', label: 'East', viewType: 'sea', quality: 10, description: 'Unobstructed panoramic ocean view from penthouse level. Horizon line visible.', features: ['Ocean', 'Horizon', 'Panoramic'], timeOfDay: 'morning', sunExposure: 'full' },
    views: [
      { direction: 'north', label: 'North', viewType: 'marina', quality: 9, description: 'Bird\'s eye marina view. Yachts and waterfront from above.', features: ['Marina', 'Aerial View'], timeOfDay: 'afternoon', sunExposure: 'full' },
      { direction: 'east', label: 'East', viewType: 'sea', quality: 10, description: 'Unobstructed panoramic ocean view from penthouse level. Horizon line visible.', features: ['Ocean', 'Horizon', 'Panoramic'], timeOfDay: 'morning', sunExposure: 'full' },
      { direction: 'south', label: 'South', viewType: 'city', quality: 8, description: 'Expansive city view. Multiple districts visible.', features: ['City', 'Panoramic', 'Skyline'], timeOfDay: 'evening', sunExposure: 'full' },
      { direction: 'west', label: 'West', viewType: 'mountain', quality: 9, description: 'Distant mountain range visible on clear days. Sunset views.', features: ['Mountains', 'Sunset', 'Distance'], timeOfDay: 'evening', sunExposure: 'full' },
    ],
  },
];

const VIEW_TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  marina:  { icon: Waves, color: '#3b82f6', bg: 'bg-blue-500/10' },
  sea:     { icon: Waves, color: '#06b6d4', bg: 'bg-cyan-500/10' },
  city:    { icon: Building2, color: '#8b5cf6', bg: 'bg-purple-500/10' },
  park:    { icon: Trees, color: '#10b981', bg: 'bg-emerald-500/10' },
  garden:  { icon: Trees, color: '#22c55e', bg: 'bg-green-500/10' },
  street:  { icon: MapPin, color: '#6b7280', bg: 'bg-gray-500/10' },
  mountain: { icon: Mountain, color: '#f59e0b', bg: 'bg-amber-500/10' },
};

const DIRECTION_ANGLES: Record<string, number> = {
  north: 0, east: 90, south: 180, west: 270,
};

// ─── VIEW SIMULATION PANEL ───
function ViewSimulation({ view, unitFloor }: { view: ViewData; unitFloor: number }) {
  const cfg = VIEW_TYPE_CONFIG[view.viewType] || VIEW_TYPE_CONFIG.street;
  const Icon = cfg.icon;
  const angle = DIRECTION_ANGLES[view.direction] || 0;

  // Simulated view gradient based on view type
  const viewGradients: Record<string, string> = {
    marina: 'from-blue-900 via-blue-700 to-cyan-600',
    sea: 'from-cyan-900 via-blue-600 to-teal-500',
    city: 'from-gray-900 via-purple-900 to-indigo-800',
    park: 'from-green-900 via-emerald-700 to-green-500',
    garden: 'from-green-800 via-emerald-600 to-teal-500',
    street: 'from-gray-800 via-gray-700 to-gray-600',
    mountain: 'from-amber-900 via-orange-800 to-yellow-700',
  };

  const horizon = Math.max(30, 70 - unitFloor * 2); // Higher floor = lower horizon

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-b">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-b ${viewGradients[view.viewType] || viewGradients.city}`} />
      
      {/* Horizon line */}
      <div className="absolute w-full border-t border-white/10" style={{ top: `${horizon}%` }} />
      
      {/* Simulated elements based on view type */}
      {view.viewType === 'marina' && (
        <>
          <div className="absolute bottom-[20%] left-[10%] right-[10%] h-[30%] bg-blue-800/40 rounded-t-3xl" />
          <div className="absolute bottom-[25%] left-[20%] w-8 h-4 bg-white/20 rounded-full" />
          <div className="absolute bottom-[22%] left-[40%] w-12 h-5 bg-white/15 rounded-full" />
          <div className="absolute bottom-[28%] left-[60%] w-6 h-3 bg-white/20 rounded-full" />
        </>
      )}
      {view.viewType === 'sea' && (
        <>
          <div className="absolute bottom-[15%] left-0 right-0 h-[40%] bg-gradient-to-t from-cyan-800/50 to-transparent" />
          <div className="absolute bottom-[30%] left-[15%] w-full h-px bg-white/10" />
          <div className="absolute bottom-[35%] left-[10%] w-full h-px bg-white/5" />
        </>
      )}
      {view.viewType === 'city' && (
        <>
          {[20, 35, 50, 65, 80].map((x, i) => (
            <div key={i} className="absolute bottom-0 bg-purple-500/20 rounded-t-sm"
              style={{ left: `${x}%`, width: '8%', height: `${30 + Math.random() * 40}%` }} />
          ))}
          {[25, 45, 70].map((x, i) => (
            <div key={i} className="absolute bottom-0 bg-indigo-500/15 rounded-t-sm"
              style={{ left: `${x}%`, width: '6%', height: `${50 + Math.random() * 30}%` }} />
          ))}
        </>
      )}
      {view.viewType === 'park' && (
        <>
          <div className="absolute bottom-[20%] left-0 right-0 h-[50%] bg-gradient-to-t from-green-800/40 to-transparent" />
          {[15, 30, 50, 70, 85].map((x, i) => (
            <div key={i} className="absolute rounded-full bg-green-600/30"
              style={{ left: `${x}%`, bottom: `${20 + Math.random() * 15}%`, width: '8%', aspectRatio: '1' }} />
          ))}
        </>
      )}

      {/* Floor height indicator */}
      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-white/70">
        Floor {unitFloor} — {view.direction.toUpperCase()}
      </div>

      {/* View quality badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="text-[10px] text-white font-medium">{view.quality}/10</span>
      </div>

      {/* Direction compass */}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
        <Compass className="w-5 h-5 text-white/50" style={{ transform: `rotate(${angle}deg)` }} />
      </div>

      {/* Sun exposure indicator */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
        <Sun className="w-3 h-3 text-amber-400" />
        <span className="text-[10px] text-white/70 capitalize">{view.sunExposure}</span>
      </div>

      {/* Description overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
          <span className="text-xs font-medium capitalize" style={{ color: cfg.color }}>{view.viewType}</span>
        </div>
        <p className="text-[11px] text-white/80 leading-relaxed">{view.description}</p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function TrueViewEngine() {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [selectedDirection, setSelectedDirection] = useState<string>('north');
  const [compareMode, setCompareMode] = useState(false);
  const [compareUnitIdx, setCompareUnitIdx] = useState<number | null>(null);

  const unit = UNIT_VIEWS[selectedUnitIdx];
  const currentView = unit.views.find((v) => v.direction === selectedDirection) || unit.views[0];
  const compareUnit = compareUnitIdx !== null ? UNIT_VIEWS[compareUnitIdx] : null;
  const compareView = compareUnit?.views.find((v) => v.direction === selectedDirection) || compareUnit?.views[0];

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            True View From Every Unit
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">See exactly what buyers see — accurate views at real height and aspect</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`border-gray-700 text-xs ${compareMode ? 'bg-blue-600 border-blue-500 text-white' : 'text-gray-400'}`}
            onClick={() => { setCompareMode(!compareMode); setCompareUnitIdx(null); }}
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            {compareMode ? 'Exit Compare' : 'Compare Units'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — unit selector */}
        <div className="w-64 border-r border-gray-800 overflow-y-auto p-4 space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Select Unit</div>
          {UNIT_VIEWS.map((u, i) => {
            const cfg = VIEW_TYPE_CONFIG[u.primaryView.viewType];
            const Icon = cfg?.icon || Eye;
            return (
              <button
                key={u.unitId}
                onClick={() => {
                  if (compareMode && i !== selectedUnitIdx) {
                    setCompareUnitIdx(i);
                  } else {
                    setSelectedUnitIdx(i);
                  }
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  i === selectedUnitIdx
                    ? 'border-blue-500 bg-blue-500/10'
                    : compareMode && i === compareUnitIdx
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-semibold text-sm">Unit {u.unitNumber}</span>
                  <span className="text-gray-500 text-xs">Floor {u.floor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3" style={{ color: cfg?.color }} />
                  <span className="text-xs capitalize" style={{ color: cfg?.color }}>{u.primaryView.viewType}</span>
                  <span className="text-gray-600 text-xs ml-auto">{u.primaryView.quality}/10</span>
                </div>
              </button>
            );
          })}

          {/* View legend */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">View Types</div>
            {Object.entries(VIEW_TYPE_CONFIG).map(([key, val]) => {
              const I = val.icon;
              return (
                <div key={key} className="flex items-center gap-2 py-1">
                  <I className="w-3 h-3" style={{ color: val.color }} />
                  <span className="text-xs text-gray-400 capitalize">{key}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main view area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Direction tabs */}
          <div className="flex items-center gap-2 mb-4">
            {(['north', 'east', 'south', 'west'] as const).map((dir) => {
              const v = unit.views.find((vi) => vi.direction === dir);
              const isActive = selectedDirection === dir;
              return (
                <button
                  key={dir}
                  onClick={() => setSelectedDirection(dir)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  {dir.charAt(0).toUpperCase() + dir.slice(1)}
                  {v && <span className="opacity-60">{v.quality}/10</span>}
                </button>
              );
            })}
          </div>

          {/* View simulation */}
          {compareMode && compareUnit && compareView ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Unit {unit.unitNumber}</Badge>
                  <span className="text-gray-500 text-xs">Floor {unit.floor}</span>
                </div>
                <ViewSimulation view={currentView} unitFloor={unit.floor} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Unit {compareUnit.unitNumber}</Badge>
                  <span className="text-gray-500 text-xs">Floor {compareUnit.floor}</span>
                </div>
                <ViewSimulation view={compareView} unitFloor={compareUnit.floor} />
              </div>
            </div>
          ) : (
            <ViewSimulation view={currentView} unitFloor={unit.floor} />
          )}

          {/* View details */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white">View Quality</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{currentView.quality}<span className="text-gray-500 text-lg">/10</span></div>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < currentView.quality ? 'bg-amber-400' : 'bg-gray-700'}`} />
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white">Sun Exposure</span>
              </div>
              <div className="text-lg font-bold text-white capitalize">{currentView.sunExposure}</div>
              <p className="text-xs text-gray-500 mt-1">
                {currentView.sunExposure === 'full' ? 'Direct sunlight most of the day' :
                 currentView.sunExposure === 'partial' ? 'Filtered light, some shade' :
                 'Mostly shaded, minimal direct light'}
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Floor Advantage</span>
              </div>
              <div className="text-lg font-bold text-white">{unit.floor >= 15 ? 'Premium' : unit.floor >= 8 ? 'Elevated' : 'Standard'}</div>
              <p className="text-xs text-gray-500 mt-1">
                {unit.floor >= 15 ? 'Unobstructed panoramic views' :
                 unit.floor >= 8 ? 'Clear views over surrounding buildings' :
                 'Street-level with some neighbouring views'}
              </p>
            </div>
          </div>

          {/* View features */}
          <div className="mt-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <div className="text-sm font-medium text-white mb-3">View Features</div>
            <div className="flex flex-wrap gap-2">
              {currentView.features.map((f) => (
                <Badge key={f} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
