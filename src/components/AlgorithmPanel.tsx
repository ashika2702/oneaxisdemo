import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Brain, TrendingUp, Target, Zap, Shield,
  Activity, Clock, Database, Eye, Sigma
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: 'pricing' | 'scoring' | 'prediction' | 'risk' | 'matching';
  confidence: number;
  accuracy: number;
  lastRun: string;
  inputs: string[];
  formula: string;
  status: 'active' | 'training' | 'calibrating';
}

const ALGORITHMS: Algorithm[] = [
  {
    id: 'drift-score',
    name: 'Drift Scoring Engine',
    description: 'Predicts buyer disengagement 14-21 days before they go cold. Combines session recency, page depth, repeat visits, and content affinity into a composite decay score.',
    category: 'scoring',
    confidence: 94.2,
    accuracy: 91.5,
    lastRun: '2 min ago',
    inputs: ['Session recency', 'Page depth', 'Repeat visits', 'Content affinity', 'Email open rate'],
    formula: 'Drift = Σ(w₁×recency + w₂×depth + w₃×frequency + w₄×affinity) × decay_factor(t)',
    status: 'active',
  },
  {
    id: 'demand-pricing',
    name: 'Demand-Based Pricing',
    description: 'Dynamic price recommendations based on real-time enquiry velocity, comparable sales, inventory levels, and seasonal demand patterns.',
    category: 'pricing',
    confidence: 88.7,
    accuracy: 86.2,
    lastRun: '15 min ago',
    inputs: ['Enquiry velocity', 'Comparable sales', 'Inventory level', 'Seasonal index', 'Absorption rate'],
    formula: 'P_optimal = P_base × (1 + α×demand_index - β×inventory_pressure + γ×seasonality)',
    status: 'active',
  },
  {
    id: 'sell-through',
    name: 'Predictive Sell-Through',
    description: 'Forecasts unit sales velocity by type, floor, and aspect. Uses historical absorption curves, market conditions, and buyer pipeline depth.',
    category: 'prediction',
    confidence: 91.3,
    accuracy: 89.8,
    lastRun: '1 hr ago',
    inputs: ['Historical absorption', 'Market velocity', 'Pipeline depth', 'Unit attributes', 'Pricing position'],
    formula: 'SellThrough = f(absorption_curve, market_multiplier, pipeline_quality, unit_premium)',
    status: 'active',
  },
  {
    id: 'settlement-risk',
    name: 'Settlement Risk Classifier',
    description: 'Flags buyers at risk of failed settlement 30+ days in advance. Monitors finance approval status, engagement decay, and solicitor responsiveness.',
    category: 'risk',
    confidence: 89.5,
    accuracy: 87.3,
    lastRun: '30 min ago',
    inputs: ['Finance status', 'Drift score', 'Solicitor latency', 'Contract age', 'Buyer profile'],
    formula: 'Risk = σ(w₁×finance + w₂×drift + w₃×legal + w₄×demographic) → [0-100]',
    status: 'active',
  },
  {
    id: 'true-view',
    name: 'True View Scoring',
    description: 'Evaluates unit view quality using building height data, aspect analysis, and surrounding obstruction mapping. Scores 1-10 per directional view.',
    category: 'matching',
    confidence: 96.1,
    accuracy: 94.0,
    lastRun: '5 min ago',
    inputs: ['Building height', 'Aspect angle', 'Obstruction map', 'Distance to feature', 'Elevation data'],
    formula: 'ViewScore = Σ(visibility × feature_weight × distance_decay) / max_possible × 10',
    status: 'active',
  },
  {
    id: 'sun-calc',
    name: 'Solar Ephemeris Calculator',
    description: 'Computes precise sun position for any date/time using latitude, longitude, and timezone. Drives shadow casting and face exposure analysis.',
    category: 'prediction',
    confidence: 99.8,
    accuracy: 99.9,
    lastRun: 'Realtime',
    inputs: ['Lat/Lng', 'Date/Time', 'Timezone', 'Building geometry', 'Seasonal offset'],
    formula: 'altitude = arcsin(sin(δ)×sin(φ) + cos(δ)×cos(φ)×cos(H)), azimuth = arctan2(sin(H), cos(H)×sin(φ) - tan(δ)×cos(φ))',
    status: 'active',
  },
  {
    id: 'optioneer',
    name: 'AI Optioneer',
    description: 'Generates optimal project configurations using constraint satisfaction across unit mix, pricing, and revenue targets.',
    category: 'pricing',
    confidence: 85.4,
    accuracy: 82.1,
    lastRun: '3 hrs ago',
    inputs: ['Unit mix constraints', 'Revenue target', 'Market demand', 'Cost structure', 'Timeline'],
    formula: 'maximize(Revenue) subject to: mix_constraints, cost_budget, timeline, market_absorption',
    status: 'calibrating',
  },
  {
    id: 'lead-score',
    name: 'Lead Quality Scorer',
    description: 'Ranks inbound leads by conversion probability using source channel, enquiry depth, demographic fit, and engagement pattern.',
    category: 'scoring',
    confidence: 87.6,
    accuracy: 84.9,
    lastRun: '10 min ago',
    inputs: ['Source channel', 'Enquiry depth', 'Demographic fit', 'Engagement pattern', 'Budget signal'],
    formula: 'LeadScore = softmax(channel_weight × depth_score × fit_index × engagement_decay) × 100',
    status: 'training',
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pricing: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <DollarIcon className="w-4 h-4" /> },
  scoring: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: <Target className="w-4 h-4" /> },
  prediction: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: <TrendingUp className="w-4 h-4" /> },
  risk: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <Shield className="w-4 h-4" /> },
  matching: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: <Eye className="w-4 h-4" /> },
};

export default function AlgorithmPanel() {
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = categoryFilter === 'all'
    ? ALGORITHMS
    : ALGORITHMS.filter(a => a.category === categoryFilter);

  const avgConfidence = (ALGORITHMS.reduce((a, alg) => a + alg.confidence, 0) / ALGORITHMS.length).toFixed(1);
  const avgAccuracy = (ALGORITHMS.reduce((a, alg) => a + alg.accuracy, 0) / ALGORITHMS.length).toFixed(1);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Algorithm Transparency</h2>
            <p className="text-gray-400 text-sm">Formulas, confidence scores, data sources & model health</p>
          </div>
        </div>
      </div>

      {/* System health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Models Active</span>
          </div>
          <div className="text-2xl font-bold text-white">{ALGORITHMS.length}</div>
          <div className="text-[10px] text-emerald-400">{ALGORITHMS.filter(a => a.status === 'active').length} running</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Avg. Confidence</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{avgConfidence}%</div>
          <div className="text-[10px] text-gray-500">Across all models</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Avg. Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{avgAccuracy}%</div>
          <div className="text-[10px] text-gray-500">Backtested on historical</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Data Points/Day</span>
          </div>
          <div className="text-2xl font-bold text-white">2.4M</div>
          <div className="text-[10px] text-emerald-400">+12% vs last week</div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            categoryFilter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          All ({ALGORITHMS.length})
        </button>
        {Object.entries(CATEGORY_COLORS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setCategoryFilter(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              categoryFilter === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {config.icon}
            {key}
          </button>
        ))}
      </div>

      {/* Algorithm list */}
      <div className="space-y-3">
        {filtered.map((algo, i) => (
          <motion.div
            key={algo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedAlgo(selectedAlgo?.id === algo.id ? null : algo)}
            className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
              selectedAlgo?.id === algo.id ? 'border-cyan-500/30' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${CATEGORY_COLORS[algo.category]?.bg} flex items-center justify-center`}>
                  <span className={CATEGORY_COLORS[algo.category]?.text}>
                    {CATEGORY_COLORS[algo.category]?.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{algo.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      algo.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      algo.status === 'training' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {algo.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{algo.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-sm text-white font-medium">{algo.confidence}%</div>
                  <div className="text-[10px] text-gray-500">confidence</div>
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{algo.accuracy}%</div>
                  <div className="text-[10px] text-gray-500">accuracy</div>
                </div>
              </div>
            </div>

            {/* Confidence bars */}
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">Model Confidence</span>
                  <span className="text-gray-400">{algo.confidence}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${algo.confidence}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">Historical Accuracy</span>
                  <span className="text-gray-400">{algo.accuracy}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${algo.accuracy}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {selectedAlgo?.id === algo.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-700 space-y-3"
              >
                {/* Formula */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sigma className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs text-cyan-400 font-medium">FORMULA</span>
                  </div>
                  <code className="text-xs text-gray-300 font-mono break-all">{algo.formula}</code>
                </div>

                {/* Inputs */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">INPUT FEATURES ({algo.inputs.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {algo.inputs.map(input => (
                      <span key={input} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                        {input}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last run */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    Last run: {algo.lastRun}
                  </div>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-7 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Run Now
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
