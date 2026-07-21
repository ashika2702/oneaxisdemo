import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', status: 'active', coverage: 100 },
  { code: 'ar', name: 'Arabic', native: 'العربية', status: 'active', coverage: 100 },
  { code: 'zh', name: 'Chinese', native: '中文', status: 'active', coverage: 95 },
  { code: 'ru', name: 'Russian', native: 'Русский', status: 'active', coverage: 88 },
  { code: 'fr', name: 'French', native: 'Français', status: 'beta', coverage: 72 },
  { code: 'ur', name: 'Urdu', native: 'اردو', status: 'beta', coverage: 65 },
  { code: 'fa', name: 'Farsi', native: 'فارسی', status: 'pending', coverage: 0 },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', status: 'pending', coverage: 0 },
];

const DEMO_TRANSLATIONS = [
  { en: 'Spacious 3-bedroom apartment with panoramic marina views', ar: 'شقة واسعة بـ 3 غرف نوم مع إطلالات بانورامية على المارينا', zh: '宽敞的三居室公寓，享有全景码头景观' },
  { en: 'Corner unit with floor-to-ceiling windows', ar: 'وحدة زاوية بنوافذ من الأرض إلى السقف', zh: '角落单位，落地窗' },
  { en: 'Price per sqm: AED 19,655', ar: 'السعر للمتر المربع: 19,655 درهم', zh: '每平方米价格：19,655 迪拉姆' },
];

export default function MultilingualEngine() {
  const [activeLang, setActiveLang] = useState('ar');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-400" />Multilingual Engine</h2>
        <p className="text-gray-500 text-sm mt-0.5">Every engine and concierge in any language — auto-translated, culturally adapted</p>
      </div>
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-4">
        {/* Language grid */}
        <div className="grid grid-cols-4 gap-2">
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => setActiveLang(l.code)}
              className={`p-3 rounded-xl border text-left transition-all ${activeLang === l.code ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'}`}>
              <div className="text-white font-medium text-sm">{l.native}</div>
              <div className="text-gray-500 text-[10px]">{l.name}</div>
              <Badge className={`mt-1 ${l.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : l.status === 'beta' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-700 text-gray-400'} border-0 text-[9px]`}>{l.status}</Badge>
            </button>
          ))}
        </div>

        {/* Live translation preview */}
        <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-white flex items-center gap-2"><Languages className="w-4 h-4 text-cyan-400" />Live Preview</div>
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-xs" onClick={handleGenerate} disabled={generating}>
              <Sparkles className="w-3 h-3 mr-1" />{generating ? 'Translating...' : 'Regenerate'}
            </Button>
          </div>
          <div className="space-y-2">
            {DEMO_TRANSLATIONS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-gray-800/30 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">English</div>
                <div className="text-sm text-white mb-2">{t.en}</div>
                <div className="text-xs text-cyan-400 mb-1">{LANGUAGES.find((l) => l.code === activeLang)?.native || 'Arabic'}</div>
                <div className="text-sm text-cyan-300" dir={activeLang === 'ar' || activeLang === 'ur' || activeLang === 'fa' ? 'rtl' : 'ltr'}>
                  {activeLang === 'en' ? t.en : activeLang === 'ar' ? t.ar : activeLang === 'zh' ? t.zh : t.ar}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coverage stats */}
        <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
          <div className="text-sm font-medium text-white mb-3">Translation Coverage</div>
          <div className="space-y-2">
            {LANGUAGES.filter((l) => l.coverage > 0).map((l) => (
              <div key={l.code} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-20">{l.name}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${l.coverage}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{l.coverage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
