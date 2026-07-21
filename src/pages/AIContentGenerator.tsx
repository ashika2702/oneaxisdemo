import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Sparkles, FileText, Share2,
  Mail, Globe, Copy, Check, RefreshCw,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

/* ────────────────────────────────────────────────
   AI CONTENT GENERATOR
   Auto-generates marketing content from project data:
   listing descriptions, social media posts, email
   campaigns, press releases in multiple languages.
   Saves $20K-$50K per project in marketing costs.
   ──────────────────────────────────────────── */

type ContentType = 'listing' | 'social' | 'email' | 'press' | 'investor';

interface GeneratedContent {
  type: ContentType;
  title: string;
  content: string;
  language: string;
  tone: string;
}

const contentTemplates: Record<ContentType, { label: string; icon: React.ReactNode; desc: string }> = {
  listing: { label: 'Listing Description', icon: <FileText className="w-4 h-4" />, desc: 'Property portal listing with key selling points' },
  social: { label: 'Social Media Post', icon: <Share2 className="w-4 h-4" />, desc: 'Instagram/Facebook/LinkedIn post with hashtags' },
  email: { label: 'Email Campaign', icon: <Mail className="w-4 h-4" />, desc: 'Personalized email for buyer segments' },
  press: { label: 'Press Release', icon: <Globe className="w-4 h-4" />, desc: 'Project launch announcement for media' },
  investor: { label: 'Investor Memo', icon: <FileText className="w-4 h-4" />, desc: 'ROI-focused memo for institutional investors' },
};

export default function AIContentGenerator() {
  const navigate = useNavigate();
  const { projects } = useStore();
  const project = projects[0];

  const [activeType, setActiveType] = useState<ContentType>('listing');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [tone, setTone] = useState<'professional' | 'luxury' | 'urgent'>('luxury');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const contents: Record<string, Record<string, string>> = {
        listing: {
          en: `**${project?.name}** — Where skyline meets shoreline.\n\nDiscover an exclusive collection of ${project?.units.length} residences ranging from studios to 3-bedroom penthouses, with panoramic views of the Marina and city skyline.\n\n**Key Features:**\n• Premium finishes throughout\n• Floor-to-ceiling windows with panoramic views\n• Smart home technology\n• Resort-style amenities\n• Prime location with excellent connectivity\n\n**Starting from $425,000** — Limited units available. Schedule your private viewing today.`,
          ar: `**${project?.name}** — حيث يلتقي الأفق بالشاطئ.\n\nاكتشف مجموعة حصرية من ${project?.units.length} residence تتراوح من استوديوهات إلى بنتهاوس بغرفة نوم، مع إطلالات بانورامية على المارينا وأفق المدينة.\n\n**المميزات الرئيسية:**\n• تشطيبات فاخرة في جميع أنحاء الوحدة\n• نوافذ من الأرض إلى السقف\n• تقنية المنزل الذكي\n• مرافق على طراز المنتجع\n• موقع متميز\n\n**الأسعار تبدأ من 425,000 درهم** — وحدات محدودة.`,
        },
        social: {
          en: `✨ ${project?.name} — Your new address in the sky\n\nSwipe to explore our stunning 3D virtual tour. Every unit, every view, every detail — experience it all before breaking ground.\n\n🏙 ${project?.units.length} luxury residences\n💰 From $425K\n🌊 Marina views\n📍 Prime location\n\nLink in bio to explore →\n\n#DubaiRealEstate #LuxuryLiving #${project?.name?.replace(/\s/g, '')} #OffPlan #MarinaViews #PropertyInvestment #DubaiLife`,
          ar: `✨ ${project?.name} — عنوانك الجديد في السماء\n\nتصفح جولتنا الافتراضية ثلاثية الأبعاد المذهلة. كل وحدة، كل إطلالة، كل تفصيل — جربها جميعاً قبل البدء في البناء.\n\n#عقارات_دبي #فخامة_معيشة #استثمار_عقاري`,
        },
        email: {
          en: `Subject: Private Preview: ${project?.name} — Marina Residences\n\nDear [First Name],\n\nAs a valued client, you are invited to an exclusive first look at ${project?.name}, our newest development offering unparalleled Marina views and world-class amenities.\n\n**What makes this special:**\n• Early-bird pricing (save up to 15%)\n• Choose from the best units before public launch\n• Interactive 3D tour — explore every floor\n• Personalized unit comparison tool\n\n[VIEW 3D TOUR — BUTTON]\n\nOur sales team is standing by to answer any questions via WhatsApp or call.\n\nBest regards,\nThe ${project?.name} Team`,
          ar: `الموضوع: معاينة خاصة: ${project?.name}\n\nعزيزي [الاسم]،\n\nنحن ندعوك لحضور نظرة أولى حصرية على ${project?.name}.\n\n**ما الذي يجعل هذا مميزاً:**\n• أسعار الطيور المبكرة\n• اختر من أفضل الوحدات قبل الإطلاق العام\n• جولة ثلاثية الأبعاد تفاعلية\n\n[عرض الجولة ثلاثية الأبعاد]`,
        },
        press: {
          en: `**FOR IMMEDIATE RELEASE**\n\n${project?.name} Launches in Dubai Marina — ${project?.units.length} Luxury Residences with Interactive 3D Experience\n\nDUBAI, UAE — [Date] — [Developer Name] announces the launch of ${project?.name}, a landmark residential tower in Dubai Marina featuring ${project?.units.length} meticulously designed units ranging from studios to 3-bedroom penthouses.\n\nThe project introduces an industry-first interactive 3D sales experience powered by OneAxis, allowing buyers to explore every unit, view, and floor plan virtually before construction begins.\n\n**Pricing starts from AED 1.56 million ($425,000).**\n\nFor media inquiries:\n[Contact Name] | [Email] | [Phone]`,
          ar: `**للنشر الفوري**\n\nإطلاق ${project?.name} في دبي مارينا — ${project?.units.length} residence فاخرة مع تجربة ثلاثية الأبعاد تفاعلية`,
        },
        investor: {
          en: `${project?.name} — Investment Memorandum\n\n**Executive Summary**\n• Total units: ${project?.units.length}\n• Estimated GDV: $${((project?.units.reduce((a,u)=>a+u.price,0))/1000000).toFixed(1)}M\n• Starting price: $425K\n• Target IRR: 18-22%\n• Construction start: Q3 2025\n• Handover: Q4 2027\n\n**Market Position**\nLocated in prime Dubai Marina with direct Marina views. Comparable projects achieved 25-35% capital appreciation during construction phase.\n\n**Sales Velocity Projection**\nBased on OneAxis AI analysis of comparable launches:\n• Month 1-3: 30% sold (early-bird phase)\n• Month 4-6: 55% sold (public launch)\n• Month 7-12: 85% sold (construction progress)\n\n**Risk Factors & Mitigation**\n[Detailed analysis included in full memo]`,
          ar: `${project?.name} — مذكرة استثمار`,
        },
      };

      setGenerated({
        type: activeType,
        title: contentTemplates[activeType].label,
        content: contents[activeType]?.[language] || contents[activeType]?.en || '',
        language,
        tone,
      });
    }, 1500);
  };

  const handleCopy = () => {
    if (generated) navigator.clipboard.writeText(generated.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Sparkles className="w-5 h-5" /></div>
            <div>
              <h1 className="text-lg font-bold">AI Content Generator</h1>
              <p className="text-gray-500 text-xs">Generate marketing content from your project data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Content Type Selection */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {(Object.entries(contentTemplates) as [ContentType, typeof contentTemplates.listing][]).map(([key, tmpl]) => (
            <button
              key={key}
              onClick={() => { setActiveType(key); setGenerated(null); }}
              className={`p-3 rounded-xl border text-center transition-all ${
                activeType === key ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className={`mx-auto mb-1 ${activeType === key ? 'text-purple-400' : 'text-gray-500'}`}>{tmpl.icon}</div>
              <div className={`text-[10px] font-medium ${activeType === key ? 'text-white' : 'text-gray-400'}`}>{tmpl.label}</div>
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Language</label>
              <div className="flex gap-1">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 rounded-lg text-xs ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>English</button>
                <button onClick={() => setLanguage('ar')} className={`px-3 py-1.5 rounded-lg text-xs ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>العربية</button>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Tone</label>
              <div className="flex gap-1">
                {(['luxury', 'professional', 'urgent'] as const).map((t) => (
                  <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${tone === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-500" onClick={handleGenerate} disabled={generating}>
                {generating ? <><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Generating...</> : <><Sparkles className="w-3 h-3 mr-1" /> Generate</>}
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Content */}
        {generated && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold">{generated.title}</span>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{generated.language.toUpperCase()}</span>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded capitalize">{generated.tone}</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400" onClick={handleCopy}>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400">
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="p-4 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed" dir={generated.language === 'ar' ? 'rtl' : 'ltr'}>
              {generated.content}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Content Pieces', value: '24', desc: 'Generated this month' },
            { label: 'Time Saved', value: '18 hrs', desc: 'vs manual writing' },
            { label: 'Cost Saved', value: '$3,200', desc: 'vs copywriter fees' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-purple-400">{s.value}</div>
              <div className="text-[10px] text-gray-500">{s.label}</div>
              <div className="text-[9px] text-gray-600">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
