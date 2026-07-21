import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Copy, CheckCheck, Sparkles, Eye, Globe, MessageSquare, Smartphone, Wand2, Check, Info, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const PLATFORMS = [
  { id: "google", label: "Google Ads", icon: Globe, color: "#4285F4" },
  { id: "meta", label: "Meta", icon: MessageSquare, color: "#1877F2" },
  { id: "whatsapp", label: "WhatsApp", icon: Smartphone, color: "#25D366" },
  { id: "native", label: "Native", icon: Eye, color: "#FF6B35" },
] as const;

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
      <Info className="w-3 h-3" />Connected to live backend
    </span>
  );
}

export default function AdEditor() {
  const [platform, setPlatform] = useState<string>("google");
  const [headline, setHeadline] = useState("Luxury Apartments in Sydney CBD");
  const [description, setDescription] = useState("Starting from $650,000. Limited units available. Book your private viewing today.");
  const [cta, setCta] = useState("Book Viewing");
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [destUrl, setDestUrl] = useState("https://stedaxis.com/azure-heights");

  const creativesQuery = trpc.campaign.creatives.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const createCreative = trpc.campaign.createCreative.useMutation({
    onSuccess: () => { utils.campaign.creatives.invalidate(); setName(""); }
  });

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${headline}\n${description}\n${cta}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!name) return;
    createCreative.mutate({
      platform: platform as any,
      name,
      headline,
      description,
      ctaText: cta,
      destinationUrl: destUrl,
    });
  };

  const platformConfig = PLATFORMS.find(p => p.id === platform);

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Megaphone className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Ad Studio</h1>
              <p className="text-[10px] text-white/25">Create and edit ads for any platform</p>
            </div>
          </div>
          <DemoBadge />
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Platform Tabs */}
            <div className="flex items-center gap-2 mb-5">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={`flex items-center gap-2 px-4 h-[34px] rounded-lg border text-[12px] transition-all ${
                    platform === p.id ? "border-white/[0.08] bg-white/[0.04] text-white/80" : "border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
                  }`}>
                  <p.icon className="w-3.5 h-3.5" style={{ color: platform === p.id ? p.color : undefined }} />{p.label}
                </button>
              ))}
            </div>

            {/* Ad Form */}
            <div className="max-w-lg space-y-4">
              <div>
                <label className="text-[11px] text-white/40 mb-1 block">Creative Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Azure Heights - Google Headline 1"
                  className="h-9 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
              </div>
              <div>
                <label className="text-[11px] text-white/40 mb-1 block">Headline</label>
                <Input value={headline} onChange={e => setHeadline(e.target.value)}
                  className="h-9 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" maxLength={platform === "google" ? 30 : 125} />
                <p className="text-[9px] text-white/20 mt-0.5 text-right">{headline.length}/{platform === "google" ? 30 : 125}</p>
              </div>
              <div>
                <label className="text-[11px] text-white/40 mb-1 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full h-20 rounded-md border border-white/[0.05] bg-white/[0.02] text-white/70 text-[12px] p-2.5 resize-none outline-none focus:border-white/[0.1]"
                  maxLength={platform === "google" ? 90 : 220} />
                <p className="text-[9px] text-white/20 mt-0.5 text-right">{description.length}/{platform === "google" ? 90 : 220}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/40 mb-1 block">CTA Button</label>
                  <Input value={cta} onChange={e => setCta(e.target.value)} className="h-9 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
                </div>
                <div>
                  <label className="text-[11px] text-white/40 mb-1 block">Destination URL</label>
                  <Input value={destUrl} onChange={e => setDestUrl(e.target.value)} className="h-9 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="h-8 text-[12px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30 gap-1.5" onClick={handleSave} disabled={!name || createCreative.isPending}>
                  {createCreative.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}Save Creative
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-[12px] text-white/40 gap-1.5" onClick={handleCopy}>
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="w-[360px] border-l border-white/[0.04] bg-white/[0.01] flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-5 h-10 border-b border-white/[0.03] flex-shrink-0">
              <Eye className="w-3.5 h-3.5 text-white/20" /><span className="text-[11px] text-white/40">Preview</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                <motion.div key={platform} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  {platform === "google" && (
                    <div className="space-y-1">
                      <p className="text-[8px] text-[#1a0dab] leading-tight">Ad</p>
                      <p className="text-[13px] text-[#1a0dab] font-medium leading-tight">{headline}</p>
                      <p className="text-[10px] text-[#006621] leading-tight">{destUrl}</p>
                      <p className="text-[11px] text-[#4d5156] leading-snug mt-1">{description}</p>
                    </div>
                  )}
                  {platform === "meta" && (
                    <div className="rounded-lg border border-white/[0.06] overflow-hidden">
                      <div className="h-24 bg-gradient-to-br from-[#6b7280]/20 to-[#52525b]/10 flex items-center justify-center"><span className="text-[10px] text-white/20">Project Image</span></div>
                      <div className="p-3 space-y-1">
                        <p className="text-[10px] text-white/20">stedaxis.com</p>
                        <p className="text-[12px] text-white/80 font-medium">{headline}</p>
                        <p className="text-[10px] text-white/40">{description}</p>
                        <button className="w-full mt-2 h-7 rounded bg-white/[0.06] text-[10px] text-white/50 font-medium">{cta}</button>
                      </div>
                    </div>
                  )}
                  {platform === "whatsapp" && (
                    <div className="rounded-2xl bg-[#0B141B] border border-white/[0.06] p-4 space-y-2 max-w-[280px]">
                      <p className="text-[10px] text-white/20">Sponsored</p>
                      <div className="h-20 rounded-lg bg-gradient-to-br from-[#6b7280]/20 to-[#52525b]/10 flex items-center justify-center"><span className="text-[10px] text-white/20">Image</span></div>
                      <p className="text-[12px] text-white/80 font-medium">{headline}</p>
                      <p className="text-[10px] text-white/40">{description}</p>
                      <button className="w-full h-8 rounded-full bg-[#25D366] text-[#0B141B] text-[11px] font-semibold">{cta}</button>
                    </div>
                  )}
                  {platform === "native" && (
                    <div className="rounded-lg border border-white/[0.06] p-3 flex gap-3">
                      <div className="w-16 h-16 rounded bg-gradient-to-br from-[#6b7280]/20 to-[#52525b]/10 flex-shrink-0 flex items-center justify-center"><span className="text-[8px] text-white/20">Img</span></div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-[8px] text-white/20">Sponsored</p>
                        <p className="text-[11px] text-white/80 font-medium truncate">{headline}</p>
                        <p className="text-[9px] text-white/40 line-clamp-2">{description}</p>
                        <p className="text-[9px] text-[#6b7280]">{cta}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Saved Creatives */}
              <div className="mt-6">
                <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Saved Creatives</p>
                <div className="space-y-1.5">
                  {creativesQuery.data?.map((c: any) => (
                    <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: PLATFORMS.find(p => p.id === c.platform)?.color || "#666" }} />
                      <span className="text-[10px] text-white/40 flex-1 truncate">{c.name}</span>
                      <span className={`text-[8px] px-1 rounded capitalize ${c.status === "live" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.04] text-white/30"}`}>{c.status}</span>
                    </div>
                  )) || <p className="text-[9px] text-white/15">No creatives saved yet</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
