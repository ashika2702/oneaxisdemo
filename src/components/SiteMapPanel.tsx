import { useState, useEffect } from 'react';
import {
  MapPin, Sun, Wind, Droplets, Mountain, Compass,
  Calendar, Clock, CloudRain, Thermometer,
  Satellite, Play, Pause
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GeoSite {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  timezone: string;
  elevation: number;
  climateZone: string;
}

interface SunPosition {
  time: string;
  altitude: number;
  azimuth: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

interface WindData {
  prevailingDirection: number;
  averageSpeed: number;
  maxSpeed: number;
  seasonal: { season: string; direction: number; speed: number }[];
}

interface RainfallData {
  annual: number;
  wettestMonth: string;
  driestMonth: string;
  monthly: { month: string; mm: number }[];
}

interface Props {
  geoSite: GeoSite | null;
}

/* ────────────────────────────────────────────────
   GEOGRAPHIC SITE MAP PANEL
   Satellite-style map with sun path animation,
   wind rose, rainfall chart, and climate data.
   ──────────────────────────────────────────── */

export default function SiteMapPanel({ geoSite }: Props) {
  const [activeTab, setActiveTab] = useState<'map' | 'sun' | 'wind' | 'rain'>('map');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [sunAnimating, setSunAnimating] = useState(false);
  const [sunTimeIndex, setSunTimeIndex] = useState(12);

  // Demo data if none provided
  const site = geoSite || {
    lat: 25.2048,
    lng: 55.2708,
    address: 'Sheikh Zayed Road',
    city: 'Dubai',
    country: 'UAE',
    timezone: 'GST+4',
    elevation: 5,
    climateZone: 'Hot Desert (BWh)',
  };

  // Generate sun path data for solstices and equinox
  const sunPathData: SunPosition[] = [
    { time: '06:00', altitude: 5, azimuth: 75, season: 'summer' },
    { time: '07:00', altitude: 18, azimuth: 82, season: 'summer' },
    { time: '08:00', altitude: 32, azimuth: 90, season: 'summer' },
    { time: '09:00', altitude: 45, azimuth: 100, season: 'summer' },
    { time: '10:00', altitude: 58, azimuth: 115, season: 'summer' },
    { time: '11:00', altitude: 72, azimuth: 135, season: 'summer' },
    { time: '12:00', altitude: 87, azimuth: 180, season: 'summer' },
    { time: '13:00', altitude: 80, azimuth: 225, season: 'summer' },
    { time: '14:00', altitude: 65, azimuth: 250, season: 'summer' },
    { time: '15:00', altitude: 50, azimuth: 265, season: 'summer' },
    { time: '16:00', altitude: 35, azimuth: 278, season: 'summer' },
    { time: '17:00', altitude: 20, azimuth: 288, season: 'summer' },
    { time: '18:00', altitude: 8, azimuth: 296, season: 'summer' },
  ];

  const windData: WindData = {
    prevailingDirection: 315, // NW
    averageSpeed: 14,
    maxSpeed: 45,
    seasonal: [
      { season: 'Spring', direction: 300, speed: 12 },
      { season: 'Summer', direction: 270, speed: 10 },
      { season: 'Autumn', direction: 330, speed: 16 },
      { season: 'Winter', direction: 340, speed: 18 },
    ],
  };

  const rainfallData: RainfallData = {
    annual: 94,
    wettestMonth: 'March',
    driestMonth: 'June',
    monthly: [
      { month: 'Jan', mm: 18 }, { month: 'Feb', mm: 15 }, { month: 'Mar', mm: 16 },
      { month: 'Apr', mm: 4 }, { month: 'May', mm: 1 }, { month: 'Jun', mm: 0 },
      { month: 'Jul', mm: 0 }, { month: 'Aug', mm: 0 }, { month: 'Sep', mm: 0 },
      { month: 'Oct', mm: 1 }, { month: 'Nov', mm: 5 }, { month: 'Dec', mm: 14 },
    ],
  };

  // Animate sun
  useEffect(() => {
    if (!sunAnimating) return;
    const interval = setInterval(() => {
      setSunTimeIndex((prev) => (prev + 1) % sunPathData.length);
    }, 800);
    return () => clearInterval(interval);
  }, [sunAnimating, sunPathData.length]);

  const currentSun = sunPathData[sunTimeIndex];

  // Wind rose directions
  const windDirections = [
    { angle: 0, label: 'N', speed: 8 },
    { angle: 45, label: 'NE', speed: 5 },
    { angle: 90, label: 'E', speed: 3 },
    { angle: 135, label: 'SE', speed: 4 },
    { angle: 180, label: 'S', speed: 6 },
    { angle: 225, label: 'SW', speed: 12 },
    { angle: 270, label: 'W', speed: 15 },
    { angle: 315, label: 'NW', speed: 18 },
  ];

  const maxRain = Math.max(...rainfallData.monthly.map((m) => m.mm));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Site Geography
          </h3>
          <p className="text-gray-500 text-xs">{site.city}, {site.country} • {site.lat.toFixed(4)}, {site.lng.toFixed(4)}</p>
        </div>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-4 gap-2 mb-4 px-2">
        {[
          { icon: <Mountain className="w-3.5 h-3.5" />, label: 'Elevation', value: `${site.elevation}m`, color: 'text-gray-400' },
          { icon: <Thermometer className="w-3.5 h-3.5" />, label: 'Climate', value: site.climateZone.split(' ')[0], color: 'text-amber-400' },
          { icon: <Compass className="w-3.5 h-3.5" />, label: 'Lat/Lng', value: `${site.lat.toFixed(1)}, ${site.lng.toFixed(1)}`, color: 'text-blue-400' },
          { icon: <Clock className="w-3.5 h-3.5" />, label: 'Timezone', value: site.timezone, color: 'text-emerald-400' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-800/50 rounded-lg p-2.5 text-center">
            <div className={`${item.color} flex justify-center mb-1`}>{item.icon}</div>
            <div className="text-white text-xs font-semibold">{item.value}</div>
            <div className="text-gray-500 text-[10px]">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 px-2">
        {[
          { key: 'map' as const, label: 'Satellite', icon: <Satellite className="w-3.5 h-3.5" /> },
          { key: 'sun' as const, label: 'Sun Path', icon: <Sun className="w-3.5 h-3.5" /> },
          { key: 'wind' as const, label: 'Wind', icon: <Wind className="w-3.5 h-3.5" /> },
          { key: 'rain' as const, label: 'Rainfall', icon: <Droplets className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        {/* ─── MAP TAB ─── */}
        {activeTab === 'map' && (
          <div className="space-y-3">
            {/* Map style toggle */}
            <div className="flex gap-1">
              {(['satellite', 'terrain', 'hybrid'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setMapStyle(style)}
                  className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${
                    mapStyle === style ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Simulated satellite map */}
            <div className="relative rounded-xl overflow-hidden border border-gray-700" style={{ aspectRatio: '4/3' }}>
              <div className={`absolute inset-0 ${
                mapStyle === 'satellite'
                  ? 'bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900'
                  : mapStyle === 'terrain'
                  ? 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100'
                  : 'bg-gradient-to-br from-amber-800 via-orange-700 to-amber-900'
              }`}>
                {/* Grid lines representing city blocks */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  {Array.from({ length: 8 }, (_, i) => (
                    <g key={i}>
                      <line x1={0} y1={(i + 1) * 12.5 + '%'} x2="100%" y2={(i + 1) * 12.5 + '%'} stroke={mapStyle === 'terrain' ? '#999' : '#fff'} strokeWidth="0.5" />
                      <line x1={(i + 1) * 12.5 + '%'} y1={0} x2={(i + 1) * 12.5 + '%'} y2="100%" stroke={mapStyle === 'terrain' ? '#999' : '#fff'} strokeWidth="0.5" />
                    </g>
                  ))}
                </svg>

                {/* Water body */}
                <div className="absolute" style={{ top: '10%', right: '5%', width: '30%', height: '25%', background: mapStyle === 'terrain' ? '#7DD3FC' : '#1E3A5F', borderRadius: '40%', opacity: 0.7 }} />

                {/* Green spaces */}
                <div className="absolute" style={{ top: '60%', left: '10%', width: '20%', height: '20%', background: mapStyle === 'terrain' ? '#86EFAC' : '#064E3B', borderRadius: '20%', opacity: 0.5 }} />

                {/* Buildings */}
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + (i * 37) % 60}%`,
                      left: `${15 + (i * 53) % 70}%`,
                      width: `${3 + (i % 4)}%`,
                      height: `${3 + (i % 3)}%`,
                      background: mapStyle === 'terrain' ? '#D4D4D8' : (i % 3 === 0 ? '#4B5563' : '#374151'),
                      borderRadius: '2px',
                    }}
                  />
                ))}

                {/* Project marker */}
                <div className="absolute" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-blue-500/30 border-2 border-blue-400 animate-ping absolute" />
                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center relative z-10 shadow-lg">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Compass */}
                <div className="absolute top-3 left-3">
                  <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-gray-600 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Scale bar */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                  <div className="text-white text-[10px]">500m</div>
                  <div className="w-12 h-1 bg-white mt-0.5" />
                </div>
              </div>
            </div>

            {/* Location details */}
            <div className="glass-panel rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Full Address</span>
                <span className="text-gray-300 text-right">{site.address}, {site.city}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Climate Classification</span>
                <span className="text-gray-300">{site.climateZone}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Annual Sunshine</span>
                <span className="text-amber-400">3,500+ hours</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── SUN PATH TAB ─── */}
        {activeTab === 'sun' && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={sunAnimating ? 'default' : 'outline'}
                  className={sunAnimating ? 'bg-amber-600' : 'border-gray-700 text-gray-400'}
                  onClick={() => setSunAnimating(!sunAnimating)}
                >
                  {sunAnimating ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                  {sunAnimating ? 'Pause' : 'Animate'}
                </Button>
              </div>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                {currentSun.time} • Alt: {currentSun.altitude}°
              </Badge>
            </div>

            {/* Sun path diagram */}
            <div className="relative aspect-square max-w-xs mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Horizon */}
                <line x1="10" y1="180" x2="190" y2="180" stroke="#4B5563" strokeWidth="1" />
                <text x="100" y="195" textAnchor="middle" fill="#6B7280" fontSize="8">Horizon</text>

                {/* Cardinal directions */}
                <text x="100" y="15" textAnchor="middle" fill="#FCD34D" fontSize="9" fontWeight="bold">N</text>
                <text x="15" y="100" textAnchor="middle" fill="#9CA3AF" fontSize="8">W</text>
                <text x="185" y="100" textAnchor="middle" fill="#9CA3AF" fontSize="8">E</text>
                <text x="100" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="8">S</text>

                {/* Sun path arcs for different seasons */}
                <path d="M 30 180 Q 100 20 170 180" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.6" strokeDasharray="3,3" />
                <path d="M 50 180 Q 100 60 150 180" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3" />
                <path d="M 10 180 Q 100 5 190 180" fill="none" stroke="#FDE68A" strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />

                {/* Sun positions along path */}
                {sunPathData.map((sp, i) => {
                  const x = 20 + (sp.azimuth - 75) / (296 - 75) * 160;
                  const y = 180 - sp.altitude / 87 * 170;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={i === sunTimeIndex ? 5 : 2} fill={i === sunTimeIndex ? '#FCD34D' : '#FBBF24'} opacity={i === sunTimeIndex ? 1 : 0.5} />
                      {i % 3 === 0 && (
                        <text x={x} y={y - 8} textAnchor="middle" fill="#9CA3AF" fontSize="6">{sp.time}</text>
                      )}
                    </g>
                  );
                })}

                {/* Current sun glow */}
                {currentSun && (
                  <circle
                    cx={20 + (currentSun.azimuth - 75) / (296 - 75) * 160}
                    cy={180 - currentSun.altitude / 87 * 170}
                    r={12}
                    fill="#FCD34D"
                    opacity={0.15}
                  >
                    <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Project location marker */}
                <circle cx="100" cy="178" r={4} fill="#3B82F6" />
                <text x="100" y="172" textAnchor="middle" fill="#60A5FA" fontSize="7">Project Site</text>
              </svg>
            </div>

            {/* Sun data table */}
            <div className="glass-panel rounded-lg p-3">
              <h5 className="text-white text-xs font-medium mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Key Sun Data
              </h5>
              <div className="space-y-1.5">
                {[
                  { event: 'Summer Solstice Sunrise', time: '05:30', dir: '62° NE' },
                  { event: 'Summer Solstice Sunset', time: '19:10', dir: '298° NW' },
                  { event: 'Winter Solstice Sunrise', time: '07:00', dir: '118° SE' },
                  { event: 'Winter Solstice Sunset', time: '17:35', dir: '242° SW' },
                  { event: 'Peak Sun Altitude (Jun)', time: '12:15', dir: '0° (Zenith)' },
                ].map((row) => (
                  <div key={row.event} className="flex justify-between text-xs">
                    <span className="text-gray-500">{row.event}</span>
                    <span className="text-gray-300">{row.time} • {row.dir}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── WIND TAB ─── */}
        {activeTab === 'wind' && (
          <div className="space-y-4">
            {/* Wind rose */}
            <div className="relative aspect-square max-w-xs mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Concentric circles */}
                {[50, 100, 150].map((r) => (
                  <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#374151" strokeWidth="0.5" />
                ))}
                {/* Axis lines */}
                <line x1="100" y1="20" x2="100" y2="180" stroke="#4B5563" strokeWidth="0.5" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="#4B5563" strokeWidth="0.5" />
                <line x1="43" y1="43" x2="157" y2="157" stroke="#4B5563" strokeWidth="0.5" />
                <line x1="157" y1="43" x2="43" y2="157" stroke="#4B5563" strokeWidth="0.5" />

                {/* Direction labels */}
                <text x="100" y="12" textAnchor="middle" fill="#9CA3AF" fontSize="9">N</text>
                <text x="100" y="196" textAnchor="middle" fill="#9CA3AF" fontSize="9">S</text>
                <text x="8" y="103" textAnchor="middle" fill="#9CA3AF" fontSize="9">W</text>
                <text x="192" y="103" textAnchor="middle" fill="#9CA3AF" fontSize="9">E</text>

                {/* Wind bars */}
                {windDirections.map((wd) => {
                  const maxBar = 70;
                  const barLen = (wd.speed / 20) * maxBar;
                  const angleRad = ((wd.angle - 90) * Math.PI) / 180;
                  const x2 = 100 + Math.cos(angleRad) * (50 + barLen);
                  const y2 = 100 + Math.sin(angleRad) * (50 + barLen);
                  return (
                    <g key={wd.angle}>
                      <line
                        x1={100 + Math.cos(angleRad) * 50}
                        y1={100 + Math.sin(angleRad) * 50}
                        x2={x2}
                        y2={y2}
                        stroke="#22D3EE"
                        strokeWidth="6"
                        opacity="0.5"
                        strokeLinecap="round"
                      />
                      <text
                        x={100 + Math.cos(angleRad) * (55 + barLen + 10)}
                        y={100 + Math.sin(angleRad) * (55 + barLen + 10) + 3}
                        textAnchor="middle"
                        fill="#22D3EE"
                        fontSize="7"
                      >
                        {wd.speed}
                      </text>
                    </g>
                  );
                })}

                {/* Center label */}
                <text x="100" y="103" textAnchor="middle" fill="#6B7280" fontSize="7">km/h</text>
              </svg>
            </div>

            {/* Wind summary */}
            <div className="glass-panel rounded-lg p-3 space-y-2">
              <h5 className="text-white text-xs font-medium">Wind Summary</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <div className="text-cyan-400 text-sm font-semibold">{windData.prevailingDirection}°</div>
                  <div className="text-gray-500 text-[10px]">Prevailing</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <div className="text-cyan-400 text-sm font-semibold">{windData.averageSpeed} km/h</div>
                  <div className="text-gray-500 text-[10px]">Average</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <div className="text-amber-400 text-sm font-semibold">{windData.maxSpeed} km/h</div>
                  <div className="text-gray-500 text-[10px]">Max Gust</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2 text-center">
                  <div className="text-emerald-400 text-sm font-semibold">NW</div>
                  <div className="text-gray-500 text-[10px]">Primary Dir</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── RAIN TAB ─── */}
        {activeTab === 'rain' && (
          <div className="space-y-4">
            {/* Monthly rainfall chart */}
            <div className="glass-panel rounded-lg p-4">
              <h5 className="text-white text-xs font-medium mb-3">Monthly Rainfall (mm)</h5>
              <svg viewBox="0 0 300 120" className="w-full">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <line key={pct} x1="30" y1={110 - pct} x2="290" y2={110 - pct} stroke="#374151" strokeWidth="0.3" />
                ))}
                {/* Bars */}
                {rainfallData.monthly.map((m, i) => {
                  const barWidth = 18;
                  const gap = 7;
                  const x = 35 + i * (barWidth + gap);
                  const height = (m.mm / maxRain) * 90;
                  return (
                    <g key={m.month}>
                      <rect
                        x={x}
                        y={110 - height}
                        width={barWidth}
                        height={height}
                        fill={m.mm > 10 ? '#3B82F6' : m.mm > 0 ? '#60A5FA' : '#374151'}
                        rx={2}
                        opacity={0.8}
                      />
                      <text x={x + barWidth / 2} y={108} textAnchor="middle" fill="#9CA3AF" fontSize="7">{m.month}</text>
                      {m.mm > 0 && (
                        <text x={x + barWidth / 2} y={110 - height - 4} textAnchor="middle" fill="#60A5FA" fontSize="7">{m.mm}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Rainfall summary */}
            <div className="glass-panel rounded-lg p-3 space-y-2">
              <h5 className="text-white text-xs font-medium flex items-center gap-1">
                <CloudRain className="w-3 h-3" /> Rainfall Summary
              </h5>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Annual Total</span>
                  <span className="text-blue-400">{rainfallData.annual} mm</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Wettest Month</span>
                  <span className="text-gray-300">{rainfallData.wettestMonth} ({rainfallData.monthly.find(m => m.month === rainfallData.wettestMonth)?.mm}mm)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Driest Month</span>
                  <span className="text-gray-300">{rainfallData.driestMonth} (0mm)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Rainy Days / Year</span>
                  <span className="text-gray-300">~25 days</span>
                </div>
              </div>
            </div>

            {/* Design implications */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
              <h5 className="text-blue-400 text-xs font-medium mb-1">Design Implications</h5>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Low annual rainfall and high evaporation rate means minimal stormwater infrastructure needed.
                However, occasional intense downpours require proper drainage design. Prevailing NW winds
                at {windData.averageSpeed} km/h average suggest orienting main facades and balconies to minimize
                wind exposure while maximizing natural ventilation potential.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
