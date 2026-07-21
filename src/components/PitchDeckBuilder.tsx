import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Presentation, ChevronRight, ChevronLeft, Download, Play,
  Square, Sparkles, Image, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: string;
  title: string;
  type: 'title' | 'data' | 'chart' | 'image' | 'quote';
  content: string;
  metric?: { value: string; label: string };
  layout: 'center' | 'split' | 'full';
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 's1',
    title: 'Harbour Residences',
    type: 'title',
    content: 'Waterfront Living Redefined — Investment Opportunity',
    layout: 'center',
  },
  {
    id: 's2',
    title: 'The Opportunity',
    type: 'data',
    content: 'Sydney waterfront precinct undergoing $2.1B regeneration. 847 registered buyers, 68% pre-sold. Strong demand for premium 2-3 bed apartments with marina access.',
    metric: { value: '$42.8M', label: 'Total Project Value' },
    layout: 'split',
  },
  {
    id: 's3',
    title: 'Market Position',
    type: 'chart',
    content: 'Premium waterfront apartments commanding 15-20% price premiums vs. comparable non-waterfront stock. Limited supply pipeline — only 340 comparable units approved for delivery in next 3 years across the precinct.',
    metric: { value: '18.6%', label: 'Projected IRR' },
    layout: 'split',
  },
  {
    id: 's4',
    title: 'Unit Mix & Pricing',
    type: 'data',
    content: 'Curated mix targeting owner-occupiers and investors. Studio through to 4-bed penthouses. Average $12,400/m² — competitive vs. comparable projects at $14,200/m².',
    metric: { value: '92 units', label: 'Total Inventory' },
    layout: 'split',
  },
  {
    id: 's5',
    title: 'Sales Velocity',
    type: 'chart',
    content: 'Launch-to-date: 63 units sold in 8 months. Type A (2-bed) moving fastest at 4.2 units/week. Penthouse inventory 40% reserved off-plan. Strong foreign buyer interest from Singapore and Hong Kong.',
    metric: { value: '68%', label: 'Sold / Reserved' },
    layout: 'full',
  },
  {
    id: 's6',
    title: 'Financial Summary',
    type: 'data',
    content: 'Conservative underwriting with 14.2% IRR downside case. Base case 18.6% IRR with $12.4M developer profit. NPV positive across all scenarios. Debt facility secured at 6.85% p.a.',
    metric: { value: '$12.4M', label: 'Developer Profit' },
    layout: 'split',
  },
  {
    id: 's7',
    title: 'Sustainability Credentials',
    type: 'image',
    content: 'Targeting 5-Star Green Star rating. 145 rooftop solar panels generating 42.5kWh/day. Rainwater harvesting 850L/day. 35% recycled materials. Estimated 12.4 tCO₂e annual carbon offset.',
    metric: { value: '78/100', label: 'Sustainability Score' },
    layout: 'split',
  },
  {
    id: 's8',
    title: 'The Team',
    type: 'quote',
    content: '"This project represents the finest waterfront living Sydney has seen in a decade. Every detail — from the solar orientation to the marina berthing — has been designed for lasting value."',
    layout: 'center',
  },
  {
    id: 's9',
    title: 'Investment Highlights',
    type: 'data',
    content: 'Key investment merits: Prime waterfront location with limited future supply. 68% pre-sold de-risks delivery. 18.6% base case IRR. 5-Star Green Star target. Experienced delivery team with 2,400+ units completed.',
    metric: { value: '2.9 yrs', label: 'Payback Period' },
    layout: 'full',
  },
  {
    id: 's10',
    title: 'Thank You',
    type: 'title',
    content: 'Contact us for detailed IM and site visit\nhello@oneaxis.live | oneaxis.live',
    layout: 'center',
  },
];

export default function PitchDeckBuilder() {
  const [slides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };

  const slide = slides[currentSlide];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pitch Deck Builder</h2>
              <p className="text-gray-400 text-sm">Auto-generated presentations from project data</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsPresenting(!isPresenting)}
            >
              {isPresenting ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPresenting ? 'Exit' : 'Present'}
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500">
              <Download className="w-4 h-4 mr-2" />
              Export PPT
            </Button>
          </div>
        </div>
      </div>

      {isPresenting ? (
        <div className="glass-panel rounded-xl p-8 min-h-[400px] flex flex-col justify-center items-center text-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl"
            >
              {slide.type === 'title' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Presentation className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">{slide.title}</h1>
                  <p className="text-gray-400 text-lg whitespace-pre-line">{slide.content}</p>
                </div>
              )}

              {slide.type === 'data' && (
                <div className={`grid gap-6 ${slide.layout === 'split' ? 'md:grid-cols-2 items-center' : ''}`}>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-3">{slide.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{slide.content}</p>
                  </div>
                  {slide.metric && (
                    <div className="glass-panel rounded-xl p-6 border-purple-500/20">
                      <div className="text-4xl font-bold text-purple-400">{slide.metric.value}</div>
                      <div className="text-sm text-gray-500">{slide.metric.label}</div>
                    </div>
                  )}
                </div>
              )}

              {slide.type === 'chart' && (
                <div className={`grid gap-6 ${slide.layout === 'split' ? 'md:grid-cols-2 items-center' : ''}`}>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-3">{slide.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{slide.content}</p>
                  </div>
                  {slide.metric && (
                    <div className="glass-panel rounded-xl p-6 text-center">
                      <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white">{slide.metric.value}</div>
                      <div className="text-sm text-gray-500">{slide.metric.label}</div>
                    </div>
                  )}
                </div>
              )}

              {slide.type === 'image' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-3">{slide.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{slide.content}</p>
                  </div>
                  <div className="glass-panel rounded-xl p-6 text-center border-emerald-500/20">
                    <Image className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-emerald-400">{slide.metric?.value}</div>
                    <div className="text-sm text-gray-500">{slide.metric?.label}</div>
                  </div>
                </div>
              )}

              {slide.type === 'quote' && (
                <div className="space-y-4">
                  <div className="text-5xl text-purple-400 font-serif">"</div>
                  <p className="text-xl text-gray-300 italic leading-relaxed">{slide.content}</p>
                  <p className="text-sm text-gray-500">— {slide.title}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
            <button onClick={prevSlide} disabled={currentSlide === 0} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400">{currentSlide + 1} / {slides.length}</span>
            <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Slide list */}
          <div className="grid gap-2">
            {slides.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setCurrentSlide(i)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  currentSlide === i
                    ? 'border-purple-500/30 bg-purple-500/5'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-medium">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{s.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      s.type === 'title' ? 'bg-purple-500/20 text-purple-400' :
                      s.type === 'chart' ? 'bg-blue-500/20 text-blue-400' :
                      s.type === 'image' ? 'bg-emerald-500/20 text-emerald-400' :
                      s.type === 'quote' ? 'bg-pink-500/20 text-pink-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {s.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{s.content}</p>
                </div>
                {s.metric && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-white font-medium">{s.metric.value}</div>
                    <div className="text-[10px] text-gray-500">{s.metric.label}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Regenerating with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate with AI
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
