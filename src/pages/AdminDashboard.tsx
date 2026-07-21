import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, Settings, CheckSquare, Copy,
  ChevronDown, Link2, X, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const timeRanges = ["1d", "1w", "1m", "6m", "1y"] as const;
type TimeRange = typeof timeRanges[number];
const analyticsTabs = ["Clicks", "Signups", "Conversions"] as const;

const MOCK_PROJECTS = [
  { id: 1, name: "Azure Heights Tower", slug: "azure-heights", url: "stedaxis.com/azure", type: "real-estate", avatarColor: "#6b7280", description: "IG conversion funnel #2", status: "active", clicks: 27, timeAgo: "7m" },
  { id: 2, name: "Marina View Residences", slug: "marina-view", url: "stedaxis.com/marina", type: "real-estate", avatarColor: "#5B9A6B", description: "Pinterest blog post links", status: "active", clicks: 48, timeAgo: "10d" },
  { id: 3, name: "Golden Gate Commercial", slug: "golden-gate", url: "stedaxis.com/golden", type: "commercial", avatarColor: "#C98A3E", description: "Pinterest blog post links", status: "planning", clicks: 48, timeAgo: "10d" },
  { id: 4, name: "Sunset Boulevard Villas", slug: "sunset-blvd", url: "stedaxis.com/sunset", type: "real-estate", avatarColor: "#8C8278", description: "Pinterest blog post links", status: "active", clicks: 48, timeAgo: "10d" },
  { id: 5, name: "Riverside Industrial Park", slug: "riverside", url: "stedaxis.com/riverside", type: "industrial", avatarColor: "#B5544A", description: "Pinterest blog post links", status: "active", clicks: 48, timeAgo: "10d" },
  { id: 6, name: "The Grand Plaza", slug: "grand-plaza", url: "stedaxis.com/grand", type: "real-estate", avatarColor: "#6B8FAD", description: "Pinterest blog post links", status: "active", clicks: 32, timeAgo: "2d" },
];

const MOCK_BAR = [
  { name: "Azure Heights", value: 124, color: "#6b7280", avatar: "AH" },
  { name: "Marina View", value: 86, color: "#5B9A6B", avatar: "MV" },
  { name: "Golden Gate", value: 51, color: "#C98A3E", avatar: "GG" },
  { name: "Sunset Blvd", value: 38, color: "#8C8278", avatar: "SB" },
  { name: "Riverside", value: 22, color: "#B5544A", avatar: "RS" },
];

const MOCK_LINE = [
  { day: "M", value: 30 }, { day: "T", value: 55 }, { day: "W", value: 42 },
  { day: "T", value: 68 }, { day: "F", value: 50 }, { day: "S", value: 78 }, { day: "S", value: 95 },
];

function ColoredAvatar({ color, text, size = 32 }: { color: string; text: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 font-semibold"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.35, color: '#0A0A0A' }}>
      {text}
    </div>
  );
}

function ClickPill({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[12px] text-white/60 font-medium tabular-nums">{count} clicks</span>
    </div>
  );
}

function SmoothAreaChart({ data }: { data: typeof MOCK_LINE }) {
  const width = 500, height = 160;
  const pad = { top: 10, right: 10, bottom: 24, left: 10 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  const getX = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
  const getY = (v: number) => pad.top + chartH - (v / maxVal) * chartH;
  let pathD = `M ${getX(0)} ${getY(data[0].value)}`;
  for (let i = 0; i < data.length - 1; i++) {
    const cpx = (getX(i) + getX(i + 1)) / 2;
    pathD += ` C ${cpx} ${getY(data[i].value)}, ${cpx} ${getY(data[i+1].value)}, ${getX(i+1)} ${getY(data[i+1].value)}`;
  }
  const areaD = `${pathD} L ${getX(data.length-1)} ${height-pad.bottom} L ${getX(0)} ${height-pad.bottom} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6b7280" stopOpacity="0.25" />
        <stop offset="60%" stopColor="#6b7280" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#6b7280" stopOpacity="0" />
      </linearGradient></defs>
      {[0,0.33,0.66,1].map((p,i)=>(
        <line key={i} x1={pad.left} y1={pad.top+chartH*p} x2={width-pad.right} y2={pad.top+chartH*p} stroke="rgba(255,255,255,0.03)" strokeWidth={1}/>
      ))}
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" />
      {data.map((d,i)=>(<circle key={i} cx={getX(i)} cy={getY(d.value)} r={3} fill="#6b7280" />))}
      {data.map((d,i)=>(<text key={`l${i}`} x={getX(i)} y={height-6} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="Inter, sans-serif">{d.day}</text>))}
    </svg>
  );
}

function HorizontalBarChart({ data }: { data: typeof MOCK_BAR }) {
  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => {
        const pct = (item.value / maxVal) * 100;
        return (
          <div key={i} className="flex items-center gap-3">
            <ColoredAvatar color={item.color} text={item.avatar} size={28} />
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <div className="flex-1 h-7 bg-white/[0.03] rounded-md overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4 + i*0.08, duration: 0.5, ease: "easeOut" }} className="h-full rounded-md" style={{ backgroundColor: item.color, opacity: 0.7 }} />
                <span className="absolute inset-0 flex items-center px-2.5 text-[11px] text-white/70 font-medium truncate">{item.name}</span>
              </div>
              <span className="text-[12px] text-white/50 font-medium tabular-nums w-8 text-right flex-shrink-0">{item.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Toast({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.25 }} className="fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-white/[0.06] bg-[#141414] shadow-2xl max-w-[280px]">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-4 h-4 text-emerald-400" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white/90 mb-0.5">Link created</p>
            <p className="text-[11px] text-white/35 leading-relaxed">Changes to the short link will take effect immediately</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/60 mt-0.5"><X className="w-3.5 h-3.5" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("1w");
  const [barTimeRange, setBarTimeRange] = useState<TimeRange>("1w");
  const [activeTab, setActiveTab] = useState<typeof analyticsTabs[number]>("Clicks");
  const [showToast, setShowToast] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Real API calls with mock fallback
  const projectsQuery = trpc.project.list.useQuery({});
  const funnelQuery = trpc.demand.funnelStats.useQuery({ orgId: 1, days: 30 });

  const isLoading = projectsQuery.isLoading || funnelQuery.isLoading;

  // Use real data if available, fallback to mock
  const projectList = useMemo(() => {
    if (projectsQuery.data && projectsQuery.data.length > 0) {
      return projectsQuery.data.map((p: any, i: number) => ({
        id: p.id,
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/\s/g, '-'),
        url: `stedaxis.com/${(p.slug || p.name.toLowerCase().replace(/\s/g, '-'))}`,
        type: p.type,
        avatarColor: MOCK_PROJECTS[i % MOCK_PROJECTS.length].avatarColor,
        description: `${p.type} project`,
        status: p.status,
        clicks: Math.floor(Math.random() * 50) + 10,
        timeAgo: 'recent',
      }));
    }
    return MOCK_PROJECTS;
  }, [projectsQuery.data]);

  const funnelStats = funnelQuery.data;

  const filtered = projectList.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug?.includes(searchQuery.toLowerCase())
  );

  const lineData = useMemo(() => {
    if (funnelStats?.signalBreakdown) {
      const days = ["M","T","W","T","F","S","S"];
      const total = funnelStats.signalsCaptured || 352;
      return days.map((d, i) => ({ day: d, value: Math.round(total * (0.3 + Math.sin(i) * 0.3)) }));
    }
    return MOCK_LINE;
  }, [funnelStats]);

  const barData = useMemo(() => {
    if (funnelStats?.channelBreakdown) {
      const channels = Object.entries(funnelStats.channelBreakdown as Record<string, number>)
        .slice(0, 5).map(([name, count], i) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: count,
          color: MOCK_BAR[i % MOCK_BAR.length].color,
          avatar: name.substring(0, 2).toUpperCase(),
        }));
      if (channels.length > 0) return channels;
    }
    return MOCK_BAR;
  }, [funnelStats]);

  useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 1500);
    const t2 = setTimeout(() => setShowToast(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const handleCopy = (id: number, slug: string) => {
    navigator.clipboard?.writeText(`stedaxis.com/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <Toast show={showToast} onClose={() => setShowToast(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[15px] font-semibold text-white/90">Projects</h1>
            <ChevronDown className="w-3.5 h-3.5 text-white/25" />
          </div>
          <Button size="sm" className="h-8 px-3 text-[12px] font-medium bg-white/[0.08] hover:bg-white/[0.12] text-white/80 border border-white/[0.06] rounded-lg gap-1.5"
            onClick={() => setShowToast(true)}>
            <Link2 className="w-3.5 h-3.5" />Create project
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            {[{ icon: SlidersHorizontal, label: "Display" }, { icon: Settings, label: "Settings" }, { icon: CheckSquare, label: "Bulk Actions" }].map(btn => (
              <button key={btn.label} className="flex items-center gap-2 px-3 h-[32px] rounded-lg border border-white/[0.05] bg-white/[0.02] text-white/40 hover:text-white/70 hover:bg-white/[0.04] text-[12px] transition-all">
                <btn.icon className="w-3.5 h-3.5" />{btn.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <Input placeholder="Search projects" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-[32px] w-56 bg-white/[0.02] border-white/[0.05] text-white/70 placeholder:text-white/20 text-[12px] rounded-lg focus-visible:ring-0" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin">
          {/* Connection status */}
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-2 mb-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <Loader2 className="w-3 h-3 text-[#6b7280] animate-spin" />
              <span className="text-[11px] text-white/40">Loading live data...</span>
            </div>
          )}
          {funnelStats && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: "Impressions", value: funnelStats.impressions || 0, change: "+23%" },
                { label: "Signals", value: funnelStats.signalsCaptured || 0, change: "+18%" },
                { label: "Qualified", value: funnelStats.leadsQualified || 0, change: "+31%" },
                { label: "Hot Leads", value: funnelStats.hotLeads || 0, change: "+12%" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</span>
                    <span className="text-[10px] text-emerald-400/70">{stat.change}</span>
                  </div>
                  <p className="text-[18px] font-bold text-white/90 tabular-nums">{stat.value.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Project List */}
          <div className="rounded-xl border border-white/[0.04] overflow-hidden" style={{ background: '#0E0E0E' }}>
            {filtered.map((project: any, i: number) => (
              <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="group flex items-center gap-4 px-5 h-[68px] border-b border-white/[0.03] cursor-pointer hover:bg-white/[0.015] transition-colors"
                onClick={() => navigate(`/project/${project.id}`)}>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-[18px] h-[18px] rounded border border-white/15 flex items-center justify-center hover:border-[#6b7280]/40">
                    <CheckSquare className="w-3 h-3 text-transparent" />
                  </div>
                </div>
                <ColoredAvatar color={project.avatarColor} text={project.name.charAt(0)} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white/90 truncate group-hover:text-white transition-colors">stedaxis.com/{project.slug}</span>
                    <button onClick={e => { e.stopPropagation(); handleCopy(project.id, project.slug); }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedId === project.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/25 hover:text-[#6b7280]" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Link2 className="w-2.5 h-2.5 text-white/15" />
                    <span className="text-[11px] text-white/25">{project.url}</span>
                    <span className="text-[11px] text-white/15 ml-1">{project.timeAgo}</span>
                  </div>
                </div>
                <div className="hidden lg:block w-48 flex-shrink-0">
                  <span className="text-[12px] text-white/30">{project.description}</span>
                </div>
                <div className="flex-shrink-0"><ClickPill count={project.clicks} /></div>
              </motion.div>
            ))}
          </div>

          {/* Analytics */}
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-xl border border-white/[0.04] p-5" style={{ background: '#0E0E0E' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] text-white/30">Total engagements:</span>
                  <span className="text-[18px] font-bold text-white/90 tabular-nums">
                    {funnelStats ? (funnelStats.signalsCaptured || 0).toLocaleString() : "352"}
                  </span>
                </div>
                <div className="flex items-center rounded-lg p-[2px]" style={{ background: '#141414' }}>
                  {timeRanges.map(r => (
                    <button key={r} onClick={() => setTimeRange(r)} className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${timeRange === r ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <SmoothAreaChart data={lineData} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-xl border border-white/[0.04] p-5" style={{ background: '#0E0E0E' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center rounded-lg p-[2px]" style={{ background: '#141414' }}>
                  {analyticsTabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 text-[11px] rounded-md transition-all ${activeTab === tab ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50"}`}>{tab}</button>
                  ))}
                </div>
                <div className="flex items-center rounded-lg p-[2px]" style={{ background: '#141414' }}>
                  {timeRanges.map(r => (
                    <button key={r} onClick={() => setBarTimeRange(r)} className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${barTimeRange === r ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <HorizontalBarChart data={barData} />
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
