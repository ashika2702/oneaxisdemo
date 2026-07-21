import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Box, Layers, Clock, CheckCircle, RotateCcw, FileUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function InstantMassing() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'massing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus('uploading');
    setProgress(0);

    // Simulate upload + processing
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStatus('processing');
          setTimeout(() => setStatus('massing'), 500);
          setTimeout(() => { setStatus('complete'); setProgress(100); }, 2500);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const reset = () => { setStatus('idle'); setProgress(0); setFileName(''); };

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" />Instant Massing</h2>
          <p className="text-gray-500 text-sm mt-0.5">Upload a plan — watch your PDF stand up into 3D in minutes</p>
        </div>
        {status === 'complete' && (
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-400" onClick={reset}><RotateCcw className="w-3.5 h-3.5 mr-1.5" />Reset</Button>
        )}
      </div>

      <div className="flex-1 p-6">
        {/* Upload area */}
        {status === 'idle' && (
          <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer">
            <FileUp className="w-12 h-12 text-gray-600 mb-3" />
            <span className="text-white font-medium mb-1">Drop your floor plan here</span>
            <span className="text-gray-500 text-sm mb-3">PDF, DWG, DXF, or image</span>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Processing time: 2-5 minutes</Badge>
            <input type="file" accept=".pdf,.dwg,.dxf,.png,.jpg" className="hidden" onChange={handleUpload} />
          </label>
        )}

        {/* Uploading */}
        {status === 'uploading' && (
          <div className="flex flex-col items-center justify-center h-64">
            <Upload className="w-10 h-10 text-blue-400 animate-bounce mb-4" />
            <span className="text-white font-medium mb-2">Uploading {fileName}</span>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>
            <span className="text-gray-500 text-xs mt-2">{progress}%</span>
          </div>
        )}

        {/* Processing */}
        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center h-64">
            <Layers className="w-10 h-10 text-amber-400 animate-spin mb-4" />
            <span className="text-white font-medium mb-1">AI Extracting Boundaries</span>
            <span className="text-gray-500 text-xs">Detecting walls, rooms, and openings...</span>
          </div>
        )}

        {/* Massing animation */}
        {status === 'massing' && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Animated massing — flat to 3D */}
              <motion.div
                className="absolute inset-x-8 bottom-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                initial={{ height: 4, opacity: 0.3 }}
                animate={{ height: 160, opacity: 1 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-x-16 bottom-8 bg-gradient-to-t from-amber-600 to-amber-400 rounded-lg"
                initial={{ height: 4, opacity: 0.3 }}
                animate={{ height: 120, opacity: 1 }}
                transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute right-8 bottom-8 w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg"
                initial={{ height: 4, opacity: 0.3 }}
                animate={{ height: 100, opacity: 1 }}
                transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-white font-medium mt-4">Building 3D Massing...</span>
            <span className="text-gray-500 text-xs">Extruding walls, placing openings</span>
          </div>
        )}

        {/* Complete */}
        {status === 'complete' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-white font-semibold">Massing Complete</span>
                <span className="text-gray-500 text-sm ml-3">{fileName}</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ml-auto">Ready</Badge>
            </div>

            {/* 3D Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#06080f]" />
                {/* Simplified 3D massing preview */}
                <div className="relative z-10">
                  <div className="w-32 h-4 bg-blue-500/30 rounded-sm" />
                  <div className="w-32 h-24 bg-gradient-to-t from-blue-600/40 to-blue-400/20 border border-blue-400/30 rounded-sm mt-0" />
                  <div className="w-16 h-16 bg-amber-500/20 border border-amber-400/30 rounded-sm absolute bottom-4 right-4" />
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] text-gray-500 z-10">3D Massing</span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                  <div className="text-xs text-gray-500 mb-2">DETECTED</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Floors</span><span className="text-white font-medium">12</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Units</span><span className="text-white font-medium">48</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Total Area</span><span className="text-white font-medium">8,450 m²</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Confidence</span><span className="text-emerald-400 font-medium">94%</span></div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                  <div className="text-xs text-gray-500 mb-2">NEXT STEPS</div>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-xs"><Box className="w-3 h-3 mr-1.5" />Refine in 3D Editor</Button>
                    <Button size="sm" variant="outline" className="w-full border-gray-700 text-gray-400 text-xs"><Layers className="w-3 h-3 mr-1.5" />Add Materials</Button>
                    <Button size="sm" variant="outline" className="w-full border-gray-700 text-gray-400 text-xs"><Clock className="w-3 h-3 mr-1.5" />Send to Designer Review</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
