import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, ZoomIn, ZoomOut, RotateCw, Maximize, Search, Bed, Bath, Square, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const MOCK_FLOORPLANS = [
  { id: "FP001", unit: "101", type: "1 Bedroom", bedrooms: 1, bathrooms: 1, area: 65, price: 650000, level: 1, layout: "Standard" },
  { id: "FP002", unit: "102", type: "2 Bedroom", bedrooms: 2, bathrooms: 2, area: 95, price: 890000, level: 1, layout: "Corner" },
  { id: "FP003", unit: "201", type: "2 Bedroom + Study", bedrooms: 2, bathrooms: 2, area: 112, price: 1050000, level: 2, layout: "Premium" },
  { id: "FP004", unit: "301", type: "3 Bedroom", bedrooms: 3, bathrooms: 2, area: 135, price: 1250000, level: 3, layout: "Penthouse" },
  { id: "FP005", unit: "302", type: "2 Bedroom", bedrooms: 2, bathrooms: 2, area: 88, price: 820000, level: 3, layout: "Standard" },
  { id: "FP006", unit: "401", type: "3 Bedroom + Study", bedrooms: 3, bathrooms: 3, area: 158, price: 1650000, level: 4, layout: "Sky Suite" },
];

export default function FloorPlanViewer() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const projectsQuery = trpc.project.list.useQuery({});

  const filtered = MOCK_FLOORPLANS.filter(fp =>
    !search || fp.unit.includes(search) || fp.type.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPlan = MOCK_FLOORPLANS.find(fp => fp.id === selected);

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Floor Plans</h1>
              <p className="text-[10px] text-white/25">{filtered.length} floor plans</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <Input placeholder="Search units..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 w-48 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Plan List */}
          <div className="w-72 border-r border-white/[0.04] overflow-y-auto py-3 flex-shrink-0">
            {filtered.map(fp => (
              <button key={fp.id} onClick={() => setSelected(fp.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2 ${selected === fp.id ? "bg-white/[0.03] border-l-white/30" : "border-l-transparent hover:bg-white/[0.02]"}`}>
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center text-[11px] font-bold text-white/40">{fp.unit}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-white/80">{fp.type}</p>
                  <p className="text-[10px] text-white/25">{fp.area}m² · Level {fp.level}</p>
                </div>
                <span className="text-[11px] text-emerald-400/70 tabular-nums">${(fp.price / 1000000).toFixed(2)}M</span>
              </button>
            ))}
          </div>

          {/* Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedPlan ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.04] flex-shrink-0">
                  <span className="text-[12px] font-medium text-white/70">Unit {selectedPlan.unit} — {selectedPlan.type}</span>
                  <div className="flex items-center gap-1">
                    {[{icon: ZoomIn}, {icon: ZoomOut}, {icon: RotateCw}, {icon: Maximize}].map((Btn, i) => (
                      <button key={i} className="w-7 h-7 rounded hover:bg-white/[0.04] flex items-center justify-center text-white/25 hover:text-white/50 transition-colors">
                        <Btn.icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center bg-white/[0.01] relative">
                  <div className="w-[480px] h-[360px] border border-white/[0.08] rounded-lg bg-white/[0.02] flex items-center justify-center relative">
                    {/* Simple SVG floor plan representation */}
                    <svg viewBox="0 0 480 360" className="w-full h-full">
                      <rect x="20" y="20" width="440" height="320" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="4" />
                      {/* Living room */}
                      <rect x="30" y="30" width="200" height="180" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <text x="130" y="120" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="Inter">Living</text>
                      {/* Bedroom 1 */}
                      <rect x="240" y="30" width="210" height="140" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <text x="345" y="100" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="Inter">Bedroom 1</text>
                      {/* Bedroom 2 / Study */}
                      {selectedPlan.bedrooms >= 2 && (
                        <>
                          <rect x="240" y="180" width="120" height="150" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                          <text x="300" y="255" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="Inter">{selectedPlan.bedrooms >= 3 ? "Bed 2" : "Study"}</text>
                        </>
                      )}
                      {/* Bedroom 3 */}
                      {selectedPlan.bedrooms >= 3 && (
                        <>
                          <rect x="370" y="180" width="80" height="150" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                          <text x="410" y="255" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="Inter">Bed 3</text>
                        </>
                      )}
                      {/* Kitchen */}
                      <rect x="30" y="220" width="120" height="110" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <text x="90" y="275" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="Inter">Kitchen</text>
                      {/* Bathroom */}
                      <rect x="160" y="220" width="70" height="70" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <text x="195" y="255" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="10" fontFamily="Inter">Bath</text>
                    </svg>
                  </div>
                </div>
                {/* Specs Bar */}
                <div className="flex items-center gap-6 px-4 h-12 border-t border-white/[0.04] flex-shrink-0">
                  <div className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-white/20" /><span className="text-[11px] text-white/40">{selectedPlan.bedrooms} bed</span></div>
                  <div className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-white/20" /><span className="text-[11px] text-white/40">{selectedPlan.bathrooms} bath</span></div>
                  <div className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5 text-white/20" /><span className="text-[11px] text-white/40">{selectedPlan.area}m²</span></div>
                  <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-400/40" /><span className="text-[11px] text-emerald-400/70">${selectedPlan.price.toLocaleString()}</span></div>
                  <span className="text-[10px] text-white/20 ml-auto">{selectedPlan.layout}</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Layers className="w-12 h-12 text-white/10 mb-3" />
                <p className="text-[13px] text-white/30">Select a floor plan to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
