import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, FileText, Clock, DollarSign, CheckCircle2, AlertTriangle,
  ChevronRight, Download, MessageSquare, CalendarDays, Shield,
  TrendingUp, Eye, Bell, User, LogOut, Home, CreditCard,
  ClipboardList, Phone, Mail, MapPin, ChevronDown, ChevronUp
} from "lucide-react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type Tab = "overview" | "documents" | "payments" | "settlement" | "messages";

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const BUYER = {
  name: "James Chen",
  email: "james@email.com",
  phone: "+61 412 345 678",
  unit: "A1402",
  unitType: "2 Bed + Study",
  floor: 14,
  area: 98,
  price: 1820000,
  depositPaid: 5000,
  project: "Azure Heights",
  address: "45 Park Avenue, Sydney NSW 2000",
  reservationId: "RA-8XJ2M9P",
  reservedDate: "15 July 2026",
  settlementDate: "26 August 2026",
  daysToSettlement: 37,
  agent: { name: "Sarah Mitchell", phone: "+61 423 456 789", email: "sarah@stedaxis.com" },
  progress: 35,
};

const MILESTONES = [
  { label: "Reservation", date: "15 Jul 2026", done: true, icon: CheckCircle2 },
  { label: "Contract Exchange", date: "20 Jul 2026", done: true, icon: FileText },
  { label: "Cooling Off", date: "27 Jul 2026", done: false, icon: Shield },
  { label: "Finance Approval", date: "10 Aug 2026", done: false, icon: DollarSign },
  { label: "Pre-Settlement", date: "20 Aug 2026", done: false, icon: ClipboardList },
  { label: "Settlement", date: "26 Aug 2026", done: false, icon: Home },
];

const DOCUMENTS = [
  { name: "Contract of Sale", type: "pdf", size: "2.4 MB", status: "signed", date: "20 Jul 2026" },
  { name: "Section 32 Statement", type: "pdf", size: "1.8 MB", status: "viewed", date: "18 Jul 2026" },
  { name: "Floor Plan — A1402", type: "pdf", size: "3.1 MB", status: "viewed", date: "16 Jul 2026" },
  { name: "Amenity Guide", type: "pdf", size: "5.2 MB", status: "new", date: "—" },
  { name: "Building Rules", type: "pdf", size: "890 KB", status: "pending", date: "—" },
];

const PAYMENTS = [
  { label: "Holding Deposit", amount: 5000, status: "paid", date: "15 Jul 2026", icon: DollarSign },
  { label: "Exchange Deposit (10%)", amount: 177000, status: "due", date: "20 Jul 2026", icon: CreditCard },
  { label: "Balance (90%)", amount: 1638000, status: "upcoming", date: "26 Aug 2026", icon: Home },
];

const NOTIFICATIONS = [
  { message: "Contract of Sale has been countersigned", time: "2 hours ago", read: false },
  { message: "Your cooling off period ends in 3 days", time: "1 day ago", read: false },
  { message: "New document: Amenity Guide available", time: "2 days ago", read: true },
];

const fmtPrice = (n: number) => `$${n.toLocaleString()}`;

/* ═══════════════════════════════════════════
   MAIN COMPONENT — Public Buyer Portal
   ═══════════════════════════════════════════ */
export default function BuyerPortal() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "settlement", label: "Settlement", icon: ClipboardList },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/90">
      {/* Top bar */}
      <div className="border-b border-white/[0.04] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b3b45] to-[#4a4a55] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white/70" />
            </div>
            <span className="text-[14px] font-semibold text-white/90">OneAxis</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[12px] text-white/30">Buyer Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] relative"
              >
                <Bell className="w-4 h-4 text-white/30" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-[8px] text-[#0A0A0A] font-bold flex items-center justify-center">2</span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#141414] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/[0.04]">
                      <p className="text-[12px] font-medium text-white/70">Notifications</p>
                    </div>
                    {NOTIFICATIONS.map((n, i) => (
                      <div key={i} className={`p-3 border-b border-white/[0.03] ${!n.read ? "bg-white/[0.02]" : ""}`}>
                        <p className="text-[11px] text-white/50">{n.message}</p>
                        <p className="text-[9px] text-white/20 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b3b45] to-[#4a4a55] flex items-center justify-center text-[10px] font-bold text-white/70">
                {BUYER.name.charAt(0)}
              </div>
              <span className="text-[12px] text-white/50 hidden sm:inline">{BUYER.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-white/90 mb-1">Welcome back, {BUYER.name.split(" ")[0]}</h1>
          <p className="text-[12px] text-white/30">Unit {BUYER.unit} · {BUYER.project} · {BUYER.daysToSettlement} days to settlement</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/25 uppercase tracking-wider">Settlement Progress</span>
            <span className="text-[11px] text-emerald-400 font-medium">{BUYER.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${BUYER.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/[0.04] pb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-emerald-400/60 text-white/80"
                  : "border-transparent text-white/25 hover:text-white/50"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Unit card */}
                <div className="col-span-2 bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Your Unit</p>
                      <h2 className="text-[24px] font-bold text-white/90">{BUYER.unit}</h2>
                      <p className="text-[12px] text-white/30">{BUYER.unitType} · Floor {BUYER.floor} · {BUYER.area}m²</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-bold text-white/90">{fmtPrice(BUYER.price)}</p>
                      <p className="text-[10px] text-white/20">{BUYER.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-white/25">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {BUYER.project}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Settlement: {BUYER.settlementDate}</span>
                    <span className="flex items-center gap-1 text-emerald-400/60"><CheckCircle2 className="w-3 h-3" /> Hold Active</span>
                  </div>
                </div>

                {/* Agent card */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Your Agent</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b3b45] to-[#4a4a55] flex items-center justify-center text-[12px] font-bold text-white/70">
                      {BUYER.agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-white/70">{BUYER.agent.name}</p>
                      <p className="text-[10px] text-white/20">Sales Consultant</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a href={`tel:${BUYER.agent.phone}`} className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/50 transition-colors">
                      <Phone className="w-3 h-3" /> {BUYER.agent.phone}
                    </a>
                    <a href={`mailto:${BUYER.agent.email}`} className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/50 transition-colors">
                      <Mail className="w-3 h-3" /> {BUYER.agent.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                <p className="text-[10px] text-white/20 uppercase tracking-wider mb-4">Settlement Journey</p>
                <div className="flex items-start gap-0">
                  {MILESTONES.map((m, i) => (
                    <div key={i} className="flex-1 relative">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          m.done ? "bg-emerald-500/15" : "bg-white/[0.04]"
                        }`}>
                          <m.icon className={`w-4 h-4 ${m.done ? "text-emerald-400" : "text-white/15"}`} />
                        </div>
                        <p className={`text-[10px] font-medium ${m.done ? "text-white/60" : "text-white/25"}`}>{m.label}</p>
                        <p className="text-[9px] text-white/15 mt-0.5">{m.date}</p>
                      </div>
                      {i < MILESTONES.length - 1 && (
                        <div className={`absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-px ${
                          m.done ? "bg-emerald-500/20" : "bg-white/[0.04]"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl divide-y divide-white/[0.03]">
                {DOCUMENTS.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-red-400/60" />
                      </div>
                      <div>
                        <p className="text-[12px] text-white/60 font-medium">{doc.name}</p>
                        <p className="text-[10px] text-white/20">{doc.type.toUpperCase()} · {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                        doc.status === "signed" ? "bg-emerald-500/10 text-emerald-400" :
                        doc.status === "viewed" ? "bg-blue-500/10 text-blue-400" :
                        doc.status === "new" ? "bg-amber-500/10 text-amber-400" :
                        "bg-white/[0.04] text-white/30"
                      }`}>
                        {doc.status}
                      </span>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/30 text-[10px] hover:bg-white/[0.08] transition-colors">
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-3 mb-6">
                {PAYMENTS.map((p, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        p.status === "paid" ? "bg-emerald-500/10" : p.status === "due" ? "bg-amber-500/10" : "bg-white/[0.04]"
                      }`}>
                        <p.icon className={`w-4 h-4 ${
                          p.status === "paid" ? "text-emerald-400" : p.status === "due" ? "text-amber-400" : "text-white/20"
                        }`} />
                      </div>
                      <div>
                        <p className="text-[12px] text-white/60 font-medium">{p.label}</p>
                        <p className="text-[10px] text-white/20">Due: {p.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-semibold text-white/70">{fmtPrice(p.amount)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                        p.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                        p.status === "due" ? "bg-amber-500/10 text-amber-400" :
                        "bg-white/[0.04] text-white/30"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white/40">Total Purchase Price</span>
                  <span className="text-[20px] font-bold text-white/90">{fmtPrice(BUYER.price)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settlement" && (
            <motion.div key="settlement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Countdown</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 37, label: "Days" },
                      { value: 14, label: "Hours" },
                      { value: 32, label: "Mins" },
                      { value: 18, label: "Secs" },
                    ].map((t, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-lg p-3 text-center">
                        <p className="text-[20px] font-bold text-white/80">{t.value}</p>
                        <p className="text-[9px] text-white/20">{t.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/30 mt-3 text-center">Settlement: {BUYER.settlementDate}</p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Outstanding Actions</p>
                  <div className="space-y-2">
                    {[
                      { label: "Arrange building inspection", urgent: true },
                      { label: "Confirm finance approval", urgent: true },
                      { label: "Review strata by-laws", urgent: false },
                      { label: "Arrange insurance", urgent: false },
                    ].map((action, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                        <div className={`w-1.5 h-1.5 rounded-full ${action.urgent ? "bg-amber-400" : "bg-white/15"}`} />
                        <span className="text-[11px] text-white/40 flex-1">{action.label}</span>
                        {action.urgent && <span className="text-[8px] text-amber-400/60 font-medium">Due soon</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-8 text-center">
                <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-[13px] text-white/30 mb-1">Secure messaging</p>
                <p className="text-[11px] text-white/20 mb-4">Chat directly with your sales consultant</p>
                <button className="px-4 py-2 rounded-lg bg-white/[0.06] text-white/50 text-[11px] hover:bg-white/[0.1] transition-colors">
                  Start Conversation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
