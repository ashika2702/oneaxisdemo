import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest, CheckCircle, Clock, AlertTriangle, Eye,
  ChevronRight, Send, RotateCcw, User, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkflowItem {
  id: string;
  name: string;
  type: 'model' | 'pricing' | 'content' | 'config';
  currentStage: 'draft' | 'review' | 'approve' | 'published';
  author: string;
  reviewer?: string;
  approver?: string;
  updatedAt: string;
  history: { stage: string; by: string; at: string; note: string }[];
  pendingNote?: string;
}

const WORKFLOW_ITEMS: WorkflowItem[] = [
  {
    id: 'w1', name: 'Harbour Residences — 3D Model v3', type: 'model', currentStage: 'review',
    author: 'Lisa Park', reviewer: 'Mike Ross', updatedAt: '2 hr ago',
    history: [
      { stage: 'Draft', by: 'Lisa Park', at: '1 Jul 2026', note: 'Uploaded revised L15-20 geometry' },
      { stage: 'Review', by: 'Lisa Park', at: '2 Jul 2026', note: 'Submitted for internal review' },
    ],
    pendingNote: 'Awaiting reviewer sign-off before client presentation',
  },
  {
    id: 'w2', name: 'Updated Pricing — July Release', type: 'pricing', currentStage: 'approve',
    author: 'Sarah Williams', reviewer: 'Mike Ross', approver: 'David Chen', updatedAt: '30 min ago',
    history: [
      { stage: 'Draft', by: 'Sarah Williams', at: '30 Jun 2026', note: 'Applied demand-based adjustments' },
      { stage: 'Review', by: 'Mike Ross', at: '1 Jul 2026', note: 'Approved with minor corrections' },
      { stage: 'Approve', by: 'Mike Ross', at: '2 Jul 2026', note: 'Escalated to David for final approval' },
    ],
    pendingNote: 'Requires owner approval before publishing to live engine',
  },
  {
    id: 'w3', name: 'Marketing Content Pack — Q3', type: 'content', currentStage: 'published',
    author: 'Emma Green', reviewer: 'Sarah Williams', approver: 'David Chen', updatedAt: '1 day ago',
    history: [
      { stage: 'Draft', by: 'Emma Green', at: '28 Jun 2026', note: 'Generated 12 assets via AI' },
      { stage: 'Review', by: 'Sarah Williams', at: '29 Jun 2026', note: 'Approved with copy edits' },
      { stage: 'Approve', by: 'David Chen', at: '30 Jun 2026', note: 'Approved for release' },
      { stage: 'Published', by: 'Emma Green', at: '1 Jul 2026', note: 'Live on engine + microsite' },
    ],
  },
  {
    id: 'w4', name: 'Unit Configuration — Penthouse B', type: 'config', currentStage: 'draft',
    author: 'Lisa Park', updatedAt: '4 hr ago',
    history: [
      { stage: 'Draft', by: 'Lisa Park', at: '2 Jul 2026', note: 'Custom finishes for PH-B' },
    ],
    pendingNote: 'Ready for review — custom kitchen spec needs approval',
  },
  {
    id: 'w5', name: 'Brochure v2 — Mandarin Translation', type: 'content', currentStage: 'review',
    author: 'Tom Baker', reviewer: 'Sarah Williams', updatedAt: '5 hr ago',
    history: [
      { stage: 'Draft', by: 'Tom Baker', at: '1 Jul 2026', note: 'Translated via Multilingual Engine' },
      { stage: 'Review', by: 'Tom Baker', at: '2 Jul 2026', note: 'Submitted for language review' },
    ],
    pendingNote: 'Waiting for native speaker validation',
  },
];

const STAGE_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  draft: { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: <FileText className="w-3.5 h-3.5" />, label: 'Draft' },
  review: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Eye className="w-3.5 h-3.5" />, label: 'In Review' },
  approve: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Clock className="w-3.5 h-3.5" />, label: 'Pending Approval' },
  published: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Published' },
};

const STAGES = ['draft', 'review', 'approve', 'published'];

export default function ApprovalWorkflow() {
  const [items, setItems] = useState<WorkflowItem[]>(WORKFLOW_ITEMS);
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [actionNote, setActionNote] = useState('');

  const filtered = filter === 'all' ? items : items.filter(i => i.currentStage === filter);

  const advanceItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const currentIdx = STAGES.indexOf(item.currentStage);
      if (currentIdx >= STAGES.length - 1) return item;
      const nextStage = STAGES[currentIdx + 1] as WorkflowItem['currentStage'];
      return {
        ...item,
        currentStage: nextStage,
        history: [...item.history, { stage: STAGE_CONFIG[nextStage]?.label || nextStage, by: 'You', at: 'Just now', note: actionNote || 'Advanced to next stage' }],
        pendingNote: undefined,
      };
    }));
    setActionNote('');
  };

  const revertItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const currentIdx = STAGES.indexOf(item.currentStage);
      if (currentIdx <= 0) return item;
      const prevStage = STAGES[currentIdx - 1] as WorkflowItem['currentStage'];
      return {
        ...item,
        currentStage: prevStage,
        history: [...item.history, { stage: 'Reverted', by: 'You', at: 'Just now', note: actionNote || 'Reverted to previous stage' }],
        pendingNote: undefined,
      };
    }));
    setActionNote('');
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Approval Workflow</h2>
            <p className="text-gray-400 text-sm">Draft → Review → Approve → Publish with full history</p>
          </div>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {STAGES.map(stage => (
          <div key={stage} className="glass-panel rounded-xl p-3 text-center">
            <div className={`text-lg font-bold ${STAGE_CONFIG[stage]?.color}`}>{items.filter(i => i.currentStage === stage).length}</div>
            <div className="text-[10px] text-gray-500">{STAGE_CONFIG[stage]?.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}>All</button>
        {STAGES.map(stage => (
          <button key={stage} onClick={() => setFilter(stage)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === stage ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}>
            {STAGE_CONFIG[stage]?.label} ({items.filter(i => i.currentStage === stage).length})
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
              selectedItem?.id === item.id ? 'border-teal-500/30' : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${STAGE_CONFIG[item.currentStage]?.bg} flex items-center justify-center`}>
                  <span className={STAGE_CONFIG[item.currentStage]?.color}>{STAGE_CONFIG[item.currentStage]?.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{item.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${STAGE_CONFIG[item.currentStage]?.bg} ${STAGE_CONFIG[item.currentStage]?.color}`}>
                      {STAGE_CONFIG[item.currentStage]?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span>{item.updatedAt}</span>
                    {item.reviewer && <span>• Reviewer: {item.reviewer}</span>}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${selectedItem?.id === item.id ? 'rotate-90' : ''}`} />
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1 mt-3 ml-11">
              {STAGES.map((stage, idx) => {
                const currentIdx = STAGES.indexOf(item.currentStage);
                const isDone = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-blue-400' : 'bg-gray-700'}`} />
                    {idx < STAGES.length - 1 && <div className={`w-6 h-0.5 ${idx < currentIdx ? 'bg-emerald-500/30' : 'bg-gray-700'}`} />}
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedItem?.id === item.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-gray-700">
                  {/* History */}
                  <div className="space-y-2 mb-3">
                    {item.history.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-2.5 h-2.5 text-gray-400" />
                        </div>
                        <div>
                          <span className="text-gray-300">{h.stage}</span>
                          <span className="text-gray-500"> by {h.by} • {h.at}</span>
                          <p className="text-gray-500">{h.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {item.pendingNote && (
                    <div className="bg-amber-500/5 rounded-lg p-2 mb-3 border border-amber-500/10">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span className="text-xs text-amber-400">{item.pendingNote}</span>
                      </div>
                    </div>
                  )}

                  {item.currentStage !== 'published' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={actionNote}
                        onChange={(e) => setActionNote(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-teal-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-500" onClick={(e) => { e.stopPropagation(); advanceItem(item.id); }}>
                        <Send className="w-3.5 h-3.5 mr-1" />Advance
                      </Button>
                      {item.currentStage !== 'draft' && (
                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" onClick={(e) => { e.stopPropagation(); revertItem(item.id); }}>
                          <RotateCcw className="w-3.5 h-3.5 mr-1" />Revert
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
