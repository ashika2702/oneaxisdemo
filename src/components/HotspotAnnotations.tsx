import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Plus, X, MessageSquare, Eye, Paperclip, CheckCircle,
  Clock, AlertTriangle, Users, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  category: 'design' | 'issue' | 'question' | 'approval' | 'note';
  author: string;
  createdAt: string;
  resolved: boolean;
  replies: Reply[];
  attachments: string[];
}

interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

const DEMO_HOTSPOTS: Hotspot[] = [
  {
    id: 'h1', x: 25, y: 30, title: 'Facade cladding query', description: 'Client wants to change from aluminium to terracotta panels on floors 15-20. Need cost impact and lead time.',
    category: 'question', author: 'Sarah Chen', createdAt: '2 hours ago', resolved: false,
    replies: [
      { id: 'r1', author: 'Mike Ross', content: 'Terracotta adds ~$180/m². Lead time is 14 weeks vs 6 for aluminium. I can get a sample board by Friday.', createdAt: '1 hour ago' },
    ],
    attachments: ['Cladding_Spec_v2.pdf'],
  },
  {
    id: 'h2', x: 60, y: 45, title: 'Balcony depth non-compliance', description: 'Level 8 balconies exceed maximum projection by 200mm per DCP. Need setback adjustment or variation.',
    category: 'issue', author: 'James Wright', createdAt: '1 day ago', resolved: false,
    replies: [],
    attachments: ['DCP_Section_4.3.pdf', 'Balcony_Plan.dwg'],
  },
  {
    id: 'h3', x: 45, y: 70, title: 'Lobby ceiling height approved', description: 'DA approval received for 4.2m lobby ceiling. Proceeding with millwork shop drawings.',
    category: 'approval', author: 'Lisa Park', createdAt: '3 days ago', resolved: true,
    replies: [
      { id: 'r2', author: 'David Kim', content: 'Millwork shop drawings issued to joiner. 6-week fabrication timeline confirmed.', createdAt: '2 days ago' },
    ],
    attachments: ['DA_Approval_Letter.pdf'],
  },
  {
    id: 'h4', x: 80, y: 25, title: 'Switch to low-VOC paints', description: 'Recommend switching to low-VOC paint system for all interior levels. Minor cost increase ($12K total) but improves Green Star score.',
    category: 'design', author: 'Emma Green', createdAt: '5 hours ago', resolved: false,
    replies: [
      { id: 'r3', author: 'Project Manager', content: 'Approved. Update the finishes schedule and notify the painting contractor.', createdAt: '3 hours ago' },
      { id: 'r4', author: 'Emma Green', content: 'Finishes schedule updated. Contractor notified via variation order #VO-2026-042.', createdAt: '2 hours ago' },
    ],
    attachments: ['Paint_Spec_LowVOC.pdf'],
  },
  {
    id: 'h5', x: 15, y: 55, title: 'Access for tower crane B', description: 'Need to confirm crane base location. Geotechnical report indicates bearing capacity is sufficient at proposed location.',
    category: 'note', author: 'Tom Baker', createdAt: '1 week ago', resolved: true,
    replies: [
      { id: 'r5', author: 'Structural Engineer', content: 'Crane base design confirmed. Piling contractor can proceed with CA2 foundation.', createdAt: '5 days ago' },
    ],
    attachments: ['Crane_Base_Design.pdf', 'Geotech_Report.pdf'],
  },
  {
    id: 'h6', x: 70, y: 60, title: 'Parking bay width issue', description: 'B1 level parking bays measuring 2.3m clear — AS2890 requires 2.6m minimum for visitor spaces. Need redesign.',
    category: 'issue', author: 'Sarah Chen', createdAt: '12 hours ago', resolved: false,
    replies: [],
    attachments: ['AS2890_Extract.pdf'],
  },
];

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  design: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: <Eye className="w-3 h-3" />, label: 'Design' },
  issue: { color: 'text-red-400', bg: 'bg-red-500/20', icon: <AlertTriangle className="w-3 h-3" />, label: 'Issue' },
  question: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <MessageSquare className="w-3 h-3" />, label: 'Question' },
  approval: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <CheckCircle className="w-3 h-3" />, label: 'Approval' },
  note: { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: <Paperclip className="w-3 h-3" />, label: 'Note' },
};

export default function HotspotAnnotations() {
  const [hotspots] = useState<Hotspot[]>(DEMO_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [addingHotspot, setAddingHotspot] = useState(false);

  const filtered = hotspots.filter(h => {
    const matchCategory = categoryFilter === 'all' || h.category === categoryFilter;
    const matchResolved = showResolved || !h.resolved;
    return matchCategory && matchResolved;
  });

  const openCount = hotspots.filter(h => !h.resolved).length;
  const resolvedCount = hotspots.filter(h => h.resolved).length;

  return (
    <div className="h-full flex">
      {/* Hotspot Map Area */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {/* Floor plan placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[80%] h-[80%] border-2 border-dashed border-gray-700 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <BuildingIcon className="w-32 h-32 text-gray-800" />
            </div>
            <div className="absolute top-4 left-4 text-xs text-gray-600">Level 8 — Floor Plan</div>

            {/* Hotspot pins */}
            {filtered.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSelectedHotspot(hotspot)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  selectedHotspot?.id === hotspot.id ? 'border-white scale-110' :
                  hotspot.resolved ? 'border-emerald-500' :
                  hotspot.category === 'issue' ? 'border-red-500' :
                  hotspot.category === 'question' ? 'border-blue-500' :
                  'border-purple-500'
                } ${CATEGORY_CONFIG[hotspot.category]?.bg} transition-all hover:scale-110`}>
                  <MapPin className={`w-3 h-3 ${CATEGORY_CONFIG[hotspot.category]?.color}`} />
                </div>
                {selectedHotspot?.id === hotspot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 rounded px-2 py-1 text-[10px] text-white border border-gray-600"
                  >
                    {hotspot.title}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Add hotspot button */}
        <button
          onClick={() => setAddingHotspot(!addingHotspot)}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
        >
          <Plus className="w-5 h-5" />
        </button>

        {addingHotspot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-16 right-4 bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs text-gray-300 max-w-[200px]"
          >
            Click anywhere on the floor plan to place a new hotspot
          </motion.div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-80 glass-panel border-l border-gray-700 overflow-y-auto scrollbar-thin">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">Annotations</h3>
            <div className="flex gap-1.5">
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded">{openCount} open</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded">{resolvedCount} done</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-1 mb-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                categoryFilter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                  categoryFilter === key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {config.icon}
                {config.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-gray-600"
            />
            Show resolved
          </label>
        </div>

        {/* Hotspot list */}
        <div className="divide-y divide-gray-800">
          {filtered.map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => setSelectedHotspot(selectedHotspot?.id === hotspot.id ? null : hotspot)}
              className={`w-full text-left p-3 transition-all hover:bg-gray-800/50 ${
                selectedHotspot?.id === hotspot.id ? 'bg-gray-800/50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${CATEGORY_CONFIG[hotspot.category]?.bg}`}>
                  <span className={CATEGORY_CONFIG[hotspot.category]?.color}>
                    {CATEGORY_CONFIG[hotspot.category]?.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-white font-medium truncate">{hotspot.title}</span>
                    {hotspot.resolved && <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{hotspot.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-gray-600">{hotspot.author}</span>
                    <span className="text-[10px] text-gray-600">{hotspot.createdAt}</span>
                    {hotspot.replies.length > 0 && (
                      <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {hotspot.replies.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="glass-panel border-l border-gray-700 overflow-y-auto scrollbar-thin flex-shrink-0"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] ${CATEGORY_CONFIG[selectedHotspot.category]?.bg} ${CATEGORY_CONFIG[selectedHotspot.category]?.color}`}>
                  {CATEGORY_CONFIG[selectedHotspot.category]?.label}
                </span>
                <button onClick={() => setSelectedHotspot(null)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-white font-semibold mb-2">{selectedHotspot.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{selectedHotspot.description}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>{selectedHotspot.author}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedHotspot.createdAt}</span>
              </div>

              {selectedHotspot.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] text-gray-500 uppercase mb-1.5">Attachments</div>
                  <div className="space-y-1">
                    {selectedHotspot.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 text-xs">
                        <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-300 truncate">{att}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Replies */}
              <div className="mb-4">
                <div className="text-[10px] text-gray-500 uppercase mb-2">Replies ({selectedHotspot.replies.length})</div>
                <div className="space-y-3">
                  {selectedHotspot.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-white font-medium">{reply.author}</span>
                        <span className="text-[10px] text-gray-500">{reply.createdAt}</span>
                      </div>
                      <p className="text-xs text-gray-400">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => { if (e.key === 'Enter' && replyText.trim()) { setReplyText(''); } }}
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 h-8 px-3" onClick={() => { if (replyText.trim()) setReplyText(''); }}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9h1" />
      <path d="M9 13h1" />
      <path d="M13 13h1" />
      <path d="M13 17h1" />
    </svg>
  );
}
