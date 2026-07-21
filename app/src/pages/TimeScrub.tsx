import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Clock, Play, Pause, RotateCcw, Building2, Hammer, Trees,
  Train, School, MapPin, CalendarDays, ChevronRight, Info,
  CheckCircle2, AlertTriangle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type Phase = "site" | "foundation" | "structure" | "fitout" | "complete" | "future";

interface TimelineEvent {
  year: number;
  month: string;
  phase: Phase;
  label: string;
  description: string;
  icon: any;
  infrastructure?: boolean;
}

/* ═══════════════════════════════════════════
   MOCK DATA — Azure Heights Timeline
   ═══════════════════════════════════════════ */
const EVENTS: TimelineEvent[] = [
  { year: 2024, month: "Mar", phase: "site", label: "Site Acquisition", description: "45 Park Avenue purchased", icon: MapPin },
  { year: 2024, month: "Sep", phase: "site", label: "DA Approval", description: "Development application approved by council", icon: CheckCircle2 },
  { year: 2025, month: "Jan", phase: "foundation", label: "Demolition", description: "Existing structures cleared", icon: Hammer },
  { year: 2025, month: "Jun", phase: "foundation", label: "Foundation Pour", description: "Basement and podium slab complete", icon: Building2 },
  { year: 2025, month: "Nov", phase: "structure", label: "Tower A Topped Out", description: "Level 18 concrete pour — 45% sold", icon: Building2 },
  { year: 2026, month: "Mar", phase: "structure", label: "Tower B Rising", description: "Level 12 reached — facade installation begins", icon: Building2 },
  { year: 2026, month: "Jul", phase: "fitout", label: "Now Selling", description: "Display suite open — 60% sold", icon: CheckCircle2 },
  { year: 2026, month: "Oct", phase: "fitout", label: "Fitout Peak", description: " kitchens, bathrooms, flooring", icon: Building2 },
  { year: 2027, month: "Mar", phase: "complete", label: "Practical Completion", description: "OC obtained — settlement begins", icon: CheckCircle2 },
  { year: 2027, month: "Jun", phase: "complete", label: "Settlement Complete", description: "All owners moved in", icon: Trees },
  { year: 2028, month: "Jan", phase: "future", label: "Metro Station Opens", description: "New underground station — 200m walk", icon: Train, infrastructure: true },
  { year: 2028, month: "Sep", phase: "future", label: "Harbour Park", description: "3.2 hectare waterfront park opens", icon: Trees, infrastructure: true },
  { year: 2029, month: "Mar", phase: "future", label: "School Expansion", description: "St. Mary's new campus — 600m", icon: School, infrastructure: true },
];

const PHASES: { id: Phase; label: string; color: string; description: string }[] = [
  { id: "site", label: "Site Today", color: "#6b7280", description: "The site as it exists now" },
  { id: "foundation", label: "Foundation", color: "#8b5cf6", description: "Ground works and basement" },
  { id: "structure", label: "Structure", color: "#3b82f6", description: "Building frame rising" },
  { id: "fitout", label: "Fitout", color: "#f59e0b", description: "Interior finishes" },
  { id: "complete", label: "Complete", color: "#10b981", description: "The finished building" },
  { id: "future", label: "2030 Vision", color: "#06b6d4", description: "The neighbourhood to come" },
];

const INFRASTRUCTURE_ITEMS = [
  { name: "Metro Station", distance: "200m", year: 2028, verified: true, source: "Transport NSW" },
  { name: "Harbour Park", distance: "400m", year: 2028, verified: true, source: "City of Sydney" },
  { name: "School Expansion", distance: "600m", year: 2029, verified: true, source: "NSW Education" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function TimeScrub() {
  const [phaseIndex, setPhaseIndex] = useState(4); // Start at "complete"
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      setPhaseIndex(prev => {
        if (prev >= PHASES.length - 1) return 0;
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Events up to current phase
  const visibleEvents = EVENTS.filter(e => {
    const phaseIdx = PHASES.findIndex(p => p.id === e.phase);
    return phaseIdx <= phaseIndex;
  });

  // Future infrastructure for "future" phase
  const showInfrastructure = phaseIndex >= 4;

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b3b45] to-[#4a4a55] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Time Scrub</h1>
              <p className="text-[10px] text-white/25">Site today → construction → complete → 2030</p>
            </div>
          </div>
          <button onClick={() => setShowInfo(!showInfo)} className="text-white/20 hover:text-white/40">
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Phase visualization */}
            <div className="flex-1 relative bg-[#080808] flex items-center justify-center overflow-hidden p-8">
              {/* Background based on phase */}
              <div className="absolute inset-0 transition-all duration-1000" style={{
                background: phaseIndex <= 1 ? "#1a1814"
                  : phaseIndex === 2 ? "#141820"
                  : phaseIndex === 3 ? "#1a1a1a"
                  : phaseIndex === 4 ? "#0f1720"
                  : "#0f1a20"
              }} />

              {/* Site phase — empty lot */}
              {phaseIndex === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 600 400" className="w-full max-w-[600px]">
                    <rect x="50" y="200" width="500" height="150" fill="#2a2520" rx="4" />
                    <rect x="100" y="150" width="80" height="60" fill="#3a3530" rx="2" />
                    <rect x="200" y="120" width="120" height="90" fill="#3a3530" rx="2" />
                    <rect x="350" y="160" width="100" height="50" fill="#3a3530" rx="2" />
                    <text x="300" y="280" fill="rgba(255,255,255,0.15)" fontSize="14" textAnchor="middle" fontFamily="Inter">Existing buildings — pre-demolition</text>
                    <text x="300" y="300" fill="rgba(255,255,255,0.08)" fontSize="10" textAnchor="middle" fontFamily="Inter">45 Park Avenue, Sydney</text>
                  </svg>
                </motion.div>
              )}

              {/* Foundation phase */}
              {phaseIndex === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 600 400" className="w-full max-w-[600px]">
                    <rect x="50" y="250" width="500" height="100" fill="#2a2825" rx="4" />
                    {/* Excavation */}
                    <rect x="150" y="260" width="300" height="80" fill="#1a1815" rx="2" />
                    <rect x="200" y="240" width="200" height="20" fill="#4a4540" rx="1" />
                    {/* Crane */}
                    <line x1="450" y1="280" x2="450" y2="80" stroke="#5a5550" strokeWidth="4" />
                    <line x1="450" y1="80" x2="520" y2="120" stroke="#5a5550" strokeWidth="3" />
                    <text x="300" y="200" fill="rgba(255,255,255,0.15)" fontSize="14" textAnchor="middle" fontFamily="Inter">Foundation excavation</text>
                  </svg>
                </motion.div>
              )}

              {/* Structure phase */}
              {phaseIndex === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 600 400" className="w-full max-w-[600px]">
                    <rect x="50" y="300" width="500" height="50" fill="#2a2825" rx="4" />
                    {/* Tower A rising */}
                    <rect x="180" y="100" width="100" height="200" fill="#2a3038" rx="1" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
                    {/* Tower B starting */}
                    <rect x="320" y="200" width="80" height="100" fill="#2a3038" rx="1" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
                    {/* Floor lines */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1="180" y1={100 + i * 25} x2="280" y2={100 + i * 25} stroke="rgba(59,130,246,0.1)" strokeWidth="0.5" />
                    ))}
                    {/* Crane */}
                    <line x1="130" y1="320" x2="130" y2="60" stroke="#5a5550" strokeWidth="3" />
                    <line x1="130" y1="60" x2="200" y2="40" stroke="#5a5550" strokeWidth="2" />
                    <text x="300" y="80" fill="rgba(59,130,246,0.3)" fontSize="12" textAnchor="middle" fontFamily="Inter">Tower A rising — Level 18</text>
                  </svg>
                </motion.div>
              )}

              {/* Fitout phase */}
              {phaseIndex === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 600 400" className="w-full max-w-[600px]">
                    <rect x="50" y="300" width="500" height="50" fill="#2a2825" rx="4" />
                    {/* Towers with facade */}
                    <rect x="160" y="60" width="120" height="240" fill="#2a3238" rx="2" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
                    <rect x="310" y="100" width="100" height="200" fill="#2a3238" rx="2" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                    {/* Windows with some lit */}
                    {Array.from({ length: 10 }).map((_, row) =>
                      Array.from({ length: 5 }).map((_, col) => {
                        const lit = (row + col) % 3 === 0;
                        return (
                          <rect key={`${row}-${col}`} x={165 + col * 22} y={70 + row * 22} width="16" height="16" rx="1"
                            fill={lit ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)"} />
                        );
                      })
                    )}
                    <text x="300" y="40" fill="rgba(245,158,11,0.4)" fontSize="12" textAnchor="middle" fontFamily="Inter">Fitout in progress — kitchens, bathrooms, flooring</text>
                  </svg>
                </motion.div>
              )}

              {/* Complete phase */}
              {phaseIndex === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 600 400" className="w-full max-w-[600px]">
                    <defs>
                      <linearGradient id="completeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a2a3a" />
                        <stop offset="100%" stopColor="#0f1a2a" />
                      </linearGradient>
                    </defs>
                    <rect x="50" y="300" width="500" height="50" fill="url(#completeGrad)" rx="4" />
                    {/* Completed towers */}
                    <rect x="150" y="50" width="130" height="250" fill="#1e2e3e" rx="3" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                    <rect x="300" y="80" width="110" height="220" fill="#1e2e3e" rx="3" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" />
                    {/* Windows */}
                    {Array.from({ length: 12 }).map((_, row) =>
                      Array.from({ length: 6 }).map((_, col) => (
                        <rect key={`${row}-${col}`} x={155 + col * 20} y={58 + row * 19} width="14" height="14" rx="1"
                          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      ))
                    )}
                    {/* Garden */}
                    <rect x="50" y="280" width="500" height="20" fill="rgba(16,185,129,0.05)" rx="2" />
                    <text x="300" y="30" fill="rgba(16,185,129,0.4)" fontSize="13" textAnchor="middle" fontFamily="Inter" fontWeight="600">Azure Heights — Practical Completion</text>
                  </svg>
                </motion.div>
              )}

              {/* Future phase */}
              {phaseIndex >= 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 600 400" className="w-full max-w-[600px]">
                    <rect x="50" y="300" width="500" height="50" fill="#0f2028" rx="4" />
                    {/* Completed towers */}
                    <rect x="150" y="50" width="130" height="250" fill="#1a2a35" rx="3" />
                    <rect x="300" y="80" width="110" height="220" fill="#1a2a35" rx="3" />
                    {/* Windows */}
                    {Array.from({ length: 12 }).map((_, row) =>
                      Array.from({ length: 6 }).map((_, col) => (
                        <rect key={`${row}-${col}`} x={155 + col * 20} y={58 + row * 19} width="14" height="14" rx="1"
                          fill="rgba(255,255,255,0.05)" />
                      ))
                    )}
                    {/* Infrastructure markers */}
                    <g>
                      <circle cx="80" cy="200" r="8" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1" />
                      <text x="80" y="225" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="Inter">Metro</text>
                    </g>
                    <g>
                      <circle cx="520" cy="150" r="8" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1" />
                      <text x="520" y="175" fill="#10b981" fontSize="8" textAnchor="middle" fontFamily="Inter">Park</text>
                    </g>
                    <g>
                      <circle cx="480" cy="280" r="8" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1" />
                      <text x="480" y="305" fill="#f59e0b" fontSize="8" textAnchor="middle" fontFamily="Inter">School</text>
                    </g>
                    <text x="300" y="30" fill="rgba(6,182,212,0.4)" fontSize="13" textAnchor="middle" fontFamily="Inter" fontWeight="600">The Neighbourhood in 2030</text>
                  </svg>
                </motion.div>
              )}

              {/* Phase label overlay */}
              <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-xl border border-white/[0.06] px-4 py-2.5">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Phase {phaseIndex + 1} of {PHASES.length}</p>
                <p className="text-[16px] font-bold" style={{ color: currentPhase.color }}>{currentPhase.label}</p>
              </div>

              {/* Infrastructure panel (future phases) */}
              {showInfrastructure && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-4 right-4 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-xl border border-white/[0.06] p-4 w-[220px]"
                >
                  <p className="text-[9px] text-white/20 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Coming to the neighbourhood
                  </p>
                  {INFRASTRUCTURE_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-white/[0.03] last:border-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400/50 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-white/50">{item.name}</p>
                        <p className="text-[8px] text-white/15">{item.distance} · {item.year} · {item.source}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-white/[0.03] flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400/40 flex-shrink-0" />
                    <p className="text-[8px] text-white/15">All dates from official government announcements. Verified.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Scrubber controls */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.03]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isPlaying ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1]"
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setPhaseIndex(0); }}
                  className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-white/40"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                {/* Phase dots */}
                <div className="flex-1 flex items-center gap-0">
                  {PHASES.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => { setPhaseIndex(i); setIsPlaying(false); }}
                      className="flex-1 relative group"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full border-2 transition-all flex-shrink-0"
                          style={{
                            borderColor: i <= phaseIndex ? p.color : "rgba(255,255,255,0.08)",
                            background: i === phaseIndex ? p.color : i < phaseIndex ? `${p.color}40` : "transparent",
                          }}
                        />
                        {i < PHASES.length - 1 && (
                          <div
                            className="h-px flex-1 mx-1 transition-colors"
                            style={{ background: i < phaseIndex ? `${p.color}40` : "rgba(255,255,255,0.04)" }}
                          />
                        )}
                      </div>
                      <p className={`text-[8px] mt-1.5 transition-colors text-left ${i === phaseIndex ? "text-white/50" : "text-white/15"}`}>
                        {p.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — Timeline */}
          <div className="w-[280px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto flex-shrink-0">
            <div className="p-4">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Timeline</p>
              <div className="space-y-0 relative">
                {/* Vertical line */}
                <div className="absolute left-[14px] top-2 bottom-2 w-px bg-white/[0.04]" />

                {visibleEvents.map((event, i) => {
                  const phase = PHASES.find(p => p.id === event.phase);
                  const isInfra = event.infrastructure;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="relative flex items-start gap-3 pb-3"
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 relative z-10"
                        style={{
                          borderColor: phase?.color || "#6b7280",
                          background: isInfra ? `${phase?.color}20` : "#0A0A0A",
                        }}
                      >
                        {isInfra && <div className="w-1 h-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: phase?.color }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-white/15">{event.month} {event.year}</span>
                          {isInfra && (
                            <span className="px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[7px] font-medium uppercase">Future</span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 font-medium">{event.label}</p>
                        <p className="text-[9px] text-white/15">{event.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Trust note */}
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/50 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-white/25 leading-relaxed">
                    Future infrastructure dates are sourced from official government announcements and are publicly verifiable.
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
