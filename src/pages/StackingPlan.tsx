import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ChevronLeft, ChevronRight, Bed, Bath, Square, Car,
  DollarSign, Eye, Heart, Share2, ArrowUpRight, Lock, Unlock,
  CheckCheck, Copy, X, Filter, ArrowUpDown, Maximize2, Minimize2,
  Sun, Wind, Home, Grip
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type UnitStatus = "available" | "reserved" | "sold" | "held" | "coming-soon";
type FloorFilter = "all" | "available" | "sold" | "reserved";

interface StackingUnit {
  id: string;
  unitNumber: string;
  floor: number;
  status: UnitStatus;
  bedrooms: number;
  bathrooms: number;
  cars: number;
  area: number;
  price: number;
  type: string;
  facing: string;
  viewType: string;
}

/* ═══════════════════════════════════════════
   MOCK DATA — Azure Heights Tower A
   ═══════════════════════════════════════════ */
const TOWER_NAME = "Tower A — The Crown";
const TOTAL_FLOORS = 18;
const UNITS_PER_FLOOR = 6;

const UNITS: StackingUnit[] = Array.from({ length: TOTAL_FLOORS * UNITS_PER_FLOOR }, (_, i) => {
  const floor = TOTAL_FLOORS - Math.floor(i / UNITS_PER_FLOOR);
  const unitInFloor = (i % UNITS_PER_FLOOR) + 1;
  const unitNumber = `A${String(floor).padStart(2, "0")}${unitInFloor}`;

  const statuses: UnitStatus[] = ["available", "reserved", "sold", "held", "coming-soon"];
  // More sold on lower floors, more available on higher
  const statusRoll = Math.random() + (floor / TOTAL_FLOORS) * 0.3;
  let status: UnitStatus;
  if (statusRoll < 0.25) status = "sold";
  else if (statusRoll < 0.4) status = "reserved";
  else if (statusRoll < 0.5) status = "held";
  else if (floor > 15) status = "coming-soon";
  else status = "available";

  const types = ["1 Bed", "1 Bed+S", "2 Bed", "2 Bed+S", "3 Bed", "3 Bed"];
  const type = types[unitInFloor - 1];
  const bedMap: Record<string, number> = { "1 Bed": 1, "1 Bed+S": 1, "2 Bed": 2, "2 Bed+S": 2, "3 Bed": 3 };
  const areaMap: Record<string, number> = { "1 Bed": 52, "1 Bed+S": 65, "2 Bed": 85, "2 Bed+S": 95, "3 Bed": 120 };
  const priceMap: Record<string, number> = { "1 Bed": 850000, "1 Bed+S": 1050000, "2 Bed": 1350000, "2 Bed+S": 1550000, "3 Bed": 2100000 };
  const facings = ["North", "NE", "East", "SE", "South", "SW"];
  const views = ["City", "Harbour", "Park", "City + Harbour", "Park + City", "Internal"];

  return {
    id: `su-${i}`,
    unitNumber,
    floor,
    status,
    bedrooms: bedMap[type] || 1,
    bathrooms: bedMap[type] || 1,
    cars: bedMap[type] || 1,
    area: areaMap[type] + Math.floor(Math.random() * 10),
    price: priceMap[type] + floor * 25000 + Math.floor(Math.random() * 30000),
    type,
    facing: facings[unitInFloor - 1],
    viewType: views[unitInFloor - 1],
  };
});

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
const statusConfig: Record<UnitStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  available: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400", label: "Available" },
  reserved: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400", label: "Reserved" },
  sold: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400", label: "Sold" },
  held: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-400", label: "On Hold" },
  "coming-soon": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", dot: "bg-purple-400", label: "Coming Soon" },
};

const fmtPrice = (n: number) => `$${(n / 1000000).toFixed(2)}M`;

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function StackingPlan() {
  const [selectedUnit, setSelectedUnit] = useState<StackingUnit | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [floorFilter, setFloorFilter] = useState<FloorFilter>("all");
  const [presentationMode, setPresentationMode] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareUnits, setCompareUnits] = useState<StackingUnit[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Group by floor
  const floors = useMemo(() => {
    const map = new Map<number, StackingUnit[]>();
    for (let f = TOTAL_FLOORS; f >= 1; f--) {
      const floorUnits = UNITS.filter(u => u.floor === f);
      if (floorFilter === "all") {
        map.set(f, floorUnits);
      } else {
        map.set(f, floorUnits);
      }
    }
    return map;
  }, [floorFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = UNITS.length;
    const available = UNITS.filter(u => u.status === "available").length;
    const sold = UNITS.filter(u => u.status === "sold").length;
    const reserved = UNITS.filter(u => u.status === "reserved").length;
    return { total, available, sold, reserved, percentSold: Math.round((sold / total) * 100) };
  }, []);

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addToCompare = (unit: StackingUnit) => {
    setCompareUnits(prev => {
      if (prev.find(u => u.id === unit.id)) return prev.filter(u => u.id !== unit.id);
      if (prev.length >= 3) return [...prev.slice(1), unit];
      return [...prev, unit];
    });
  };

  return (
    <AdminLayout hideSidebar={presentationMode}>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b3b45] to-[#4a4a55] flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Stacking Plan</h1>
              <p className="text-[10px] text-white/25">{TOWER_NAME} · {TOTAL_FLOORS} floors · {UNITS_PER_FLOOR} units per floor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stats pills */}
            <div className="flex items-center gap-3 mr-3">
              {[
                { label: "Available", value: stats.available, color: "text-emerald-400" },
                { label: "Sold", value: stats.sold, color: "text-red-400" },
                { label: "Reserved", value: stats.reserved, color: "text-amber-400" },
              ].map(s => (
                <span key={s.label} className="text-[10px]">
                  <span className={s.color}>{s.value}</span>
                  <span className="text-white/20 ml-1">{s.label}</span>
                </span>
              ))}
            </div>

            {compareUnits.length > 0 && (
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-white/50 text-[10px] hover:bg-white/[0.1] transition-colors"
              >
                Compare ({compareUnits.length})
              </button>
            )}

            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-[10px] text-white/30 hover:text-white/50 transition-all"
            >
              {presentationMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              {presentationMode ? "Exit" : "Present"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Stacking grid */}
          <div className="flex-1 overflow-auto p-5">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 pb-3 border-b border-white/[0.03]">
              <span className="text-[10px] text-white/20 uppercase tracking-wider">Legend</span>
              {(Object.keys(statusConfig) as UnitStatus[]).map(s => (
                <span key={s} className="flex items-center gap-1.5 text-[10px]">
                  <span className={`w-2 h-2 rounded-full ${statusConfig[s].dot}`} />
                  <span className="text-white/30">{statusConfig[s].label}</span>
                </span>
              ))}
            </div>

            {/* Floor rows */}
            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-1.5">
                <div className="text-[9px] text-white/15 text-center py-1">Floor</div>
                {["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"].map((u, i) => (
                  <div key={i} className="text-[9px] text-white/15 text-center py-1">{u}</div>
                ))}
              </div>

              {/* Floor rows */}
              {Array.from({ length: TOTAL_FLOORS }, (_, fi) => {
                const floor = TOTAL_FLOORS - fi;
                const floorUnits = floors.get(floor) || [];

                return (
                  <motion.div
                    key={floor}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fi * 0.015 }}
                    className="grid grid-cols-[60px_repeat(6,1fr)] gap-1.5 items-center"
                  >
                    {/* Floor label */}
                    <div className="text-[11px] text-white/30 font-medium text-right pr-2">
                      L{floor}
                    </div>

                    {/* Units */}
                    {floorUnits.map(unit => {
                      const st = statusConfig[unit.status];
                      const isHovered = hoveredUnit === unit.id;
                      const isSelected = selectedUnit?.id === unit.id;

                      return (
                        <motion.button
                          key={unit.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedUnit(unit)}
                          onMouseEnter={() => setHoveredUnit(unit.id)}
                          onMouseLeave={() => setHoveredUnit(null)}
                          className={`relative p-2 rounded-lg border text-left transition-all ${
                            isSelected
                              ? `${st.bg} ${st.border} ring-1 ring-white/20`
                              : isHovered
                              ? `${st.bg} ${st.border}`
                              : `${st.bg} ${st.border} opacity-70 hover:opacity-100`
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-semibold ${st.text}`}>{unit.unitNumber}</span>
                            {favorites.has(unit.id) && <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400" />}
                          </div>
                          <p className="text-[8px] text-white/25">{unit.type}</p>
                          <p className="text-[8px] text-white/15">{unit.area}m²</p>
                          {/* Status dot */}
                          <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        </motion.button>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>

            {/* Ground label */}
            <div className="mt-2 pt-2 border-t border-white/[0.05] text-center">
              <span className="text-[10px] text-white/15">Ground Level · Lobby · Retail</span>
            </div>
          </div>

          {/* Right panel — Unit detail */}
          <AnimatePresence>
            {selectedUnit && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border-l border-white/[0.04] bg-[#0A0A0A] overflow-hidden flex-shrink-0"
              >
                <div className="w-[300px] p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase ${statusConfig[selectedUnit.status].bg} ${statusConfig[selectedUnit.status].text}`}>
                          {statusConfig[selectedUnit.status].label}
                        </span>
                      </div>
                      <h2 className="text-[18px] font-bold text-white/90 mt-1">{selectedUnit.unitNumber}</h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFav(selectedUnit.id)}
                        className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08]"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.has(selectedUnit.id) ? "text-red-400 fill-red-400" : "text-white/25"}`} />
                      </button>
                      <button
                        onClick={() => setSelectedUnit(null)}
                        className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08]"
                      >
                        <X className="w-3.5 h-3.5 text-white/25" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 mb-4">
                    <p className="text-[22px] font-bold text-white/90">{fmtPrice(selectedUnit.price)}</p>
                    <p className="text-[10px] text-white/20">${Math.round(selectedUnit.price / selectedUnit.area).toLocaleString()}/m² · Floor {selectedUnit.floor}</p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { icon: Bed, value: selectedUnit.bedrooms, label: "Bed" },
                      { icon: Bath, value: selectedUnit.bathrooms, label: "Bath" },
                      { icon: Car, value: selectedUnit.cars, label: "Car" },
                      { icon: Square, value: `${selectedUnit.area}m²`, label: "Area" },
                    ].map(s => (
                      <div key={s.label} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-2 text-center">
                        <s.icon className="w-3.5 h-3.5 text-white/20 mx-auto mb-1" />
                        <p className="text-[12px] font-semibold text-white/70">{s.value}</p>
                        <p className="text-[8px] text-white/15">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Type", value: selectedUnit.type },
                      { label: "Facing", value: selectedUnit.facing },
                      { label: "View", value: selectedUnit.viewType },
                      { label: "Floor", value: `Level ${selectedUnit.floor}` },
                    ].map(d => (
                      <div key={d.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.03]">
                        <span className="text-[10px] text-white/25">{d.label}</span>
                        <span className="text-[11px] text-white/60">{d.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full py-2.5 rounded-xl bg-white/[0.08] text-white/80 text-[12px] font-medium hover:bg-white/[0.12] transition-colors">
                      Reserve Now — $5,000
                    </button>
                    <button
                      onClick={() => addToCompare(selectedUnit)}
                      className="w-full py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-[11px] hover:bg-white/[0.06] transition-colors"
                    >
                      {compareUnits.find(u => u.id === selectedUnit.id) ? "Remove from Compare" : "Add to Compare"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comparison bar */}
        <AnimatePresence>
          {showCompare && compareUnits.length > 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="border-t border-white/[0.04] bg-[#0A0A0A] overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-medium text-white/60">Side by Side Comparison</h3>
                  <button onClick={() => setShowCompare(false)} className="text-white/20 hover:text-white/40">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${compareUnits.length + 1}, 1fr)` }}>
                  {/* Labels column */}
                  <div className="space-y-2">
                    {["Price", "Area", "Bedrooms", "Bathrooms", "Floor", "Facing", "View", "Status"].map(l => (
                      <p key={l} className="text-[10px] text-white/20 h-5 flex items-center">{l}</p>
                    ))}
                  </div>
                  {/* Unit columns */}
                  {compareUnits.map(u => (
                    <div key={u.id} className="space-y-2 bg-white/[0.02] rounded-lg p-2">
                      <p className="text-[11px] font-semibold text-white/70">{u.unitNumber}</p>
                      <p className="text-[10px] text-white/50">{fmtPrice(u.price)}</p>
                      <p className="text-[10px] text-white/50">{u.area}m²</p>
                      <p className="text-[10px] text-white/50">{u.bedrooms}</p>
                      <p className="text-[10px] text-white/50">{u.bathrooms}</p>
                      <p className="text-[10px] text-white/50">{u.floor}</p>
                      <p className="text-[10px] text-white/50">{u.facing}</p>
                      <p className="text-[10px]"><span className={`${statusConfig[u.status].text}`}>{statusConfig[u.status].label}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
