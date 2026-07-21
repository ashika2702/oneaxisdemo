import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Layers, RotateCw, Move, ZoomIn, Info, FileImage } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const MODELS = [
  { id: "M001", name: "Azure Heights Tower", type: "full_building", status: "complete", vertices: 45200, uploadedBy: "James Chen", uploadedAt: "2025-06-10" },
  { id: "M002", name: "Marina View - Exterior", type: "exterior", status: "complete", vertices: 28400, uploadedBy: "Sarah Kim", uploadedAt: "2025-06-08" },
  { id: "M003", name: "Golden Gate Lobby", type: "interior", status: "processing", vertices: 15600, uploadedBy: "David Park", uploadedAt: "2025-06-05" },
  { id: "M004", name: "Sunset Blvd - Penthouse", type: "unit", status: "complete", vertices: 22100, uploadedBy: "Lisa Wang", uploadedAt: "2025-06-03" },
];

export default function ThreeViewer() {
  const [selected, setSelected] = useState<string | null>("M001");
  const sel = MODELS.find(m => m.id === selected);

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">3D Viewer</h1>
              <p className="text-[10px] text-white/25">Project models & walkthroughs</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[{icon: Move}, {icon: RotateCw}, {icon: ZoomIn}, {icon: Info}].map((Btn, i) => (
              <button key={i} className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-white/25 hover:text-white/50 transition-colors">
                <Btn.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Model List */}
          <div className="w-60 border-r border-white/[0.04] overflow-y-auto py-3 flex-shrink-0">
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2 ${selected === m.id ? "bg-white/[0.03] border-l-white/30" : "border-l-transparent hover:bg-white/[0.02]"}`}>
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <FileImage className="w-4 h-4 text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white/80 truncate">{m.name}</p>
                  <p className="text-[9px] text-white/25">{m.vertices.toLocaleString()} vertices · {m.type}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.status === "complete" ? "bg-emerald-400" : "bg-amber-400"}`} />
              </button>
            ))}
          </div>

          {/* Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {sel ? (
              <>
                <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.04] flex-shrink-0">
                  <span className="text-[12px] text-white/60">{sel.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/25">{sel.vertices.toLocaleString()} vertices</span>
                    <span className={`text-[9px] px-1.5 py-[1px] rounded-full ${sel.status === "complete" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{sel.status}</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-white/[0.01] relative">
                  {/* 3D Placeholder */}
                  <div className="w-[400px] h-[400px] relative">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Building wireframe */}
                      <rect x="100" y="80" width="200" height="240" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <rect x="120" y="60" width="200" height="240" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      {/* Connect corners for 3D effect */}
                      <line x1="100" y1="80" x2="120" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <line x1="300" y1="80" x2="320" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <line x1="100" y1="320" x2="120" y2="300" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <line x1="300" y1="320" x2="320" y2="300" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      {/* Floor lines */}
                      {[0,1,2,3,4].map(i => (
                        <line key={i} x1="100" y1={80 + i * 48} x2="300" y2={80 + i * 48} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      ))}
                      {[0,1,2,3].map(i => (
                        <line key={i} x1="120" y1={60 + i * 48} x2="320" y2={60 + i * 48} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                      ))}
                      {/* Windows */}
                      {Array.from({length: 15}).map((_, i) => (
                        <rect key={i} x={130 + (i % 3) * 55} y={95 + Math.floor(i / 3) * 50} width="30" height="30"
                          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                      ))}
                    </svg>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                      <Layers className="w-3 h-3 text-white/30" />
                      <span className="text-[10px] text-white/30">Interactive 3D — click and drag to rotate</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Box className="w-12 h-12 text-white/10 mb-3" />
                <p className="text-[13px] text-white/30">Select a model to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
