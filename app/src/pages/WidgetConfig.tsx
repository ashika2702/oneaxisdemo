import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Eye, Check, Copy, Globe, MapPin, Home, Info, Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const FEATURES = [
  { id: "gallery", label: "Photo Gallery", desc: "Project images and renders" },
  { id: "floorplans", label: "Floor Plans", desc: "Interactive unit layouts" },
  { id: "pricing", label: "Pricing", desc: "Unit prices and availability" },
  { id: "amenities", label: "Amenities", desc: "Nearby facilities map" },
  { id: "virtualtour", label: "Virtual Tour", desc: "360° walkthrough" },
  { id: "brochure", label: "Brochure Download", desc: "PDF project brochure" },
  { id: "enquiry", label: "Enquiry Form", desc: "Lead capture form" },
  { id: "whatsapp", label: "WhatsApp Chat", desc: "Direct WhatsApp button" },
] as const;

const AMENITY_CATS = [
  { id: "transport", label: "Transport", items: ["Train Station", "Bus Stop", "Ferry", "Airport"] },
  { id: "education", label: "Education", items: ["Primary School", "High School", "University", "Childcare"] },
  { id: "health", label: "Health", items: ["Hospital", "Medical Centre", "Pharmacy", "Dental"] },
  { id: "lifestyle", label: "Lifestyle", items: ["Shopping Centre", "Restaurant", "Cafe", "Gym", "Park"] },
] as const;

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
      <Info className="w-3 h-3" />Connected to live backend
    </span>
  );
}

export default function WidgetConfig() {
  const [projectId, setProjectId] = useState<number>(1);
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set(["gallery", "pricing", "amenities", "enquiry", "whatsapp"]));
  const [enabledAmenities, setEnabledAmenities] = useState<Set<string>>(new Set(["Train Station", "Shopping Centre", "Park", "Cafe"]));
  const [primaryColor, setPrimaryColor] = useState("#6b7280");
  const [theme, setTheme] = useState("auto");
  const [autoOpen, setAutoOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hi! Interested in this property? Ask me anything or book a viewing.");
  const [copied, setCopied] = useState(false);

  const widgetQuery = trpc.widget.get.useQuery({ projectId });
  const utils = trpc.useUtils();
  const upsert = trpc.widget.upsert.useMutation({
    onSuccess: () => utils.widget.get.invalidate(),
  });

  useEffect(() => {
    if (widgetQuery.data) {
      const f = widgetQuery.data.features as any;
      const a = widgetQuery.data.amenities as any;
      if (f?.enabled) setEnabledFeatures(new Set(f.enabled));
      if (a?.enabled) setEnabledAmenities(new Set(a.enabled));
      if (widgetQuery.data.primaryColor) setPrimaryColor(widgetQuery.data.primaryColor);
      if (widgetQuery.data.theme) setTheme(widgetQuery.data.theme);
      if (widgetQuery.data.autoOpen !== null) setAutoOpen(widgetQuery.data.autoOpen);
      if (widgetQuery.data.greetingMessage) setGreeting(widgetQuery.data.greetingMessage);
    }
  }, [widgetQuery.data]);

  const toggleFeature = (id: string) => {
    const next = new Set(enabledFeatures);
    next.has(id) ? next.delete(id) : next.add(id);
    setEnabledFeatures(next);
  };

  const toggleAmenity = (item: string) => {
    const next = new Set(enabledAmenities);
    next.has(item) ? next.delete(item) : next.add(item);
    setEnabledAmenities(next);
  };

  const handleSave = () => {
    upsert.mutate({
      projectId,
      features: { enabled: Array.from(enabledFeatures) },
      amenities: { enabled: Array.from(enabledAmenities), categories: AMENITY_CATS.map(c => c.id) },
      primaryColor,
      theme: theme as any,
      autoOpen,
      greetingMessage: greeting,
      displayOptions: { showHeader: true, showFooter: true },
      leadFormFields: ["name", "email", "phone", "message"],
    });
  };

  const embedCode = widgetQuery.data?.embedCode || `<!-- Add before </head> -->\n<script src="https://oneaxis.live/widget.js?pid=${projectId}" async data-color="${primaryColor}"></script>`;

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Code className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Widget Config</h1>
              <p className="text-[10px] text-white/25">Configure embed widget for partner sites</p>
            </div>
          </div>
          <DemoBadge />
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Config Panel */}
          <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
            <div className="max-w-lg space-y-6">
              {/* Theme */}
              <div>
                <label className="text-[11px] text-white/40 mb-2 block">Theme & Color</label>
                <div className="flex gap-2 mb-3">
                  {["light", "dark", "auto"].map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      className={`px-3 h-8 rounded-lg border text-[11px] capitalize transition-all ${theme === t ? "border-[#6b7280]/30 bg-[#6b7280]/5 text-white/80" : "border-white/[0.04] text-white/30 hover:bg-white/[0.02]"}`}>{t}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
                  <span className="text-[11px] text-white/40 font-mono">{primaryColor}</span>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="text-[11px] text-white/40 mb-2 block">Widget Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {FEATURES.map(f => (
                    <button key={f.id} onClick={() => toggleFeature(f.id)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        enabledFeatures.has(f.id) ? "border-[#6b7280]/20 bg-[#6b7280]/[0.03]" : "border-white/[0.03] bg-white/[0.01] opacity-50"
                      }`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${enabledFeatures.has(f.id) ? "bg-[#6b7280] border-[#6b7280]" : "border-white/20"}`}>
                        {enabledFeatures.has(f.id) && <Check className="w-3 h-3 text-[#0A0A0A]" />}
                      </div>
                      <div><p className="text-[11px] font-medium text-white/70">{f.label}</p><p className="text-[9px] text-white/25">{f.desc}</p></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-[11px] text-white/40 mb-2 block">Nearby Amenities to Show</label>
                <div className="space-y-3">
                  {AMENITY_CATS.map(cat => (
                    <div key={cat.id}>
                      <p className="text-[10px] text-white/30 mb-1.5">{cat.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map(item => (
                          <button key={item} onClick={() => toggleAmenity(item)}
                            className={`px-2.5 py-1 rounded-full text-[10px] transition-all ${
                              enabledAmenities.has(item) ? "bg-[#6b7280]/15 text-[#6b7280] border border-[#6b7280]/20" : "bg-white/[0.02] text-white/25 border border-white/[0.03]"
                            }`}>{item}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Greeting */}
              <div>
                <label className="text-[11px] text-white/40 mb-1.5 block">Welcome Message</label>
                <textarea value={greeting} onChange={e => setGreeting(e.target.value)}
                  className="w-full h-16 rounded-md border border-white/[0.05] bg-white/[0.02] text-white/60 text-[11px] p-2.5 resize-none outline-none"
                  placeholder="Hi! Ask me anything about this property..." />
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setAutoOpen(!autoOpen)}
                    className={`w-8 h-4 rounded-full transition-all ${autoOpen ? "bg-[#6b7280]" : "bg-white/10"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${autoOpen ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-[10px] text-white/30">Auto-open on page load</span>
                </div>
              </div>

              <Button size="sm" className="h-9 text-[12px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30 gap-1.5"
                onClick={handleSave} disabled={upsert.isPending}>
                {upsert.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}Save Configuration
              </Button>
            </div>
          </div>

          {/* Preview + Embed */}
          <div className="w-[340px] border-l border-white/[0.04] bg-white/[0.01] flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-5 h-10 border-b border-white/[0.03] flex-shrink-0">
              <Eye className="w-3.5 h-3.5 text-white/20" /><span className="text-[11px] text-white/40">Preview</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {/* Widget Preview */}
              <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ borderColor: primaryColor + "30" }}>
                <div className="h-8 flex items-center px-3" style={{ backgroundColor: primaryColor + "15" }}>
                  <Home className="w-3 h-3 mr-1.5" style={{ color: primaryColor }} /><span className="text-[10px] font-medium" style={{ color: primaryColor }}>Azure Heights</span>
                </div>
                <div className="p-3 space-y-2">
                  {enabledFeatures.has("gallery") && <div className="h-16 rounded bg-white/[0.03] flex items-center justify-center"><span className="text-[8px] text-white/15">Gallery</span></div>}
                  {enabledFeatures.has("pricing") && <div className="flex items-center justify-between py-1"><span className="text-[9px] text-white/30">From</span><span className="text-[11px] text-emerald-400 font-medium">$650,000</span></div>}
                  {enabledFeatures.has("amenities") && (
                    <div className="flex flex-wrap gap-1">
                      {Array.from(enabledAmenities).slice(0, 4).map(a => <span key={a} className="px-1.5 py-[1px] rounded text-[8px] bg-white/[0.03] text-white/25">{a}</span>)}
                    </div>
                  )}
                  {enabledFeatures.has("enquiry") && <button className="w-full h-6 rounded text-[9px] font-medium text-[#0A0A0A]" style={{ backgroundColor: primaryColor }}>Enquire Now</button>}
                  {enabledFeatures.has("whatsapp") && <button className="w-full h-6 rounded bg-[#25D366]/10 text-[#25D366] text-[9px] font-medium">Chat on WhatsApp</button>}
                </div>
              </div>

              {/* Embed Code */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/20 uppercase tracking-wider">Embed Code</span>
                  <button onClick={() => { navigator.clipboard?.writeText(embedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="text-[9px] text-white/30 hover:text-white/60 flex items-center gap-1">
                    {copied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-[#0A0A0A] border border-white/[0.04] text-[9px] text-white/30 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">{embedCode}</pre>
              </div>

              {/* Stats */}
              {widgetQuery.data && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Views", value: widgetQuery.data.impressions || 0 },
                    { label: "Clicks", value: widgetQuery.data.clicks || 0 },
                    { label: "Leads", value: widgetQuery.data.leadsCaptured || 0 },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                      <p className="text-[13px] font-bold text-white/70">{s.value}</p>
                      <p className="text-[8px] text-white/20">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
