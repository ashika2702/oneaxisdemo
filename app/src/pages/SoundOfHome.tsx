import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Volume2, VolumeX, Wind, CloudRain, Sun, Moon,
  Building2, TreePine, Music, Sliders, Headphones,
  Waves, Info, Play, Pause, RotateCcw
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   AUDIO LAYER MODEL
   ═══════════════════════════════════════════ */
interface AudioLayer {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  volume: number;
  active: boolean;
  simulated: boolean;
}

const DEFAULT_LAYERS: AudioLayer[] = [
  { id: "base", name: "City Hum", description: "The ambient sound of the city at height", icon: Building2, color: "#6b7280", volume: 0.4, active: true, simulated: true },
  { id: "park", name: "Park Birds", description: "Birdsong from the nearby park aspect", icon: TreePine, color: "#10b981", volume: 0.25, active: false, simulated: true },
  { id: "morning", name: "Morning Light", description: "Soft dawn chorus and gentle breeze", icon: Sun, color: "#f59e0b", volume: 0.3, active: false, simulated: true },
  { id: "rain", name: "Rain on Glass", description: "Gentle rainfall on the balcony glazing", icon: CloudRain, color: "#3b82f6", volume: 0, active: false, simulated: true },
  { id: "evening", name: "Evening Calm", description: "Dusk settling, distant dinner sounds", icon: Moon, color: "#8b5cf6", volume: 0, active: false, simulated: true },
  { id: "water", name: "Water Garden", description: "Fountain sounds from the courtyard", icon: Waves, color: "#06b6d4", volume: 0.15, active: false, simulated: true },
];

const HEIGHT_CURVE = [
  { level: "Ground", height: 0, cityVol: 0.9, windVol: 0.05 },
  { level: "Level 5", height: 15, cityVol: 0.7, windVol: 0.1 },
  { level: "Level 10", height: 30, cityVol: 0.5, windVol: 0.2 },
  { level: "Level 14", height: 42, cityVol: 0.35, windVol: 0.3 },
  { level: "Level 18", height: 54, cityVol: 0.2, windVol: 0.4 },
  { level: "Penthouse", height: 60, cityVol: 0.1, windVol: 0.5 },
];

export default function SoundOfHome() {
  const [layers, setLayers] = useState<AudioLayer[]>(DEFAULT_LAYERS);
  const [masterVolume, setMasterVolume] = useState(0.6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHeight, setSelectedHeight] = useState(2); // Level 10
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "evening" | "night">("day");
  const [showInfo, setShowInfo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const setLayerVolume = (id: string, volume: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, volume } : l));
  };

  const heightData = HEIGHT_CURVE[selectedHeight];

  // Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw waveform for each active layer
      layers.filter(l => l.active).forEach((layer, li) => {
        ctx.beginPath();
        ctx.strokeStyle = layer.color + "60";
        ctx.lineWidth = 1.5;
        const time = Date.now() * 0.002;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.02 + time + li * 2) * (layer.volume * masterVolume * 40) * Math.sin(x * 0.01 + time * 0.5);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Center line
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [layers, masterVolume]);

  const activeLayers = layers.filter(l => l.active);

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center">
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Sound of Home</h1>
              <p className="text-[10px] text-white/25">Aspect-aware spatial audio atmosphere</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowInfo(!showInfo)} className="text-white/20 hover:text-white/40">
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                isPlaying ? "bg-cyan-500/15 text-cyan-400" : "bg-white/[0.06] text-white/40"
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isPlaying ? "Playing" : "Preview"}
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="flex-shrink-0 px-5 py-3 bg-cyan-500/[0.04] border-b border-cyan-500/10">
            <p className="text-[11px] text-white/40 leading-relaxed">
              The Sound of Home layers environmental audio based on the unit's height, aspect, and time of day.
              Higher floors hear less street noise and more wind. Park-facing units hear birdsong.
              Evening brings different sounds than morning. This is a simulated preview — production uses
              licensed seamless loops from Artlist/Soundly.
            </p>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Main area */}
          <div className="flex-1 flex flex-col p-6 overflow-auto">
            {/* Visualizer */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-5">
              <canvas ref={canvasRef} width={700} height={100} className="w-full h-[80px]" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[9px] text-white/15">
                  {activeLayers.length} layer{activeLayers.length !== 1 ? "s" : ""} active
                </span>
                <span className="text-[9px] text-white/15">
                  Master: {Math.round(masterVolume * 100)}%
                </span>
              </div>
            </div>

            {/* Height selector */}
            <div className="mb-5">
              <label className="text-[10px] text-white/20 uppercase tracking-wider mb-2 block">Floor Height</label>
              <div className="flex gap-2">
                {HEIGHT_CURVE.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHeight(i)}
                    className={`flex-1 p-2.5 rounded-xl border text-center transition-all ${
                      selectedHeight === i
                        ? "bg-white/[0.06] border-white/[0.1]"
                        : "bg-transparent border-white/[0.03] hover:border-white/[0.06]"
                    }`}
                  >
                    <p className={`text-[11px] font-medium ${selectedHeight === i ? "text-white/70" : "text-white/30"}`}>{h.level}</p>
                    <p className="text-[8px] text-white/15">{h.height}m</p>
                  </button>
                ))}
              </div>
              {/* Height curve visualization */}
              <div className="mt-3 flex items-end gap-1 h-8">
                {HEIGHT_CURVE.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5">
                      <div className="flex-1 rounded-sm bg-white/[0.06]" style={{ height: `${h.cityVol * 24}px` }} />
                      <div className="flex-1 rounded-sm bg-cyan-500/20" style={{ height: `${h.windVol * 24}px` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-1 px-1">
                <span className="flex items-center gap-1 text-[8px] text-white/15">
                  <span className="w-2 h-1 rounded-sm bg-white/[0.06]" /> Street noise
                </span>
                <span className="flex items-center gap-1 text-[8px] text-white/15">
                  <span className="w-2 h-1 rounded-sm bg-cyan-500/20" /> Wind
                </span>
              </div>
            </div>

            {/* Time of day */}
            <div className="mb-5">
              <label className="text-[10px] text-white/20 uppercase tracking-wider mb-2 block">Time of Day</label>
              <div className="flex gap-2">
                {([
                  { id: "morning" as const, label: "Morning", icon: Sun },
                  { id: "day" as const, label: "Day", icon: Sun },
                  { id: "evening" as const, label: "Evening", icon: Moon },
                  { id: "night" as const, label: "Night", icon: Moon },
                ]).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTimeOfDay(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-[11px] transition-all ${
                      timeOfDay === t.id
                        ? "bg-white/[0.06] border-white/[0.1] text-white/70"
                        : "bg-transparent border-white/[0.03] text-white/25 hover:border-white/[0.06]"
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio layers */}
            <div>
              <label className="text-[10px] text-white/20 uppercase tracking-wider mb-2 block">Audio Layers</label>
              <div className="space-y-2">
                {layers.map(layer => (
                  <div
                    key={layer.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      layer.active
                        ? "bg-white/[0.03] border-white/[0.06]"
                        : "bg-transparent border-white/[0.02] opacity-50"
                    }`}
                  >
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ background: layer.active ? `${layer.color}15` : "rgba(255,255,255,0.03)" }}
                    >
                      <layer.icon className="w-4 h-4" style={{ color: layer.active ? layer.color : "rgba(255,255,255,0.15)" }} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/50 font-medium">{layer.name}</p>
                      <p className="text-[9px] text-white/15">{layer.description}</p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={layer.volume}
                      onChange={(e) => setLayerVolume(layer.id, Number(e.target.value))}
                      className="w-20 h-1 rounded-full appearance-none"
                      style={{
                        background: `linear-gradient(to right, ${layer.color}40 0%, ${layer.color}40 ${layer.volume * 100}%, rgba(255,255,255,0.04) ${layer.volume * 100}%)`,
                      }}
                    />
                    <span className="text-[9px] text-white/20 w-8 text-right">{Math.round(layer.volume * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-[240px] border-l border-white/[0.04] bg-[#0A0A0A] p-4 flex-shrink-0">
            <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Master</p>
            <div className="mb-5">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none mb-2"
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) ${masterVolume * 100}%, rgba(255,255,255,0.04) ${masterVolume * 100}%)`,
                }}
              />
              <div className="flex items-center justify-between text-[10px]">
                <VolumeX className="w-3 h-3 text-white/15" />
                <span className="text-white/30">{Math.round(masterVolume * 100)}%</span>
                <Volume2 className="w-3 h-3 text-white/15" />
              </div>
            </div>

            <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Current Mix</p>
            <div className="space-y-2 mb-5">
              {layers.filter(l => l.active).map(l => (
                <div key={l.id} className="flex items-center justify-between text-[10px]">
                  <span className="text-white/30">{l.name}</span>
                  <span style={{ color: l.color }}>{Math.round(l.volume * masterVolume * 100)}%</span>
                </div>
              ))}
              {activeLayers.length === 0 && (
                <p className="text-[10px] text-white/15 italic">No layers active</p>
              )}
            </div>

            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
              <p className="text-[9px] text-white/20 uppercase tracking-wider mb-2">Unit Profile</p>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-white/25">Height</span>
                  <span className="text-white/50">{heightData.height}m AGL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/25">Street noise</span>
                  <span className="text-white/50">{Math.round(heightData.cityVol * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/25">Wind exposure</span>
                  <span className="text-cyan-400/60">{Math.round(heightData.windVol * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/25">Time</span>
                  <span className="text-white/50 capitalize">{timeOfDay}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-cyan-500/[0.04] border border-cyan-500/10">
              <p className="text-[9px] text-white/25 leading-relaxed">
                In production, each layer is a licensed seamless loop.
                Crossfade between states is 2 seconds.
                Audio starts muted — user gesture required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
