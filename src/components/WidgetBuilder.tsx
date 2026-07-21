import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Copy, Check, Palette,
  Eye, Smartphone, Monitor, Tablet,
  X, Globe, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/store/useStore';

export default function WidgetBuilder({ onClose }: { onClose: () => void }) {
  const { projects, activeProjectId } = useStore();
  const project = projects.find(p => p.id === activeProjectId);
  const [activeTab, setActiveTab] = useState<'design' | 'preview' | 'code'>('design');
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Widget config
  const [config, setConfig] = useState({
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    textColor: '#1e293b',
    bgColor: '#ffffff',
    borderRadius: 12,
    showPricing: true,
    showAvailability: true,
    showFloorPlan: true,
    showPhotos: true,
    allowFiltering: true,
    allowComparison: true,
    headerText: project?.name || 'Select Your Unit',
    subText: 'Click on any unit to view details and pricing',
    ctaText: 'Reserve Now',
    fontFamily: 'Inter',
    animationSpeed: 0.5,
  });

  const embedCode = `<!-- OneAxis Widget - ${project?.name} -->
<div id="oneaxis-widget" 
  data-project="${activeProjectId}"
  data-primary="${config.primaryColor}"
  data-accent="${config.accentColor}"
  data-show-pricing="${config.showPricing}"
  data-show-availability="${config.showAvailability}"
  data-show-floorplan="${config.showFloorPlan}"
  data-allow-filtering="${config.allowFiltering}"
  data-allow-comparison="${config.allowComparison}"
  data-header="${config.headerText}"
  data-subtext="${config.subText}"
  data-cta="${config.ctaText}"
  data-font="${config.fontFamily}"
  data-radius="${config.borderRadius}"
></div>
<script src="https://cdn.oneaxis.live/widget.js" async></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorPresets = [
    { name: 'Blue Sky', primary: '#3b82f6', accent: '#10b981', bg: '#ffffff' },
    { name: 'Desert Gold', primary: '#d97706', accent: '#059669', bg: '#fffbeb' },
    { name: 'Ocean Deep', primary: '#0ea5e9', accent: '#f59e0b', bg: '#f0f9ff' },
    { name: 'Royal Purple', primary: '#7c3aed', accent: '#ec4899', bg: '#faf5ff' },
    { name: 'Slate Dark', primary: '#64748b', accent: '#94a3b8', bg: '#0f172a' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Code className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Widget Builder</h2>
            <p className="text-xs text-gray-400">Create embeddable selectors for your website</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { key: 'design', label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
          { key: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
          { key: 'code', label: 'Embed Code', icon: <Code className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* DESIGN TAB */}
        <AnimatePresence mode="wait">
          {activeTab === 'design' && (
            <motion.div
              key="design"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex overflow-hidden"
            >
              {/* Config Panel */}
              <div className="w-80 border-r border-gray-700 overflow-y-auto scrollbar-thin p-4 space-y-5">
                {/* Color Presets */}
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-2 block">Color Theme</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {colorPresets.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => setConfig({ ...config, primaryColor: preset.primary, accentColor: preset.accent, bgColor: preset.bg })}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          config.primaryColor === preset.primary ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})` }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Custom Colors</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-300">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-300">Accent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-300">Background</span>
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-2 block">Corner Radius</label>
                  <Slider value={[config.borderRadius]} onValueChange={([v]) => setConfig({ ...config, borderRadius: v })} min={0} max={24} step={2} />
                  <div className="text-right text-xs text-gray-500 mt-1">{config.borderRadius}px</div>
                </div>

                {/* Text Fields */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Header Text</label>
                  <input
                    type="text"
                    value={config.headerText}
                    onChange={(e) => setConfig({ ...config, headerText: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <label className="text-xs text-gray-400 font-medium">Sub Text</label>
                  <input
                    type="text"
                    value={config.subText}
                    onChange={(e) => setConfig({ ...config, subText: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <label className="text-xs text-gray-400 font-medium">CTA Button</label>
                  <input
                    type="text"
                    value={config.ctaText}
                    onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Feature Toggles */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Features</label>
                  {[
                    { key: 'showPricing', label: 'Show Pricing' },
                    { key: 'showAvailability', label: 'Show Availability' },
                    { key: 'showFloorPlan', label: 'Show Floor Plan' },
                    { key: 'allowFiltering', label: 'Allow Filtering' },
                    { key: 'allowComparison', label: 'Allow Comparison' },
                  ].map(feat => (
                    <label key={feat.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config[feat.key as keyof typeof config] as boolean}
                        onChange={(e) => setConfig({ ...config, [feat.key]: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                      />
                      <span className="text-xs text-gray-300">{feat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="flex-1 p-6 bg-gray-900/50 flex items-center justify-center">
                <WidgetPreview config={config} project={project} />
              </div>
            </motion.div>
          )}

          {/* PREVIEW TAB */}
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900/50"
            >
              {/* Device Toggle */}
              <div className="flex items-center gap-2 mb-4 bg-gray-800 rounded-lg p-1">
                {[
                  { key: 'desktop', icon: <Monitor className="w-4 h-4" /> },
                  { key: 'tablet', icon: <Tablet className="w-4 h-4" /> },
                  { key: 'mobile', icon: <Smartphone className="w-4 h-4" /> },
                ].map(d => (
                  <button
                    key={d.key}
                    onClick={() => setPreviewDevice(d.key as any)}
                    className={`p-2 rounded-md transition-all ${previewDevice === d.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    {d.icon}
                  </button>
                ))}
              </div>

              <div
                className="transition-all duration-300"
                style={{
                  width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                  maxWidth: '100%',
                }}
              >
                <WidgetPreview config={config} project={project} />
              </div>
            </motion.div>
          )}

          {/* CODE TAB */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-6 flex flex-col items-center justify-center"
            >
              <div className="max-w-2xl w-full">
                <div className="glass-panel rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-semibold">Embed Code</h3>
                    </div>
                    <Button
                      onClick={copyCode}
                      className={copied ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                      size="sm"
                    >
                      {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                  <pre className="bg-gray-950 rounded-lg p-4 text-xs text-green-400 overflow-x-auto scrollbar-thin font-mono leading-relaxed">
                    {embedCode}
                  </pre>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-panel rounded-lg p-4 text-center">
                    <Globe className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-white font-semibold text-sm">Any Website</div>
                    <div className="text-xs text-gray-500">Works with WordPress, Wix, custom</div>
                  </div>
                  <div className="glass-panel rounded-lg p-4 text-center">
                    <Smartphone className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-semibold text-sm">Responsive</div>
                    <div className="text-xs text-gray-500">Desktop, tablet, mobile ready</div>
                  </div>
                  <div className="glass-panel rounded-lg p-4 text-center">
                    <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-semibold text-sm">Real-time Sync</div>
                    <div className="text-xs text-gray-500">Updates when you edit in OneAxis</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Widget Preview Component ───
function WidgetPreview({ config, project }: { config: any; project: any }) {
  const units = project?.units?.slice(0, 8) || [];
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold' | 'reserved'>('all');

  const filteredUnits = filter === 'all' ? units : units.filter((u: any) => u.status === filter);
  const selUnit = units.find((u: any) => u.id === selectedUnit);

  const statusColors: Record<string, string> = {
    available: config.accentColor,
    sold: '#9ca3af',
    reserved: config.primaryColor,
    'coming-soon': '#f59e0b',
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-2xl border"
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.bgColor === '#0f172a' ? '#334155' : '#e5e7eb',
        borderRadius: config.borderRadius,
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: config.bgColor === '#0f172a' ? '#334155' : '#e5e7eb' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ color: config.textColor, fontSize: '16px', fontWeight: 600 }}>{config.headerText}</h3>
          <Badge style={{ backgroundColor: config.primaryColor + '20', color: config.primaryColor, border: 'none' }}>
            {project?.units?.filter((u: any) => u.status === 'available').length || 0} Available
          </Badge>
        </div>
        <p style={{ color: config.textColor, opacity: 0.6, fontSize: '12px' }}>{config.subText}</p>
      </div>

      {/* Filters */}
      {config.allowFiltering && (
        <div className="flex gap-1 p-3 border-b" style={{ borderColor: config.bgColor === '#0f172a' ? '#334155' : '#e5e7eb' }}>
          {['all', 'available', 'sold', 'reserved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all capitalize"
              style={{
                backgroundColor: filter === f ? config.primaryColor : config.bgColor === '#0f172a' ? '#1e293b' : '#f3f4f6',
                color: filter === f ? '#ffffff' : config.textColor,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="p-3 grid grid-cols-4 gap-2">
        {filteredUnits.map((unit: any) => {
          const isSelected = selectedUnit === unit.id;
          return (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(isSelected ? null : unit.id)}
              className="relative rounded-lg p-2 text-center transition-all border-2"
              style={{
                backgroundColor: isSelected ? config.primaryColor + '15' : config.bgColor === '#0f172a' ? '#1e293b' : '#f9fafb',
                borderColor: isSelected ? config.primaryColor : 'transparent',
                borderRadius: config.borderRadius / 2,
              }}
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: statusColors[unit.status] }}
              />
              <div style={{ color: config.textColor, fontSize: '13px', fontWeight: 600 }}>{unit.unitNumber}</div>
              <div style={{ color: config.textColor, opacity: 0.5, fontSize: '10px' }}>{unit.type.split(' ')[0]}</div>
              {config.showPricing && (
                <div style={{ color: config.primaryColor, fontSize: '11px', fontWeight: 500, marginTop: 2 }}>
                  ${(unit.price / 1000).toFixed(0)}K
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Unit Detail */}
      <AnimatePresence>
        {selUnit && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t overflow-hidden"
            style={{ borderColor: config.bgColor === '#0f172a' ? '#334155' : '#e5e7eb' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div style={{ color: config.textColor, fontSize: '14px', fontWeight: 600 }}>Unit {selUnit.unitNumber}</div>
                  <div style={{ color: config.textColor, opacity: 0.6, fontSize: '11px' }}>{selUnit.type} • {selUnit.area} m²</div>
                </div>
                <div style={{ color: config.primaryColor, fontSize: '18px', fontWeight: 700 }}>
                  ${(selUnit.price / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg p-2" style={{ backgroundColor: config.bgColor === '#0f172a' ? '#1e293b' : '#f3f4f6' }}>
                  <div style={{ color: config.textColor, opacity: 0.5, fontSize: '10px' }}>Bedrooms</div>
                  <div style={{ color: config.textColor, fontSize: '13px', fontWeight: 600 }}>{selUnit.bedrooms}</div>
                </div>
                <div className="rounded-lg p-2" style={{ backgroundColor: config.bgColor === '#0f172a' ? '#1e293b' : '#f3f4f6' }}>
                  <div style={{ color: config.textColor, opacity: 0.5, fontSize: '10px' }}>View</div>
                  <div style={{ color: config.textColor, fontSize: '13px', fontWeight: 600 }}>{selUnit.view}</div>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: config.accentColor, borderRadius: config.borderRadius / 2 }}
              >
                {config.ctaText}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-4 py-2 border-t flex items-center justify-between" style={{ borderColor: config.bgColor === '#0f172a' ? '#334155' : '#e5e7eb' }}>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor})` }} />
          <span style={{ color: config.textColor, opacity: 0.4, fontSize: '10px' }}>Powered by OneAxis</span>
        </div>
        <span style={{ color: config.textColor, opacity: 0.4, fontSize: '10px' }}>{project?.units?.length || 0} units total</span>
      </div>
    </div>
  );
}
