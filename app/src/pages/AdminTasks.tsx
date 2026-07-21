import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ClipboardList, Clock, CheckCircle2, Flame,
  Phone, Calendar, FileText, ChevronRight, User, Loader2
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const MOCK_TASKS = [
  { id: "T001", type: "hot_route_notify", label: "Hot Lead Alert", description: "James Chen scored 87 — contact within 2h", lead: "James Chen", project: "Azure Heights", due: "2h", priority: "urgent", status: "pending", icon: Flame, iconColor: "#ef4444" },
  { id: "T002", type: "schedule_viewing", label: "Schedule Viewing", description: "Lisa Wang wants to view 2BR Unit 8", lead: "Lisa Wang", project: "Azure Heights", due: "24h", priority: "high", status: "pending", icon: Calendar, iconColor: "#f59e0b" },
  { id: "T003", type: "draft_proposal", label: "Draft Proposal", description: "Prepare pricing proposal for Priya Sharma", lead: "Priya Sharma", project: "Azure Heights", due: "48h", priority: "high", status: "in_progress", icon: FileText, iconColor: "#6b7280" },
  { id: "T004", type: "follow_up_call", label: "Follow-up Call", description: "David Park asked about settlement — call back", lead: "David Park", project: "Golden Gate", due: "4h", priority: "medium", status: "pending", icon: Phone, iconColor: "#3b82f6" },
  { id: "T005", type: "hot_route_notify", label: "Hot Lead Alert", description: "Sarah Kim scored 76 — searched pricing", lead: "Sarah Kim", project: "Marina View", due: "2h", priority: "urgent", status: "done", icon: Flame, iconColor: "#10b981" },
  { id: "T006", type: "send_brochure", label: "Send Brochure", description: "Emma Watson requested project brochure", lead: "Emma Watson", project: "Sunset Blvd", due: "12h", priority: "low", status: "pending", icon: FileText, iconColor: "#8b5cf6" },
];

const FILTERS = ["all", "urgent", "high", "medium", "low", "done"] as const;

const COLORS: Record<string, string> = {
  urgent: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#8b5cf6", done: "#10b981",
};

export default function AdminTasks() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  // Real API call
  const tasksQuery = trpc.demand.tasks.useQuery({ orgId: 1, limit: 50 });
  const isLoading = tasksQuery.isLoading;

  // Merge real + mock
  const tasks = useMemo(() => {
    if (tasksQuery.data && tasksQuery.data.length > 0) {
      return tasksQuery.data.map((t: any, i: number) => ({
        id: t.id?.toString() || `T${i}`,
        type: t.taskType || "task",
        label: t.taskType?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Task",
        description: t.draftContent || t.suggestedAction || "Review this task",
        lead: t.leadId ? `Lead #${t.leadId}` : "Unassigned",
        project: t.metadata?.project || "Azure Heights",
        due: t.dueAt ? formatDue(t.dueAt) : "soon",
        priority: t.status === "pending" && t.taskType === "hot_route_notify" ? "urgent" : "high",
        status: t.status,
        icon: t.taskType === "hot_route_notify" ? Flame : t.taskType === "schedule_viewing" ? Calendar : FileText,
        iconColor: t.status === "done" ? "#10b981" : t.taskType === "hot_route_notify" ? "#ef4444" : "#6b7280",
      }));
    }
    return MOCK_TASKS;
  }, [tasksQuery.data]);

  const filtered = useMemo(() => {
    return tasks.filter((t: any) =>
      filter === "all" ? true :
      filter === "done" ? t.status === "done" :
      t.priority === filter
    );
  }, [tasks, filter]);

  const pendingCount = tasks.filter((t: any) => t.status === "pending").length;
  const urgentCount = tasks.filter((t: any) => t.priority === "urgent" && t.status !== "done").length;

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <ClipboardList className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Agent Tasks</h1>
              <p className="text-[10px] text-white/25">AI-generated tasks for your sales team</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-medium">
                <Flame className="w-3 h-3" />{urgentCount} urgent
              </span>
            )}
            <span className="px-2 py-1 rounded-full bg-white/[0.04] text-white/30 text-[10px]">{pendingCount} pending</span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-[#6b7280] animate-spin" />}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 px-6 py-3 flex-shrink-0 border-b border-white/[0.03]">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 h-[28px] rounded-lg text-[12px] font-medium transition-all capitalize ${
                filter === f ? "bg-white/[0.08] text-white/80" : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scrollbar-thin">
          {filtered.map((task: any, i: number) => (
            <motion.div key={task.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: task.iconColor + "15" }}>
                <task.icon className="w-4 h-4" style={{ color: task.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[13px] font-medium ${task.status === "done" ? "text-white/40 line-through" : "text-white/90"}`}>{task.label}</span>
                  <span className={`px-1.5 py-[1px] rounded text-[9px] font-medium capitalize ${
                    task.priority === "urgent" ? "bg-red-500/15 text-red-400" :
                    task.priority === "high" ? "bg-amber-500/15 text-amber-400" :
                    task.priority === "medium" ? "bg-blue-500/15 text-blue-400" :
                    "bg-white/[0.04] text-white/30"
                  }`}>{task.priority}</span>
                  {task.status === "in_progress" && <span className="px-1.5 py-[1px] rounded text-[9px] bg-[#6b7280]/15 text-[#6b7280]">In Progress</span>}
                  {task.status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className={`text-[11px] ${task.status === "done" ? "text-white/20" : "text-white/40"} truncate`}>{task.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <User className="w-2.5 h-2.5 text-white/15" />
                    <span className="text-[10px] text-white/25">{task.lead}</span>
                  </div>
                  <span className="text-white/10">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-white/15" />
                    <span className="text-[10px] text-white/25">{task.due}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0" />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-white/20">
              <ClipboardList className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-[13px]">No tasks match this filter</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function formatDue(dueAt: string | Date): string {
  const due = new Date(dueAt);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const hours = Math.round(diff / 3600000);
  if (hours < 1) return "<1h";
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}
