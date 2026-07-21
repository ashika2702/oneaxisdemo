import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, Bed, Bath, Square, Tag, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const STATUS_COLORS: Record<string, string> = {
  available: "#10b981", reserved: "#f59e0b", sold: "#ef4444", held: "#8b5cf6",
};

export default function AdminUnits() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const unitsQuery = trpc.unit.list.useQuery({});
  const isLoading = unitsQuery.isLoading;

  const units = (unitsQuery.data || []).filter((u: any) => {
    const matchesSearch = !search || u.unitNumber?.toLowerCase().includes(search.toLowerCase()) || u.type?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = (unitsQuery.data || []).reduce((acc: any, u: any) => {
    acc[u.status || "unknown"] = (acc[u.status || "unknown"] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Unit Inventory</h1>
              <p className="text-[10px] text-white/25">{unitsQuery.data?.length || 0} units · {statusCounts.available || 0} available</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <Input placeholder="Search units..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 w-44 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="h-8 px-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/50 text-[11px] outline-none">
              <option value="all" className="bg-[#141414]">All Status</option>
              {["available", "reserved", "sold", "held"].map(s => <option key={s} value={s} className="bg-[#141414]">{s}</option>)}
            </select>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-[#6b7280] animate-spin" />}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {units.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Building2 className="w-12 h-12 text-white/10 mb-3" />
              <p className="text-[13px] text-white/30">{search || filterStatus !== "all" ? "No units match" : "No units yet"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {units.map((unit: any, i: number) => (
                <motion.div key={unit.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 hover:bg-white/[0.025] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-bold text-white/90">{unit.unitNumber}</span>
                    <span className="text-[9px] px-1.5 py-[1px] rounded-full capitalize" style={{ backgroundColor: (STATUS_COLORS[unit.status] || "#666") + "15", color: STATUS_COLORS[unit.status] || "#999" }}>{unit.status}</span>
                  </div>
                  <p className="text-[10px] text-white/30 capitalize mb-3">{unit.type} · {unit.bedrooms}br · {unit.bathrooms}ba · {unit.areaSqm}m²</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                    <span className="text-[13px] font-bold text-emerald-400">${(Number(unit.price) / 1000000).toFixed(2)}M</span>
                    {unit.floor && <span className="text-[9px] text-white/20">Floor {unit.floor}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
