import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Building2, UserCircle, Users2,
  BarChart3, Workflow, Settings, ChevronLeft, ChevronRight, Box, LogOut,
  Brain, Rocket, Megaphone, Search, Globe, ClipboardList, Columns3,
  Cpu, HardHat, FileText, Calculator, Layers, Clock, Shield, Network,
  Eye, Sun, Headphones, Timer, Lock, MapPin,
  Users, Activity, ShieldCheck, Film
} from "lucide-react";
import { useStore } from "@/store/useStore";

const navItems = [
  { icon: Network, label: "System Blueprint", path: "/admin/blueprint", badge: null },
  { icon: Cpu, label: "Neural Center", path: "/admin/neural", badge: null },
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", badge: null },
  { icon: Brain, label: "Demand Engine", path: "/admin/demand", badge: null },
  { icon: Columns3, label: "Pipeline CRM", path: "/admin/crm", badge: null },
  { icon: ClipboardList, label: "Agent Tasks", path: "/admin/tasks", badge: null },
  { icon: FolderKanban, label: "Projects", path: "/admin/projects", badge: null },
  { icon: Building2, label: "Units", path: "/admin/units", badge: null },
  { icon: Rocket, label: "Campaigns", path: "/admin/campaign", badge: null },
  { icon: Megaphone, label: "Ad Studio", path: "/admin/ads", badge: null },
  { icon: Search, label: "SEO Keywords", path: "/admin/seo", badge: null },
  { icon: Globe, label: "Widget Config", path: "/admin/widget", badge: null },
  { icon: Clock, label: "Settlements", path: "/admin/settlements", badge: null },
  { icon: Shield, label: "HOLD Suite", path: "/admin/hold", badge: null },
  { icon: Cpu, label: "Algorithms", path: "/admin/algorithms", badge: null },
  { icon: HardHat, label: "Construction", path: "/admin/phasing", badge: null },
  { icon: FileText, label: "Documents", path: "/admin/documents", badge: null },
  { icon: Calculator, label: "Financials", path: "/admin/financial", badge: null },
  { icon: Layers, label: "Floor Plans", path: "/admin/floorplans", badge: null },
  { icon: Box, label: "Digital Twin", path: "/admin/twin", badge: null },
  { icon: Box, label: "3D Viewer", path: "/admin/3d", badge: null },
  { icon: Eye, label: "Experience", path: "/admin/experience", badge: null },
  { icon: Sun, label: "Day Engine", path: "/admin/day-engine", badge: null },
  { icon: Headphones, label: "Sound of Home", path: "/admin/sound", badge: null },
  { icon: Timer, label: "Time Scrub", path: "/admin/timescrub", badge: null },
  { icon: Building2, label: "Stacking Plan", path: "/admin/stacking", badge: null },
  { icon: Lock, label: "Reserve Unit", path: "/admin/reserve", badge: null },
  { icon: UserCircle, label: "Buyer Portal", path: "/admin/portal", badge: null },
  { icon: Brain, label: "It Remembers", path: "/admin/remembers", badge: null },
  { icon: MapPin, label: "My Life Here", path: "/admin/mylife", badge: null },
  { icon: Users, label: "Walk Together", path: "/admin/walk", badge: null },
  { icon: Activity, label: "Living Project", path: "/admin/living", badge: null },
  { icon: ShieldCheck, label: "Verified Views", path: "/admin/verified", badge: null },
  { icon: Film, label: "Keepsake Studio", path: "/admin/keepsake", badge: null },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children, hideSidebar }: { children: React.ReactNode; hideSidebar?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();

  const isActive = (path: string) => location.pathname === path;

  if (hideSidebar) {
    return (
      <div className="h-screen w-screen bg-[#0A0A0A] text-white/90 overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white/90 overflow-hidden selection:bg-white/10">
      {/* ─── Sidebar ─── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col flex-shrink-0"
        style={{ background: '#0A0A0A' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-[60px] flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b3b45, #4a4a55)' }}
            onClick={() => navigate("/admin")}
          >
            <Box className="w-4 h-4 text-[#0A0A0A]" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col overflow-hidden flex-1"
              >
                <span className="text-[13px] font-semibold text-white/90 truncate leading-tight">OneAxis</span>
                <span className="text-[11px] text-white/30 truncate leading-tight">admin@stedaxis.com</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-md hover:bg-white/[0.04] flex items-center justify-center flex-shrink-0 transition-colors"
          >
            {collapsed
              ? <ChevronRight className="w-3 h-3 text-white/25" />
              : <ChevronLeft className="w-3 h-3 text-white/25" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-[2px] overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 h-[36px] rounded-lg text-[13px] transition-all group relative ${
                isActive(item.path)
                  ? "bg-white/[0.06] text-white"
                  : "text-white/35 hover:text-white/70 hover:bg-white/[0.03]"
              }`}
            >
              <item.icon className={`w-[16px] h-[16px] flex-shrink-0 ${isActive(item.path) ? "text-white/80" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span
                  className={`ml-auto text-[10px] px-[6px] py-[1px] rounded-full font-medium flex-shrink-0 ${
                    item.label === "Leads"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/[0.08] text-white/40"
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.badge && collapsed && (
                <span className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center font-bold ${
                  item.label === "Leads" ? "bg-emerald-500 text-white" : "bg-white/20 text-white/80"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="py-3 px-3 space-y-[2px] flex-shrink-0">
          {/* Announcement Card */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mb-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-medium text-emerald-400 uppercase tracking-wider">New</span>
                  <button className="text-white/20 hover:text-white/50 text-xs">&times;</button>
                </div>
                <p className="text-[11px] font-medium text-white/70 mb-1">Partners affiliate program</p>
                <p className="text-[10px] text-white/30 mb-2.5 leading-relaxed">Run your own affiliate program with zero overhead.</p>
                <button className="text-[11px] font-medium text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 rounded-lg transition-colors">
                  Try it out &rarr;
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {bottomNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 h-[36px] rounded-lg text-[13px] transition-all ${
                isActive(item.path)
                  ? "bg-white/[0.06] text-white"
                  : "text-white/35 hover:text-white/70 hover:bg-white/[0.03]"
              }`}
            >
              <item.icon className="w-[16px] h-[16px] flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b3b45, #4a4a55)', color: '#e4e4e7' }}
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/70 truncate">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-white/25 truncate">{user?.email || "admin@stedaxis.com"}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <LogOut className="w-3.5 h-3.5 text-white/20 hover:text-white/50 cursor-pointer flex-shrink-0 transition-colors" />
          </div>
        </div>
      </motion.aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
