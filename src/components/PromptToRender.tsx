import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, Sparkles, Loader2, Image, RotateCcw, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RenderPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  beforeImg: string;
  afterImg: string;
  tags: string[];
}

const PRESETS: RenderPreset[] = [
  {
    id: 'modern-living',
    name: 'Modern Living Room',
    description: 'Contemporary open-plan living with floor-to-ceiling windows',
    prompt: 'A modern living room with polished concrete floors, a large L-shaped sofa in charcoal fabric, floor-to-ceiling windows overlooking a city skyline at golden hour, minimalist coffee table, indoor plants, warm ambient lighting, interior design photography, 4k, photorealistic',
    beforeImg: 'Empty concrete shell with exposed wiring and unfinished walls',
    afterImg: 'Fully furnished modern living space',
    tags: ['Living', 'Modern', 'City View'],
  },
  {
    id: 'hamptons-kitchen',
    name: 'Hamptons Kitchen',
    description: 'Classic white shaker cabinets with marble island bench',
    prompt: 'Hamptons style kitchen with white shaker cabinets, Carrara marble island bench with waterfall edge, brushed brass pendant lights over the island, SMEG appliances, herringbone white subway tile backsplash, natural oak flooring, soft natural daylight, interior design photography, 4k, photorealistic',
    beforeImg: 'Raw kitchen space with plumbing rough-ins only',
    afterImg: 'Complete Hamptons kitchen',
    tags: ['Kitchen', 'Hamptons', 'Luxury'],
  },
  {
    id: 'master-suite',
    name: 'Master Bedroom Suite',
    description: 'Luxury master with walk-in robe and ensuite visualization',
    prompt: 'Luxury master bedroom with king-size bed dressed in white linen, upholstered headboard in navy velvet, bedside tables with brass lamps, wool carpet, sheer curtains with city views, walk-in wardrobe visible through glass doors, spa-like ensuite with freestanding tub, warm evening lighting, interior design photography, 4k, photorealistic',
    beforeImg: 'Unfinished bedroom with bare drywall',
    afterImg: 'Luxury master suite complete',
    tags: ['Bedroom', 'Luxury', 'Ensuite'],
  },
  {
    id: 'coastal-bathroom',
    name: 'Coastal Bathroom',
    description: 'Beach-inspired bathroom with natural textures',
    prompt: 'Coastal style bathroom with freestanding white oval bathtub, floating timber vanity with vessel sink, large format beige tiles, frameless glass shower, potted monstera plant, round rattan mirror, soft natural light from skylight, fresh white towels, interior design photography, 4k, photorealistic',
    beforeImg: 'Bathroom rough-in with plumbing pipes exposed',
    afterImg: 'Coastal bathroom retreat',
    tags: ['Bathroom', 'Coastal', 'Spa'],
  },
  {
    id: 'japanese-zen',
    name: 'Japanese Zen Interior',
    description: 'Minimalist zen with tatami and shoji screens',
    prompt: 'Japanese zen interior with tatami mat flooring, low wooden furniture, shoji screen room divider, ikebana flower arrangement, paper lantern pendant light, rock garden visible through large window, warm timber beams, serene atmosphere, interior design photography, 4k, photorealistic',
    beforeImg: 'Bare room with concrete floor',
    afterImg: 'Tranquil Japanese interior',
    tags: ['Zen', 'Japanese', 'Minimalist'],
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    description: 'Exposed brick and steel beams with modern furnishings',
    prompt: 'Industrial loft apartment with exposed red brick walls, black steel beam ceiling, large factory windows, leather Chesterfield sofa, reclaimed wood coffee table, vintage rugs, modern kitchen with stainless steel appliances, warm pendant Edison bulbs, interior design photography, 4k, photorealistic',
    beforeImg: 'Empty warehouse shell',
    afterImg: 'Styled industrial loft living',
    tags: ['Industrial', 'Loft', 'Urban'],
  },
];

const COLOR_MAP: Record<string, string> = {
  Living: 'bg-blue-500/20 text-blue-400',
  Kitchen: 'bg-amber-500/20 text-amber-400',
  Bedroom: 'bg-purple-500/20 text-purple-400',
  Bathroom: 'bg-cyan-500/20 text-cyan-400',
  Modern: 'bg-gray-500/20 text-gray-400',
  Luxury: 'bg-yellow-500/20 text-yellow-400',
  Coastal: 'bg-teal-500/20 text-teal-400',
  Zen: 'bg-emerald-500/20 text-emerald-400',
  Japanese: 'bg-red-500/20 text-red-400',
  Minimalist: 'bg-slate-500/20 text-slate-400',
  Industrial: 'bg-orange-500/20 text-orange-400',
  Loft: 'bg-indigo-500/20 text-indigo-400',
  Urban: 'bg-pink-500/20 text-pink-400',
  'City View': 'bg-sky-500/20 text-sky-400',
  Hamptons: 'bg-lime-500/20 text-lime-400',
  Ensuite: 'bg-violet-500/20 text-violet-400',
  Spa: 'bg-rose-500/20 text-rose-400',
};

export default function PromptToRender() {
  const [selectedPreset, setSelectedPreset] = useState<RenderPreset | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Prompt-to-Render</h2>
            <p className="text-gray-400 text-sm">AI interior visualization from text prompts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'presets' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'custom' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Custom Prompt
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          {!selectedPreset ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRESETS.map((preset, i) => (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPreset(preset)}
                  className="glass-panel rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition-all group border border-gray-700 hover:border-violet-500/30"
                >
                  <div className="h-32 rounded-lg bg-gray-800 mb-3 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" />
                    <Image className="w-10 h-10 text-gray-600 group-hover:text-violet-400 transition-colors" />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-gray-300">
                      AI Render
                    </div>
                  </div>
                  <h4 className="text-white font-medium mb-1">{preset.name}</h4>
                  <p className="text-gray-500 text-xs mb-3">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.tags.map((tag) => (
                      <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] ${COLOR_MAP[tag] || 'bg-gray-500/20 text-gray-400'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPreset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setSelectedPreset(null); setGenerated(false); }}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Back to presets
                  </button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300"
                      onClick={() => handleCopyPrompt(selectedPreset.prompt)}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      {copied ? 'Copied' : 'Copy Prompt'}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-500"
                      onClick={handleGenerate}
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          Rendering...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-1" />
                          Generate Render
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Prompt display */}
                <div className="glass-panel rounded-xl p-4 border border-violet-500/20">
                  <div className="text-xs text-violet-400 mb-2 font-medium">PROMPT</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedPreset.prompt}</p>
                </div>

                {/* Before / After visualization */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Before — Empty Shell</div>
                    <div className="h-48 rounded-lg bg-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-2">
                          <BoxIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-500 max-w-[200px]">{selectedPreset.beforeImg}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-xl p-4 border-violet-500/20">
                    <div className="text-xs text-violet-400 mb-2 font-medium uppercase tracking-wider">
                      {generated ? 'After — AI Rendered' : 'After — Will Generate'}
                    </div>
                    <div className="h-48 rounded-lg bg-gray-800 flex items-center justify-center relative overflow-hidden">
                      {generating ? (
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-2" />
                          <p className="text-xs text-gray-400">AI generating interior...</p>
                          <div className="w-32 h-1 bg-gray-700 rounded-full mt-2 mx-auto overflow-hidden">
                            <motion.div
                              className="h-full bg-violet-400"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 3 }}
                            />
                          </div>
                        </div>
                      ) : generated ? (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-2">
                            <Image className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xs text-gray-300">{selectedPreset.afterImg}</p>
                          <div className="flex items-center gap-1 mt-2 justify-center">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Render complete</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Click Generate to create render</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Generation details */}
                {generated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-xl p-4 border-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-white font-medium">Generation Complete</span>
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Download 4K
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-white font-medium text-sm">4096x4096</div>
                        <div className="text-[10px] text-gray-500">Resolution</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-white font-medium text-sm">~12s</div>
                        <div className="text-[10px] text-gray-500">Generation Time</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-white font-medium text-sm">Photorealistic</div>
                        <div className="text-[10px] text-gray-500">Style</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-white font-medium text-sm">95%</div>
                        <div className="text-[10px] text-gray-500">Prompt Match</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl space-y-4"
        >
          <div className="glass-panel rounded-xl p-5">
            <label className="text-sm text-gray-300 font-medium mb-2 block">Describe your interior vision</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., A Scandinavian living room with light oak floors, white walls, a cognac leather sofa, large abstract artwork, indoor fiddle leaf fig, natural morning light streaming through sheer curtains..."
              className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-violet-500 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-500">{customPrompt.length} characters</div>
              <Button
                className="bg-violet-600 hover:bg-violet-500"
                onClick={handleGenerate}
                disabled={generating || customPrompt.length < 10}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Render
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-panel rounded-xl p-4">
            <h4 className="text-sm text-white font-medium mb-3">Prompt Tips</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Mention specific materials (marble, oak, velvet)',
                'Include lighting conditions (golden hour, soft morning)',
                'Add style references (Scandinavian, Art Deco, Industrial)',
                'Specify camera angle (wide shot, eye-level)',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <LightbulbIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-5 border-emerald-500/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">Render Generated</span>
              </div>
              <div className="h-64 rounded-lg bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-3">
                    <Image className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-gray-300">AI Interior Render Complete</p>
                  <p className="text-xs text-gray-500 mt-1">4K resolution • Photorealistic style</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-violet-600 hover:bg-violet-500">
                  <Download className="w-4 h-4 mr-2" />
                  Download 4K Image
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
