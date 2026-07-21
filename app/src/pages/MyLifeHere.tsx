import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Train, Car, Clock, School, ShoppingBag, HeartPulse,
  Dumbbell, Utensils, Briefcase, Home, Navigation, Route,
  Zap, Compass, Info, ChevronRight
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const PROJECT = { lat: -33.8688, lng: 151.2093, address: "45 Park Avenue, Sydney NSW 2000", name: "Azure Heights" };

const COMMUTE_ROUTES = [
  { from: "Sydney CBD (Your workplace)", mode: "walk", duration: "8 min", distance: "650m", icon: MapPin, color: "#10b981" },
  { from: "Sydney CBD", mode: "train", duration: "4 min", distance: "2 stops", icon: Train, color: "#3b82f6" },
  { from: "North Sydney", mode: "train", duration: "12 min", distance: "4 stops", icon: Train, color: "#3b82f6" },
  { from: "Parramatta", mode: "train", duration: "24 min", distance: "6 stops", icon: Train, color: "#3b82f6" },
  { from: "Airport", mode: "car", duration: "18 min", distance: "12km", icon: Car, color: "#f59e0b" },
];

const AMENITIES = [
  { name: "Central Station", category: "transport", distance: "450m", walk: "6 min", icon: Train },
  { name: "St. Mary's Primary", category: "education", distance: "600m", walk: "8 min", icon: School },
  { name: "Westfield Sydney", category: "retail", distance: "800m", walk: "10 min", icon: ShoppingBag },
  { name: "Royal Hospital", category: "health", distance: "1.2km", walk: "15 min", icon: HeartPulse },
  { name: "Fitness First", category: "wellness", distance: "350m", walk: "4 min", icon: Dumbbell },
  { name: "Harbour Dining Precinct", category: "dining", distance: "300m", walk: "4 min", icon: Utensils },
  { name: "Metro Line (2028)", category: "transport", distance: "200m", walk: "3 min", icon: Train },
  { name: "Martin Place", category: "business", distance: "500m", walk: "7 min", icon: Briefcase },
];

const WALK_SCORE = 98;
const TRANSIT_SCORE = 100;
const BIKE_SCORE = 85;

export default function MyLifeHere() {
  const [workplace, setWorkplace] = useState("Sydney CBD");
  const [commuteMode, setCommuteMode] = useState<"transit" | "drive" | "walk">("transit");
  const [showPersonalized, setShowPersonalized] = useState(true);

  const primaryRoute = COMMUTE_ROUTES.find(r => r.from.includes(workplace) && (commuteMode === "transit" ? r.mode === "train" : commuteMode === "walk" ? r.mode === "walk" : r.mode === "car")) || COMMUTE_ROUTES[0];

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/10 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">My Life Here</h1>
              <p className="text-[10px] text-white/25">Your commute, your context, your week</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Walk Score", value: WALK_SCORE, color: "#10b981", desc: "Walker's Paradise" },
              { label: "Transit Score", value: TRANSIT_SCORE, color: "#3b82f6", desc: "Rider's Paradise" },
              { label: "Bike Score", value: BIKE_SCORE, color: "#f59e0b", desc: "Bikeable" },
            ].map(score => (
              <div key={score.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">{score.label}</p>
                <p className="text-[28px] font-bold mb-1" style={{ color: score.color }}>{score.value}</p>
                <p className="text-[9px] text-white/20">{score.desc}</p>
                <div className="w-full h-1 rounded-full bg-white/[0.04] mt-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${score.value}%`, background: score.color, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Commute + Personalization */}
            <div className="space-y-4">
              {/* Personalized commute */}
              <div className="bg-gradient-to-br from-rose-500/[0.04] to-purple-500/[0.02] border border-rose-500/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-rose-400" />
                  <h3 className="text-[13px] font-semibold text-white/80">Your Commute</h3>
                </div>

                <div className="mb-4">
                  <label className="text-[9px] text-white/20 uppercase tracking-wider mb-1.5 block">Your Workplace</label>
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[12px] text-white/70 outline-none focus:border-rose-500/30 transition-colors"
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  {(["transit", "walk", "drive"] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setCommuteMode(mode)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-all ${
                        commuteMode === mode
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                          : "bg-white/[0.03] text-white/25 border border-white/[0.04]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Primary route */}
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <primaryRoute.icon className="w-4 h-4" style={{ color: primaryRoute.color }} />
                      <span className="text-[12px] text-white/60">{primaryRoute.from}</span>
                    </div>
                    <span className="text-[11px] text-white/25">{primaryRoute.distance}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] font-bold text-white/90">{primaryRoute.duration}</span>
                    <span className="text-[11px] text-white/25">to {PROJECT.name}</span>
                  </div>
                  <p className="text-[10px] text-white/20 mt-1">
                    Leave at 8:12 AM → Arrive 8:{12 + parseInt(primaryRoute.duration)} AM
                  </p>
                </div>
              </div>

              {/* All commute options */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h3 className="text-[11px] font-medium text-white/40 mb-3">All Routes</h3>
                <div className="space-y-2">
                  {COMMUTE_ROUTES.map((route, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                      <div className="flex items-center gap-2">
                        <route.icon className="w-3.5 h-3.5" style={{ color: route.color }} />
                        <span className="text-[11px] text-white/40">{route.from}</span>
                      </div>
                      <span className="text-[11px] text-white/50 font-medium">{route.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Amenities map */}
            <div className="space-y-4">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h3 className="text-[11px] font-medium text-white/40 mb-3">Your Neighbourhood</h3>

                {/* SVG map */}
                <div className="relative h-[200px] bg-[#080808] rounded-lg overflow-hidden mb-4">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Grid */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <line key={`h${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={200} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                    ))}

                    {/* Roads */}
                    <rect x={0} y={90} width={400} height={16} fill="rgba(255,255,255,0.03)" />
                    <rect x={190} y={0} width={16} height={200} fill="rgba(255,255,255,0.03)" />

                    {/* Project (center) */}
                    <circle cx={200} cy={100} r={10} fill="rgba(244,63,94,0.2)" stroke="#f43f5e" strokeWidth="1.5" />
                    <text x={200} y={125} fill="rgba(244,63,94,0.5)" fontSize="7" textAnchor="middle" fontFamily="Inter">Azure Heights</text>

                    {/* Amenities */}
                    <circle cx={100} cy={60} r={5} fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="0.5" />
                    <text x={100} y={50} fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">Station</text>

                    <circle cx={310} cy={70} r={5} fill="rgba(16,185,129,0.3)" stroke="#10b981" strokeWidth="0.5" />
                    <text x={310} y={60} fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">School</text>

                    <circle cx={340} cy={140} r={5} fill="rgba(245,158,11,0.3)" stroke="#f59e0b" strokeWidth="0.5" />
                    <text x={340} y={155} fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">Westfield</text>

                    <circle cx={80} cy={150} r={5} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="0.5" />
                    <text x={80} y={165} fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">Hospital</text>

                    <circle cx={250} cy={40} r={5} fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="0.5" />
                    <text x={250} y={30} fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">Dining</text>
                  </svg>
                </div>

                {/* Amenities list */}
                <div className="space-y-1.5">
                  {AMENITIES.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
                          <a.icon className="w-3 h-3 text-white/20" />
                        </div>
                        <div>
                          <p className="text-[11px] text-white/50">{a.name}</p>
                          <p className="text-[8px] text-white/15 capitalize">{a.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/30">{a.distance}</p>
                        <p className="text-[8px] text-white/15">{a.walk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy note */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                <p className="text-[9px] text-white/20 leading-relaxed">
                  Your workplace is stored with your consent and used only for commute calculation.
                  It is PII under our privacy policy and can be deleted at any time from your profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
