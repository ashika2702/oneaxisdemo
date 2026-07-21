import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Eye, Bed, Bath, Maximize, MapPin, Phone,
  Mail, ChevronRight, X, Expand, CheckCircle2, ArrowRight,
  Home, Compass, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/* ═══════════════════════════════════════════
   EMBED WIDGET — Customer Website Integration
   Lightweight, configurable, brandable
   ═══════════════════════════════════════════ */

interface EmbedConfig {
  projectId: string;
  projectName: string;
  theme: 'light' | 'dark' | 'auto';
  viewMode: 'gallery' | '3d' | 'list' | 'map';
  showPricing: boolean;
  showContact: boolean;
  primaryColor: string;
  accentColor: string;
  height: string;
  width: string;
}

const mockUnits = [
  { id: '1', number: '1201', type: '2 Bedroom', floor: 12, area: 94, bedrooms: 2, bathrooms: 2, price: 720000, view: 'Harbour', status: 'available', image: 'azure-heights-exterior' },
  { id: '2', number: '1202', type: '2 Bedroom', floor: 12, area: 89, bedrooms: 2, bathrooms: 2, price: 695000, view: 'City', status: 'available', image: 'azure-heights-exterior' },
  { id: '3', number: '1203', type: '1 Bedroom', floor: 12, area: 62, bedrooms: 1, bathrooms: 1, price: 485000, view: 'Garden', status: 'reserved', image: 'azure-heights-exterior' },
  { id: '4', number: '1501', type: '3 Bedroom', floor: 15, area: 128, bedrooms: 3, bathrooms: 2, price: 1050000, view: 'Harbour', status: 'available', image: 'azure-heights-exterior' },
  { id: '5', number: '1502', type: '3 Bedroom', floor: 15, area: 135, bedrooms: 3, bathrooms: 3, price: 1200000, view: 'Panoramic', status: 'available', image: 'azure-heights-exterior' },
  { id: '6', number: '801', type: 'Studio', floor: 8, area: 45, bedrooms: 0, bathrooms: 1, price: 385000, view: 'City', status: 'sold', image: 'azure-heights-exterior' },
];

export default function EmbedWidget() {
  const [config] = useState<EmbedConfig>({
    projectId: 'demo-1',
    projectName: 'Azure Heights Tower',
    theme: 'light',
    viewMode: 'gallery',
    showPricing: true,
    showContact: true,
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    height: '600px',
    width: '100%',
  });

  const [selectedUnit, setSelectedUnit] = useState<typeof mockUnits[0] | null>(null);
  const [activeView, setActiveView] = useState<'gallery' | 'list' | 'detail'>('gallery');
  const [filterType, setFilterType] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const isDark = config.theme === 'dark' || (config.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const filteredUnits = filterType === 'all'
    ? mockUnits
    : mockUnits.filter((u) => u.type.toLowerCase().includes(filterType.toLowerCase()));

  const bgClass = isDark ? 'bg-[#0a0e1a] text-white' : 'bg-white text-gray-900';
  const cardClass = isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  if (activeView === 'detail' && selectedUnit) {
    return (
      <div className={`${bgClass} rounded-2xl border overflow-hidden shadow-xl`} style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Detail View */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Building2 className="w-20 h-20 opacity-20" style={{ color: config.primaryColor }} />
          <button
            onClick={() => setActiveView('gallery')}
            className={`absolute top-3 left-3 p-2 rounded-lg ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm`}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={selectedUnit.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : selectedUnit.status === 'reserved' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}>
              {selectedUnit.status}
            </Badge>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold" style={{ color: config.primaryColor }}>Unit {selectedUnit.number}</h3>
            <p className={`text-sm ${textMuted}`}>Level {selectedUnit.floor} · {selectedUnit.view} View</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Bed, label: 'Bedrooms', value: selectedUnit.bedrooms },
              { icon: Bath, label: 'Bathrooms', value: selectedUnit.bathrooms },
              { icon: Maximize, label: 'Area', value: `${selectedUnit.area}m²` },
            ].map((item) => (
              <div key={item.label} className={`${cardClass} border rounded-xl p-3 text-center`}>
                <item.icon className={`w-5 h-5 mx-auto mb-1 ${textMuted}`} />
                <div className="text-lg font-bold">{item.value}</div>
                <div className={`text-[10px] ${textMuted}`}>{item.label}</div>
              </div>
            ))}
          </div>

          {config.showPricing && (
            <div className={`${cardClass} border rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-xs ${textMuted}`}>Price</div>
                  <div className="text-2xl font-bold">${(selectedUnit.price / 1000).toFixed(0)}k</div>
                </div>
                <Button
                  className="text-white px-6"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Enquire Now
                </Button>
              </div>
            </div>
          )}

          {config.showContact && (
            <div className={`${cardClass} border rounded-xl p-4 space-y-2`}>
              <h4 className="text-sm font-semibold">Contact Agent</h4>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5" style={{ color: config.primaryColor }} />
                <span className={textMuted}>+61 2 9000 1234</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5" style={{ color: config.primaryColor }} />
                <span className={textMuted}>sales@stedaxis.com</span>
              </div>
            </div>
          )}
        </div>

        {/* Branding */}
        <div className={`px-5 py-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'} flex items-center justify-between`}>
          <span className={`text-[10px] ${textMuted}`}>Powered by</span>
          <span className="text-xs font-semibold" style={{ color: config.primaryColor }}>OneAxis</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${bgClass} rounded-2xl border overflow-hidden shadow-xl transition-colors`}
      style={{ fontFamily: 'Inter, sans-serif', maxHeight: isExpanded ? '90vh' : config.height }}
    >
      {/* Header */}
      <div className={`px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{config.projectName}</h3>
            <div className={`flex items-center gap-3 mt-1 text-xs ${textMuted}`}>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Sydney, NSW
              </span>
              <span className="flex items-center gap-1">
                <Home className="w-3 h-3" /> {mockUnits.length} units
              </span>
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 className="w-3 h-3" /> {mockUnits.filter((u) => u.status === 'available').length} available
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'studio', '1 bedroom', '2 bedroom', '3 bedroom'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterType === type
                  ? 'text-white'
                  : isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={filterType === type ? { backgroundColor: config.primaryColor } : {}}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 overflow-y-auto ${isExpanded ? 'max-h-[calc(90vh-180px)]' : 'max-h-[400px]'}`}>
        {activeView === 'gallery' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredUnits.map((unit, idx) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { setSelectedUnit(unit); setActiveView('detail'); }}
                className={`${cardClass} border rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/30 transition-all group`}
              >
                <div className="h-28 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center relative">
                  <Building2 className="w-12 h-12 opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: config.primaryColor }} />
                  <div className="absolute top-2 right-2">
                    <Badge className={`text-[9px] ${
                      unit.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                      unit.status === 'reserved' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {unit.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Unit {unit.number}</h4>
                    {config.showPricing && (
                      <span className="text-sm font-bold" style={{ color: config.primaryColor }}>
                        ${(unit.price / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${textMuted} mt-0.5`}>{unit.type} · {unit.area}m² · Floor {unit.floor}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] ${textMuted} flex items-center gap-0.5`}>
                      <Bed className="w-3 h-3" /> {unit.bedrooms}
                    </span>
                    <span className={`text-[10px] ${textMuted} flex items-center gap-0.5`}>
                      <Bath className="w-3 h-3" /> {unit.bathrooms}
                    </span>
                    <span className={`text-[10px] ${textMuted} flex items-center gap-0.5`}>
                      <Eye className="w-3 h-3" /> {unit.view}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                onClick={() => { setSelectedUnit(unit); setActiveView('detail'); }}
                className={`${cardClass} border rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500/30 transition-all`}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 opacity-40" style={{ color: config.primaryColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Unit {unit.number}</h4>
                    {config.showPricing && (
                      <span className="text-sm font-bold" style={{ color: config.primaryColor }}>
                        ${(unit.price / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${textMuted}`}>{unit.type} · {unit.area}m² · Floor {unit.floor}</p>
                </div>
                <ChevronRight className={`w-4 h-4 ${textMuted}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Branding Footer */}
      <div className={`px-5 py-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: config.primaryColor }}>
            <Compass className="w-3 h-3 text-white" />
          </div>
          <span className={`text-[10px] ${textMuted}`}>Interactive by</span>
          <span className="text-xs font-bold" style={{ color: config.primaryColor }}>OneAxis</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className={`text-[10px] ${textMuted}`}>AI-Powered</span>
        </div>
      </div>
    </div>
  );
}
