import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Play, Pause, Sparkles, Clock, Share2, Smartphone,
  CheckCircle2, AlertTriangle, Zap, Palette, Home, Eye,
  ChevronRight, Download, Send, Image, Music, Type
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const FINISH_OPTIONS = {
  kitchen: ["Premium White", "Charcoal Oak", "Coastal Blue", "Warm Walnut"],
  flooring: ["European Oak", "Polished Concrete", "Porcelain Tile", "Carpet"],
  bathroom: ["Matte Black", "Chrome", "Brushed Gold", "Gunmetal"],
};

const CAMERA_PATHS = [
  { id: "balcony-sunrise", name: "Balcony Sunrise", duration: "8s", description: "Dawn light across your balcony, harbour in background" },
  { id: "living-pan", name: "Living Room Pan", duration: "6s", description: "Slow pan across the open-plan living and kitchen" },
  { id: "exterior-rise", name: "Exterior Rise", duration: "6s", description: "Camera rises from street to reveal your floor" },
];

export default function KeepsakeStudio() {
  const [selectedFinishes, setSelectedFinishes] = useState({ kitchen: "Premium White", flooring: "European Oak", bathroom: "Matte Black" });
  const [selectedPath, setSelectedPath] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const startRender = () => {
    setIsRendering(true);
    setRenderComplete(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setRenderComplete(true);
          return 100;
        }
        return p + 2;
      });
    }, 80);
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Keepsake Studio</h1>
              <p className="text-[10px] text-white/25">Personalized cinematic preview</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Preview area */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Phone frame mockup */}
            <div className="relative w-[280px] h-[500px] bg-[#141414] rounded-[32px] border-4 border-white/[0.06] shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10" />

              {/* Content */}
              <div className="w-full h-full bg-[#0A0A0A] flex flex-col">
                {!renderComplete ? (
                  /* Preview state */
                  <>
                    {/* Hero image placeholder */}
                    <div className="h-[45%] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f0f] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Home className="w-10 h-10 text-white/8 mx-auto mb-2" />
                          <p className="text-[10px] text-white/15">Unit A1402 Preview</p>
                        </div>
                      </div>
                      {/* Title card overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-[10px] text-white/30">Azure Heights</p>
                        <p className="text-[14px] font-bold text-white/70">Residence A1402</p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                          { label: "2 Bed + S", sub: "98m²" },
                          { label: "Floor 14", sub: "Harbour View" },
                          { label: "$1.82M", sub: "North East" },
                        ].map(s => (
                          <div key={s.label} className="bg-white/[0.03] rounded-lg p-2 text-center">
                            <p className="text-[9px] text-white/40 font-medium">{s.label}</p>
                            <p className="text-[7px] text-white/15">{s.sub}</p>
                          </div>
                        ))}
                      </div>

                      {/* Finish preview */}
                      <p className="text-[8px] text-white/15 uppercase tracking-wider mb-1.5">Your Selections</p>
                      <div className="space-y-1.5">
                        {Object.entries(selectedFinishes).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between py-1 border-b border-white/[0.03]">
                            <span className="text-[9px] text-white/25 capitalize">{key}</span>
                            <span className="text-[9px] text-white/40">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* End card */}
                      <div className="mt-3 pt-3 border-t border-white/[0.04] text-center">
                        <p className="text-[7px] text-white/10">Powered by OneAxis</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Completed state */
                  <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3"
                    >
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </motion.div>
                    <p className="text-[13px] font-semibold text-white/70 mb-1">Your Keepsake is Ready</p>
                    <p className="text-[9px] text-white/20 mb-4 text-center">20-second cinematic of Residence A1402 with your chosen finishes</p>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/40 text-[9px]">
                        <Download className="w-3 h-3" /> Download
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-[9px]">
                        <Send className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Render progress */}
            {isRendering && (
              <div className="mt-4 w-[280px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/30">Rendering your keepsake...</span>
                  <span className="text-[10px] text-white/30">{progress}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-pink-400/40"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[8px] text-white/15 mt-1 text-center">GPU render · 1080×1920 · ~45 seconds</p>
              </div>
            )}
          </div>

          {/* Right config panel */}
          <div className="w-[280px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto flex-shrink-0">
            <div className="p-4">
              {/* Finishes */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Palette className="w-3 h-3" /> Your Finishes
              </p>
              <div className="space-y-3 mb-5">
                {(Object.keys(FINISH_OPTIONS) as Array<keyof typeof FINISH_OPTIONS>).map(category => (
                  <div key={category}>
                    <label className="text-[9px] text-white/25 capitalize mb-1.5 block">{category}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {FINISH_OPTIONS[category].map(option => (
                        <button
                          key={option}
                          onClick={() => setSelectedFinishes(prev => ({ ...prev, [category]: option }))}
                          className={`px-2 py-1.5 rounded-lg text-[9px] transition-all ${
                            selectedFinishes[category] === option
                              ? "bg-pink-500/10 border border-pink-500/20 text-pink-400"
                              : "bg-white/[0.03] border border-white/[0.04] text-white/25 hover:bg-white/[0.05]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Camera path */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Film className="w-3 h-3" /> Camera Path
              </p>
              <div className="space-y-1.5 mb-5">
                {CAMERA_PATHS.map((path, i) => (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPath(i)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all ${
                      selectedPath === i
                        ? "bg-pink-500/10 border border-pink-500/20"
                        : "bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-medium ${selectedPath === i ? "text-pink-400" : "text-white/40"}`}>{path.name}</span>
                      <span className="text-[8px] text-white/15">{path.duration}</span>
                    </div>
                    <p className="text-[8px] text-white/15">{path.description}</p>
                  </button>
                ))}
              </div>

              {/* CTA */}
              {!isRendering && !renderComplete && (
                <button
                  onClick={startRender}
                  className="w-full py-3 rounded-xl bg-pink-500/15 text-pink-400 text-[12px] font-medium hover:bg-pink-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate My Keepsake
                </button>
              )}

              {renderComplete && (
                <button
                  onClick={() => { setRenderComplete(false); setProgress(0); }}
                  className="w-full py-3 rounded-xl bg-white/[0.06] text-white/40 text-[12px] hover:bg-white/[0.1] transition-colors"
                >
                  Create Another
                </button>
              )}

              {/* Delivery note */}
              <div className="mt-4 p-3 rounded-lg bg-pink-500/[0.04] border border-pink-500/10">
                <p className="text-[9px] text-white/20 leading-relaxed">
                  Your keepsake will be delivered as a vertical MP4 (1080×1920) optimized for WhatsApp and Instagram Stories.
                  Render time: ~45 seconds. Share link valid for 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
