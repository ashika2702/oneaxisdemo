import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Activity, Flame, TrendingUp, X, ArrowRight, Zap,
  Users, MessageSquare, Target, Megaphone, Search, Code,
  ClipboardList, BarChart3, Shield, Loader2
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

/* ═══════════════════════════════════════════
   MODULE DEFINITIONS
   ═══════════════════════════════════════════ */
interface ModuleDef {
  id: string;
  label: string;
  color: string;
  icon: any;
  route: string;
  status: "active" | "demo" | "core";
  description: string;
  angle: number;
  ring: number;
}

const MODULES: ModuleDef[] = [
  { id: "demand", label: "Demand Engine", color: "#ef4444", icon: Target, route: "/admin/demand", status: "active", description: "Drift scoring, 15 signal types, hot routing at >=80", angle: 0, ring: 1 },
  { id: "crm", label: "CRM Pipeline", color: "#3b82f6", icon: Users, route: "/admin/crm", status: "active", description: "4-stage pipeline with drift score integration", angle: 60, ring: 1 },
  { id: "whatsapp", label: "WhatsApp AI", color: "#10b981", icon: MessageSquare, route: "/admin/demand", status: "active", description: "Meta Cloud API, auto-lead creation, AI replies", angle: 120, ring: 1 },
  { id: "tasks", label: "Agent Tasks", color: "#eab308", icon: ClipboardList, route: "/admin/tasks", status: "active", description: "AI-generated tasks with hot lead alerts", angle: 180, ring: 1 },
  { id: "analytics", label: "Analytics", color: "#94a3b8", icon: BarChart3, route: "/admin/analytics", status: "active", description: "Cross-module funnel & conversion tracking", angle: 240, ring: 1 },
  { id: "superadmin", label: "Super Admin", color: "#6b7280", icon: Shield, route: "/super-admin", status: "active", description: "Customer orgs, billing, system health", angle: 300, ring: 1 },
  { id: "campaigns", label: "Campaigns", color: "#8b5cf6", icon: Megaphone, route: "/admin/campaign", status: "demo", description: "AI campaign planning with audience targeting", angle: 30, ring: 2 },
  { id: "ads", label: "Ad Studio", color: "#f59e0b", icon: Target, route: "/admin/ads", status: "demo", description: "Google, Meta, WhatsApp ad creation", angle: 90, ring: 2 },
  { id: "seo", label: "SEO Engine", color: "#06b6d4", icon: Search, route: "/admin/seo", status: "demo", description: "AI keyword research with volume & CPC", angle: 150, ring: 2 },
  { id: "widget", label: "Widget Net", color: "#ec4899", icon: Code, route: "/admin/widget", status: "demo", description: "Embed widget for partner site lead capture", angle: 210, ring: 2 },
];

const CONNECTIONS: [string, string][] = [
  ["brain", "demand"], ["brain", "crm"], ["brain", "whatsapp"],
  ["brain", "tasks"], ["brain", "analytics"], ["brain", "superadmin"],
  ["demand", "crm"], ["demand", "whatsapp"], ["crm", "tasks"],
  ["demand", "widget"], ["brain", "campaigns"], ["brain", "ads"],
  ["brain", "seo"], ["campaigns", "ads"], ["analytics", "demand"],
  ["analytics", "crm"],
];

/* ═══════════════════════════════════════════
   CANVAS VISUALIZATION
   ═══════════════════════════════════════════ */
function NeuralCanvas({ onSelect, selected, data }: {
  onSelect: (id: string) => void;
  selected: string | null;
  data: any;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef<string | null>(null);
  const particlesRef = useRef<Array<{ t: number; speed: number; conn: [string, string]; offset: number }>>([]);

  const getNodePos = useCallback((id: string, w: number, h: number) => {
    const cx = w / 2, cy = h / 2;
    if (id === "brain") return { x: cx, y: cy };
    const mod = MODULES.find(m => m.id === id);
    if (!mod) return { x: cx, y: cy };
    const rad = (mod.angle * Math.PI) / 180;
    const r = mod.ring === 1 ? Math.min(w, h) * 0.38 : Math.min(w, h) * 0.55;
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const pw = parent?.clientWidth || window.innerWidth;
      const ph = parent?.clientHeight || window.innerHeight;
      canvas.style.width = pw + "px";
      canvas.style.height = ph + "px";
      canvas.width = pw * window.devicePixelRatio;
      canvas.height = ph * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    if (particlesRef.current.length === 0) {
      CONNECTIONS.forEach(conn => {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            t: Math.random(),
            speed: 0.3 + Math.random() * 0.5,
            conn,
            offset: i / 3,
          });
        }
      });
    }

    const draw = (time: number) => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || canvas.offsetWidth;
      const h = parent?.clientHeight || canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Subtle radial gradient background
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)/2);
      grad.addColorStop(0, "rgba(200, 184, 154, 0.02)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw connections
      CONNECTIONS.forEach(([from, to]) => {
        const a = getNodePos(from, w, h);
        const b = getNodePos(to, w, h);
        const isActive = hoverRef.current === from || hoverRef.current === to || selected === from || selected === to;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        const cpx = (a.x + b.x) / 2 + (Math.sin(time * 0.001) * 10);
        const cpy = (a.y + b.y) / 2 - 30;
        ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
        ctx.strokeStyle = isActive
          ? "rgba(200, 184, 154, 0.25)"
          : "rgba(200, 184, 154, 0.06)";
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();
      });

      // Draw particles
      particlesRef.current.forEach(p => {
        const a = getNodePos(p.conn[0], w, h);
        const b = getNodePos(p.conn[1], w, h);
        const pt = ((time * 0.00015 * p.speed) + p.offset) % 1;
        const cpx = (a.x + b.x) / 2;
        const cpy = (a.y + b.y) / 2 - 30;
        const x = (1 - pt) * (1 - pt) * a.x + 2 * (1 - pt) * pt * cpx + pt * pt * b.x;
        const y = (1 - pt) * (1 - pt) * a.y + 2 * (1 - pt) * pt * cpy + pt * pt * b.y;

        const mod = MODULES.find(m => m.id === p.conn[1]);
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = mod?.color || "#6b7280";
        ctx.globalAlpha = Math.sin(pt * Math.PI) * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = mod?.color || "#6b7280";
        ctx.globalAlpha = Math.sin(pt * Math.PI) * 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw brain
      const brain = getNodePos("brain", w, h);
      const brainPulse = 1 + Math.sin(time * 0.002) * 0.08;
      const isBrainHover = hoverRef.current === "brain" || selected === "brain";

      // Brain glow rings
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(brain.x, brain.y, 35 * i * brainPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 184, 154, ${0.04 - i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Brain core
      ctx.beginPath();
      ctx.arc(brain.x, brain.y, 34 * brainPulse, 0, Math.PI * 2);
      ctx.fillStyle = "#6b7280";
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Brain highlight
      ctx.beginPath();
      ctx.arc(brain.x - 10, brain.y - 10, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
      ctx.fill();

      // Brain inner
      ctx.beginPath();
      ctx.arc(brain.x, brain.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 184, 154, 0.5)";
      ctx.fill();

      // Draw modules
      MODULES.forEach(mod => {
        const pos = getNodePos(mod.id, w, h);
        const isHover = hoverRef.current === mod.id;
        const isSel = selected === mod.id;
        const pulse = 1 + Math.sin(time * 0.002 + mod.angle) * 0.05;
        const r = (isSel ? 26 : isHover ? 24 : 22) * pulse;

        // Glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = mod.color;
        ctx.globalAlpha = (isHover || isSel) ? 0.15 : 0.06;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Connection ring
        if (mod.status === "active") {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 10, 0, Math.PI * 2);
          ctx.strokeStyle = mod.color;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Main circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = mod.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Inner highlight
        ctx.beginPath();
        ctx.arc(pos.x - r*0.25, pos.y - r*0.25, r*0.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fill();

        // Status dot
        const dotColor = mod.status === "active" ? "#10b981" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(pos.x + r * 0.75, pos.y - r * 0.75, 5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.strokeStyle = "#0A0A0A";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label background
        ctx.font = `600 ${isSel ? 12 : 11}px Inter, system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const textY = pos.y + r + 12;
        const metrics = ctx.measureText(mod.label);
        ctx.fillStyle = "rgba(10,10,10,0.8)";
        ctx.beginPath();
        ctx.roundRect(pos.x - metrics.width/2 - 6, textY - 2, metrics.width + 12, 18, 4);
        ctx.fill();

        // Label text
        ctx.fillStyle = isSel ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)";
        ctx.fillText(mod.label, pos.x, textY);
      });

      // Brain label background
      ctx.font = "bold 12px Inter, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const brainTitle = "ONEAXIS AI";
      const brainSub = "Neural Engine";
      const tm = ctx.measureText(brainTitle);
      const sm = ctx.measureText(brainSub);
      const maxW = Math.max(tm.width, sm.width);
      ctx.fillStyle = "rgba(10,10,10,0.85)";
      ctx.beginPath();
      ctx.roundRect(brain.x - maxW/2 - 10, brain.y + 46, maxW + 20, 40, 6);
      ctx.fill();

      // Brain label text
      ctx.fillStyle = "#6b7280";
      ctx.fillText(brainTitle, brain.x, brain.y + 50);
      ctx.font = "10px Inter, system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText(brainSub, brain.x, brain.y + 66);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    // Mouse handling
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      let found: string | null = null;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;

      // Check brain
      const b = getNodePos("brain", w, h);
      if (Math.hypot(mouseRef.current.x - b.x, mouseRef.current.y - b.y) < 35) found = "brain";

      // Check modules
      MODULES.forEach(mod => {
        const p = getNodePos(mod.id, w, h);
        if (Math.hypot(mouseRef.current.x - p.x, mouseRef.current.y - p.y) < 35) found = mod.id;
      });

      hoverRef.current = found;
      canvas.style.cursor = found ? "pointer" : "default";
    };

    const handleClick = () => {
      if (hoverRef.current) onSelect(hoverRef.current);
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("click", handleClick);
    };
  }, [getNodePos, onSelect, selected]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

/* ═══════════════════════════════════════════
   NODE DETAIL PANEL
   ═══════════════════════════════════════════ */
function NodePanel({ node, onClose, onNavigate }: {
  node: ModuleDef | null;
  onClose: () => void;
  onNavigate: (route: string) => void;
}) {
  if (!node) return null;
  const isActive = node.status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.25 }}
      className="absolute top-16 right-4 bottom-20 w-80 rounded-2xl border border-white/[0.06] bg-[#0E0E0E]/95 backdrop-blur-xl p-5 overflow-y-auto z-10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: node.color + "20" }}>
            <node.icon className="w-4 h-4" style={{ color: node.color }} />
          </div>
          <h3 className="text-[14px] font-semibold text-white/90">{node.label}</h3>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-4 ${
        isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      }`}>
        {isActive ? <Zap className="w-2.5 h-2.5" /> : <Flame className="w-2.5 h-2.5" />}
        {isActive ? "Live System" : "Demo Mode"}
      </div>

      <p className="text-[12px] text-white/50 leading-relaxed mb-5">{node.description}</p>

      <div className="space-y-2">
        <button
          onClick={() => onNavigate(node.route)}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium transition-all"
          style={{ backgroundColor: node.color + "18", color: node.color, border: `1px solid ${node.color}30` }}
        >
          Open Module <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   BOTTOM METRICS
   ═══════════════════════════════════════════ */
function BottomMetrics({ data }: { data: any }) {
  const metrics = [
    { label: "Active Leads", value: data?.leads || "47", icon: Users, color: "#3b82f6", change: "+12%" },
    { label: "Hot Routes", value: data?.hotRoutes || "8", icon: Flame, color: "#ef4444", change: "+3 today" },
    { label: "Signals/24h", value: data?.signals || "156", icon: Activity, color: "#10b981", change: "+23%" },
    { label: "WhatsApp Msgs", value: data?.whatsapp || "89", icon: MessageSquare, color: "#8b5cf6", change: "+18%" },
    { label: "Pipeline Value", value: data?.pipeline || "$2.1M", icon: TrendingUp, color: "#6b7280", change: "+8.5%" },
    { label: "Agent Tasks", value: data?.tasks || "12", icon: ClipboardList, color: "#eab308", change: "4 urgent" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-white/[0.04] bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center px-6 gap-6 overflow-x-auto">
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
            <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-white/90 tabular-nums">{m.value}</span>
              <span className="text-[9px] text-emerald-400">{m.change}</span>
            </div>
            <p className="text-[9px] text-white/25">{m.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function NeuralDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const funnelQuery = trpc.demand.funnelStats.useQuery({ orgId: 1, days: 30 }, { refetchInterval: 30000 });
  const tasksQuery = trpc.demand.tasks.useQuery({ orgId: 1, limit: 10 });

  const selectedMod = MODULES.find(m => m.id === selected) || null;

  const liveData = useMemo(() => {
    if (!funnelQuery.data) return null;
    return {
      leads: funnelQuery.data.leadsQualified || 47,
      hotRoutes: funnelQuery.data.hotLeads || 8,
      signals: funnelQuery.data.signalsCaptured || 156,
      whatsapp: 89,
      pipeline: "$2.1M",
      tasks: tasksQuery.data?.length || 12,
    };
  }, [funnelQuery.data, tasksQuery.data]);

  return (
    <AdminLayout hideSidebar>
      <div className="flex-1 relative bg-[#0A0A0A]">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 h-12">
          <div className="flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-[#6b7280]" />
            <h1 className="text-[13px] font-semibold text-white/80">Neural Command Center</h1>
            <span className="px-1.5 py-[1px] rounded text-[9px] bg-emerald-500/10 text-emerald-400 font-medium">LIVE</span>
          </div>
          <div className="flex items-center gap-3">
            {funnelQuery.isLoading && <Loader2 className="w-3 h-3 text-[#6b7280] animate-spin" />}
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              10 modules
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-14 left-4 z-10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] text-white/25">Live</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] text-white/25">Demo</span>
          </div>
        </div>

        {/* Canvas */}
        <NeuralCanvas onSelect={setSelected} selected={selected} data={liveData} />

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && selected !== "brain" && (
            <NodePanel
              node={selectedMod}
              onClose={() => setSelected(null)}
              onNavigate={(route) => navigate(route)}
            />
          )}
        </AnimatePresence>

        {/* Bottom Metrics */}
        <BottomMetrics data={liveData} />
      </div>
    </AdminLayout>
  );
}
