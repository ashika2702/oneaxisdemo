import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Layers, Activity, Thermometer, Droplets, Wind, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const SYSTEMS = [
  { id: "hvac", name: "HVAC", icon: Wind, status: "operational", value: "22°C", detail: "Cooling active, 3 zones" },
  { id: "water", name: "Water", icon: Droplets, status: "operational", value: "Normal", detail: "Pressure 480 kPa" },
  { id: "electrical", name: "Electrical", icon: Zap, status: "operational", value: "95% Load", detail: "Main + backup active" },
  { id: "fire", name: "Fire Safety", icon: AlertTriangle, status: "operational", value: "Armed", detail: "All sensors clear" },
  { id: "security", name: "Security", icon: CheckCircle2, status: "operational", value: "Active", detail: "42 cameras online" },
  { id: "elevator", name: "Elevators", icon: Activity, status: "maintenance", value: "3/4", detail: "Service lift scheduled" },
];

const FLOORS = [
  { level: "P1", name: "Parking 1", occupancy: 85, systems: 6, alerts: 0 },
  { level: "P2", name: "Parking 2", occupancy: 62, systems: 6, alerts: 0 },
  { level: "L", name: "Lobby", occupancy: 40, systems: 6, alerts: 0 },
  { level: "1", name: "Level 1", occupancy: 78, systems: 6, alerts: 0 },
  { level: "2", name: "Level 2", occupancy: 65, systems: 6, alerts: 1 },
  { level: "3", name: "Level 3", occupancy: 90, systems: 6, alerts: 0 },
  { level: "4", name: "Level 4", occupancy: 55, systems: 6, alerts: 0 },
  { level: "R", name: "Rooftop", occupancy: 20, systems: 4, alerts: 0 },
];

export default function DigitalTwin() {
  const [activeFloor, setActiveFloor] = useState("3");

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Digital Twin</h1>
              <p className="text-[10px] text-white/25">Real-time building systems monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live
            </span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Floor Selector */}
          <div className="w-48 border-r border-white/[0.04] py-3 flex-shrink-0">
            <p className="text-[9px] text-white/20 uppercase tracking-wider px-4 mb-2">Building Levels</p>
            {[...FLOORS].reverse().map(floor => (
              <button key={floor.level} onClick={() => setActiveFloor(floor.level)}
                className={`w-full flex items-center justify-between px-4 h-9 text-[12px] transition-all ${activeFloor === floor.level ? "bg-white/[0.04] text-white/80" : "text-white/30 hover:text-white/50 hover:bg-white/[0.02]"}`}>
                <span>Level {floor.level}</span>
                <div className="flex items-center gap-2">
                  {floor.alerts > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  <span className="text-[10px] text-white/20">{floor.occupancy}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin space-y-4">
            {/* Building Stack */}
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
              <p className="text-[11px] text-white/30 mb-4 uppercase tracking-wider">Building Stack</p>
              <div className="flex items-end gap-1 h-40">
                {[...FLOORS].reverse().map(floor => (
                  <motion.div key={floor.level} initial={{ height: 0 }} animate={{ height: `${floor.occupancy * 0.8}%` }}
                    transition={{ duration: 0.5 }}
                    className={`flex-1 rounded-t-sm ${activeFloor === floor.level ? "bg-white/[0.15]" : "bg-white/[0.05]"} hover:bg-white/[0.12] cursor-pointer transition-colors relative`}
                    onClick={() => setActiveFloor(floor.level)}>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/30">{floor.level}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Systems Grid */}
            <div className="grid grid-cols-3 gap-3">
              {SYSTEMS.map((sys, i) => (
                <motion.div key={sys.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <sys.icon className="w-4 h-4 text-white/30" />
                    </div>
                    <span className={`text-[9px] px-1.5 py-[1px] rounded-full ${sys.status === "operational" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{sys.status}</span>
                  </div>
                  <p className="text-[16px] font-bold text-white/90">{sys.value}</p>
                  <p className="text-[11px] text-white/40">{sys.name}</p>
                  <p className="text-[9px] text-white/20 mt-1">{sys.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
