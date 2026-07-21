import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radio, Cloud, CloudRain, Sun, Wind, Droplets,
  Eye, Car, Truck, Train, Plane, Ship, TrendingUp, TrendingDown,
  Navigation, Activity, Zap, DollarSign, Building2,
  Warehouse, Anchor, Container, Clock, Gauge
} from 'lucide-react';

interface TrafficRoute {
  id: string;
  name: string;
  flow: number;
  queued: number;
  speed: number;
  density: 'low' | 'moderate' | 'heavy' | 'congested';
  co2: number;
  direction: string;
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm';
  visibility: number;
  uvIndex: number;
  precipitation: number;
  forecast: { day: string; high: number; low: number; condition: string }[];
}

interface EconomicIndicator {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  source: string;
}

interface InfrastructureNode {
  id: string;
  name: string;
  type: 'port' | 'airport' | 'freight' | 'train' | 'highway' | 'industrial' | 'warehouse';
  distance: number;
  driveTime: number;
  metric: string;
  metricValue: string;
}

const TRAFFIC_ROUTES: TrafficRoute[] = [
  { id: 'r1', name: 'Eastern Distributor', flow: 8724, queued: 3483, speed: 45, density: 'heavy', co2: 2233, direction: 'N→S' },
  { id: 'r2', name: 'Anzac Parade', flow: 5640, queued: 1200, speed: 52, density: 'moderate', co2: 1450, direction: 'E→W' },
  { id: 'r3', name: 'Southern Cross Dr', flow: 12300, queued: 5200, speed: 28, density: 'congested', co2: 3800, direction: 'W→E' },
  { id: 'r4', name: 'Botany Road', flow: 3400, queued: 400, speed: 58, density: 'low', co2: 890, direction: 'S→N' },
  { id: 'r5', name: 'Foreshore Parkway', flow: 6200, queued: 1800, speed: 48, density: 'moderate', co2: 1680, direction: 'N→S' },
];

const WEATHER: WeatherData = {
  temp: 24,
  feelsLike: 26,
  humidity: 68,
  windSpeed: 18,
  windDir: 'NE',
  condition: 'rain',
  visibility: 8.5,
  uvIndex: 3,
  precipitation: 12,
  forecast: [
    { day: 'Mon', high: 26, low: 18, condition: 'Clear' },
    { day: 'Tue', high: 24, low: 17, condition: 'Cloudy' },
    { day: 'Wed', high: 22, low: 16, condition: 'Rain' },
    { day: 'Thu', high: 25, low: 17, condition: 'Clear' },
    { day: 'Fri', high: 27, low: 19, condition: 'Clear' },
    { day: 'Sat', high: 28, low: 20, condition: 'Clear' },
    { day: 'Sun', high: 26, low: 18, condition: 'Cloudy' },
  ],
};

const ECONOMIC_DATA: EconomicIndicator[] = [
  { name: 'Median House Price', value: '$1.85M', change: 12.4, trend: 'up', source: 'CoreLogic' },
  { name: 'Cost of Living Index', value: '142.3', change: 3.2, trend: 'up', source: 'Numbeo' },
  { name: 'Unemployment Rate', value: '3.8%', change: -0.4, trend: 'down', source: 'ABS' },
  { name: 'Population Growth', value: '+2.1%', change: 0.3, trend: 'up', source: 'ABS' },
  { name: 'Rental Yield', value: '3.2%', change: -0.1, trend: 'down', source: 'SQM' },
  { name: 'Building Approvals', value: '+18%', change: 5.2, trend: 'up', source: 'ABS' },
  { name: 'Days on Market', value: '24 days', change: -8, trend: 'down', source: 'REA' },
  { name: 'Auction Clearance', value: '74%', change: 6, trend: 'up', source: 'CoreLogic' },
];

const INFRASTRUCTURE: InfrastructureNode[] = [
  { id: 'i1', name: 'Port Botany', type: 'port', distance: 4.2, driveTime: 8, metric: 'Container Volume', metricValue: '2.4M TEU/yr' },
  { id: 'i2', name: 'Sydney Airport (SYD)', type: 'airport', distance: 3.8, driveTime: 7, metric: 'Passengers', metricValue: '44.4M/yr' },
  { id: 'i3', name: 'Sydney Freight Network', type: 'freight', distance: 2.1, driveTime: 4, metric: 'Freight Tonnes', metricValue: '12M t/yr' },
  { id: 'i4', name: 'Central Station', type: 'train', distance: 5.5, driveTime: 12, metric: 'Daily Passengers', metricValue: '340K/day' },
  { id: 'i5', name: 'M1 Motorway Access', type: 'highway', distance: 1.8, driveTime: 3, metric: 'Daily Traffic', metricValue: '95K veh/day' },
  { id: 'i6', name: 'Alexandria Industrial', type: 'industrial', distance: 2.4, driveTime: 5, metric: 'Industrial Stock', metricValue: '450K m²' },
  { id: 'i7', name: 'Moorebank Logistics', type: 'warehouse', distance: 12, driveTime: 18, metric: 'Warehouse Space', metricValue: '850K m²' },
];

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  port: { icon: <Anchor className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-400', label: 'Port' },
  airport: { icon: <Plane className="w-4 h-4" />, color: 'bg-sky-500/20 text-sky-400', label: 'Airport' },
  freight: { icon: <Container className="w-4 h-4" />, color: 'bg-amber-500/20 text-amber-400', label: 'Freight' },
  train: { icon: <Train className="w-4 h-4" />, color: 'bg-emerald-500/20 text-emerald-400', label: 'Rail' },
  highway: { icon: <Car className="w-4 h-4" />, color: 'bg-red-500/20 text-red-400', label: 'Highway' },
  industrial: { icon: <Building2 className="w-4 h-4" />, color: 'bg-orange-500/20 text-orange-400', label: 'Industrial' },
  warehouse: { icon: <Warehouse className="w-4 h-4" />, color: 'bg-purple-500/20 text-purple-400', label: 'Logistics' },
};

const DENSITY_COLORS: Record<string, string> = {
  low: 'bg-emerald-500',
  moderate: 'bg-amber-500',
  heavy: 'bg-orange-500',
  congested: 'bg-red-500',
};

export default function LiveDataIntelligence() {
  const [activeTab, setActiveTab] = useState<'traffic' | 'weather' | 'economic' | 'infrastructure'>('traffic');
  const [dataMode, setDataMode] = useState<'live' | 'demo'>('live');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const totalFlow = TRAFFIC_ROUTES.reduce((a, r) => a + r.flow, 0);
  const totalQueued = TRAFFIC_ROUTES.reduce((a, r) => a + r.queued, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Data Intelligence</h2>
              <p className="text-gray-400 text-sm">Real-time traffic, weather, economics & infrastructure</p>
            </div>
          </div>
          <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setDataMode('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                dataMode === 'live' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Radio className="w-3 h-3" />
              LIVE
            </button>
            <button
              onClick={() => setDataMode('demo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                dataMode === 'demo' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Activity className="w-3 h-3" />
              DEMO
            </button>
          </div>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Flow</span>
          </div>
          <div className="text-2xl font-bold text-white">{(totalFlow / 1000).toFixed(1)}K</div>
          <div className="text-[10px] text-gray-500">vehicles/hr across all routes</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Queued</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{(totalQueued / 1000).toFixed(1)}K</div>
          <div className="text-[10px] text-gray-500">vehicles waiting</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Weather</span>
          </div>
          <div className="text-2xl font-bold text-white">{WEATHER.temp}°C</div>
          <div className="text-[10px] text-gray-500">{WEATHER.condition}, {WEATHER.precipitation}mm rain</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Demand Index</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">8.4<span className="text-sm">/10</span></div>
          <div className="text-[10px] text-gray-500">Strong buyer demand</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['traffic', 'weather', 'economic', 'infrastructure'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'traffic' && <Car className="w-3.5 h-3.5" />}
            {tab === 'weather' && <Cloud className="w-3.5 h-3.5" />}
            {tab === 'economic' && <DollarSign className="w-3.5 h-3.5" />}
            {tab === 'infrastructure' && <Building2 className="w-3.5 h-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'traffic' && (
        <div className="space-y-3">
          {TRAFFIC_ROUTES.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
              className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
                selectedRoute === route.id ? 'border-red-500/30' : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${DENSITY_COLORS[route.density]}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{route.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-700/50 text-gray-400 capitalize">{route.density}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{route.direction}</span>
                      <span>{route.speed} km/h avg</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-sm text-white font-medium">{route.flow.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">flow/hr</div>
                  </div>
                  <div>
                    <div className="text-sm text-amber-400 font-medium">{route.queued.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">queued</div>
                  </div>
                  <div>
                    <div className="text-sm text-red-400 font-medium">{route.co2}</div>
                    <div className="text-[10px] text-gray-500">kg CO₂/h</div>
                  </div>
                </div>
              </div>

              {/* Flow bars */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 w-10">Flow</span>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(route.flow / 15000) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 w-10">Queue</span>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(route.queued / 6000) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 w-10">CO₂</span>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(route.co2 / 5000) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {selectedRoute === route.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-3 gap-3"
                >
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-sm text-white font-medium">{((route.flow - route.queued) / route.flow * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-gray-500">Throughput</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-sm text-white font-medium">{route.speed} km/h</div>
                    <div className="text-[10px] text-gray-500">Avg Speed</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-sm text-red-400 font-medium">{(route.co2 * 24 / 1000).toFixed(1)}t</div>
                    <div className="text-[10px] text-gray-500">CO₂/day</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'weather' && (
        <div className="space-y-4">
          {/* Current conditions */}
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm text-white font-medium">Current Conditions</h4>
                <p className="text-xs text-gray-500">Sydney, NSW • Updated 5 min ago</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{WEATHER.temp}°C</div>
                <div className="text-xs text-gray-400">Feels like {WEATHER.feelsLike}°C</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">{WEATHER.humidity}%</div>
                <div className="text-[10px] text-gray-500">Humidity</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">{WEATHER.windSpeed}</div>
                <div className="text-[10px] text-gray-500">km/h {WEATHER.windDir}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">{WEATHER.visibility}km</div>
                <div className="text-[10px] text-gray-500">Visibility</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Sun className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">{WEATHER.uvIndex}</div>
                <div className="text-[10px] text-gray-500">UV Index</div>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-3">7-Day Forecast</h4>
            <div className="grid grid-cols-7 gap-2">
              {WEATHER.forecast.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-gray-800/50 rounded-lg p-2 text-center"
                >
                  <div className="text-[10px] text-gray-400 mb-1">{day.day}</div>
                  {day.condition === 'Clear' ? <Sun className="w-4 h-4 text-amber-400 mx-auto mb-1" /> :
                   day.condition === 'Rain' ? <CloudRain className="w-4 h-4 text-blue-400 mx-auto mb-1" /> :
                   <Cloud className="w-4 h-4 text-gray-400 mx-auto mb-1" />}
                  <div className="text-xs text-white font-medium">{day.high}°</div>
                  <div className="text-[10px] text-gray-500">{day.low}°</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Precipitation radar placeholder */}
          <div className="glass-panel rounded-xl p-4 border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">Precipitation Radar</span>
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded">LIVE</span>
            </div>
            <div className="h-32 rounded-lg bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-6 h-6 text-cyan-400 mx-auto mb-1 animate-pulse" />
                <p className="text-xs text-gray-400">Live precipitation data</p>
                <p className="text-[10px] text-gray-600">Source: Bureau of Meteorology</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'economic' && (
        <div className="space-y-3">
          <div className="grid gap-2">
            {ECONOMIC_DATA.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      ind.trend === 'up' ? 'bg-emerald-400' : ind.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-white">{ind.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-white font-medium">{ind.value}</div>
                    </div>
                    <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-xs ${
                      ind.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                      ind.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {ind.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                       ind.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                      {ind.change > 0 ? '+' : ''}{ind.change}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-600">Source: {ind.source}</span>
                  <span className="text-[10px] text-gray-600">Updated: {i < 3 ? 'Today' : i < 6 ? 'This week' : 'This month'}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demand heatmap teaser */}
          <div className="glass-panel rounded-xl p-4 border-emerald-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white font-medium">Local Demand Index</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">8.4<span className="text-sm text-gray-500">/10</span></span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '84%' }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Low Demand</span>
              <span>Balanced</span>
              <span>High Demand</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="space-y-3">
          {INFRASTRUCTURE.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${TYPE_ICONS[node.type]?.color}`}>
                    {TYPE_ICONS[node.type]?.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{node.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${TYPE_ICONS[node.type]?.color}`}>
                        {TYPE_ICONS[node.type]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-0.5"><Navigation className="w-3 h-3" />{node.distance}km</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{node.driveTime}min drive</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">{node.metricValue}</div>
                  <div className="text-[10px] text-gray-500">{node.metric}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Supply chain map */}
          <div className="glass-panel rounded-xl p-4 border-amber-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Ship className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white font-medium">Supply Chain Proximity Score</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Anchor className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">4.2km</div>
                <div className="text-[10px] text-gray-500">to nearest port</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Plane className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">3.8km</div>
                <div className="text-[10px] text-gray-500">to airport</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <Truck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">1.8km</div>
                <div className="text-[10px] text-gray-500">to motorway</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
