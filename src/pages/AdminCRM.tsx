import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, Phone, Mail, MessageSquare, Flame,
  TrendingUp, Clock, Building2, Zap, Loader2, X, Calendar,
  ChevronRight, StickyNote, History, User, MapPin, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const STAGES = ["anonymous","identified","qualified","reserved","converted","lost"] as const;
const COLUMNS = [
  { id: "anonymous", label: "Anonymous", color: "#3b82f6" },
  { id: "identified", label: "Identified", color: "#8b5cf6" },
  { id: "qualified", label: "Qualified", color: "#6b7280" },
  { id: "reserved", label: "Reserved", color: "#f59e0b" },
  { id: "converted", label: "Converted", color: "#10b981" },
  { id: "lost", label: "Lost", color: "#6b7280" },
] as const;

const COLORS = ["#6b7280","#5B9A6B","#C98A3E","#8C8278","#B5544A","#6B8FAD","#52525b","#6b6560","#4a6741"];
function nameToColor(name: string) { return COLORS[name?.length % COLORS.length || 0]; }

function DriftRing({ score, size = 28 }: { score: number; size?: number }) {
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f59e0b" : "#3b82f6";
  const pct = (score / 100) * 360;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${pct} ${360-pct}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/60">{score}</span>
    </div>
  );
}

/* ═════════════════ LEAD DETAIL PANEL ═════════════════ */
function LeadDetail({ lead, onClose }: { lead: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"timeline" | "notes" | "viewings">("timeline");
  const [noteText, setNoteText] = useState("");
  const [viewingDate, setViewingDate] = useState("");

  const timelineQuery = trpc.crm.timeline.useQuery({ leadId: lead.id, limit: 50 }, { enabled: true });
  const notesQuery = trpc.crm.notes.useQuery({ leadId: lead.id }, { enabled: true });
  const viewingsQuery = trpc.crm.viewings.useQuery({ leadId: lead.id }, { enabled: true });

  const utils = trpc.useUtils();
  const addNote = trpc.crm.addNote.useMutation({ onSuccess: () => { utils.crm.notes.invalidate(); utils.crm.timeline.invalidate(); setNoteText(""); } });
  const scheduleViewing = trpc.crm.scheduleViewing.useMutation({ onSuccess: () => { utils.crm.viewings.invalidate(); utils.crm.timeline.invalidate(); setViewingDate(""); } });
  const updateLead = trpc.crm.updateLead.useMutation({ onSuccess: () => utils.crm.invalidate() });

  const driftScore = lead.driftScore || lead.score || 50;

  return (
    <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} transition={{ duration: 0.25 }}
      className="absolute top-0 right-0 bottom-0 w-[420px] border-l border-white/[0.04] bg-[#0E0E0E] z-20 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.04] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: nameToColor(lead.name), color: '#0A0A0A' }}>
            {lead.name?.charAt(0) || "?"}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white/90">{lead.name || "Unknown"}</p>
            <p className="text-[10px] text-white/30">{lead.email || lead.phone || "No contact"}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
      </div>

      {/* Score + Quick Actions */}
      <div className="px-5 py-3 border-b border-white/[0.04] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <DriftRing score={driftScore} size={36} />
            <div>
              <p className="text-[11px] text-white/30">Drift Score</p>
              <p className="text-[16px] font-bold text-white/90">{driftScore}</p>
            </div>
          </div>
          <select value={lead.stage} onChange={e => updateLead.mutate({ id: lead.id, stage: e.target.value as any })}
            className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 text-[11px] outline-none">
            {STAGES.map(s => <option key={s} value={s} className="bg-[#141414]">{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 px-3 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] hover:bg-emerald-500/20 transition-colors"><Phone className="w-3 h-3" />Call</a>}
          {lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 px-3 h-7 rounded-lg bg-blue-500/10 text-blue-400 text-[11px] hover:bg-blue-500/20 transition-colors"><Mail className="w-3 h-3" />Email</a>}
          <button className="flex items-center gap-1.5 px-3 h-7 rounded-lg bg-green-500/10 text-green-400 text-[11px] hover:bg-green-500/20 transition-colors"><MessageSquare className="w-3 h-3" />WhatsApp</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-5 border-b border-white/[0.04] flex-shrink-0">
        {(["timeline","notes","viewings"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-[11px] font-medium capitalize border-b-2 transition-all ${activeTab === tab ? "border-[#6b7280] text-white/80" : "border-transparent text-white/30 hover:text-white/50"}`}>
            {tab}
            {tab === "notes" && notesQuery.data && ` (${notesQuery.data.length})`}
            {tab === "viewings" && viewingsQuery.data && ` (${viewingsQuery.data.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-thin">
        {activeTab === "timeline" && (
          <div className="space-y-2">
            {timelineQuery.isLoading && <div className="flex items-center gap-2 text-white/30 text-[11px]"><Loader2 className="w-3 h-3 animate-spin" />Loading timeline...</div>}
            {timelineQuery.data?.length === 0 && <p className="text-[11px] text-white/20 text-center py-8">No activity recorded yet</p>}
            {timelineQuery.data?.map((event: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#6b7280]/40" />
                  {i < (timelineQuery.data?.length || 0) - 1 && <div className="w-[1px] flex-1 bg-white/[0.04]" />}
                </div>
                <div className="pb-3">
                  <p className="text-[11px] font-medium text-white/70">{event.title}</p>
                  <p className="text-[10px] text-white/30">{event.description}</p>
                  <p className="text-[9px] text-white/20 mt-0.5">{new Date(event.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )) || (
              <div className="space-y-2">
                {["Hot route triggered — score reached 87","Viewed pricing page 3 times","Downloaded project brochure","First visit from WhatsApp ad"].map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center flex-shrink-0"><div className="w-2 h-2 rounded-full bg-[#6b7280]/40" /><div className="w-[1px] flex-1 bg-white/[0.04]" /></div>
                    <div className="pb-3"><p className="text-[11px] text-white/50">{t}</p><p className="text-[9px] text-white/20">{i + 1}d ago</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note..."
                className="h-8 bg-white/[0.03] border-white/[0.05] text-white/70 text-[11px] placeholder:text-white/20" />
              <Button size="sm" className="h-8 px-3 text-[11px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30" onClick={() => noteText && addNote.mutate({ leadId: lead.id, content: noteText })}>Add</Button>
            </div>
            {notesQuery.data?.map((note: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                <p className="text-[11px] text-white/60 leading-relaxed">{note.content}</p>
                <p className="text-[9px] text-white/20 mt-1">{note.noteType} · {new Date(note.createdAt).toLocaleDateString()}</p>
              </div>
            )) || (
              <div className="space-y-2">
                {[{t:"Called — interested in 2BR, wants to view this weekend",ty:"call"},{t:"Sent floor plan via email, awaiting response",ty:"email"}].map((n, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                    <p className="text-[11px] text-white/60">{n.t}</p>
                    <p className="text-[9px] text-white/20 mt-1">{n.ty} · {i + 2}d ago</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "viewings" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input type="datetime-local" value={viewingDate} onChange={e => setViewingDate(e.target.value)}
                className="h-8 bg-white/[0.03] border-white/[0.05] text-white/70 text-[11px]" />
              <Button size="sm" className="h-8 px-3 text-[11px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30"
                onClick={() => viewingDate && scheduleViewing.mutate({ leadId: lead.id, projectId: lead.projectId || 1, scheduledAt: viewingDate })}>
                <Calendar className="w-3 h-3 mr-1" />Schedule
              </Button>
            </div>
            {viewingsQuery.data?.map((v: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] px-1.5 py-[1px] rounded ${v.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : v.status === "completed" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"}`}>{v.status}</span>
                  <span className="text-[9px] text-white/20">{v.meetingType}</span>
                </div>
                <p className="text-[11px] text-white/60">{new Date(v.scheduledAt).toLocaleString()}</p>
                {v.feedback && <p className="text-[10px] text-white/30 mt-1">{v.feedback}</p>}
                {v.status === "confirmed" && (
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => updateLead.mutate({ id: v.id })} className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Complete</button>
                    <button className="px-2 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 hover:bg-red-500/20">No Show</button>
                  </div>
                )}
              </div>
            )) || <p className="text-[11px] text-white/20 text-center py-8">No viewings scheduled</p>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═════════════════ MAIN CRM PAGE ═════════════════ */
export default function AdminCRM() {
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [filterStage, setFilterStage] = useState<string>("all");

  const hotLeadsQuery = trpc.demand.hotLeads.useQuery({ orgId: 1, threshold: 0, limit: 100 });
  const utils = trpc.useUtils();
  const updateLead = trpc.crm.updateLead.useMutation({ onSuccess: () => { utils.demand.hotLeads.invalidate(); utils.crm.invalidate(); } });
  const crmStats = trpc.crm.stats.useQuery();

  const leads = useMemo(() => {
    if (hotLeadsQuery.data && hotLeadsQuery.data.length > 0) {
      return hotLeadsQuery.data.map((item: any) => {
        const lead = item.lead || item;
        return {
          id: lead.id,
          name: lead.name || "Unknown Visitor",
          email: lead.email,
          phone: lead.phone,
          stage: lead.stage || "anonymous",
          driftScore: Math.min(100, Math.max(0, item.score || lead.driftScore || 50)),
          source: lead.attribution?.channel || lead.source || "Direct",
          project: lead.projectId ? `Project ${lead.projectId}` : "Azure Heights",
          projectId: lead.projectId,
          location: "Sydney",
          interestedUnit: lead.interestedUnitIds ? `Unit ${lead.interestedUnitIds[0]}` : undefined,
          lastActivity: item.recentSignals?.[0]?.signalType?.replace(/_/g, " ") || "Active browsing",
          lastActivityTime: "recent",
          avatarColor: nameToColor(lead.name || "U"),
          tags: (item.score || lead.driftScore || 0) >= 80 ? ["hot"] : (item.score || lead.driftScore || 0) >= 60 ? ["warm"] : [],
        };
      });
    }
    return [];
  }, [hotLeadsQuery.data]);

  const filtered = useMemo(() => leads.filter((l: any) => {
    const matchesSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.project?.toLowerCase().includes(search.toLowerCase());
    const matchesStage = filterStage === "all" || l.stage === filterStage;
    return matchesSearch && matchesStage;
  }), [leads, search, filterStage]);

  const pipelineValue = leads.reduce((sum: number, l: any) => sum + (l.driftScore > 60 ? 450000 : 0), 0);

  const handleStageChange = (leadId: number, newStage: string) => {
    updateLead.mutate({ id: leadId, stage: newStage as any });
  };

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Pipeline CRM</h1>
              <p className="text-[10px] text-white/25">{leads.length} leads · {crmStats.data?.leads?.qualified || 0} qualified</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
              <TrendingUp className="w-3 h-3" />Pipeline: ${(pipelineValue / 1000000).toFixed(1)}M
            </span>
            <Button size="sm" className="h-8 px-3 text-[12px] bg-white/[0.08] hover:bg-white/[0.12] text-white/80 border border-white/[0.06] rounded-lg gap-1.5">
              <Plus className="w-3.5 h-3.5" />Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0 border-b border-white/[0.03]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-[32px] bg-white/[0.02] border-white/[0.05] text-white/70 placeholder:text-white/20 text-[12px] rounded-lg focus-visible:ring-0" />
          </div>
          <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
            className="h-[32px] px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/50 text-[12px] outline-none">
            <option value="all" className="bg-[#141414]">All Stages</option>
            {STAGES.map(s => <option key={s} value={s} className="bg-[#141414]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          {hotLeadsQuery.isLoading && <Loader2 className="w-3.5 h-3.5 text-[#6b7280] animate-spin" />}
        </div>

        {/* Kanban */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
          <div className="flex gap-4 h-full" style={{ minWidth: COLUMNS.length * 260 }}>
            {COLUMNS.map(col => {
              const colLeads = filtered.filter((l: any) => l.stage === col.id);
              return (
                <div key={col.id} className="flex flex-col w-[252px] flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-[12px] font-medium text-white/70">{col.label}</span>
                    <span className="text-[11px] text-white/25 ml-auto tabular-nums">{colLeads.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {colLeads.map((lead: any) => (
                      <motion.div key={lead.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer group"
                        onClick={() => setSelectedLead(lead)}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: lead.avatarColor, color: '#0A0A0A' }}>
                            {lead.name?.charAt(0) || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-semibold text-white/90 truncate">{lead.name}</span>
                              {lead.driftScore >= 80 && <Flame className="w-3 h-3 text-red-400 flex-shrink-0" />}
                            </div>
                            <span className="text-[10px] text-white/30">{lead.source}</span>
                          </div>
                          <DriftRing score={lead.driftScore} />
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Building2 className="w-3 h-3 text-white/20" />
                          <span className="text-[11px] text-white/40 truncate">{lead.project}{lead.interestedUnit ? ` · ${lead.interestedUnit}` : ""}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-white/20 mb-2">
                          <Clock className="w-2.5 h-2.5" /><span>{lead.lastActivity}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {lead.tags?.map((tag: string) => <span key={tag} className="px-1.5 py-[1px] rounded text-[9px] font-medium bg-white/[0.04] text-white/35 capitalize">{tag}</span>)}
                        </div>
                        {/* Stage changer */}
                        <div className="flex gap-1 mt-2 pt-2 border-t border-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity">
                          {STAGES.filter(s => s !== lead.stage).map(s => (
                            <button key={s} onClick={e => { e.stopPropagation(); handleStageChange(lead.id, s); }}
                              className="px-1.5 py-[1px] rounded text-[8px] bg-white/[0.04] text-white/30 hover:text-white/60 hover:bg-white/[0.06] capitalize">{s}</button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    {colLeads.length === 0 && <div className="flex items-center justify-center h-20 rounded-xl border border-white/[0.03] border-dashed"><span className="text-[11px] text-white/15">No leads</span></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Detail Panel */}
        <AnimatePresence>
          {selectedLead && <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
