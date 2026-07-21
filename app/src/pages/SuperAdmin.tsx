import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield, Building2, Users, CreditCard, TrendingUp,
  Search, ArrowUpRight, ArrowDownRight, Activity,
  Globe, Clock, Mail, Phone, MoreHorizontal,
  Server, CheckCircle2, AlertTriangle, XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

/* ═══════════════════════════════════════════
   MOCK CUSTOMER DATA (would come from DB)
   ═══════════════════════════════════════════ */
const CUSTOMERS = [
  { id: 1, name: "Harbour Residences Pty Ltd", subdomain: "harbour", plan: "studio", members: 8, projects: 3, leads: 47, conversions: 5, mrr: 499, status: "active", lastActive: "2m ago", country: "AU", joined: "2025-01-15" },
  { id: 2, name: "Metro Towers Development", subdomain: "metro", plan: "professional", members: 12, projects: 5, leads: 128, conversions: 14, mrr: 999, status: "active", lastActive: "15m ago", country: "AU", joined: "2025-02-01" },
  { id: 3, name: "Coastal Living Group", subdomain: "coastal", plan: "enterprise", members: 24, projects: 8, leads: 312, conversions: 38, mrr: 2499, status: "active", lastActive: "1h ago", country: "AU", joined: "2024-11-20" },
  { id: 4, name: "Pinnacle Properties", subdomain: "pinnacle", plan: "starter", members: 3, projects: 1, leads: 12, conversions: 1, mrr: 199, status: "active", lastActive: "3h ago", country: "AU", joined: "2025-03-10" },
  { id: 5, name: "Skyline Developments", subdomain: "skyline", plan: "professional", members: 15, projects: 4, leads: 89, conversions: 9, mrr: 999, status: "trial", lastActive: "5h ago", country: "AE", joined: "2025-04-01" },
  { id: 6, name: "Greenfield Construction", subdomain: "greenfield", plan: "starter", members: 4, projects: 2, leads: 23, conversions: 2, mrr: 199, status: "trial", lastActive: "1d ago", country: "AE", joined: "2025-05-15" },
  { id: 7, name: "Al Safa Holdings", subdomain: "alsafa", plan: "enterprise", members: 32, projects: 10, leads: 567, conversions: 62, mrr: 2499, status: "active", lastActive: "30m ago", country: "AE", joined: "2024-09-01" },
  { id: 8, name: "Palm Jumeirah Estates", subdomain: "palm", plan: "studio", members: 6, projects: 2, leads: 34, conversions: 4, mrr: 499, status: "past_due", lastActive: "2d ago", country: "AE", joined: "2025-01-20" },
  { id: 9, name: "Emerald Hills Corp", subdomain: "emerald", plan: "professional", members: 10, projects: 3, leads: 67, conversions: 7, mrr: 999, status: "active", lastActive: "4h ago", country: "AU", joined: "2025-02-28" },
  { id: 10, name: "Marina Bay Developers", subdomain: "marina", plan: "starter", members: 2, projects: 1, leads: 8, conversions: 0, mrr: 199, status: "cancelled", lastActive: "30d ago", country: "SG", joined: "2024-12-01" },
];

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "#6b7280" },
  professional: { label: "Professional", color: "#3b82f6" },
  studio: { label: "Studio", color: "#8b5cf6" },
  enterprise: { label: "Enterprise", color: "#6b7280" },
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500", label: "Active" },
  trial: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500", label: "Trial" },
  past_due: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500", label: "Past Due" },
  cancelled: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500", label: "Cancelled" },
};

/* ═══════════════════════════════════════════
   SUPER ADMIN PAGE
   ═══════════════════════════════════════════ */
export default function SuperAdmin() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");

  const filtered = useMemo(() => {
    return CUSTOMERS.filter(c => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.subdomain.includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      const matchesPlan = filterPlan === "all" || c.plan === filterPlan;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [search, filterStatus, filterPlan]);

  const totalMrr = CUSTOMERS.filter(c => c.status === "active").reduce((s, c) => s + c.mrr, 0);
  const totalCustomers = CUSTOMERS.filter(c => c.status === "active" || c.status === "trial").length;
  const totalMembers = CUSTOMERS.reduce((s, c) => s + c.members, 0);
  const totalLeads = CUSTOMERS.reduce((s, c) => s + c.leads, 0);
  const pastDueCount = CUSTOMERS.filter(c => c.status === "past_due").length;
  const trialCount = CUSTOMERS.filter(c => c.status === "trial").length;

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white/90 overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/[0.04] flex flex-col">
        <div className="flex items-center gap-3 px-5 h-[60px] border-b border-white/[0.04]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6b7280, #52525b)' }}>
            <Shield className="w-4 h-4 text-[#0A0A0A]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white/90">Super Admin</p>
            <p className="text-[10px] text-white/30">OneAxis Platform</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-[2px]">
          {[
            { icon: Activity, label: "Dashboard", active: true },
            { icon: Building2, label: "Organizations", active: false },
            { icon: Users, label: "Users", active: false },
            { icon: CreditCard, label: "Billing", active: false },
            { icon: Server, label: "System Health", active: false },
          ].map(item => (
            <button key={item.label}
              className={`w-full flex items-center gap-3 px-3 h-[36px] rounded-lg text-[13px] transition-all ${
                item.active ? "bg-white/[0.06] text-white" : "text-white/35 hover:text-white/70 hover:bg-white/[0.03]"
              }`}>
              <item.icon className="w-[16px] h-[16px]" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #6b7280, #52525b)', color: '#0A0A0A' }}>S</div>
            <div>
              <p className="text-[11px] text-white/70">Super Admin</p>
              <p className="text-[10px] text-white/25">admin@oneaxis.live</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <h1 className="text-[15px] font-semibold text-white/90">Platform Overview</h1>
          <div className="flex items-center gap-2">
            {pastDueCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium">
                <AlertTriangle className="w-3 h-3" />{pastDueCount} past due
              </span>
            )}
            <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-medium">
              {trialCount} on trial
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Monthly Revenue", value: `$${(totalMrr).toLocaleString()}`, change: "+12%", up: true, icon: CreditCard },
              { label: "Active Customers", value: totalCustomers.toString(), change: "+3 this month", up: true, icon: Building2 },
              { label: "Total Members", value: totalMembers.toLocaleString(), change: "+28 this week", up: true, icon: Users },
              { label: "Leads Tracked", value: totalLeads.toLocaleString(), change: "+8.5%", up: true, icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-4 h-4 text-white/20" />
                  <span className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stat.change}
                  </span>
                </div>
                <p className="text-[22px] font-bold text-white/90 tabular-nums">{stat.value}</p>
                <p className="text-[11px] text-white/30 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Plan Distribution */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {["starter", "professional", "studio", "enterprise"].map(plan => {
              const count = CUSTOMERS.filter(c => c.plan === plan && (c.status === "active" || c.status === "trial")).length;
              const planInfo = PLAN_LABELS[plan];
              const revenue = CUSTOMERS.filter(c => c.plan === plan && c.status === "active").reduce((s, c) => s + c.mrr, 0);
              return (
                <motion.div key={plan} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: planInfo.color }} />
                    <span className="text-[11px] text-white/50">{planInfo.label}</span>
                  </div>
                  <p className="text-[18px] font-bold text-white/90">{count}</p>
                  <p className="text-[10px] text-white/25">${revenue.toLocaleString()}/mo</p>
                </motion.div>
              );
            })}
          </div>

          {/* Customer List */}
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden">
            {/* Filters */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.03]">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <Input placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-[32px] bg-white/[0.02] border-white/[0.05] text-white/70 placeholder:text-white/20 text-[12px] rounded-lg focus-visible:ring-0" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="h-[32px] px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/50 text-[12px] outline-none">
                <option value="all" className="bg-[#141414]">All Status</option>
                <option value="active" className="bg-[#141414]">Active</option>
                <option value="trial" className="bg-[#141414]">Trial</option>
                <option value="past_due" className="bg-[#141414]">Past Due</option>
                <option value="cancelled" className="bg-[#141414]">Cancelled</option>
              </select>
              <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
                className="h-[32px] px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/50 text-[12px] outline-none">
                <option value="all" className="bg-[#141414]">All Plans</option>
                <option value="starter" className="bg-[#141414]">Starter</option>
                <option value="professional" className="bg-[#141414]">Professional</option>
                <option value="studio" className="bg-[#141414]">Studio</option>
                <option value="enterprise" className="bg-[#141414]">Enterprise</option>
              </select>
            </div>

            {/* Table */}
            <div className="divide-y divide-white/[0.03]">
              {filtered.map((customer, i) => {
                const status = STATUS_CONFIG[customer.status];
                const plan = PLAN_LABELS[customer.plan];
                return (
                  <motion.div key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.015] transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: plan.color + "20", color: plan.color }}>
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-white/90 truncate">{customer.name}</span>
                        <span className={`px-1.5 py-[1px] rounded text-[9px] font-medium ${status.bg} ${status.text}`}>
                          <span className={`inline-block w-1 h-1 rounded-full ${status.dot} mr-1`} />{status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Globe className="w-2.5 h-2.5 text-white/15" />
                        <span className="text-[10px] text-white/25">{customer.subdomain}.oneaxis.live</span>
                        <span className="text-white/10">·</span>
                        <span className="text-[10px] text-white/25">{customer.country}</span>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                      <div className="text-center w-14">
                        <p className="text-[12px] font-medium text-white/70">{customer.members}</p>
                        <p className="text-[9px] text-white/20">members</p>
                      </div>
                      <div className="text-center w-14">
                        <p className="text-[12px] font-medium text-white/70">{customer.leads}</p>
                        <p className="text-[9px] text-white/20">leads</p>
                      </div>
                      <div className="text-center w-14">
                        <p className="text-[12px] font-medium text-white/70">{customer.conversions}</p>
                        <p className="text-[9px] text-white/20">sales</p>
                      </div>
                      <div className="text-center w-20">
                        <p className="text-[12px] font-medium text-emerald-400">${customer.mrr}</p>
                        <p className="text-[9px] text-white/20">/month</p>
                      </div>
                      <div className="text-right w-16">
                        <p className="text-[11px] text-white/40">{customer.lastActive}</p>
                        <p className="text-[9px] text-white/20">active</p>
                      </div>
                    </div>
                    <button className="w-7 h-7 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-white/20">
                <Building2 className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-[13px]">No organizations match</p>
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "API Uptime", value: "99.97%", status: "healthy", icon: CheckCircle2 },
              { label: "Database", value: "Operational", status: "healthy", icon: CheckCircle2 },
              { label: "WhatsApp Webhook", value: "Active", status: "healthy", icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-4 py-3 flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${item.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`} />
                <div>
                  <p className="text-[11px] text-white/50">{item.label}</p>
                  <p className="text-[13px] font-medium text-white/80">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
