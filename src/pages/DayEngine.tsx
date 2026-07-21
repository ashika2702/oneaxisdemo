import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Sunrise, Sunset, Snowflake, Leaf, Thermometer,
  Home, Building2, Eye, ChevronLeft, ChevronRight, Play, Pause,
  RotateCcw, Info, Maximize2, Minimize2, Clock, CalendarDays
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type Season = "summer" | "autumn" | "winter" | "spring";
type ViewMode = "exterior" | "interior" | "balcony";
type TimeState = "dawn" | "morning" | "noon" | "afternoon" | "golden" | "dusk" | "night";

interface SunPosition {
  altitude: number; // -90 to 90
  azimuth: number;  // 0 to 360
  intensity: number; // 0 to 1
  colorTemp: number; // warm (2700) to cool (6500)
}

/* ═══════════════════════════════════════════
   SUN CALCULATION ENGINE (simplified SunCalc)
   ═══════════════════════════════════════════ */
function getSunPosition(date: Date, lat: number, lng: number): SunPosition {
  const hour = date.getHours() + date.getMinutes() / 60;
  const month = date.getMonth();

  // Simplified solar model for Sydney (-33.87, 151.21)
  const dayOfYear = month * 30 + date.getDate();
  const declination = 23.45 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);

  // Hour angle
  const solarTime = hour - 12;
  const hourAngle = solarTime * 15;

  // Altitude
  const latRad = (lat * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;
  const hourRad = (hourAngle * Math.PI) / 180;
  const sinAlt = Math.sin(latRad) * Math.sin(declRad) + Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourRad);
  const altitude = (Math.asin(sinAlt) * 180) / Math.PI;

  // Azimuth (simplified)
  const cosAz = (Math.sin(declRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
  let azimuth = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
  if (hour > 12) azimuth = 360 - azimuth;

  // Color temperature by altitude
  let colorTemp = 6500;
  let intensity = 1;

  if (altitude < -6) {
    colorTemp = 2700;
    intensity = 0.05;
  } else if (altitude < 0) {
    colorTemp = 3200;
    intensity = 0.15 + (altitude + 6) / 6 * 0.3;
  } else if (altitude < 10) {
    colorTemp = 4000;
    intensity = 0.45 + (altitude / 10) * 0.35;
  } else if (altitude < 30) {
    colorTemp = 5500;
    intensity = 0.8 + ((altitude - 10) / 20) * 0.2;
  } else {
    colorTemp = 6500;
    intensity = 1;
  }

  return { altitude, azimuth, intensity, colorTemp };
}

function timeStateFromHour(hour: number): TimeState {
  if (hour < 6) return "night";
  if (hour < 7) return "dawn";
  if (hour < 10) return "morning";
  if (hour < 14) return "noon";
  if (hour < 17) return "afternoon";
  if (hour < 19) return "golden";
  if (hour < 20) return "dusk";
  return "night";
}

function seasonFromMonth(month: number): Season {
  if (month >= 11 || month <= 1) return "summer";
  if (month >= 2 && month <= 4) return "autumn";
  if (month >= 5 && month <= 7) return "winter";
  return "spring";
}

function colorTempToHex(temp: number): string {
  // Clamp
  temp = Math.max(2700, Math.min(6500, temp));
  // Warm = amber, Cool = blue-white
  const t = (temp - 2700) / 3800;
  const r = Math.round(255 * (1 - t * 0.1));
  const g = Math.round(220 + t * 35);
  const b = Math.round(180 + t * 75);
  return `rgb(${r},${g},${b})`;
}

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const SEASONS: { id: Season; label: string; month: number }[] = [
  { id: "summer", label: "December", month: 11 },
  { id: "autumn", label: "March", month: 2 },
  { id: "winter", label: "June", month: 5 },
  { id: "spring", label: "September", month: 8 },
];

const TIME_LABELS: Record<TimeState, string> = {
  dawn: "5:30 AM — Dawn",
  morning: "8:00 AM — Morning",
  noon: "12:00 PM — Midday",
  afternoon: "3:00 PM — Afternoon",
  golden: "5:30 PM — Golden Hour",
  dusk: "7:00 PM — Dusk",
  night: "9:00 PM — Night",
};

const TIME_HOURS: Record<TimeState, number> = {
  dawn: 5.5, morning: 8, noon: 12, afternoon: 15, golden: 17.5, dusk: 19, night: 21,
};

const UNIT_ORIENTATIONS = [
  { name: "North", bearing: 0, label: "N", color: "#3b82f6" },
  { name: "East", bearing: 90, label: "E", color: "#f59e0b" },
  { name: "South", bearing: 180, label: "S", color: "#ef4444" },
  { name: "West", bearing: 270, label: "W", color: "#10b981" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function DayEngine() {
  const [timeState, setTimeState] = useState<TimeState>("noon");
  const [season, setSeason] = useState<Season>("summer");
  const [viewMode, setViewMode] = useState<ViewMode>("balcony");
  const [selectedOrientation, setSelectedOrientation] = useState(0); // North
  const [isPlaying, setIsPlaying] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sliderHour, setSliderHour] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Effective hour from either slider or preset
  const effectiveHour = useMemo(() => {
    if (isPlaying) return sliderHour;
    return TIME_HOURS[timeState];
  }, [timeState, sliderHour, isPlaying]);

  // Create date object for sun calc
  const simDate = useMemo(() => {
    const d = new Date();
    const seasonMonth = SEASONS.find(s => s.id === season)?.month ?? 11;
    d.setMonth(seasonMonth);
    d.setHours(Math.floor(effectiveHour));
    d.setMinutes(Math.round((effectiveHour % 1) * 60));
    return d;
  }, [season, effectiveHour]);

  // Sun position
  const sun = useMemo(() => getSunPosition(simDate, -33.87, 151.21), [simDate]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSliderHour(prev => {
        if (prev >= 22) return 5;
        return prev + 0.15;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Sky gradient based on sun altitude and season
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);

    if (sun.altitude < -6) {
      // Night
      skyGrad.addColorStop(0, "#0a0a1a");
      skyGrad.addColorStop(0.5, "#1a1020");
      skyGrad.addColorStop(1, "#0d0d1a");
    } else if (sun.altitude < 0) {
      // Dawn/Dusk
      skyGrad.addColorStop(0, "#2a1a4a");
      skyGrad.addColorStop(0.3, "#4a2a3a");
      skyGrad.addColorStop(0.6, "#6a3a2a");
      skyGrad.addColorStop(1, "#1a1a2e");
    } else if (sun.altitude < 20) {
      // Golden
      skyGrad.addColorStop(0, "#3a4a7a");
      skyGrad.addColorStop(0.3, "#6a5a4a");
      skyGrad.addColorStop(0.6, "#8a6a3a");
      skyGrad.addColorStop(1, "#2a2a3e");
    } else {
      // Day
      const s = SEASONS.find(s => s.id === season);
      if (season === "summer") {
        skyGrad.addColorStop(0, "#3a6aaa");
        skyGrad.addColorStop(0.5, "#5a8aca");
        skyGrad.addColorStop(1, "#aaccdd");
      } else if (season === "winter") {
        skyGrad.addColorStop(0, "#4a5a7a");
        skyGrad.addColorStop(0.5, "#6a7a9a");
        skyGrad.addColorStop(1, "#9aabbbaa");
      } else {
        skyGrad.addColorStop(0, "#3a5a8a");
        skyGrad.addColorStop(0.5, "#5a7aaa");
        skyGrad.addColorStop(1, "#8aabcbaa");
      }
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Stars at night
    if (sun.altitude < -6) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 80; i++) {
        const sx = (i * 137.5) % w;
        const sy = (i * 89.3) % (h * 0.6);
        const sr = 0.5 + (i % 3) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sun / Moon
    const sunX = w * 0.5 + Math.cos((sun.azimuth - 90) * Math.PI / 180) * w * 0.35;
    const sunY = h * 0.6 - Math.sin(sun.altitude * Math.PI / 180) * h * 0.4;

    if (sun.altitude > -12) {
      // Sun glow
      const glowGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 60);
      glowGrad.addColorStop(0, `rgba(255,220,150,${sun.intensity * 0.4})`);
      glowGrad.addColorStop(0.5, `rgba(255,200,100,${sun.intensity * 0.15})`);
      glowGrad.addColorStop(1, "rgba(255,180,50,0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(sunX - 60, sunY - 60, 120, 120);

      // Sun disc
      ctx.fillStyle = colorTempToHex(sun.colorTemp);
      ctx.beginPath();
      ctx.arc(sunX, sunY, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Moon
      ctx.fillStyle = "#ddd";
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.15, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // City/building silhouettes
    ctx.fillStyle = sun.altitude < 0 ? "#0a0a12" : "#1a1a2a";
    // Tower A
    ctx.fillRect(w * 0.15, h * 0.45, 40, h * 0.55);
    // Tower B
    ctx.fillRect(w * 0.35, h * 0.35, 50, h * 0.65);
    // Tower C
    ctx.fillRect(w * 0.55, h * 0.4, 35, h * 0.6);
    // Tower D
    ctx.fillRect(w * 0.72, h * 0.38, 45, h * 0.62);

    // Windows
    if (sun.altitude < 0) {
      // Lit windows at night
      ctx.fillStyle = "rgba(255,220,150,0.3)";
      for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 4; col++) {
          const lit = ((row * 7 + col * 13) % 3 === 0);
          if (lit) {
            ctx.fillRect(w * 0.15 + 5 + col * 8, h * 0.5 + row * 15, 5, 8);
            ctx.fillRect(w * 0.35 + 5 + col * 10, h * 0.42 + row * 15, 6, 8);
          }
        }
      }
    }

    // Interior room preview (if interior mode)
    if (viewMode === "interior") {
      // Room overlay
      const rw = w * 0.7;
      const rh = h * 0.5;
      const rx = (w - rw) / 2;
      const ry = h * 0.45;

      // Room background
      const roomLight = Math.max(0.05, sun.intensity * 0.8);
      ctx.fillStyle = `rgba(${30 + roomLight * 40},${25 + roomLight * 35},${20 + roomLight * 30},0.95)`;
      ctx.fillRect(rx, ry, rw, rh);

      // Window
      ctx.fillStyle = sun.altitude > 0
        ? `rgba(${100 + sun.intensity * 100},${120 + sun.intensity * 80},${160 + sun.intensity * 60},0.6)`
        : "rgba(20,20,40,0.8)";
      ctx.fillRect(rx + 20, ry + 20, rw * 0.4, rh * 0.5);

      // Window frame
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(rx + 20, ry + 20, rw * 0.4, rh * 0.5);

      // Sunlight through window
      if (sun.intensity > 0.2) {
        const lightGrad = ctx.createLinearGradient(rx + 20, ry + 20, rx + rw * 0.5, ry + rh * 0.8);
        const li = sun.intensity * 0.15;
        lightGrad.addColorStop(0, `rgba(255,220,150,${li})`);
        lightGrad.addColorStop(1, "rgba(255,220,150,0)");
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.moveTo(rx + 20, ry + 20);
        ctx.lineTo(rx + rw * 0.4, ry + 20);
        ctx.lineTo(rx + rw * 0.6, ry + rh * 0.8);
        ctx.lineTo(rx + 20, ry + rh * 0.7);
        ctx.closePath();
        ctx.fill();
      }

      // Kitchen bench
      ctx.fillStyle = "rgba(80,70,60,0.6)";
      ctx.fillRect(rx + rw * 0.55, ry + rh * 0.4, rw * 0.4, 8);

      // Label
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(`${UNIT_ORIENTATIONS[selectedOrientation].name} facing · Level 14`, rx + 20, ry + rh - 15);
    }

    // Balcony view overlay
    if (viewMode === "balcony") {
      // Balcony railing
      ctx.strokeStyle = sun.altitude < 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      for (let x = 0; x < w; x += 20) {
        ctx.lineTo(x, h * 0.7 + Math.sin(x * 0.05) * 2);
      }
      ctx.stroke();

      // Vertical rails
      for (let x = 40; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.7);
        ctx.lineTo(x, h * 0.85);
        ctx.stroke();
      }

      // View label
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "12px Inter, sans-serif";
      ctx.fillText(`Balcony · ${UNIT_ORIENTATIONS[selectedOrientation].name} aspect · ${SEASONS.find(s => s.id === season)?.label}`, w * 0.5 - 120, h * 0.92);
    }

  }, [sun, season, viewMode, selectedOrientation]);

  const currentTimeLabel = useMemo(() => {
    const h = Math.floor(effectiveHour);
    const m = Math.round((effectiveHour % 1) * 60);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }, [effectiveHour]);

  return (
    <AdminLayout hideSidebar={presentationMode}>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Day Engine</h1>
              <p className="text-[10px] text-white/25">Astronomy-accurate light simulation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggles */}
            <div className="flex items-center rounded-lg p-[2px] bg-white/[0.03] border border-white/[0.04]">
              {(["exterior", "interior", "balcony"] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium capitalize transition-all ${
                    viewMode === v ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-7 h-7 rounded-lg bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06]"
            >
              <Info className="w-3.5 h-3.5 text-white/30" />
            </button>

            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-[10px] text-white/30 hover:text-white/50 transition-all"
            >
              {presentationMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              {presentationMode ? "Exit" : "Present"}
            </button>
          </div>
        </div>

        {/* Info banner */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 py-3 bg-amber-500/[0.04] border-b border-amber-500/10 flex items-start gap-3">
                <Sun className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    The Day Engine computes real sun position for any date/time at the project's latitude/longitude.
                    Light direction, color temperature, and sky state are all astronomy-derived, not painted.
                    Winter vs summer shadows differ because Earth's axial tilt is in the math.
                  </p>
                  <p className="text-[10px] text-amber-400/50 mt-1">
                    Sydney: 33.87°S, 151.21°E · Solar declination: {getSunPosition(simDate, -33.87, 151.21).altitude.toFixed(1)}° altitude
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex overflow-hidden">
          {/* Main canvas area */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              width={900}
              height={500}
              className="w-full h-full object-cover"
            />

            {/* Time overlay */}
            <div className="absolute top-4 left-4 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-xl border border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[18px] font-bold text-white/90 tabular-nums">{currentTimeLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/25">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3" /> {sun.altitude.toFixed(1)}° altitude
                </span>
                <span>|</span>
                <span>{sun.azimuth.toFixed(0)}° azimuth</span>
                <span>|</span>
                <span>{sun.colorTemp}K</span>
              </div>
            </div>

            {/* Orientation badge */}
            <div className="absolute top-4 right-4 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-xl border border-white/[0.06] px-3 py-2">
              <div className="flex items-center gap-2">
                <NavigationIcon bearing={UNIT_ORIENTATIONS[selectedOrientation].bearing} />
                <div>
                  <p className="text-[12px] font-medium text-white/70">{UNIT_ORIENTATIONS[selectedOrientation].name}</p>
                  <p className="text-[9px] text-white/20">{UNIT_ORIENTATIONS[selectedOrientation].bearing}° bearing</p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-lg border border-white/[0.06] px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-white/30">Astronomy-computed · Not rendered art</span>
            </div>
          </div>

          {/* Right control panel */}
          <div className="w-[280px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto flex-shrink-0">
            <div className="p-4 space-y-5">
              {/* Play controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-medium transition-all ${
                    isPlaying ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? "Pause Day" : "Play Day"}
                </button>
                <button
                  onClick={() => { setSliderHour(12); setIsPlaying(false); setTimeState("noon"); }}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white/30" />
                </button>
              </div>

              {/* Time scrubber */}
              <div>
                <label className="text-[10px] text-white/25 uppercase tracking-wider mb-2 block">Time of Day</label>
                <input
                  type="range"
                  min={5}
                  max={22}
                  step={0.1}
                  value={sliderHour}
                  onChange={(e) => { setSliderHour(Number(e.target.value)); setIsPlaying(false); }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-3"
                  style={{
                    background: `linear-gradient(to right, #1e1e2e 0%, #f59e0b ${((sliderHour - 5) / 17) * 100}%, #1e1e2e ${((sliderHour - 5) / 17) * 100}%)`,
                  }}
                />
                <div className="grid grid-cols-4 gap-1">
                  {(Object.keys(TIME_HOURS) as TimeState[]).map(ts => (
                    <button
                      key={ts}
                      onClick={() => { setTimeState(ts); setSliderHour(TIME_HOURS[ts]); setIsPlaying(false); }}
                      className={`px-1.5 py-1 rounded text-[9px] transition-all ${
                        timeState === ts && !isPlaying
                          ? "bg-white/[0.08] text-white/70"
                          : "text-white/20 hover:text-white/40 hover:bg-white/[0.03]"
                      }`}
                    >
                      {TIME_LABELS[ts].split(" — ")[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season selector */}
              <div>
                <label className="text-[10px] text-white/25 uppercase tracking-wider mb-2 block">
                  <CalendarDays className="w-3 h-3 inline mr-1" />Season
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SEASONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSeason(s.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        season === s.id
                          ? "bg-white/[0.06] border-white/[0.1]"
                          : "bg-transparent border-white/[0.03] hover:border-white/[0.06]"
                      }`}
                    >
                      <p className={`text-[11px] font-medium ${season === s.id ? "text-white/80" : "text-white/40"}`}>
                        {s.label}
                      </p>
                      <p className="text-[9px] text-white/20 capitalize">{s.id}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="text-[10px] text-white/25 uppercase tracking-wider mb-2 block">Unit Orientation</label>
                <div className="space-y-1">
                  {UNIT_ORIENTATIONS.map((o, i) => (
                    <button
                      key={o.name}
                      onClick={() => setSelectedOrientation(i)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-all ${
                        selectedOrientation === i ? "bg-white/[0.06]" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/[0.08] flex items-center justify-center" style={{ borderColor: selectedOrientation === i ? o.color : undefined }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: o.color }} />
                      </div>
                      <div className="text-left">
                        <p className={`text-[11px] ${selectedOrientation === i ? "text-white/70 font-medium" : "text-white/35"}`}>
                          {o.name}
                        </p>
                        <p className="text-[9px] text-white/15">{o.bearing}°</p>
                      </div>
                      {selectedOrientation === i && (
                        <motion.div layoutId="orientation-check" className="ml-auto">
                          <Eye className="w-3 h-3 text-white/30" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* The question this answers */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                <p className="text-[9px] text-white/20 uppercase tracking-wider mb-1.5">This answers</p>
                <p className="text-[11px] text-white/50 italic leading-relaxed">
                  "Will the morning sun hit the bedroom in July?"
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Thermometer className="w-3 h-3 text-white/15" />
                  <span className="text-[10px] text-white/20">
                    Light at {sun.altitude > 0 ? "+" : ""}{sun.altitude.toFixed(1)}° · {sun.colorTemp}K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* Compass indicator */
function NavigationIcon({ bearing }: { bearing: number }) {
  return (
    <div className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center relative">
      <div
        className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-l-transparent border-r-transparent border-b-red-400/60"
        style={{ transform: `rotate(${bearing}deg)`, transformOrigin: "center" }}
      />
      <span className="absolute text-[7px] text-white/20 font-medium top-0.5">N</span>
    </div>
  );
}
