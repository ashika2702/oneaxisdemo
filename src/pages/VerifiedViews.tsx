import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CheckCircle2, Shield, AlertTriangle, Eye,
  ChevronLeft, ChevronRight, MapPin, CalendarDays,
  Droplets, Hash, Info, Download, Share2
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   MOCK DATA — Verified View Captures
   ═══════════════════════════════════════════ */
const CAPTURES = [
  {
    id: "vc-001",
    level: 14,
    heightM: 42,
    heading: 45,
    bearing: "NE",
    date: "12 Mar 2026",
    drone: "DJI Mavic 3 Pro",
    aspect: "Harbour + City Bridge",
    verified: true,
    tiles: "KTX2 compressed",
    accuracy: "±2m",
  },
  {
    id: "vc-002",
    level: 8,
    heightM: 24,
    heading: 180,
    bearing: "S",
    date: "15 Mar 2026",
    drone: "DJI Mavic 3 Pro",
    aspect: "Park + Internal",
    verified: true,
    tiles: "KTX2 compressed",
    accuracy: "±2m",
  },
  {
    id: "vc-003",
    level: 18,
    heightM: 54,
    heading: 0,
    bearing: "N",
    date: "10 Mar 2026",
    drone: "DJI Mavic 3 Pro",
    aspect: "Full City Panorama",
    verified: true,
    tiles: "KTX2 compressed",
    accuracy: "±1.5m",
  },
];

const UNIT_FLOORS = [
  { unit: "A1401", floor: 14, nearestCapture: 14, view: "Harbour + City", orientation: "North East" },
  { unit: "A1402", floor: 14, nearestCapture: 14, view: "Harbour", orientation: "North East" },
  { unit: "A0801", floor: 8, nearestCapture: 8, view: "Park", orientation: "South" },
  { unit: "A0802", floor: 8, nearestCapture: 8, view: "Park + Internal", orientation: "South East" },
  { unit: "A1801", floor: 18, nearestCapture: 18, view: "Full Panorama", orientation: "North" },
];

export default function VerifiedViews() {
  const [selectedCapture, setSelectedCapture] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [showTrustInfo, setShowTrustInfo] = useState(false);

  const capture = CAPTURES[selectedCapture];
  const unit = UNIT_FLOORS.find(u => u.unit === selectedUnit);

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Verified Views</h1>
              <p className="text-[10px] text-white/25">Drone-captured · Height-true · Orientation-matched</p>
            </div>
          </div>
          <button onClick={() => setShowTrustInfo(!showTrustInfo)} className="text-white/20 hover:text-white/40">
            <Info className="w-4 h-4" />
          </button>
        </div>

        {showTrustInfo && (
          <div className="flex-shrink-0 px-5 py-3 bg-emerald-500/[0.04] border-b border-emerald-500/10">
            <p className="text-[11px] text-white/40 leading-relaxed">
              Every view badge shows the exact capture height, date, and drone model. Views are captured at level bands
              every 2–3 floors. Floors between bands interpolate from the nearest capture — the badge always discloses this.
              "Captured at Level 14" means the view is from that exact height. No studio renders, no artistic interpretation.
            </p>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Main view */}
          <div className="flex-1 relative bg-[#080808] flex items-center justify-center overflow-hidden">
            {/* Simulated panoramic view */}
            <svg viewBox="0 0 800 450" className="w-[95%] max-w-[900px]">
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a2a4a" />
                  <stop offset="50%" stopColor="#2a3a5a" />
                  <stop offset="100%" stopColor="#3a4a6a" />
                </linearGradient>
              </defs>

              {/* Sky */}
              <rect x="0" y="0" width="800" height="250" fill="url(#sky)" />

              {/* City skyline */}
              <rect x="50" y="150" width="40" height="100" fill="#1e2e3e" rx="1" />
              <rect x="100" y="120" width="50" height="130" fill="#1a2a3a" rx="1" />
              <rect x="160" y="170" width="35" height="80" fill="#1e2e3e" rx="1" />
              <rect x="210" y="100" width="60" height="150" fill="#162636" rx="1" />
              <rect x="280" y="140" width="45" height="110" fill="#1e2e3e" rx="1" />
              <rect x="340" y="80" width="70" height="170" fill="#142434" rx="1" />
              <rect x="420" y="130" width="40" height="120" fill="#1e2e3e" rx="1" />
              <rect x="470" y="160" width="55" height="90" fill="#1a2a3a" rx="1" />
              <rect x="535" y="110" width="65" height="140" fill="#162636" rx="1" />
              <rect x="610" y="140" width="50" height="110" fill="#1e2e3e" rx="1" />
              <rect x="670" y="100" width="80" height="150" fill="#142434" rx="1" />

              {/* Windows */}
              {Array.from({ length: 40 }).map((_, i) => (
                <rect key={i} x={60 + (i * 18) % 720} y={110 + Math.floor(i / 20) * 60}
                  width="6" height="10" rx="0.5" fill={`rgba(255,220,150,${0.05 + (i % 4) * 0.02})`} />
              ))}

              {/* Water */}
              <rect x="0" y="250" width="800" height="100" fill="#0c2038" />
              <rect x="0" y="250" width="800" height="20" fill="#0e2840" opacity="0.5" />

              {/* Bridge silhouette */}
              <path d="M 200 250 Q 350 180 500 250" fill="none" stroke="#1a3040" strokeWidth="3" />
              <line x1="280" y1="250" x2="280" y2="210" stroke="#1a3040" strokeWidth="1" />
              <line x1="340" y1="250" x2="340" y2="190" stroke="#1a3040" strokeWidth="1" />
              <line x1="400" y1="250" x2="400" y2="185" stroke="#1a3040" strokeWidth="1" />

              {/* Foreground — balcony/window frame */}
              <rect x="0" y="340" width="800" height="110" fill="#0a0a0a" />
              <rect x="20" y="350" width="200" height="8" rx="2" fill="#1a1a1a" />
              <rect x="580" y="350" width="200" height="8" rx="2" fill="#1a1a1a" />

              {/* Glass reflection overlay */}
              <rect x="0" y="0" width="800" height="340" fill="url(#glass)" opacity="0.05" />
            </svg>

            {/* Verified badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-xl border border-emerald-500/20 px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Verified View</span>
              </div>
              <p className="text-[12px] text-white/70 font-medium">Level {capture.level} · {capture.bearing} aspect</p>
              <p className="text-[9px] text-white/25">Captured on site {capture.date} · {capture.drone}</p>
              <p className="text-[8px] text-white/15 mt-1">Accuracy: {capture.accuracy} · {capture.tiles}</p>
            </motion.div>

            {/* Navigation */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setSelectedCapture(Math.max(0, selectedCapture - 1))}
                className="w-8 h-8 rounded-lg bg-[#0A0A0A]/70 backdrop-blur border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.05]"
              >
                <ChevronLeft className="w-4 h-4 text-white/30" />
              </button>
              <span className="text-[10px] text-white/30 px-2">{selectedCapture + 1} / {CAPTURES.length}</span>
              <button
                onClick={() => setSelectedCapture(Math.min(CAPTURES.length - 1, selectedCapture + 1))}
                className="w-8 h-8 rounded-lg bg-[#0A0A0A]/70 backdrop-blur border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.05]"
              >
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-[280px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto flex-shrink-0">
            <div className="p-4">
              {/* Capture details */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Capture Details</p>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 mb-4">
                <div className="space-y-2">
                  {[
                    { label: "Capture ID", value: capture.id },
                    { label: "Level", value: `Level ${capture.level}` },
                    { label: "Height AGL", value: `${capture.heightM}m` },
                    { label: "Heading", value: `${capture.heading}° ${capture.bearing}` },
                    { label: "Date", value: capture.date },
                    { label: "Drone", value: capture.drone },
                    { label: "Aspect", value: capture.aspect },
                    { label: "Accuracy", value: capture.accuracy },
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between py-0.5 border-b border-white/[0.03] last:border-0">
                      <span className="text-[9px] text-white/20">{d.label}</span>
                      <span className="text-[10px] text-white/50">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All captures */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">All Captures</p>
              <div className="space-y-1.5 mb-4">
                {CAPTURES.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCapture(i)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                      selectedCapture === i ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04]"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-white/20" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] ${selectedCapture === i ? "text-emerald-400" : "text-white/40"}`}>Level {c.level}</p>
                      <p className="text-[8px] text-white/15">{c.aspect}</p>
                    </div>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400/40 flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* Units table */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Unit View Mapping</p>
              <div className="space-y-1.5">
                {UNIT_FLOORS.map(u => (
                  <button
                    key={u.unit}
                    onClick={() => setSelectedUnit(selectedUnit === u.unit ? null : u.unit)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      selectedUnit === u.unit ? "bg-white/[0.06]" : "bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-medium">{u.unit}</span>
                      <span className="text-[8px] text-white/15">Floor {u.floor}</span>
                    </div>
                    <p className="text-[8px] text-white/20">View: {u.view}</p>
                    <p className="text-[7px] text-emerald-400/40">Verified at Level {u.nearestCapture}</p>
                  </button>
                ))}
              </div>

              {/* Trust promise */}
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10">
                <div className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400/50 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-white/25 leading-relaxed">
                    "Everything you see here is real or clearly marked."
                    Views between capture bands interpolate from the nearest verified capture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
