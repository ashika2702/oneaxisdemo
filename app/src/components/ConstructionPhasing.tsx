import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HardHat, Play, Pause, RotateCcw, SkipForward, SkipBack,
  Calendar, CheckCircle, Clock, Layers,
  BarChart3, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Phase {
  id: string;
  name: string;
  duration: number; // weeks
  startWeek: number;
  color: string;
  status: 'completed' | 'active' | 'upcoming';
  completion: number;
  tasks: { name: string; done: boolean }[];
  resources: { type: string; count: number }[];
}

const PHASES: Phase[] = [
  {
    id: 'p1', name: 'Site Preparation', duration: 8, startWeek: 0, color: 'bg-emerald-500',
    status: 'completed', completion: 100,
    tasks: [
      { name: 'Demolition', done: true },
      { name: 'Site clearance', done: true },
      { name: 'Geotechnical survey', done: true },
      { name: 'Temporary works', done: true },
      { name: 'Site office setup', done: true },
    ],
    resources: [{ type: 'Excavators', count: 4 }, { type: 'Labourers', count: 12 }],
  },
  {
    id: 'p2', name: 'Foundation & Piling', duration: 16, startWeek: 8, color: 'bg-blue-500',
    status: 'completed', completion: 100,
    tasks: [
      { name: 'Piling works', done: true },
      { name: 'Ground beams', done: true },
      { name: 'Basement excavation', done: true },
      { name: 'Waterproofing', done: true },
      { name: 'Foundation inspection', done: true },
    ],
    resources: [{ type: 'Piling rigs', count: 2 }, { type: 'Concrete pumps', count: 2 }],
  },
  {
    id: 'p3', name: 'Structure (Floors 1-15)', duration: 24, startWeek: 24, color: 'bg-purple-500',
    status: 'active', completion: 68,
    tasks: [
      { name: 'Floor 1-5 slabs', done: true },
      { name: 'Floor 6-10 slabs', done: true },
      { name: 'Floor 11-13 slabs', done: true },
      { name: 'Floor 14-15 slabs', done: false },
      { name: 'Core walls', done: true },
    ],
    resources: [{ type: 'Tower cranes', count: 2 }, { type: 'Formwork crews', count: 3 }],
  },
  {
    id: 'p4', name: 'Structure (Floors 16-30)', duration: 20, startWeek: 48, color: 'bg-amber-500',
    status: 'upcoming', completion: 0,
    tasks: [
      { name: 'Floor 16-20 slabs', done: false },
      { name: 'Floor 21-25 slabs', done: false },
      { name: 'Floor 26-30 slabs', done: false },
      { name: 'Roof structure', done: false },
      { name: 'Crown installation', done: false },
    ],
    resources: [{ type: 'Tower cranes', count: 2 }, { type: 'Steel crew', count: 2 }],
  },
  {
    id: 'p5', name: 'Cladding & Facade', duration: 28, startWeek: 60, color: 'bg-pink-500',
    status: 'upcoming', completion: 0,
    tasks: [
      { name: 'Curtain wall install', done: false },
      { name: 'Window glazing', done: false },
      { name: 'Balcony rails', done: false },
      { name: 'External finishes', done: false },
    ],
    resources: [{ type: 'Gondolas', count: 8 }, { type: 'Glaziers', count: 16 }],
  },
  {
    id: 'p6', name: 'MEP & Fit-out', duration: 32, startWeek: 76, color: 'bg-cyan-500',
    status: 'upcoming', completion: 0,
    tasks: [
      { name: 'Electrical rough-in', done: false },
      { name: 'Plumbing', done: false },
      { name: 'HVAC install', done: false },
      { name: 'Fire services', done: false },
      { name: 'Smart building systems', done: false },
    ],
    resources: [{ type: 'Electricians', count: 20 }, { type: 'Plumbers', count: 12 }],
  },
  {
    id: 'p7', name: 'Final Handover', duration: 8, startWeek: 108, color: 'bg-indigo-500',
    status: 'upcoming', completion: 0,
    tasks: [
      { name: 'Defects rectification', done: false },
      { name: 'Commissioning', done: false },
      { name: 'Occupancy certificate', done: false },
      { name: 'Final inspection', done: false },
    ],
    resources: [{ type: 'Commissioning team', count: 6 }, { type: 'Inspectors', count: 4 }],
  },
];

const TOTAL_WEEKS = 116;

export default function ConstructionPhasing() {
  const [currentWeek, setCurrentWeek] = useState(42);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentWeek(prev => {
          if (prev >= TOTAL_WEEKS) {
            setIsPlaying(false);
            return TOTAL_WEEKS;
          }
          return prev + 1;
        });
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const activePhase = PHASES.find(p =>
    currentWeek >= p.startWeek && currentWeek < p.startWeek + p.duration
  );

  const progress = (currentWeek / TOTAL_WEEKS) * 100;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Construction Phasing</h2>
            <p className="text-gray-400 text-sm">Animated build sequence — week {currentWeek} of {TOTAL_WEEKS}</p>
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Progress</span>
          </div>
          <div className="text-2xl font-bold text-white">{progress.toFixed(0)}%</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Current Phase</span>
          </div>
          <div className="text-lg font-bold text-white truncate">{activePhase?.name || 'Pre-start'}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Weeks Remaining</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{TOTAL_WEEKS - currentWeek}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Est. Completion</span>
          </div>
          <div className="text-lg font-bold text-white">Mar 2028</div>
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="glass-panel rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-8 w-8 p-0" onClick={() => setCurrentWeek(0)}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button size="sm" className={`h-8 w-8 p-0 ${isPlaying ? 'bg-amber-600' : 'bg-emerald-600'}`} onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-8 w-8 p-0" onClick={() => setCurrentWeek(TOTAL_WEEKS)}>
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-8 w-8 p-0" onClick={() => { setCurrentWeek(0); setIsPlaying(false); }}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <input
            type="range"
            min="0"
            max={TOTAL_WEEKS}
            value={currentWeek}
            onChange={(e) => { setCurrentWeek(Number(e.target.value)); setIsPlaying(false); }}
            className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-xs text-gray-400 w-16 text-right">Week {currentWeek}</span>
        </div>

        {/* Phase timeline bars */}
        <div className="space-y-1.5">
          {PHASES.map((phase) => {
            const startPct = (phase.startWeek / TOTAL_WEEKS) * 100;
            const widthPct = (phase.duration / TOTAL_WEEKS) * 100;
            const isActive = currentWeek >= phase.startWeek && currentWeek < phase.startWeek + phase.duration;
            const isDone = currentWeek >= phase.startWeek + phase.duration;
            const activeWidth = isActive ? ((currentWeek - phase.startWeek) / phase.duration) * 100 : isDone ? 100 : 0;

            return (
              <div key={phase.id} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-28 truncate text-right">{phase.name}</span>
                <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full opacity-30"
                    style={{ left: `${startPct}%`, width: `${widthPct}%`, backgroundColor: phase.color.replace('bg-', '') }}
                  />
                  <motion.div
                    className={`absolute h-full rounded-full ${phase.color}`}
                    style={{ left: `${startPct}%` }}
                    animate={{ width: `${(widthPct * activeWidth) / 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-8">{activeWidth.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PHASES.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
            className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
              selectedPhase?.id === phase.id ? 'border-amber-500/30' :
              phase.status === 'active' ? 'border-blue-500/30' :
              phase.status === 'completed' ? 'border-emerald-500/20' :
              'border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                <span className="text-sm text-white font-medium">{phase.name}</span>
              </div>
              {phase.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {phase.status === 'active' && <Zap className="w-4 h-4 text-blue-400 animate-pulse" />}
              {phase.status === 'upcoming' && <Clock className="w-4 h-4 text-gray-500" />}
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                className={`h-full ${phase.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${phase.completion}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{phase.duration} weeks</span>
              <span className="text-gray-500">Wk {phase.startWeek}-{phase.startWeek + phase.duration}</span>
              <span className={phase.status === 'completed' ? 'text-emerald-400' : phase.status === 'active' ? 'text-blue-400' : 'text-gray-500'}>
                {phase.completion}%
              </span>
            </div>

            {selectedPhase?.id === phase.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-gray-700 space-y-2"
              >
                <div>
                  <div className="text-[10px] text-gray-500 mb-1 uppercase">Tasks</div>
                  <div className="space-y-1">
                    {phase.tasks.map((task, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs">
                        {task.done ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
                        <span className={task.done ? 'text-gray-400 line-through' : 'text-gray-300'}>{task.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 mb-1 uppercase">Resources</div>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.resources.map((r, j) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-300">
                        {r.count}× {r.type}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
