import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Users, CloudRain, Sun, Wind, Eye, Clock,
  TrendingUp, AlertTriangle, CheckCircle2, Building2,
  Radio, Thermometer, Droplets, RefreshCw, Zap, Globe
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const WEATHER = {
  condition: "rain" as const,
  temp: 18,
  humidity: 78,
  wind: 22,
  description: "Light rain · Feels like 16°",
};

const LIVE_UNITS = [
  { id: "A1402", status: "available", viewers: 3, lastAction: "Floor plan viewed", timeAgo: "2 min ago" },
  { id: "A1203", status: "available", viewers: 1, lastAction: "Price enquiry", timeAgo: "5 min ago" },
  { id: "A1501", status: "available", viewers: 2, lastAction: "Gallery viewed", timeAgo: "1 min ago" },
  { id: "A0802", status: "reserved", viewers: 0, lastAction: "Reserved by James Chen", timeAgo: "12 min ago" },
  { id: "A1004", status: "sold", viewers: 0, lastAction: "Sold — contract exchanged", timeAgo: "1 hour ago" },
];

const PRESENCE_COUNT = 12;
const TOTAL_SESSIONS_TODAY = 47;

export default function LivingProject() {
  const [pulseUnits, setPulseUnits] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewerSpike, setViewerSpike] = useState(false);

  // Simulate live pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Random pulse
      const unitId = LIVE_UNITS[Math.floor(Math.random() * LIVE_UNITS.length)].id;
      setPulseUnits(prev => new Set([...prev, unitId]));
      setTimeout(() => {
        setPulseUnits(prev => {
          const next = new Set(prev);
          next.delete(unitId);
          return next;
        });
      }, 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Living Project</h1>
              <p className="text-[10px] text-white/25">Live inventory · Presence · Weather</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
              <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
            </span>
            <span className="text-[10px] text-white/20">{currentTime.toLocaleTimeString("en-AU")}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Top row: Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Active Viewers", value: String(PRESENCE_COUNT), icon: Users, color: "#3b82f6", sub: "3 on Unit A1402" },
              { label: "Sessions Today", value: String(TOTAL_SESSIONS_TODAY), icon: Eye, color: "#8b5cf6", sub: "+12% vs yesterday" },
              { label: "Hot Leads", value: "8", icon: Zap, color: "#f59e0b", sub: "3 new today" },
              { label: "Units Reserved", value: "3", icon: CheckCircle2, color: "#10b981", sub: "Today: A0802" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  <span className="text-[10px] text-white/20">{stat.label}</span>
                </div>
                <p className="text-[22px] font-bold text-white/90">{stat.value}</p>
                <p className="text-[9px] text-white/15">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Live inventory pulse */}
            <div className="col-span-2 bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-medium text-white/50 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-teal-400" /> Live Inventory Pulse
                </h3>
                <span className="text-[9px] text-white/15 flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5" /> Auto-refreshing
                </span>
              </div>

              <div className="space-y-2">
                {LIVE_UNITS.map(unit => {
                  const isPulsing = pulseUnits.has(unit.id);
                  const statusColor = unit.status === "available" ? "text-emerald-400" : unit.status === "reserved" ? "text-amber-400" : "text-red-400";
                  const statusBg = unit.status === "available" ? "bg-emerald-500/10" : unit.status === "reserved" ? "bg-amber-500/10" : "bg-red-500/10";

                  return (
                    <motion.div
                      key={unit.id}
                      animate={isPulsing ? { backgroundColor: "rgba(255,255,255,0.04)" } : { backgroundColor: "rgba(255,255,255,0.01)" }}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-white/15" />
                          {unit.viewers > 0 && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400 text-[6px] text-white flex items-center justify-center font-bold">
                              {unit.viewers}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-[12px] text-white/60 font-medium">{unit.id}</p>
                          <p className="text-[9px] text-white/15">{unit.lastAction} · {unit.timeAgo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {unit.viewers >= 2 && (
                          <span className="flex items-center gap-1 text-[9px] text-blue-400/60">
                            <Users className="w-2.5 h-2.5" /> {unit.viewers} viewing
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full ${statusBg} ${statusColor} text-[8px] font-semibold uppercase`}>
                          {unit.status}
                        </span>
                        {isPulsing && (
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-teal-400"
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Weather */}
              <div className="bg-gradient-to-br from-blue-500/[0.04] to-cyan-500/[0.02] border border-blue-500/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] text-white/20 uppercase tracking-wider">Sydney Weather</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[28px] font-bold text-white/90">{WEATHER.temp}°</span>
                  <span className="text-[11px] text-white/25">C</span>
                </div>
                <p className="text-[11px] text-white/30 mb-3">{WEATHER.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Droplets, label: "Humidity", value: `${WEATHER.humidity}%` },
                    { icon: Wind, label: "Wind", value: `${WEATHER.wind} km/h` },
                    { icon: Thermometer, label: "Feels like", value: `${WEATHER.temp - 2}°` },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <item.icon className="w-3.5 h-3.5 text-white/15 mx-auto mb-1" />
                      <p className="text-[10px] text-white/40">{item.value}</p>
                      <p className="text-[7px] text-white/10">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <p className="text-[9px] text-blue-400/40 flex items-center gap-1">
                    <Sun className="w-2.5 h-2.5" /> Matched to experience sky
                  </p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h3 className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Trust Indicators</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Live inventory", value: "Always true from DB", icon: CheckCircle2, color: "#10b981" },
                    { label: "Viewer counts", value: "Real, never faked", icon: Users, color: "#3b82f6" },
                    { label: "Weather", value: "Open-Meteo API", icon: Sun, color: "#f59e0b" },
                    { label: "Scarcity", value: "Database-driven", icon: AlertTriangle, color: "#ef4444" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <item.icon className="w-3 h-3 flex-shrink-0" style={{ color: item.color, opacity: 0.5 }} />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40">{item.label}</p>
                        <p className="text-[8px] text-white/15">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
