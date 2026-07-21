import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Image, Layout, DollarSign, Layers, MapPin,
  Download, Eye, Check, Palette, Type, ChevronRight, X,
  FileOutput, Sparkles, Home, CheckCircle, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrochureSection {
  id: string;
  type: 'cover' | 'overview' | 'exterior' | 'interior' | 'floorplan' | 'pricing' | 'materials' | 'location' | 'contact' | 'finishes' | 'amenities';
  title: string;
  enabled: boolean;
  order: number;
}

interface Props {
  projectName: string;
  projectType: string;
  onClose: () => void;
}

/* ────────────────────────────────────────────────
   BROCHURE EXPORT GENERATOR
   Configure, preview, and download a branded
   property brochure as PDF. Multi-step wizard
   with section selection, styling, preview, and
   download actions.
   ──────────────────────────────────────────── */

const defaultSections: BrochureSection[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', enabled: true, order: 1 },
  { id: 'overview', type: 'overview', title: 'Project Overview', enabled: true, order: 2 },
  { id: 'exterior', type: 'exterior', title: 'Exterior Gallery', enabled: true, order: 3 },
  { id: 'interior', type: 'interior', title: 'Interior Gallery', enabled: true, order: 4 },
  { id: 'floorplan', type: 'floorplan', title: 'Floor Plans', enabled: true, order: 5 },
  { id: 'finishes', type: 'finishes', title: 'Finishes & Materials', enabled: true, order: 6 },
  { id: 'amenities', type: 'amenities', title: 'Amenities', enabled: true, order: 7 },
  { id: 'pricing', type: 'pricing', title: 'Pricing', enabled: false, order: 8 },
  { id: 'location', type: 'location', title: 'Location Map', enabled: true, order: 9 },
  { id: 'contact', type: 'contact', title: 'Contact', enabled: true, order: 10 },
];

const sectionIcons: Record<string, React.ReactNode> = {
  cover: <FileText className="w-4 h-4" />,
  overview: <Eye className="w-4 h-4" />,
  exterior: <Image className="w-4 h-4" />,
  interior: <Home className="w-4 h-4" />,
  floorplan: <Layout className="w-4 h-4" />,
  finishes: <Palette className="w-4 h-4" />,
  amenities: <Sparkles className="w-4 h-4" />,
  pricing: <DollarSign className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
  contact: <Type className="w-4 h-4" />,
};

type WizardStep = 'configure' | 'style' | 'preview' | 'download';

export default function BrochureExport({ projectName, projectType, onClose }: Props) {
  const [step, setStep] = useState<WizardStep>('configure');
  const [sections, setSections] = useState<BrochureSection[]>(defaultSections);
  const [brandColor, setBrandColor] = useState('#1E40AF');
  const [accentColor, setAccentColor] = useState('#D4AF37');
  const [fontStyle, setFontStyle] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [brochureName, setBrochureName] = useState(`${projectName} - Brochure`);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const newArr = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
      return newArr.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const enabledSections = sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const totalPages = enabledSections.length;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep('download');
    }, 2000);
  };

  const fontClass = fontStyle === 'modern' ? 'font-sans' : fontStyle === 'classic' ? 'font-serif' : 'font-mono';

  const steps: { key: WizardStep; label: string }[] = [
    { key: 'configure', label: 'Configure' },
    { key: 'style', label: 'Style' },
    { key: 'preview', label: 'Preview' },
    { key: 'download', label: 'Download' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <FileOutput className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Brochure Export</h3>
            <p className="text-gray-500 text-xs">{totalPages} pages configured</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-6 px-2">
        {steps.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
              step === s.key
                ? 'bg-blue-600 text-white'
                : i < steps.findIndex((x) => x.key === step)
                ? 'bg-blue-600/20 text-blue-400'
                : 'bg-gray-800/50 text-gray-500'
            }`}
          >
            {i < steps.findIndex((x) => x.key === step) && <CheckCircle className="w-3 h-3" />}
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: CONFIGURE ─── */}
          {step === 'configure' && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Brochure Name</label>
                <input
                  value={brochureName}
                  onChange={(e) => setBrochureName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Sections ({enabledSections.length} enabled)</label>
                <div className="space-y-1.5">
                  {sections.sort((a, b) => a.order - b.order).map((section, idx) => (
                    <div
                      key={section.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                        section.enabled
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-900/30 border-gray-800 opacity-50'
                      }`}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          section.enabled
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-600'
                        }`}
                      >
                        {section.enabled && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-gray-500">{sectionIcons[section.type]}</span>
                      <span className="text-sm text-gray-300 flex-1">{section.title}</span>
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-500 hover:text-white disabled:opacity-20"
                        >
                          <ChevronRight className="w-3 h-3 -rotate-90" />
                        </button>
                        <button
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={idx === sections.length - 1}
                          className="p-1 text-gray-500 hover:text-white disabled:opacity-20"
                        >
                          <ChevronRight className="w-3 h-3 rotate-90" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeLogo} onChange={(e) => setIncludeLogo(e.target.checked)} className="accent-blue-500" />
                  <span className="text-sm text-gray-400">Include OneAxis branding</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} className="accent-blue-500" />
                  <span className="text-sm text-gray-400">Add draft watermark</span>
                </label>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-500 mt-4" onClick={() => setStep('style')}>
                Continue to Styling
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 2: STYLE ─── */}
          {step === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Brand Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#1E40AF', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2', '#1F2937'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBrandColor(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        brandColor === c ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Accent Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#D4AF37', '#C0C0C0', '#CD7F32', '#E5E7EB', '#FCD34D', '#A78BFA'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        accentColor === c ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Typography Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'modern' as const, label: 'Modern', sample: 'Aa', desc: 'Clean sans-serif' },
                    { id: 'classic' as const, label: 'Classic', sample: 'Aa', desc: 'Elegant serif' },
                    { id: 'minimal' as const, label: 'Minimal', sample: 'Aa', desc: 'Geometric mono' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontStyle(f.id)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        fontStyle === f.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                      }`}
                    >
                      <span className={`text-xl ${f.id === 'modern' ? 'font-sans' : f.id === 'classic' ? 'font-serif' : 'font-mono'} text-white`}>{f.sample}</span>
                      <div className="text-xs text-gray-400 mt-1">{f.label}</div>
                      <div className="text-[10px] text-gray-500">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setStep('configure')}>
                  Back
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={() => setStep('preview')}>
                  Preview
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: PREVIEW ─── */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Brochure Preview - A4 aspect ratio */}
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700" style={{ aspectRatio: '210/297' }}>
                {/* Cover Page Preview */}
                {enabledSections[0]?.type === 'cover' && (
                  <div className="h-full relative flex flex-col" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 50%, ${accentColor}44 100%)` }}>
                    {watermark && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <span className="text-6xl font-bold text-white -rotate-45">DRAFT</span>
                      </div>
                    )}
                    {includeLogo && (
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-white/20 text-white border-0">OneAxis</Badge>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
                        <Home className="w-12 h-12 text-white" />
                      </div>
                      <h1 className={`text-3xl font-bold text-white mb-2 ${fontClass}`}>{projectName}</h1>
                      <p className="text-white/70 text-sm capitalize">{projectType} Development</p>
                      <div className="mt-6 w-16 h-0.5" style={{ backgroundColor: accentColor }} />
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-white/50 text-xs">Premium Property Brochure</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Page thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {enabledSections.slice(1).map((section) => (
                  <div key={section.id} className="aspect-[210/297] bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center p-2">
                    <span className="text-gray-500 mb-1">{sectionIcons[section.type]}</span>
                    <span className="text-[9px] text-gray-400 text-center leading-tight">{section.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setStep('style')}>
                  Back
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Layers className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileOutput className="w-4 h-4 mr-2" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4: DOWNLOAD ─── */}
          {step === 'download' && (
            <motion.div
              key="download"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-white font-semibold text-lg mb-1">Brochure Ready</h4>
                <p className="text-gray-400 text-sm">{brochureName}.pdf</p>
                <p className="text-gray-500 text-xs mt-1">{totalPages} pages • High quality</p>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full border-gray-700 text-gray-400">
                  <FileOutput className="w-4 h-4 mr-2" />
                  Download as PNG Images
                </Button>
                <Button variant="outline" className="w-full border-gray-700 text-gray-400">
                  <FileText className="w-4 h-4 mr-2" />
                  Copy Share Link
                </Button>
              </div>

              <div className="glass-panel rounded-lg p-3 space-y-2">
                <h5 className="text-sm text-gray-400">Included Sections</h5>
                {enabledSections.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-gray-300">{s.title}</span>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full text-gray-500" onClick={() => setStep('configure')}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
