import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Navigation, GraduationCap, Heart, ShoppingBag,
  Train, Trees, Coffee, Dumbbell, Building2, TrendingUp,
  Star, Car, Footprints
} from 'lucide-react';

interface Amenity {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'shopping' | 'transit' | 'park' | 'dining' | 'fitness' | 'business';
  distance: number;
  walkTime: number;
  driveTime: number;
  rating: number;
  description: string;
}

interface NeighbourhoodMetric {
  label: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  detail: string;
}

const AMENITIES: Amenity[] = [
  { id: 'a1', name: 'St. John\'s Primary School', type: 'school', distance: 0.4, walkTime: 5, driveTime: 2, rating: 4.6, description: 'K-6 Catholic co-ed school with strong academic results' },
  { id: 'a2', name: 'Newtown High School', type: 'school', distance: 1.2, walkTime: 15, driveTime: 4, rating: 4.3, description: 'Selective public high school, top 50 in state' },
  { id: 'a3', name: 'Royal Prince Alfred Hospital', type: 'hospital', distance: 2.1, walkTime: 25, driveTime: 6, rating: 4.7, description: 'Major tertiary referral hospital, 24hr emergency' },
  { id: 'a4', name: 'Newtown Medical Centre', type: 'hospital', distance: 0.6, walkTime: 7, driveTime: 2, rating: 4.2, description: 'GP clinic with bulk billing, open 7 days' },
  { id: 'a5', name: 'Westfield Burwood', type: 'shopping', distance: 3.5, driveTime: 8, walkTime: 45, rating: 4.4, description: 'Major shopping centre with 250+ stores' },
  { id: 'a6', name: 'King Street Precinct', type: 'shopping', distance: 0.3, walkTime: 4, driveTime: 2, rating: 4.5, description: 'Vibrant retail and dining strip' },
  { id: 'a7', name: 'Newtown Station', type: 'transit', distance: 0.5, walkTime: 6, driveTime: 2, rating: 4.3, description: 'T2 line to CBD, 12 min to Central' },
  { id: 'a8', name: 'Bus 422 / 423', type: 'transit', distance: 0.2, walkTime: 2, driveTime: 1, rating: 3.9, description: 'Direct to CBD and inner west' },
  { id: 'a9', name: 'Camperdown Park', type: 'park', distance: 0.8, walkTime: 10, driveTime: 3, rating: 4.5, description: '28ha park with off-leash dog area, playground' },
  { id: 'a10', name: 'Sydney Park', type: 'park', distance: 1.5, walkTime: 18, driveTime: 4, rating: 4.8, description: '40ha wetlands, cycling tracks, picnic areas' },
  { id: 'a11', name: 'Black Star Pastry', type: 'dining', distance: 0.3, walkTime: 4, driveTime: 2, rating: 4.6, description: 'Famous watermelon strawberry cake cafe' },
  { id: 'a12', name: 'Gigi\'s Italian', type: 'dining', distance: 0.4, walkTime: 5, driveTime: 2, rating: 4.4, description: 'Award-winning wood-fired pizza and pasta' },
  { id: 'a13', name: 'Fitness First Newtown', type: 'fitness', distance: 0.5, walkTime: 6, driveTime: 2, rating: 4.1, description: 'Full gym with pool, classes, 24/7 access' },
  { id: 'a14', name: 'F45 Training', type: 'fitness', distance: 0.3, walkTime: 4, driveTime: 2, rating: 4.3, description: 'High-intensity functional training studio' },
  { id: 'a15', name: 'Commonwealth Bank', type: 'business', distance: 0.4, walkTime: 5, driveTime: 2, rating: 3.8, description: 'Full-service branch with lending specialists' },
];

const METRICS: NeighbourhoodMetric[] = [
  { label: 'Walkability', score: 94, trend: 'up', detail: 'Daily errands do not require a car' },
  { label: 'Transit Score', score: 89, trend: 'up', detail: 'Excellent public transport access' },
  { label: 'Bike Score', score: 78, trend: 'stable', detail: 'Bike-friendly streets and lanes' },
  { label: 'School Catchment', score: 88, trend: 'up', detail: 'In-demand public school zones' },
  { label: 'Safety Index', score: 82, trend: 'stable', detail: 'Low crime, well-lit streets' },
  { label: 'Price Growth (YoY)', score: 12.4, trend: 'up', detail: 'Above Sydney average of 8.2%' },
];

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  school: { icon: <GraduationCap className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-400', label: 'Education' },
  hospital: { icon: <Heart className="w-4 h-4" />, color: 'bg-red-500/20 text-red-400', label: 'Health' },
  shopping: { icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-amber-500/20 text-amber-400', label: 'Retail' },
  transit: { icon: <Train className="w-4 h-4" />, color: 'bg-green-500/20 text-green-400', label: 'Transit' },
  park: { icon: <Trees className="w-4 h-4" />, color: 'bg-emerald-500/20 text-emerald-400', label: 'Parks' },
  dining: { icon: <Coffee className="w-4 h-4" />, color: 'bg-orange-500/20 text-orange-400', label: 'Dining' },
  fitness: { icon: <Dumbbell className="w-4 h-4" />, color: 'bg-purple-500/20 text-purple-400', label: 'Fitness' },
  business: { icon: <Building2 className="w-4 h-4" />, color: 'bg-gray-500/20 text-gray-400', label: 'Services' },
};

export default function NeighbourhoodIntelligence() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  const filtered = activeFilter === 'all'
    ? AMENITIES
    : AMENITIES.filter(a => a.type === activeFilter);

  const typeCounts = AMENITIES.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Neighbourhood Intelligence</h2>
            <p className="text-gray-400 text-sm">Amenities, walkability & lifestyle scores</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {METRICS.slice(0, 3).map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{m.label}</span>
              <TrendIcon trend={m.trend} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {typeof m.score === 'number' && m.score > 50 ? m.score : m.score}
              {m.label === 'Price Growth (YoY)' && <span className="text-sm">%</span>}
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(m.score, 100)}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">{m.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Walk time circles */}
      <div className="glass-panel rounded-xl p-4 mb-6">
        <h4 className="text-sm text-white font-medium mb-3">Time to Essentials</h4>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: <Coffee className="w-5 h-5" />, label: 'Cafe', time: '3 min', mode: <Footprints className="w-3 h-3" /> },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Groceries', time: '5 min', mode: <Footprints className="w-3 h-3" /> },
            { icon: <Train className="w-5 h-5" />, label: 'Station', time: '6 min', mode: <Footprints className="w-3 h-3" /> },
            { icon: <GraduationCap className="w-5 h-5" />, label: 'School', time: '5 min', mode: <Footprints className="w-3 h-3" /> },
            { icon: <Heart className="w-5 h-5" />, label: 'Hospital', time: '25 min', mode: <Footprints className="w-3 h-3" /> },
            { icon: <Trees className="w-5 h-5" />, label: 'Park', time: '10 min', mode: <Footprints className="w-3 h-3" /> },
            { icon: <Building2 className="w-5 h-5" />, label: 'CBD', time: '12 min', mode: <Train className="w-3 h-3" /> },
            { icon: <Car className="w-5 h-5" />, label: 'Airport', time: '18 min', mode: <Car className="w-3 h-3" /> },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gray-800 flex items-center justify-center text-emerald-400 mb-1">
                {item.icon}
              </div>
              <div className="text-xs text-white font-medium">{item.time}</div>
              <div className="flex items-center justify-center gap-0.5 text-[10px] text-gray-500">
                {item.mode}
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-thin pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeFilter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          All ({AMENITIES.length})
        </button>
        {Object.entries(TYPE_ICONS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {config.icon}
            {config.label} ({typeCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Amenity List */}
      <div className="space-y-2">
        {filtered.map((amenity, i) => (
          <motion.div
            key={amenity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => setSelectedAmenity(selectedAmenity === amenity ? null : amenity)}
            className={`glass-panel rounded-lg p-3 cursor-pointer transition-all border ${
              selectedAmenity?.id === amenity.id
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${TYPE_ICONS[amenity.type]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                {TYPE_ICONS[amenity.type]?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-white text-sm font-medium truncate">{amenity.name}</h4>
                  <div className="flex items-center gap-1 text-amber-400 flex-shrink-0 ml-2">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-xs">{amenity.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-gray-500">{amenity.distance}km away</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <Footprints className="w-2.5 h-2.5" />
                    {amenity.walkTime}min walk
                  </span>
                  {amenity.driveTime <= 5 && (
                    <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
                      <Car className="w-2.5 h-2.5" />
                      {amenity.driveTime}min drive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedAmenity?.id === amenity.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-gray-700"
              >
                <p className="text-xs text-gray-400 mb-2">{amenity.description}</p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-300 hover:text-white transition-colors">
                    <Navigation className="w-3 h-3" />
                    Get Directions
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-300 hover:text-white transition-colors">
                    <MapPin className="w-3 h-3" />
                    View on Map
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom metric */}
      <div className="glass-panel rounded-xl p-4 mt-6 border-emerald-500/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white font-medium"> suburb Property Growth</div>
            <div className="text-xs text-gray-500">Median house price trend — 5 year view</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-400">+12.4%</div>
            <div className="text-[10px] text-gray-500">YoY Growth</div>
          </div>
        </div>
        <div className="h-16 mt-3 flex items-end gap-1">
          {[45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-emerald-500/30 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-600 mt-1">
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === 'down') return <TrendingUp className="w-3.5 h-3.5 text-red-400 rotate-180" />;
  return <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-500" />;
}
