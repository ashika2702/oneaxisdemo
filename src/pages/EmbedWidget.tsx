import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Bed, Bath, Maximize, Eye, Phone,
  MessageCircle, X, CheckCircle,
  Calendar, DollarSign, Home, ArrowRight, Square,
  Compass, Mountain
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

/* ────────────────────────────────────────────────
   EMBEDDABLE WIDGET PAGE (B2B2C)
   Standalone page designed to be embedded on client
   websites via iframe or script tag. Shows unit/lot
   selectors, pricing, 3D preview, and lead capture.
   No app chrome — pure widget experience.
   ──────────────────────────────────────────── */

type WidgetMode = 'units' | 'lots' | 'contact' | 'detail' | 'reserve';

const statusColors: Record<string, string> = {
  available: 'bg-emerald-500',
  sold: 'bg-red-500',
  reserved: 'bg-amber-500',
  'coming-soon': 'bg-blue-500',
  hold: 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
  'coming-soon': 'Coming Soon',
  hold: 'Hold',
};

export default function EmbedWidget() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme') || 'dark';
  const accent = searchParams.get('accent') || '#3B82F6';
  const showPricing = searchParams.get('pricing') !== 'false';
  const showFilters = searchParams.get('filters') !== 'false';
  const showComparison = searchParams.get('compare') !== 'false';
  const compact = searchParams.get('compact') === 'true';

  const { projects } = useStore();
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const [mode] = useState<WidgetMode>(project?.type === 'land-development' ? 'lots' : 'units');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType] = useState<string>('all');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparePanel, setShowComparePanel] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '', whatsapp: false });
  const [submitted, setSubmitted] = useState(false);
  const [reserving, setReserving] = useState(false);

  // Auto-height communication with parent window
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'oneaxis-resize', height }, '*');
    };
    sendHeight();
    const interval = setInterval(sendHeight, 500);
    return () => clearInterval(interval);
  }, [mode, selectedId, showComparePanel, showContactForm]);

  // Tell parent when unit is selected
  const notifyParent = (action: string, data?: any) => {
    window.parent.postMessage({ type: 'oneaxis-event', action, data, projectId: project?.id }, '*');
  };

  const units = project?.units || [];
  const lots = project?.lots || [];
  const rooms = project?.rooms || [];

  const filteredUnits = units.filter((u) => {
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    if (filterType !== 'all' && !u.type.includes(filterType)) return false;
    if (filterBedrooms !== 'all' && u.bedrooms !== Number(filterBedrooms)) return false;
    return true;
  });

  const selectedUnit = units.find((u) => u.id === selectedId);
  const selectedLot = lots.find((l) => l.id === selectedId);

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notifyParent('lead-submitted', { ...contactForm, unitId: selectedId, projectId: project?.id });
    setTimeout(() => { setSubmitted(false); setShowContactForm(false); }, 3000);
  };

  const handleReserve = () => {
    setReserving(true);
    notifyParent('reservation-started', { unitId: selectedId, projectId: project?.id });
  };

  const isLight = theme === 'light';
  const bg = isLight ? 'bg-white' : 'bg-[#0A0A0F]';
  const cardBg = isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/80 border-gray-800';
  const text = isLight ? 'text-gray-900' : 'text-white';
  const muted = isLight ? 'text-gray-500' : 'text-gray-400';
  const inputBg = isLight ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700';

  return (
    <div className={`${bg} min-h-full w-full`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: isLight ? '#e5e7eb' : '#1f2937' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className={`text-sm font-semibold ${text}`}>{project?.name}</h2>
              <p className={`text-[10px] ${muted}`}>Powered by OneAxis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showComparison && compareList.length > 0 && (
              <button
                onClick={() => setShowComparePanel(!showComparePanel)}
                className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1"
                style={{ backgroundColor: accent + '20', color: accent }}
              >
                Compare ({compareList.length})
              </button>
            )}
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="text-[10px] px-2 py-1 rounded-full text-white flex items-center gap-1"
              style={{ backgroundColor: accent }}
            >
              <Phone className="w-3 h-3" />
              Contact
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && mode === 'units' && (
          <div className="flex gap-2 mt-3 flex-wrap">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`${inputBg} ${text} text-[10px] rounded px-2 py-1 border`}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
            <select value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)} className={`${inputBg} ${text} text-[10px] rounded px-2 py-1 border`}>
              <option value="all">All Bedrooms</option>
              <option value="0">Studio</option>
              <option value="1">1 BR</option>
              <option value="2">2 BR</option>
              <option value="3">3 BR</option>
            </select>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {!compact && (
        <div className="flex gap-3 p-3 border-b" style={{ borderColor: isLight ? '#e5e7eb' : '#1f2937' }}>
          {project?.type === 'land-development' ? (
            <>
              <div className="flex items-center gap-1"><Square className="w-3 h-3 text-emerald-400" /><span className={`text-[10px] ${muted}`}>{lots.filter(l=>l.status==='available').length} Available</span></div>
              <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-red-400" /><span className={`text-[10px] ${muted}`}>{lots.filter(l=>l.status==='sold').length} Sold</span></div>
              <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-blue-400" /><span className={`text-[10px] ${muted}`}>{lots.length} Total</span></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1"><Home className="w-3 h-3 text-emerald-400" /><span className={`text-[10px] ${muted}`}>{units.filter(u=>u.status==='available').length} Available</span></div>
              <div className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-amber-400" /><span className={`text-[10px] ${muted}`}>{units.length} Total</span></div>
              {project?.type === 'residential' && <div className="flex items-center gap-1"><Bed className="w-3 h-3 text-blue-400" /><span className={`text-[10px] ${muted}`}>{rooms.length} Rooms</span></div>}
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="p-3">
        {/* UNITS VIEW */}
        {mode === 'units' && (
          <div className="space-y-2">
            {filteredUnits.length === 0 && (
              <div className={`text-center py-8 ${muted} text-xs`}>No units match your filters</div>
            )}
            {filteredUnits.map((unit) => {
              const isSelected = selectedId === unit.id;
              const isCompared = compareList.includes(unit.id);
              return (
                <motion.div
                  key={unit.id}
                  layout
                  onClick={() => { setSelectedId(isSelected ? null : unit.id); notifyParent('unit-selected', unit); }}
                  className={`${cardBg} border rounded-xl p-3 cursor-pointer transition-all hover:border-blue-500/50`}
                  style={{ borderColor: isSelected ? accent : undefined }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: accent + '30', color: accent }}>
                        {unit.unitNumber}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${text}`}>{unit.type}</div>
                        <div className={`text-[10px] ${muted}`}>Floor {unit.floor} • {unit.view}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {showPricing && (
                        <div className={`text-xs font-bold ${text}`}>${(unit.price / 1000000).toFixed(2)}M</div>
                      )}
                      <Badge className={`${statusColors[unit.status]} text-white text-[9px] px-1.5 py-0`}>{statusLabels[unit.status]}</Badge>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t" style={{ borderColor: isLight ? '#e5e7eb' : '#374151' }}>
                          <div className="text-center">
                            <Maximize className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: accent }} />
                            <div className={`text-[10px] font-semibold ${text}`}>{unit.area} m²</div>
                            <div className={`text-[9px] ${muted}`}>Area</div>
                          </div>
                          <div className="text-center">
                            <Bed className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: accent }} />
                            <div className={`text-[10px] font-semibold ${text}`}>{unit.bedrooms}</div>
                            <div className={`text-[9px] ${muted}`}>Beds</div>
                          </div>
                          <div className="text-center">
                            <Bath className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: accent }} />
                            <div className={`text-[10px] font-semibold ${text}`}>{unit.bathrooms}</div>
                            <div className={`text-[9px] ${muted}`}>Baths</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-[10px]"
                            style={{ backgroundColor: accent }}
                            onClick={(e) => { e.stopPropagation(); handleReserve(); }}
                          >
                            Reserve Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`h-8 text-[10px] flex-1 ${isLight ? 'border-gray-300' : 'border-gray-700'}`}
                            onClick={(e) => { e.stopPropagation(); toggleCompare(unit.id); }}
                          >
                            {isCompared ? 'Remove' : 'Compare'}
                          </Button>
                        </div>
                        <button
                          className={`w-full mt-2 text-[10px] flex items-center justify-center gap-1 ${muted} hover:text-blue-400`}
                          onClick={(e) => { e.stopPropagation(); setShowContactForm(true); }}
                        >
                          <MessageCircle className="w-3 h-3" /> Ask about this unit
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* LOTS VIEW */}
        {mode === 'lots' && (
          <div className="space-y-2">
            {lots.map((lot) => {
              const isSelected = selectedId === lot.id;
              const isCompared = compareList.includes(lot.id);
              return (
                <motion.div
                  key={lot.id}
                  layout
                  onClick={() => { setSelectedId(isSelected ? null : lot.id); notifyParent('lot-selected', lot); }}
                  className={`${cardBg} border rounded-xl p-3 cursor-pointer transition-all hover:border-emerald-500/50`}
                  style={{ borderColor: isSelected ? '#10B981' : undefined }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                        {lot.lotNumber}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${text}`}>{lot.zone} Zone</div>
                        <div className={`text-[10px] ${muted}`}>{lot.area} m² • {lot.frontage}m frontage</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {showPricing && <div className={`text-xs font-bold ${text}`}>${(lot.price / 1000000).toFixed(1)}M</div>}
                      <Badge className={`${statusColors[lot.status]} text-white text-[9px] px-1.5 py-0`}>{statusLabels[lot.status]}</Badge>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t" style={{ borderColor: isLight ? '#e5e7eb' : '#374151' }}>
                          <div className="text-center"><Compass className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-400" /><div className={`text-[10px] font-semibold ${text}`}>{lot.maxHeight}m</div><div className={`text-[9px] ${muted}`}>Max Height</div></div>
                          <div className="text-center"><Mountain className="w-3.5 h-3.5 mx-auto mb-0.5 text-amber-400" /><div className={`text-[10px] font-semibold ${text}`}>{lot.maxCoverage}%</div><div className={`text-[9px] ${muted}`}>Coverage</div></div>
                          <div className="text-center"><Eye className="w-3.5 h-3.5 mx-auto mb-0.5 text-blue-400" /><div className={`text-[10px] font-semibold ${text}`}>{lot.viewRating}/10</div><div className={`text-[9px] ${muted}`}>View</div></div>
                        </div>
                        <div className="mt-2 text-[10px] space-y-1">
                          <div className={`flex justify-between ${muted}`}><span>Slope:</span><span className={text}>{lot.slope}</span></div>
                          <div className={`flex justify-between ${muted}`}><span>Sun:</span><span className={text}>{lot.sunExposure}</span></div>
                          <div className={`flex justify-between ${muted}`}><span>Soil:</span><span className={text}>{lot.soilType}</span></div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(lot.utilities || []).map((u) => (
                            <span key={u} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px]">{u}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1 h-8 text-[10px] bg-emerald-600 hover:bg-emerald-500" onClick={(e) => { e.stopPropagation(); handleReserve(); }}>Reserve Lot</Button>
                          <Button size="sm" variant="outline" className={`h-8 text-[10px] flex-1 ${isLight ? 'border-gray-300' : 'border-gray-700'}`} onClick={(e) => { e.stopPropagation(); toggleCompare(lot.id); }}>{isCompared ? 'Remove' : 'Compare'}</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contact Form */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`${cardBg} border rounded-xl p-4 mt-3`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-xs font-semibold ${text}`}>Get in Touch</h4>
                <button onClick={() => setShowContactForm(false)} className={muted}><X className="w-4 h-4" /></button>
              </div>
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className={`text-xs ${text}`}>Thank you! We'll contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-2">
                  <input type="text" placeholder="Full Name" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className={`w-full ${inputBg} ${text} text-xs rounded px-3 py-2 border`} />
                  <input type="tel" placeholder="Phone / WhatsApp" required value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className={`w-full ${inputBg} ${text} text-xs rounded px-3 py-2 border`} />
                  <input type="email" placeholder="Email (optional)" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className={`w-full ${inputBg} ${text} text-xs rounded px-3 py-2 border`} />
                  {selectedUnit && (
                    <div className={`text-[10px] ${muted} px-2 py-1 rounded bg-blue-500/10`}>Inquiring about: Unit {selectedUnit.unitNumber}</div>
                  )}
                  {selectedLot && (
                    <div className={`text-[10px] ${muted} px-2 py-1 rounded bg-emerald-500/10`}>Inquiring about: Lot {selectedLot.lotNumber}</div>
                  )}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="wa" checked={contactForm.whatsapp} onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.checked })} className="accent-blue-500" />
                    <label htmlFor="wa" className={`text-[10px] ${muted}`}>Contact me via WhatsApp</label>
                  </div>
                  <Button type="submit" size="sm" className="w-full h-8 text-[10px]" style={{ backgroundColor: accent }}>Submit Inquiry</Button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reservation Flow */}
        <AnimatePresence>
          {reserving && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`${cardBg} border rounded-xl p-4 mt-3`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-xs font-semibold ${text}`}>Reserve {selectedUnit ? `Unit ${selectedUnit.unitNumber}` : selectedLot ? `Lot ${selectedLot.lotNumber}` : ''}</h4>
                <button onClick={() => setReserving(false)} className={muted}><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                <div className={`text-[10px] ${muted} p-2 rounded bg-amber-500/10 text-amber-400`}>
                  <DollarSign className="w-3 h-3 inline mr-1" />
                  Reservation fee: {selectedUnit ? `$${(selectedUnit.price * 0.05).toLocaleString()}` : selectedLot ? `$${(selectedLot.price * 0.05).toLocaleString()}` : ''} (5%)
                </div>
                <input type="text" placeholder="Full Name" className={`w-full ${inputBg} ${text} text-xs rounded px-3 py-2 border`} />
                <input type="email" placeholder="Email" className={`w-full ${inputBg} ${text} text-xs rounded px-3 py-2 border`} />
                <input type="tel" placeholder="Phone / WhatsApp" className={`w-full ${inputBg} ${text} text-xs rounded px-3 py-2 border`} />
                <Button size="sm" className="w-full h-8 text-[10px] bg-emerald-600 hover:bg-emerald-500" onClick={() => { setReserving(false); notifyParent('reservation-completed', { unitId: selectedId }); }}>
                  <CheckCircle className="w-3 h-3 mr-1" /> Complete Reservation
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compare Panel */}
      <AnimatePresence>
        {showComparePanel && compareList.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className={`fixed bottom-0 left-0 right-0 ${cardBg} border-t p-3 z-50 max-h-48 overflow-y-auto`} style={{ borderColor: isLight ? '#e5e7eb' : '#374151' }}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${text}`}>Compare ({compareList.length})</span>
              <button onClick={() => setShowComparePanel(false)} className={muted}><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {mode === 'units' ? compareList.map((id) => {
                const u = units.find((x) => x.id === id);
                if (!u) return null;
                return (
                  <div key={id} className={`p-2 rounded border text-center`} style={{ borderColor: isLight ? '#e5e7eb' : '#374151' }}>
                    <div className={`text-[10px] font-semibold ${text}`}>{u.unitNumber}</div>
                    <div className={`text-[9px] ${muted}`}>{u.area}m²</div>
                    <div className={`text-[9px] ${muted}`}>{u.bedrooms}BR/{u.bathrooms}BA</div>
                    {showPricing && <div className={`text-[10px] font-bold`} style={{ color: accent }}>${(u.price/1000000).toFixed(2)}M</div>}
                  </div>
                );
              }) : compareList.map((id) => {
                const l = lots.find((x) => x.id === id);
                if (!l) return null;
                return (
                  <div key={id} className={`p-2 rounded border text-center`} style={{ borderColor: isLight ? '#e5e7eb' : '#374151' }}>
                    <div className={`text-[10px] font-semibold ${text}`}>Lot {l.lotNumber}</div>
                    <div className={`text-[9px] ${muted}`}>{l.area}m²</div>
                    <div className={`text-[9px] ${muted}`}>{l.zone}</div>
                    {showPricing && <div className={`text-[10px] font-bold`} style={{ color: accent }}>${(l.price/1000000).toFixed(1)}M</div>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <div className={`p-3 text-center border-t`} style={{ borderColor: isLight ? '#e5e7eb' : '#1f2937' }}>
        <a href="https://oneaxis.live" target="_blank" rel="noopener noreferrer" className={`text-[9px] ${muted} hover:text-blue-400 flex items-center justify-center gap-1`}>
          Interactive 3D by <span style={{ color: accent }} className="font-semibold">OneAxis</span> <ArrowRight className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
