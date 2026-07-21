import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch, CheckCircle, Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModelVersion {
  id: string;
  version: string;
  name: string;
  author: string;
  createdAt: string;
  status: 'published' | 'draft' | 'archived';
  changes: { type: 'added' | 'removed' | 'modified' | 'repriced'; description: string; count: number }[];
  pinned: boolean;
}

const VERSIONS: ModelVersion[] = [
  {
    id: 'v3', version: 'v3', name: 'Harbour Residences — Current',
    author: 'Lisa Park', createdAt: '2 Jul 2026', status: 'published', pinned: true,
    changes: [
      { type: 'removed', description: 'Units removed on Level 7', count: 2 },
      { type: 'modified', description: 'Units resized', count: 4 },
      { type: 'repriced', description: 'Units repriced', count: 12 },
      { type: 'added', description: 'Balcony upgrades added', count: 8 },
    ],
  },
  {
    id: 'v2', version: 'v2', name: 'Harbour Residences — June Revision',
    author: 'Lisa Park', createdAt: '15 Jun 2026', status: 'archived', pinned: false,
    changes: [
      { type: 'modified', description: 'Level 10-15 layouts revised', count: 6 },
      { type: 'repriced', description: 'Price adjustment post-launch', count: 18 },
      { type: 'added', description: 'Penthouse config added', count: 2 },
    ],
  },
  {
    id: 'v1', version: 'v1', name: 'Harbour Residences — Launch',
    author: 'Lisa Park', createdAt: '1 May 2026', status: 'archived', pinned: false,
    changes: [
      { type: 'added', description: 'Initial model upload', count: 92 },
    ],
  },
];

const CHANGE_COLORS: Record<string, { color: string; bg: string }> = {
  added: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  removed: { color: 'text-red-400', bg: 'bg-red-500/20' },
  modified: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  repriced: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
};

export default function ModelVersioning() {
  const [selectedVersion, setSelectedVersion] = useState<ModelVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [v1Selected, setV1Selected] = useState<string | null>(null);
  const [v2Selected, setV2Selected] = useState<string | null>(null);

  const currentVersion = VERSIONS.find(v => v.status === 'published');

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Model Versioning</h2>
            <p className="text-gray-400 text-sm">Never silent mutations. Every change tracked and promoted.</p>
          </div>
        </div>
      </div>

      {/* Current version banner */}
      {currentVersion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-5 mb-6 border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{currentVersion.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">Published</span>
                </div>
                <div className="text-xs text-gray-500">By {currentVersion.author} • {currentVersion.createdAt}</div>
              </div>
            </div>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-500">
              <Plus className="w-3.5 h-3.5 mr-1" />New Version
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            {currentVersion.changes.map((c, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-[10px] ${CHANGE_COLORS[c.type]?.bg} ${CHANGE_COLORS[c.type]?.color}`}>
                {c.count > 0 ? '+' : ''}{c.count} {c.type}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Compare mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setCompareMode(!compareMode); setV1Selected(null); setV2Selected(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            compareMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-gray-400 hover:bg-gray-800/50'
          }`}
        >
          Compare Versions
        </button>
      </div>

      {/* Version list */}
      <div className="space-y-3">
        {VERSIONS.map((version, i) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-panel rounded-xl p-4 border transition-all cursor-pointer ${
              selectedVersion?.id === version.id ? 'border-orange-500/30' :
              v1Selected === version.id || v2Selected === version.id ? 'border-blue-500/30' :
              'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => {
              if (compareMode) {
                if (!v1Selected) setV1Selected(version.id);
                else if (!v2Selected && v1Selected !== version.id) setV2Selected(version.id);
                else { setV1Selected(version.id); setV2Selected(null); }
              } else {
                setSelectedVersion(selectedVersion?.id === version.id ? null : version);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {compareMode && (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${
                    v1Selected === version.id ? 'bg-blue-500 border-blue-500 text-white' :
                    v2Selected === version.id ? 'bg-purple-500 border-purple-500 text-white' :
                    'border-gray-600'
                  }`}>
                    {v1Selected === version.id ? 'A' : v2Selected === version.id ? 'B' : ''}
                  </div>
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  version.status === 'published' ? 'bg-emerald-500/20' :
                  version.status === 'draft' ? 'bg-blue-500/20' :
                  'bg-gray-700'
                }`}>
                  <span className={`text-xs font-bold ${
                    version.status === 'published' ? 'text-emerald-400' :
                    version.status === 'draft' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>{version.version}</span>
                </div>
                <div>
                  <span className="text-sm text-white font-medium">{version.name}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>By {version.author}</span>
                    <span>•</span>
                    <span>{version.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  version.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                  version.status === 'draft' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {version.status}
                </span>
                <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${selectedVersion?.id === version.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {selectedVersion?.id === version.id && !compareMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-500 mb-2">Change Summary</div>
                <div className="space-y-1.5">
                  {version.changes.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${CHANGE_COLORS[c.type]?.bg} ${CHANGE_COLORS[c.type]?.color} w-16 text-center capitalize`}>
                        {c.type}
                      </span>
                      <span className="text-xs text-gray-300">{c.description}</span>
                      <span className={`text-xs ml-auto ${CHANGE_COLORS[c.type]?.color} font-medium`}>
                        {c.count > 0 ? '+' : ''}{c.count}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Diff view */}
      {compareMode && v1Selected && v2Selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-5 mt-4 border-blue-500/20">
          <h4 className="text-sm text-white font-medium mb-3">
            Diff: {VERSIONS.find(v => v.id === v1Selected)?.version} → {VERSIONS.find(v => v.id === v2Selected)?.version}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">-2</span>
              <span className="text-gray-300">Units removed on Level 7 (2× 1-bed)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">~4</span>
              <span className="text-gray-300">Unit areas modified (3× 2-bed enlarged, 1× studio reduced)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">$12</span>
              <span className="text-gray-300">Units repriced (avg +3.2% adjustment)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">+8</span>
              <span className="text-gray-300">Balcony upgrade options added</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
