import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, Database, Brain, TrendingUp, Users, Target,
  Globe, ArrowRight, CheckCircle, Activity, Zap
} from 'lucide-react';

interface FlywheelMetric {
  label: string;
  value: string;
  change: number;
  description: string;
}

const METRICS: FlywheelMetric[] = [
  { label: 'Projects Instrumented', value: '84', change: 12, description: 'Active projects feeding data' },
  { label: 'Buyer Events (M)', value: '2.4M', change: 28, description: 'Interactions this quarter' },
  { label: 'Drift Predictions', value: '14,892', change: 34, description: 'Buyer risk scores generated' },
  { label: 'Training Pairs', value: '8,420', change: 45, description: 'Designer-corrected extraction pairs' },
  { label: 'Extraction Accuracy', value: '91.4%', change: 3.2, description: 'AI plan-to-model accuracy' },
  { label: 'Market Corridors', value: '26', change: 8, description: 'Anonymised demand signals' },
];

const DATA_STREAMS = [
  { id: 'behavioural', name: 'Behavioural Events', icon: <Users className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/20', count: '2.4M events', feeds: 'Drift Scoring, Settlement Risk, Sell-Through' },
  { id: 'extraction', name: 'Extraction Training Pairs', icon: <Database className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-500/20', count: '8,420 pairs', feeds: 'Plan-to-Model AI, Accuracy improvement' },
  { id: 'market', name: 'Market Demand Signals', icon: <Globe className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20', count: '26 corridors', feeds: 'Axis Markets, Pricing recommendations' },
];

const COMPOUNDING_EFFECTS = [
  { project: 10, driftAccuracy: 72, extractionAccuracy: 78, marketCoverage: 8 },
  { project: 25, driftAccuracy: 81, extractionAccuracy: 85, marketCoverage: 14 },
  { project: 50, driftAccuracy: 88, extractionAccuracy: 91, marketCoverage: 20 },
  { project: 100, driftAccuracy: 93, extractionAccuracy: 95, marketCoverage: 28 },
  { project: 200, driftAccuracy: 96, extractionAccuracy: 97, marketCoverage: 40 },
];

export default function DataFlywheel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'streams' | 'compounding'>('overview');

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Data Flywheel</h2>
            <p className="text-gray-400 text-sm">Every project makes every model smarter</p>
          </div>
        </div>
      </div>

      {/* Hero statement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-5 mb-6 border-cyan-500/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">The Moat</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Three datasets with explicit schemas, ownership terms, and versioning. Each project makes every model smarter. 
          This clause in the client contract is as important as any feature. After ~50 projects: anonymised demand-velocity 
          intelligence by corridor — months ahead of settlement-based data. If banks accept these as presale evidence, 
          OneAxis becomes financing infrastructure.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['overview', 'streams', 'compounding'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'compounding' ? 'Compounding Effect' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{m.label}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                    <TrendingUp className="w-3 h-3" />+{m.change}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-[10px] text-gray-500 mt-1">{m.description}</div>
              </motion.div>
            ))}
          </div>

          {/* The flywheel visual */}
          <div className="glass-panel rounded-xl p-6 mt-4 border-cyan-500/10">
            <h4 className="text-sm text-white font-medium mb-4 text-center">The Flywheel Loop</h4>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center w-32">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xs text-white font-medium">Buyer Events</div>
                <div className="text-[10px] text-gray-400">Viewer, widget, portal</div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center w-32">
                <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xs text-white font-medium">Models Train</div>
                <div className="text-[10px] text-gray-400">Drift, risk, sell-through</div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center w-32">
                <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs text-white font-medium">Better Predictions</div>
                <div className="text-[10px] text-gray-400">Accuracy improves</div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center w-32">
                <CheckCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-xs text-white font-medium">More Sales</div>
                <div className="text-[10px] text-gray-400">Developers win</div>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <ArrowRight className="w-5 h-5 text-cyan-400 rotate-90" />
            </div>
            <div className="text-center">
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-3 text-center inline-block">
                <div className="text-xs text-cyan-400 font-medium">More projects instrumented → More events → Smarter models</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'streams' && (
        <div className="space-y-4">
          {DATA_STREAMS.map((stream, i) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${stream.bg} flex items-center justify-center`}>
                  <span className={stream.color}>{stream.icon}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{stream.name}</h4>
                  <span className={`text-xs ${stream.color}`}>{stream.count}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Feeds: <span className="text-gray-300">{stream.feeds}</span></p>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${stream.bg.replace('/20', '')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${60 + i * 15}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </motion.div>
          ))}

          <div className="glass-panel rounded-xl p-4 border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">Data Contracts</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                Client consents to anonymised data use at contract signing
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                All data versioned and schema'd — not incidental
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                Ownership stays with client; OneAxis holds anonymised/aggregated rights
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compounding' && (
        <div className="glass-panel rounded-xl p-5">
          <h4 className="text-sm text-white font-medium mb-4">Model Accuracy vs. Projects Instrumented</h4>
          <div className="space-y-4">
            {COMPOUNDING_EFFECTS.map((point, i) => (
              <motion.div
                key={point.project}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-white font-medium w-20">{point.project} projects</span>
                  <div className="flex-1 flex gap-1">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-blue-400">Drift</span>
                        <span className="text-gray-400">{point.driftAccuracy}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${point.driftAccuracy}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-purple-400">Extract</span>
                        <span className="text-gray-400">{point.extractionAccuracy}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${point.extractionAccuracy}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                    <div className="w-16">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-emerald-400">Markets</span>
                        <span className="text-gray-400">{point.marketCoverage}</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${point.marketCoverage * 2}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
            <p className="text-xs text-cyan-400">
              At 200 projects: Drift 96% accuracy, Extraction 97%, Market coverage 40 corridors. 
              This is the compounding advantage no competitor can shortcut.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
