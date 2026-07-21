import { useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Search, MapPin, Building2, Clock, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const COLORS = ["#6b7280","#5B9A6B","#C98A3E","#8C8278","#B5544A","#6B8FAD"];
function nameToColor(name: string) { return COLORS[name?.length % COLORS.length || 0]; }

export default function AdminProjects() {
  const [search, setSearch] = useState("");
  const projectsQuery = trpc.project.list.useQuery({});
  const isLoading = projectsQuery.isLoading;

  const projects = (projectsQuery.data || []).filter((p: any) =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.slug?.includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <FolderKanban className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Projects</h1>
              <p className="text-[10px] text-white/25">{projects.length} projects</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 w-48 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
            </div>
            <Button size="sm" className="h-8 px-3 text-[12px] bg-white/[0.08] text-white/80 border border-white/[0.06] gap-1.5">
              <Plus className="w-3.5 h-3.5" />New Project
            </Button>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-[#6b7280] animate-spin" />}
          </div>
        </div>

        {/* Project Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FolderKanban className="w-12 h-12 text-white/10 mb-3" />
              <p className="text-[13px] text-white/30">{search ? "No projects match" : "No projects yet"}</p>
              {!search && <p className="text-[11px] text-white/20 mt-1">Create your first project to get started</p>}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {projects.map((project: any, i: number) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 hover:bg-white/[0.025] hover:border-white/[0.08] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold" style={{ backgroundColor: nameToColor(project.name) + "20", color: nameToColor(project.name) }}>
                      {project.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white/90 truncate">{project.name}</p>
                      <p className="text-[10px] text-white/25">stedaxis.com/{project.slug}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 capitalize">{project.type || "project"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${project.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.04] text-white/30"}`}>{project.status || "draft"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.03]">
                    <div className="text-center"><p className="text-[13px] font-bold text-white/70">{(project.unitsSold || 0).toString()}</p><p className="text-[8px] text-white/20">Sold</p></div>
                    <div className="text-center"><p className="text-[13px] font-bold text-white/70">{(project.totalUnits || 0).toString()}</p><p className="text-[8px] text-white/20">Total</p></div>
                    <div className="text-center"><p className="text-[13px] font-bold text-emerald-400">${((project.avgPrice || 0) / 1000000).toFixed(1)}M</p><p className="text-[8px] text-white/20">Avg Price</p></div>
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
