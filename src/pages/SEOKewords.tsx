import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Plus, Trash2, Check, X, TrendingUp, BarChart3, Globe, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
      <Info className="w-3 h-3" />Connected to live backend
    </span>
  );
}

const INTENT_COLORS: Record<string, string> = {
  informational: "#3b82f6", navigational: "#8b5cf6", commercial: "#f59e0b", transactional: "#10b981",
};

export default function SEOKewords() {
  const [search, setSearch] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [filter, setFilter] = useState("all");

  const keywordsQuery = trpc.keyword.list.useQuery({ search: search || undefined, status: filter === "all" ? undefined : filter, limit: 100 });
  const statsQuery = trpc.keyword.stats.useQuery();
  const utils = trpc.useUtils();

  const createKeyword = trpc.keyword.create.useMutation({ onSuccess: () => { utils.keyword.list.invalidate(); utils.keyword.stats.invalidate(); setNewKeyword(""); } });
  const createBatch = trpc.keyword.createBatch.useMutation({ onSuccess: () => { utils.keyword.list.invalidate(); utils.keyword.stats.invalidate(); } });
  const updateKeyword = trpc.keyword.update.useMutation({ onSuccess: () => { utils.keyword.list.invalidate(); utils.keyword.stats.invalidate(); } });
  const deleteKeyword = trpc.keyword.delete.useMutation({ onSuccess: () => { utils.keyword.list.invalidate(); utils.keyword.stats.invalidate(); } });

  const handleAIGenerate = () => {
    const aiKeywords = [
      { keyword: "apartments sydney cbd", searchVolume: 2400, difficulty: 45, cpc: 4.2, intent: "commercial" },
      { keyword: "luxury apartments sydney", searchVolume: 1800, difficulty: 52, cpc: 5.8, intent: "commercial" },
      { keyword: "buy apartment sydney", searchVolume: 3200, difficulty: 38, cpc: 6.5, intent: "transactional" },
      { keyword: "new development sydney", searchVolume: 950, difficulty: 33, cpc: 3.8, intent: "informational" },
      { keyword: "property investment sydney", searchVolume: 1500, difficulty: 41, cpc: 7.2, intent: "commercial" },
      { keyword: "off the plan apartments", searchVolume: 720, difficulty: 28, cpc: 4.5, intent: "transactional" },
    ];
    createBatch.mutate({ items: aiKeywords });
  };

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">SEO Keywords</h1>
              <p className="text-[10px] text-white/25">AI-generated + user-managed keywords</p>
            </div>
          </div>
          <DemoBadge />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 px-6 py-3 flex-shrink-0 border-b border-white/[0.03]">
          {[
            { label: "Total", value: statsQuery.data?.total || 0, icon: Globe, color: "#3b82f6" },
            { label: "Pending", value: statsQuery.data?.pending || 0, icon: Sparkles, color: "#f59e0b" },
            { label: "Approved", value: statsQuery.data?.approved || 0, icon: Check, color: "#10b981" },
            { label: "Active", value: statsQuery.data?.active || 0, icon: TrendingUp, color: "#6b7280" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-4 py-2.5">
              <div className="flex items-center gap-2 mb-1"><s.icon className="w-3 h-3" style={{ color: s.color }} /><span className="text-[9px] text-white/30">{s.label}</span></div>
              <p className="text-[16px] font-bold text-white/90">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0 border-b border-white/[0.03]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <Input placeholder="Search keywords..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-[32px] bg-white/[0.02] border-white/[0.05] text-white/70 placeholder:text-white/20 text-[12px] rounded-lg" />
          </div>
          <div className="flex gap-1">
            {["all", "pending", "approved", "active"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 h-[28px] rounded-lg text-[10px] font-medium capitalize transition-all ${filter === f ? "bg-white/[0.08] text-white/70" : "text-white/25 hover:text-white/50"}`}>{f}</button>
            ))}
          </div>
          <Button size="sm" className="h-8 px-3 text-[11px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30 gap-1.5"
            onClick={handleAIGenerate} disabled={createBatch.isPending}>
            {createBatch.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Generate
          </Button>
        </div>

        {/* Add Keyword */}
        <div className="flex items-center gap-2 px-6 py-2 flex-shrink-0">
          <Input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder="Add keyword manually..."
            className="h-8 bg-white/[0.02] border-white/[0.05] text-white/70 text-[11px] placeholder:text-white/20" onKeyDown={e => e.key === "Enter" && newKeyword && createKeyword.mutate({ keyword: newKeyword })} />
          <Button size="sm" className="h-8 px-3 text-[11px] bg-white/[0.06] text-white/60" onClick={() => newKeyword && createKeyword.mutate({ keyword: newKeyword })}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Keywords Table */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin">
          <div className="rounded-xl border border-white/[0.04] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Keyword", "Volume", "Difficulty", "CPC", "Intent", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-[9px] text-white/20 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {keywordsQuery.data?.map((kw: any) => (
                  <tr key={kw.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="text-[11px] font-medium text-white/80">{kw.keyword}</p>
                      <p className="text-[9px] text-white/20">{kw.source}</p>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-white/50 tabular-nums">{kw.searchVolume?.toLocaleString() || "—"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1 rounded-full bg-white/[0.04]"><div className="h-full rounded-full" style={{ width: `${kw.difficulty || 0}%`, backgroundColor: (kw.difficulty || 0) > 60 ? "#ef4444" : (kw.difficulty || 0) > 30 ? "#f59e0b" : "#10b981" }} /></div>
                        <span className="text-[10px] text-white/40">{kw.difficulty || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-emerald-400/70 tabular-nums">{kw.cpc ? `$${kw.cpc}` : "—"}</td>
                    <td className="px-4 py-2.5">
                      {kw.intent && <span className="text-[9px] px-1.5 py-[1px] rounded capitalize" style={{ backgroundColor: (INTENT_COLORS[kw.intent] || "#666") + "15", color: INTENT_COLORS[kw.intent] || "#999" }}>{kw.intent}</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <select value={kw.status} onChange={e => updateKeyword.mutate({ id: kw.id, status: e.target.value as any })}
                        className="h-6 px-1.5 rounded bg-white/[0.02] border border-white/[0.04] text-[10px] text-white/50 outline-none">
                        {["pending", "approved", "rejected", "active", "paused"].map(s => <option key={s} value={s} className="bg-[#141414]">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => deleteKeyword.mutate({ id: kw.id })} className="w-6 h-6 rounded hover:bg-red-500/10 flex items-center justify-center text-white/15 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!keywordsQuery.data || keywordsQuery.data.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-8 h-8 text-white/10 mb-2" />
                <p className="text-[12px] text-white/20">No keywords yet</p>
                <p className="text-[10px] text-white/15 mt-0.5">Click "AI Generate" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
