import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, User, Share2, Link2, Copy, CheckCheck, Crown,
  MousePointer, Monitor, Smartphone, Eye, MessageSquare,
  X, ArrowRight, Globe, Clock, Wifi, WifiOff
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const PARTICIPANTS = [
  { id: "p1", name: "James (You)", role: "driver", color: "#f43f5e", device: "desktop", location: "Balcony view · Unit A1402", online: true },
  { id: "p2", name: "Mum", role: "viewer", color: "#3b82f6", device: "mobile", location: "Chennai, India", online: true },
  { id: "p3", name: "Partner", role: "viewer", color: "#10b981", device: "mobile", location: "Sydney CBD", online: true },
  { id: "p4", name: "Sarah (Agent)", role: "guide", color: "#f59e0b", device: "desktop", location: "Display Suite", online: true },
];

const ACTIVITY_LOG = [
  { user: "James", action: "Navigated to Unit A1402", time: "Just now" },
  { user: "Mum", action: "Joined the session", time: "2 min ago" },
  { user: "Sarah", action: "Highlighted the harbour view", time: "3 min ago" },
  { user: "Partner", action: "Joined the session", time: "4 min ago" },
  { user: "James", action: "Started the session", time: "5 min ago" },
];

export default function WalkTogether() {
  const [sessionActive, setSessionActive] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { user: "Sarah", text: "Welcome everyone! Let me show you the harbour-facing units first.", color: "#f59e0b" },
    { user: "Mum", text: "The view looks beautiful from here! Can we see the kitchen?", color: "#3b82f6" },
    { user: "James", text: "Sure, I'll navigate there now.", color: "#f43f5e" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { user: "James", text: chatInput, color: "#f43f5e" }]);
    setChatInput("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://stedaxis.com/walk/abc-123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/10 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Walk It Together</h1>
              <p className="text-[10px] text-white/25">Co-presence · Synchronized viewing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px]">
              <Wifi className="w-3 h-3" /> {PARTICIPANTS.filter(p => p.online).length} online
            </div>
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 text-[10px] hover:bg-white/[0.1] transition-colors"
            >
              <Share2 className="w-3 h-3" /> Invite
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main viewport */}
          <div className="flex-1 relative bg-[#080808] flex items-center justify-center overflow-hidden">
            {/* Simulated shared view */}
            <svg viewBox="0 0 700 450" className="w-[90%] max-w-[800px]">
              <defs>
                <linearGradient id="roomGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1a1a2e" />
                  <stop offset="100%" stopColor="#0f0f1a" />
                </linearGradient>
              </defs>

              {/* Room */}
              <rect x={50} y={50} width={600} height={350} rx="4" fill="url(#roomGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              {/* Window with view */}
              <rect x={80} y={80} width={250} height={180} rx="2" fill="#0c1220" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              {/* Harbour view through window */}
              <rect x={85} y={85} width={240} height={170} rx="1" fill="#0a1628" />
              <circle cx="200" cy="150" r="25" fill="#1a2040" opacity="0.5" />
              <circle cx="280" cy="130" r="15" fill="#152035" opacity="0.4" />
              {/* City lights */}
              {Array.from({ length: 20 }).map((_, i) => (
                <rect key={i} x={90 + (i % 10) * 23} y={100 + Math.floor(i / 10) * 40} width="4" height="6" rx="1"
                  fill={`rgba(255,220,150,${0.1 + (i % 3) * 0.05})`} />
              ))}

              {/* Interior furniture */}
              <rect x={380} y={200} width={200} height="8" rx="2" fill="#2a2520" />
              <rect x={400} y={150} width="60" height="50" rx="2" fill="#252020" />
              <rect x={80} y={300} width={500} height="60" rx="2" fill="#1e1a18" />

              {/* Cursor pointers for participants */}
              <g>
                <text x={320} y={220} fill="#f59e0b" fontSize="8" fontFamily="Inter">Sarah</text>
                <polygon points="315,225 320,235 310,235" fill="#f59e0b" opacity="0.7" />
              </g>
              <g>
                <text x={450} y={180} fill="#3b82f6" fontSize="8" fontFamily="Inter">Mum</text>
                <polygon points="445,185 450,195 440,195" fill="#3b82f6" opacity="0.7" />
              </g>
              <g>
                <text x={200} y={340} fill="#10b981" fontSize="8" fontFamily="Inter">Partner</text>
                <polygon points="195,345 200,355 190,355" fill="#10b981" opacity="0.7" />
              </g>

              {/* Labels */}
              <text x={350} y={70} fill="rgba(255,255,255,0.2)" fontSize="11" textAnchor="middle" fontFamily="Inter">Unit A1402 — Living Room</text>
              <text x={350} y={400} fill="rgba(255,255,255,0.1)" fontSize="9" textAnchor="middle" fontFamily="Inter">Harbour view · North East facing · 42m elevation</text>
            </svg>

            {/* Session overlay */}
            <div className="absolute top-4 left-4 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-xl border border-white/[0.06] px-3 py-2">
              <p className="text-[9px] text-white/20">Shared View</p>
              <p className="text-[11px] text-white/50 font-medium">Unit A1402 — Balcony</p>
            </div>

            {/* Driver indicator */}
            <div className="absolute top-4 right-4 bg-[#0A0A0A]/70 backdrop-blur-xl rounded-xl border border-white/[0.06] px-3 py-2 flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <p className="text-[9px] text-white/20">Driver</p>
                <p className="text-[10px] text-white/50">James</p>
              </div>
            </div>

            {/* Chat toggle */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#0A0A0A]/80 backdrop-blur border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.05] transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-white/40" />
            </button>

            {/* Chat overlay */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-16 right-4 w-72 bg-[#141414] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-white/[0.04] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-white/60">Session Chat</span>
                    <button onClick={() => setChatOpen(false)} className="text-white/20 hover:text-white/40"><X className="w-3 h-3" /></button>
                  </div>
                  <div className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
                    {messages.map((m, i) => (
                      <div key={i}>
                        <span className="text-[9px] font-medium" style={{ color: m.color }}>{m.user}</span>
                        <p className="text-[10px] text-white/40">{m.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-white/[0.04] flex gap-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/[0.04] rounded-lg px-2 py-1.5 text-[10px] text-white/50 placeholder:text-white/15 outline-none"
                    />
                    <button onClick={sendMessage} className="px-2 py-1.5 rounded-lg bg-white/[0.06] text-white/30 hover:bg-white/[0.1]">
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="w-[240px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto flex-shrink-0">
            <div className="p-4">
              {/* Participants */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Participants</p>
              <div className="space-y-2 mb-5">
                {PARTICIPANTS.map(p => (
                  <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02]">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white/70" style={{ background: `${p.color}20` }}>
                        {p.name.charAt(0)}
                      </div>
                      {p.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A0A0A]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] text-white/50 font-medium truncate">{p.name}</p>
                        {p.role === "driver" && <Crown className="w-2.5 h-2.5 text-amber-400" />}
                      </div>
                      <p className="text-[8px] text-white/15 truncate">{p.location}</p>
                    </div>
                    {p.device === "desktop" ? <Monitor className="w-3 h-3 text-white/10" /> : <Smartphone className="w-3 h-3 text-white/10" />}
                  </div>
                ))}
              </div>

              {/* Invite */}
              <button
                onClick={() => setShowInvite(!showInvite)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.04] text-white/30 text-[10px] hover:bg-white/[0.08] transition-colors mb-5"
              >
                <Link2 className="w-3 h-3" /> Copy Invite Link
              </button>

              {/* Activity log */}
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Activity</p>
              <div className="space-y-2">
                {ACTIVITY_LOG.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/10 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] text-white/30"><span className="text-white/40">{log.user}</span> {log.action}</p>
                      <p className="text-[8px] text-white/15">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-4 p-2.5 rounded-lg bg-indigo-500/[0.04] border border-indigo-500/10">
                <p className="text-[9px] text-white/20 leading-relaxed">
                  Voice via WhatsApp call recommended. Synced view + cursors is the magic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
