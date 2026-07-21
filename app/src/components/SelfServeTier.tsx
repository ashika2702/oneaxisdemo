import { useState } from 'react';
import { Upload, Code, CreditCard, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SelfServeTier() {
  const [step, setStep] = useState(1);
  const [planUploaded, setPlanUploaded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [accent, setAccent] = useState('#3B82F6');

  const handlePublish = () => {
    setStep(4);
  };

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />Self-Serve Launch</h2>
        <p className="text-gray-500 text-sm mt-0.5">Upload → Configure → Embed → Pay. No sales call required.</p>
      </div>
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {['Upload Plan', 'Configure', 'Publish'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs text-gray-400">{s}</span>
              {i < 2 && <div className="flex-1 h-px bg-gray-800" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${planUploaded ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-700 hover:border-yellow-500'}`} onClick={() => setPlanUploaded(true)}>
              {planUploaded ? <><CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" /><div className="text-emerald-400 font-medium">masterplan.pdf uploaded</div></> : <><Upload className="w-10 h-10 text-gray-600 mx-auto mb-2" /><div className="text-white font-medium">Drop your floor plan</div><div className="text-gray-500 text-sm">PDF, DWG, or image</div></>}
            </div>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-500" disabled={!planUploaded} onClick={() => setStep(2)}>Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="text-sm font-medium text-white mb-3">Theme</div>
              <div className="flex gap-2">
                {(['light', 'dark'] as const).map((t) => (
                  <button key={t} onClick={() => setTheme(t)} className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${theme === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="text-sm font-medium text-white mb-3">Accent Colour</div>
              <div className="flex gap-2">
                {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((c) => (
                  <button key={c} onClick={() => setAccent(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${accent === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="text-sm font-medium text-white mb-2">Embed Preview</div>
              <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className={`text-xs font-bold mb-1`} style={{ color: accent }}>Azure Heights</div>
                <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>48 units from $1.65M</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-yellow-600 hover:bg-yellow-500" onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="text-sm font-medium text-white mb-2">Embed Code</div>
              <code className="block bg-gray-950 rounded-lg p-3 text-[11px] text-gray-400 font-mono">{`<script src="https://cdn.oneaxis.live/widget.js" data-project="proj_123" data-theme="${theme}" data-accent="${accent}"></script>`}</code>
              <Button variant="outline" size="sm" className="mt-2 border-gray-700 text-gray-400 text-xs"><Code className="w-3 h-3 mr-1" />Copy Code</Button>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Self-Serve Tier</span><span className="text-white font-bold">$99/project</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Processing</span><span className="text-gray-400">$0</span></div>
              <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between"><span className="text-white font-medium">Total</span><span className="text-emerald-400 font-bold">$99.00</span></div>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500" onClick={handlePublish}><CreditCard className="w-4 h-4 mr-2" />Pay & Publish</Button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
            <h3 className="text-xl font-bold text-white">Project Published</h3>
            <p className="text-gray-400 text-sm">Your interactive project is live. Embed code ready.</p>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="text-xs text-gray-500 mb-1">Live URL</div>
              <code className="text-sm text-blue-400">https://show.oneaxis.live/azr-heights</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
