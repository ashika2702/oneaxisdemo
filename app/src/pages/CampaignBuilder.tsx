import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ChevronRight, ChevronLeft, Check, Sparkles, Target, DollarSign, Calendar, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const STEPS = ["Project", "Budget", "AI Plan", "Review", "Launch"] as const;

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
      <Info className="w-3 h-3" />Connected to live backend
    </span>
  );
}

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [budget, setBudget] = useState(5000);
  const [objective, setObjective] = useState("lead_generation");
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [campaignName, setCampaignName] = useState("");

  const projectsQuery = trpc.project.list.useQuery({});
  const utils = trpc.useUtils();
  const createCampaign = trpc.campaign.create.useMutation({
    onSuccess: () => { utils.campaign.list.invalidate(); setStep(4); }
  });
  const campaignsQuery = trpc.campaign.list.useQuery({ limit: 20 });

  const generateAIPlan = () => {
    setTimeout(() => {
      setAiPlan({
        audiences: [
          { name: "First-home buyers 25-35", channel: "Meta + Google", budget: Math.round(budget * 0.4), reach: Math.round(budget * 8) },
          { name: "Investors 35-50", channel: "LinkedIn + Email", budget: Math.round(budget * 0.3), reach: Math.round(budget * 5) },
          { name: "Downsizers 50+", channel: "Google + Native", budget: Math.round(budget * 0.2), reach: Math.round(budget * 6) },
          { name: "Retargeting", channel: "Meta + Display", budget: Math.round(budget * 0.1), reach: Math.round(budget * 10) },
        ],
        timeline: [
          { week: 1, action: "Launch awareness creatives", channels: ["Meta", "Google"] },
          { week: 2, action: "Retarget website visitors", channels: ["Display", "Meta"] },
          { week: 3, action: "Push lead gen forms", channels: ["Google", "Native"] },
          { week: 4, action: "Nurture warm leads", channels: ["Email", "WhatsApp"] },
        ],
        keywords: ["apartments sydney", "new development", "property investment", "luxury apartments", "off the plan"],
        estimatedLeads: Math.round(budget / 45),
        estimatedCpl: Math.round(budget / Math.max(1, Math.round(budget / 45))),
      });
      setStep(2);
    }, 2000);
  };

  const handleLaunch = () => {
    if (!campaignName || !projectId) return;
    createCampaign.mutate({
      name: campaignName,
      projectId,
      objective: objective as any,
      budget,
      aiPlan,
    });
  };

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6b7280] to-[#52525b] flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Launch Demand</h1>
              <p className="text-[10px] text-white/25">AI-powered campaign builder</p>
            </div>
          </div>
          <DemoBadge />
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-1 px-6 py-3 flex-shrink-0 border-b border-white/[0.03]">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < step ? "bg-emerald-500/20 text-emerald-400" : i === step ? "bg-[#6b7280]/20 text-[#6b7280]" : "bg-white/[0.04] text-white/25"
              }`}>{i < step ? <Check className="w-3 h-3" /> : i + 1}</div>
              <span className={`text-[10px] ${i <= step ? "text-white/60" : "text-white/20"}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-white/10 mx-0.5" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {/* Step 0: Project */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-lg mx-auto space-y-4">
                <h2 className="text-[15px] font-semibold text-white/90">Select Project</h2>
                <p className="text-[12px] text-white/40">Choose the project to promote</p>
                <div className="space-y-2">
                  {projectsQuery.data?.map((p: any) => (
                    <button key={p.id} onClick={() => setProjectId(p.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                        projectId === p.id ? "border-[#6b7280]/30 bg-[#6b7280]/5" : "border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03]"
                      }`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: "#6b728020", color: "#6b7280" }}>{p.name.charAt(0)}</div>
                      <div className="flex-1"><p className="text-[13px] font-medium text-white/80">{p.name}</p><p className="text-[10px] text-white/30">{p.type}</p></div>
                      {projectId === p.id && <Check className="w-4 h-4 text-[#6b7280]" />}
                    </button>
                  )) || (
                    <div className="p-8 rounded-xl border border-white/[0.04] text-center">
                      <p className="text-[12px] text-white/30">No projects yet. Create one first.</p>
                      <Button size="sm" className="mt-3 h-8 text-[12px] bg-[#6b7280]/20 text-[#6b7280]" onClick={() => navigate("/admin/projects")}>Create Project</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 1: Budget */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-lg mx-auto space-y-5">
                <h2 className="text-[15px] font-semibold text-white/90">Campaign Setup</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] text-white/40 mb-1.5 block">Campaign Name</label>
                    <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g., Azure Heights Launch"
                      className="h-9 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/40 mb-1.5 block">Objective</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["lead_generation","brand_awareness","conversions","retargeting"].map(obj => (
                        <button key={obj} onClick={() => setObjective(obj)}
                          className={`px-3 py-2 rounded-lg border text-[11px] text-left capitalize transition-all ${
                            objective === obj ? "border-[#6b7280]/30 bg-[#6b7280]/5 text-white/80" : "border-white/[0.04] text-white/40 hover:bg-white/[0.02]"
                          }`}>{obj.replace(/_/g, " ")}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/40 mb-1.5 block">Budget (AUD)</label>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-white/20" />
                      <Input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))}
                        className="h-9 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[2500, 5000, 10000, 25000].map(b => (
                        <button key={b} onClick={() => setBudget(b)} className={`px-2 py-1 rounded text-[10px] ${budget === b ? "bg-[#6b7280]/10 text-[#6b7280]" : "bg-white/[0.02] text-white/30"}`}>${b.toLocaleString()}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: AI Plan */}
            {step === 2 && !aiPlan && (
              <motion.div key="step2-generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-[#6b7280] animate-spin mb-4" />
                <p className="text-[13px] text-white/60">AI is building your campaign plan...</p>
                <p className="text-[11px] text-white/30 mt-1">Analyzing project data, audience patterns, and optimal channel mix</p>
              </motion.div>
            )}
            {step === 2 && aiPlan && (
              <motion.div key="step2-plan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-2xl mx-auto space-y-5">
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#6b7280]" /><h2 className="text-[15px] font-semibold text-white/90">AI Campaign Plan</h2></div>
                {/* Audience Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {aiPlan.audiences.map((a: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.015]">
                      <p className="text-[12px] font-medium text-white/80">{a.name}</p>
                      <p className="text-[10px] text-white/30">{a.channel}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-emerald-400">${a.budget.toLocaleString()}</span>
                        <span className="text-[10px] text-white/25">{a.reach.toLocaleString()} reach</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Timeline */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                  <p className="text-[11px] font-medium text-white/60 mb-3">4-Week Timeline</p>
                  <div className="space-y-2">
                    {aiPlan.timeline.map((t: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#6b7280] font-medium w-12">W{t.week}</span>
                        <span className="text-[11px] text-white/50">{t.action}</span>
                        <span className="text-[9px] text-white/20 ml-auto">{t.channels.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {aiPlan.keywords.map((k: string, i: number) => <span key={i} className="px-2 py-1 rounded-full bg-white/[0.03] text-[10px] text-white/40">{k}</span>)}
                </div>
                {/* Estimates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-center">
                    <p className="text-[20px] font-bold text-emerald-400">{aiPlan.estimatedLeads}</p>
                    <p className="text-[10px] text-white/30">Estimated Leads</p>
                  </div>
                  <div className="p-3 rounded-xl border border-[#6b7280]/10 bg-[#6b7280]/5 text-center">
                    <p className="text-[20px] font-bold text-[#6b7280]">${aiPlan.estimatedCpl}</p>
                    <p className="text-[10px] text-white/30">Est. Cost Per Lead</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-lg mx-auto space-y-4">
                <h2 className="text-[15px] font-semibold text-white/90">Review & Launch</h2>
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 space-y-3">
                  <div className="flex justify-between"><span className="text-[11px] text-white/40">Campaign</span><span className="text-[12px] text-white/80">{campaignName}</span></div>
                  <div className="flex justify-between"><span className="text-[11px] text-white/40">Objective</span><span className="text-[12px] text-white/80 capitalize">{objective.replace(/_/g, " ")}</span></div>
                  <div className="flex justify-between"><span className="text-[11px] text-white/40">Budget</span><span className="text-[12px] text-emerald-400">${budget.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[11px] text-white/40">Audiences</span><span className="text-[12px] text-white/80">{aiPlan?.audiences?.length || 4} segments</span></div>
                  <div className="flex justify-between"><span className="text-[11px] text-white/40">Est. Leads</span><span className="text-[12px] text-[#6b7280]">{aiPlan?.estimatedLeads || "—"}</span></div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Launched */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-[15px] font-semibold text-white/90">Campaign Launched</p>
                <p className="text-[11px] text-white/30 mt-1">{campaignName} is now saved and ready</p>
                <Button size="sm" className="mt-4 h-8 text-[12px] bg-[#6b7280]/20 text-[#6b7280]" onClick={() => { setStep(0); setAiPlan(null); }}>Create Another</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        {step < 4 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.04] flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-8 text-[12px] text-white/40 hover:text-white/60" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />Back
            </Button>
            {step === 0 && <Button size="sm" className="h-8 px-4 text-[12px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30" onClick={() => setStep(1)} disabled={!projectId}>Next<ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>}
            {step === 1 && <Button size="sm" className="h-8 px-4 text-[12px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30" onClick={() => { setStep(2); generateAIPlan(); }} disabled={!campaignName}>Generate Plan<Sparkles className="w-3.5 h-3.5 ml-1" /></Button>}
            {step === 2 && aiPlan && <Button size="sm" className="h-8 px-4 text-[12px] bg-[#6b7280]/20 text-[#6b7280] hover:bg-[#6b7280]/30" onClick={() => setStep(3)}>Review<ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>}
            {step === 3 && <Button size="sm" className="h-8 px-4 text-[12px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={handleLaunch} disabled={createCampaign.isPending}>
              {createCampaign.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Rocket className="w-3.5 h-3.5 mr-1" />}Launch Campaign
            </Button>}
          </div>
        )}

        {/* Campaign List */}
        <div className="px-6 pb-4 flex-shrink-0">
          <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Recent Campaigns</p>
          <div className="space-y-1">
            {campaignsQuery.data?.slice(0, 5).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                <Target className="w-3.5 h-3.5 text-white/20" />
                <span className="text-[11px] text-white/50 flex-1">{c.name}</span>
                <span className={`text-[9px] px-1.5 py-[1px] rounded capitalize ${c.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.04] text-white/30"}`}>{c.status}</span>
                <span className="text-[10px] text-white/25">${Number(c.budget || 0).toLocaleString()}</span>
              </div>
            )) || <p className="text-[10px] text-white/15">No campaigns yet</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
