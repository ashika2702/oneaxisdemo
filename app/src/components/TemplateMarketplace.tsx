import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, FileText, Image, Video, Palette, Download, Star,
  Check, Search, ChevronRight, Lock, Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: 'brochure' | 'social' | 'video' | 'email' | 'floorplan' | 'brand';
  price: number;
  rating: number;
  downloads: number;
  premium: boolean;
  preview: string;
  tags: string[];
  format: string;
}

const TEMPLATES: TemplateItem[] = [
  // Brochures
  { id: 'b1', name: 'Prestige Brochure', description: 'Luxury 12-page property brochure with gold foil accents', category: 'brochure', price: 0, rating: 4.9, downloads: 1240, premium: false, preview: '12-page layout', tags: ['Real Estate', 'Luxury'], format: 'InDesign / PDF' },
  { id: 'b2', name: 'Investment Memorandum', description: 'Professional IM for commercial property investors', category: 'brochure', price: 49, rating: 4.8, downloads: 890, premium: true, preview: '20-page layout', tags: ['Commercial', 'Investment'], format: 'InDesign / PDF' },
  { id: 'b3', name: 'Project Presentation', description: 'Slide deck for project stakeholder meetings', category: 'brochure', price: 0, rating: 4.7, downloads: 2100, premium: false, preview: '25 slides', tags: ['Presentation', 'Stakeholder'], format: 'PPT / Keynote' },
  // Social
  { id: 's1', name: 'Launch Campaign Pack', description: '30 social posts, stories, and reels for project launch', category: 'social', price: 29, rating: 4.9, downloads: 1560, premium: true, preview: '30 assets', tags: ['Launch', 'Instagram'], format: 'PSD / Canva' },
  { id: 's2', name: 'Daily Content Calendar', description: '30-day pre-written content calendar with captions', category: 'social', price: 0, rating: 4.6, downloads: 3200, premium: false, preview: '30 days', tags: ['Content', 'Calendar'], format: 'XLSX / PDF' },
  { id: 's3', name: 'Agent Story Templates', description: '10 editable story templates for property agents', category: 'social', price: 19, rating: 4.7, downloads: 980, premium: true, preview: '10 templates', tags: ['Stories', 'Agent'], format: 'PSD / Canva' },
  // Video
  { id: 'v1', name: 'Property Walkthrough', description: 'Cinematic walkthrough video template with music', category: 'video', price: 79, rating: 4.8, downloads: 650, premium: true, preview: '2:30 min', tags: ['Walkthrough', 'Cinematic'], format: 'AE / Premiere' },
  { id: 'v2', name: 'Social Reel Pack', description: '15 short-form video templates for TikTok/Reels', category: 'video', price: 39, rating: 4.7, downloads: 1120, premium: true, preview: '15 templates', tags: ['Reels', 'Short-form'], format: 'AE / CapCut' },
  // Email
  { id: 'e1', name: 'Buyer Nurture Sequence', description: '7-email automated nurture sequence for leads', category: 'email', price: 0, rating: 4.8, downloads: 1890, premium: false, preview: '7 emails', tags: ['Nurture', 'Automation'], format: 'HTML / Text' },
  { id: 'e2', name: 'VIP Launch Invite', description: 'Exclusive launch event invitation email template', category: 'email', price: 15, rating: 4.6, downloads: 740, premium: true, preview: '3 variants', tags: ['Launch', 'VIP'], format: 'HTML' },
  // Floorplan
  { id: 'f1', name: '2D Floorplan Styles', description: '5 architectural floorplan rendering styles', category: 'floorplan', price: 0, rating: 4.9, downloads: 2450, premium: false, preview: '5 styles', tags: ['Floorplan', '2D'], format: 'AI / PSD' },
  { id: 'f2', name: 'Furnished Floorplans', description: 'Furniture overlay pack for 10 unit types', category: 'floorplan', price: 35, rating: 4.7, downloads: 880, premium: true, preview: '10 overlays', tags: ['Furniture', 'Layout'], format: 'PNG / AI' },
  // Brand
  { id: 'br1', name: 'Developer Brand Kit', description: 'Complete brand identity for property developers', category: 'brand', price: 99, rating: 4.9, downloads: 430, premium: true, preview: 'Full kit', tags: ['Branding', 'Identity'], format: 'AI / PDF' },
  { id: 'br2', name: 'Project Logo Templates', description: '20 editable project logo concepts', category: 'brand', price: 0, rating: 4.5, downloads: 4100, premium: false, preview: '20 logos', tags: ['Logo', 'Project'], format: 'AI / EPS' },
];

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  brochure: { label: 'Brochures', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-400' },
  social: { label: 'Social Media', icon: <Image className="w-4 h-4" />, color: 'bg-pink-500/20 text-pink-400' },
  video: { label: 'Video', icon: <Video className="w-4 h-4" />, color: 'bg-red-500/20 text-red-400' },
  email: { label: 'Email', icon: <Layout className="w-4 h-4" />, color: 'bg-green-500/20 text-green-400' },
  floorplan: { label: 'Floorplans', icon: <Palette className="w-4 h-4" />, color: 'bg-amber-500/20 text-amber-400' },
  brand: { label: 'Brand Kit', icon: <Star className="w-4 h-4" />, color: 'bg-purple-500/20 text-purple-400' },
};

export default function TemplateMarketplace() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filtered = TEMPLATES.filter((t) => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchPremium = !showPremiumOnly || t.premium;
    return matchCategory && matchSearch && matchPremium;
  });

  const handleDownload = (id: string) => {
    setDownloaded(prev => [...prev, id]);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Template Marketplace</h2>
            <p className="text-gray-400 text-sm">Ready-made content, designs, and templates</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, tags..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          onClick={() => setShowPremiumOnly(!showPremiumOnly)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
            showPremiumOnly
              ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
              : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-gray-300'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Premium
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-thin pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          All ({TEMPLATES.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {config.icon}
            {config.label} ({TEMPLATES.filter(t => t.category === key).length})
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{TEMPLATES.length}</div>
          <div className="text-[10px] text-gray-500">Templates</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{TEMPLATES.filter(t => t.premium).length}</div>
          <div className="text-[10px] text-gray-500">Premium</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">
            {TEMPLATES.reduce((a, t) => a + t.downloads, 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500">Downloads</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">
            {(TEMPLATES.reduce((a, t) => a + t.rating, 0) / TEMPLATES.length).toFixed(1)}
          </div>
          <div className="text-[10px] text-gray-500">Avg Rating</div>
        </div>
      </div>

      {/* Template Grid */}
      <AnimatePresence mode="wait">
        {!selectedTemplate ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedTemplate(template)}
                className="glass-panel rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700 hover:border-amber-500/30 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-medium ${CATEGORY_CONFIG[template.category]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                    {CATEGORY_CONFIG[template.category]?.label || template.category}
                  </div>
                  {template.premium ? (
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Lock className="w-3 h-3" />
                      <span className="text-[10px] font-medium">${template.price}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-emerald-400">
                      <Unlock className="w-3 h-3" />
                      <span className="text-[10px] font-medium">Free</span>
                    </div>
                  )}
                </div>

                <h4 className="text-white font-medium text-sm mb-1 group-hover:text-amber-400 transition-colors">
                  {template.name}
                </h4>
                <p className="text-gray-500 text-xs mb-3">{template.description}</p>

                <div className="h-24 rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                  <span className="text-xs text-gray-600">{template.preview}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-400">{template.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">{template.downloads.toLocaleString()} dl</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{template.format}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to marketplace
            </button>

            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium mb-2 ${CATEGORY_CONFIG[selectedTemplate.category]?.color}`}>
                    {CATEGORY_CONFIG[selectedTemplate.category]?.icon}
                    {CATEGORY_CONFIG[selectedTemplate.category]?.label}
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedTemplate.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{selectedTemplate.description}</p>
                </div>
                <div className="text-right">
                  {selectedTemplate.premium ? (
                    <div className="text-2xl font-bold text-amber-400">${selectedTemplate.price}</div>
                  ) : (
                    <div className="text-2xl font-bold text-emerald-400">Free</div>
                  )}
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm text-gray-400">{selectedTemplate.rating}</span>
                  </div>
                </div>
              </div>

              <div className="h-64 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                <div className="text-center">
                  <Layout className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{selectedTemplate.preview} preview</p>
                  <p className="text-xs text-gray-600 mt-1">Format: {selectedTemplate.format}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTemplate.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">{tag}</span>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-amber-600 hover:bg-amber-500"
                  onClick={() => handleDownload(selectedTemplate.id)}
                  disabled={downloaded.includes(selectedTemplate.id)}
                >
                  {downloaded.includes(selectedTemplate.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {selectedTemplate.premium ? `Purchase $${selectedTemplate.price}` : 'Download Free'}
                    </>
                  )}
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300">
                  <FileText className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Related */}
            <div>
              <h4 className="text-sm text-white font-medium mb-3">More like this</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {TEMPLATES
                  .filter(t => t.category === selectedTemplate.category && t.id !== selectedTemplate.id)
                  .slice(0, 3)
                  .map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplate(t)}
                      className="glass-panel rounded-lg p-3 cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700"
                    >
                      <h5 className="text-white text-sm font-medium">{t.name}</h5>
                      <p className="text-gray-500 text-xs mt-1">{t.preview}</p>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
