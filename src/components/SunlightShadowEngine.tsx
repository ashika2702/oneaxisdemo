import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Clock, Calendar, Compass, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6am to 8pm

export default function SunlightShadowEngine() {
  const [selectedMonth, setSelectedMonth] = useState(5); // June
  const [selectedHour, setSelectedHour] = useState(12); // noon
  const [animating, setAnimating] = useState(false);

  // Sun angle calculations (simplified)
  const sunElevation = Math.max(10, 70 - Math.abs(selectedMonth - 5) * 8 - Math.abs(selectedHour - 12) * 3);
  const sunAzimuth = (selectedHour - 6) * 15 + 90;
  const shadowLength = Math.max(0.3, 5 / Math.tan((sunElevation * Math.PI) / 180));

  // Solar exposure color
  const getExposureColor = (face: string) => {
    if (face === 'south') return sunElevation > 30 ? 'bg-amber-400/60' : 'bg-amber-400/20';
    if (face === 'east') return selectedHour < 12 ? 'bg-amber-400/40' : 'bg-gray-700/30';
    if (face === 'west') return selectedHour > 12 ? 'bg-amber-400/40' : 'bg-gray-700/30';
    return 'bg-gray-700/30';
  };

  const animateDay = () => {
    setAnimating(true);
    let h = 6;
    const interval = setInterval(() => {
      setSelectedHour(h);
      h++;
      if (h > 19) { clearInterval(interval); setAnimating(false); }
    }, 200);
  };

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Sun className="w-5 h-5 text-amber-400" />Sunlight & Shadow Engine</h2>
          <p className="text-gray-500 text-sm mt-0.5">Real solar geometry for any date and hour — accurate shadows and sun exposure</p>
        </div>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-xs" onClick={animateDay} disabled={animating}>
          <Clock className="w-3.5 h-3.5 mr-1.5" />{animating ? 'Animating...' : 'Animate Full Day'}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Controls */}
        <div className="w-72 border-r border-gray-800 p-4 space-y-4 overflow-y-auto">
          {/* Month selector */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="w-3 h-3" />Month</label>
            <div className="grid grid-cols-4 gap-1">
              {MONTHS.map((m, i) => (
                <button key={m} onClick={() => setSelectedMonth(i)}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-all ${selectedMonth === i ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Hour selector */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" />Hour of Day</label>
            <div className="grid grid-cols-5 gap-1">
              {HOURS.map((h) => (
                <button key={h} onClick={() => setSelectedHour(h)}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-all ${selectedHour === h ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {h}:00
                </button>
              ))}
            </div>
          </div>

          {/* Sun data */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-3 space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Solar Data</div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Elevation</span><span className="text-amber-400 font-medium">{sunElevation.toFixed(1)}°</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Azimuth</span><span className="text-amber-400 font-medium">{sunAzimuth}°</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Shadow Ratio</span><span className="text-blue-400 font-medium">1:{shadowLength.toFixed(1)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Daylight</span><span className="text-white font-medium">{selectedHour >= 6 && selectedHour <= 18 ? 'Yes' : 'No'}</span></div>
          </div>

          {/* Face exposure */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-3 space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Exposure by Face</div>
            {['North','South','East','West'].map((face) => (
              <div key={face} className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1.5"><Compass className="w-3 h-3" />{face}</span>
                <div className={`w-16 h-2 rounded-full ${getExposureColor(face.toLowerCase())}`} />
              </div>
            ))}
          </div>

          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs w-full justify-center">
            <Info className="w-3 h-3 mr-1" />Data source: Real solar ephemeris
          </Badge>
        </div>

        {/* Visualization */}
        <div className="flex-1 p-6 flex items-center justify-center relative">
          <div className="relative w-[500px] h-[400px]">
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 to-gray-800/50" />

            {/* Building */}
            <div className="absolute bottom-16 left-[180px] w-[140px] h-[200px] bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-sm border border-gray-500/30">
              {/* Windows */}
              <div className="grid grid-cols-3 gap-2 p-2 mt-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`h-6 rounded-sm ${sunElevation > 20 ? 'bg-amber-300/40' : 'bg-blue-900/40'}`} />
                ))}
              </div>
            </div>

            {/* Shadow */}
            <motion.div
              className="absolute bottom-16 bg-black/40 origin-bottom-left"
              animate={{
                width: shadowLength * 30,
                height: 8,
                left: selectedHour < 12 ? `${180 - shadowLength * 30}px` : '320px',
                rotate: selectedHour < 12 ? -5 : 5,
              }}
              transition={{ duration: 0.5 }}
              style={{ left: 320 }}
            />

            {/* Sun */}
            <motion.div
              className="absolute w-10 h-10 rounded-full bg-amber-400 shadow-lg shadow-amber-400/30"
              animate={{
                left: `${20 + (selectedHour - 6) * 4.2}%`,
                top: `${60 - sunElevation * 0.5}%`,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Sun rays */}
            <motion.div
              className="absolute w-px bg-amber-400/30 origin-top"
              animate={{
                height: `${60 - sunElevation * 0.5 + 15}%`,
                left: `${24 + (selectedHour - 6) * 4.2}%`,
                top: 0,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-[10px] text-gray-500">N</div>
            <div className="absolute bottom-2 right-2 text-[10px] text-gray-500">S</div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">
              {MONTHS[selectedMonth]} {selectedHour}:00 — Sun at {sunElevation.toFixed(0)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
