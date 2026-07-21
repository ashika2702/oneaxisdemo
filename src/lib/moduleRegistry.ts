/* ═══════════════════════════════════════════
   MODULE REGISTRY — Five Canonical Layers (C)
   ONE/INGEST → ONE/EXPERIENCE → ONE/CONVERT → ONE/HOLD → ONE/INTELLIGENCE
   ═══════════════════════════════════════════ */

export type ProjectType = 'real-estate' | 'residential' | 'land-development' | 'construction' | 'manufacturing' | 'industrial' | 'oil-gas';

export type ModuleCategory = 'ingest' | 'experience' | 'convert' | 'hold' | 'intelligence' | 'platform';

export interface ModuleDef {
  id: string;
  label: string;
  icon: string;
  category: ModuleCategory;
  defaultFor: ProjectType[];
  description: string;
  wave: 1 | 2 | 3 | 4;
}

export const ALL_MODULES: ModuleDef[] = [
  /* ─── ONE/INGEST — Files → Structured Model ─── */
  { id: 'upload', label: 'Upload', icon: 'Upload', category: 'ingest', defaultFor: ['real-estate', 'residential', 'land-development', 'construction', 'manufacturing', 'industrial', 'oil-gas'], description: 'CAD, PDF, IFC, OBJ upload pipeline', wave: 1 },
  { id: 'lot-ingestion', label: 'Lot Ingest', icon: 'Map', category: 'ingest', defaultFor: ['land-development', 'real-estate', 'residential'], description: '2D SVG lot plan parsing', wave: 1 },
  { id: 'model-versioning', label: 'Versions', icon: 'GitBranch', category: 'ingest', defaultFor: ['real-estate', 'residential', 'land-development', 'construction', 'manufacturing', 'industrial'], description: 'Model change tracking and diff', wave: 1 },

  /* ─── ONE/EXPERIENCE — Interactive Engines ─── */
  { id: '3d', label: '3D View', icon: 'Box', category: 'experience', defaultFor: ['real-estate', 'residential', 'land-development', 'construction', 'manufacturing', 'industrial', 'oil-gas'], description: 'Interactive 3D viewer with orbit controls', wave: 1 },
  { id: 'stack', label: 'Stack Plan', icon: 'Layers', category: 'experience', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'Floor-by-floor inventory grid', wave: 1 },
  { id: 'floorplan', label: 'Floor Plan', icon: 'Home', category: 'experience', defaultFor: ['real-estate', 'residential'], description: '2D floor plan with annotations', wave: 1 },
  { id: 'panorama', label: '360° View', icon: 'Compass', category: 'experience', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'Panoramic walkthrough', wave: 1 },
  { id: 'true-view', label: 'TrueView', icon: 'Eye', category: 'experience', defaultFor: ['real-estate', 'residential'], description: 'Unit view simulation by direction', wave: 1 },
  { id: 'sunlight', label: 'Sunlight', icon: 'Sun', category: 'experience', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'Solar/shadow analysis', wave: 1 },
  { id: 'city-twin', label: 'City Twin', icon: 'Building2', category: 'experience', defaultFor: ['real-estate', 'residential'], description: 'Traffic, weather, infrastructure 3D', wave: 2 },
  { id: 'template-market', label: 'Templates', icon: 'Layout', category: 'experience', defaultFor: ['real-estate', 'residential', 'land-development', 'construction', 'manufacturing', 'industrial'], description: 'Pre-built project templates', wave: 2 },

  /* ─── ONE/CONVERT — The Money Moment ─── */
  { id: 'pricing', label: 'Pricing', icon: 'DollarSign', category: 'convert', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'What-If pricing simulator', wave: 1 },
  { id: 'scenario', label: 'Scenarios', icon: 'Brain', category: 'convert', defaultFor: ['real-estate', 'residential'], description: 'AI optioneer', wave: 1 },
  { id: 'comparison-cart', label: 'Compare', icon: 'ShoppingCart', category: 'convert', defaultFor: ['real-estate', 'residential'], description: 'Side-by-side unit comparison', wave: 1 },
  { id: 'agent-copilot', label: 'Copilot', icon: 'Bot', category: 'convert', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'AI sales assistant', wave: 1 },
  { id: 'concierge', label: 'Concierge', icon: 'MessageCircle', category: 'convert', defaultFor: ['real-estate', 'residential', 'land-development'], description: '24/7 multilingual AI chat', wave: 1 },
  { id: 'buyer-portal', label: 'Buyer Portal', icon: 'UserCheck', category: 'convert', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'End-customer stakeholder view', wave: 1 },

  /* ─── ONE/HOLD — Exchange → Settlement ─── */
  { id: 'hold', label: 'HOLD Suite', icon: 'Shield', category: 'hold', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'Sunset clauses, variations, milestones', wave: 1 },
  { id: 'settlement-radar', label: 'Settlements', icon: 'Clock', category: 'hold', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'Settlement tracking and risk alerts', wave: 1 },
  { id: 'annotations', label: 'Annotations', icon: 'MessageSquare', category: 'hold', defaultFor: ['real-estate', 'residential', 'land-development', 'construction'], description: '3D hotspot comments', wave: 1 },
  { id: 'construction-phase', label: 'Phasing', icon: 'Hammer', category: 'hold', defaultFor: ['construction', 'real-estate', 'residential'], description: 'Construction timeline', wave: 1 },
  { id: 'solar', label: 'Solar', icon: 'Sun', category: 'hold', defaultFor: ['real-estate', 'residential'], description: 'Solar potential + 25yr ROI', wave: 2 },

  /* ─── ONE/INTELLIGENCE — The Moat ─── */
  { id: 'pulse', label: 'Pulse', icon: 'Activity', category: 'intelligence', defaultFor: ['real-estate', 'residential', 'land-development'], description: 'Attention flow + conversion funnel', wave: 1 },
  { id: 'revenue-risk', label: 'At Risk', icon: 'TrendingDown', category: 'intelligence', defaultFor: ['real-estate', 'residential'], description: 'Revenue at risk scoring', wave: 1 },
  { id: 'flywheel', label: 'Flywheel', icon: 'RefreshCw', category: 'intelligence', defaultFor: ['real-estate', 'residential', 'land-development', 'construction'], description: 'Data compounding visualization', wave: 1 },
  { id: 'algorithms', label: 'Algorithms', icon: 'Cpu', category: 'intelligence', defaultFor: ['real-estate', 'residential'], description: 'ML model transparency', wave: 2 },
  { id: 'live-data', label: 'Live Data', icon: 'Radio', category: 'intelligence', defaultFor: ['real-estate', 'residential'], description: 'Traffic, weather, economics', wave: 2 },
  { id: 'environmental', label: 'Emissions', icon: 'Factory', category: 'intelligence', defaultFor: ['industrial', 'manufacturing', 'oil-gas'], description: 'CO2 tracking and ESG', wave: 2 },
  { id: 'infrastructure', label: 'Infrastructure', icon: 'Warehouse', category: 'intelligence', defaultFor: ['industrial', 'manufacturing', 'construction'], description: 'Supply chain proximity', wave: 2 },
  { id: 'neighbourhood', label: 'Neighbourhood', icon: 'MapPin', category: 'intelligence', defaultFor: ['real-estate', 'residential'], description: 'Amenities + walkability', wave: 2 },
  { id: 'sustainability', label: 'Sustainability', icon: 'Leaf', category: 'intelligence', defaultFor: ['real-estate', 'residential'], description: 'Energy + certifications', wave: 2 },

  /* ─── PLATFORM — Operations ─── */
  { id: 'reports', label: 'Reports', icon: 'FileText', category: 'platform', defaultFor: ['real-estate', 'residential', 'land-development', 'construction', 'manufacturing', 'industrial'], description: 'Report generator', wave: 1 },
  { id: 'financial', label: 'Financials', icon: 'TrendingUp', category: 'platform', defaultFor: ['real-estate', 'residential'], description: 'IRR/NPV/ROI projections', wave: 1 },
  { id: 'pitch-deck', label: 'Pitch Deck', icon: 'Presentation', category: 'platform', defaultFor: ['real-estate', 'residential'], description: 'Auto-generated presentations', wave: 1 },
  { id: 'marketing', label: 'Marketing', icon: 'Megaphone', category: 'platform', defaultFor: ['real-estate', 'residential'], description: 'Marketing command centre', wave: 2 },
  { id: 'org', label: 'Organisation', icon: 'Users', category: 'platform', defaultFor: ['real-estate', 'residential', 'industrial', 'land-development', 'construction', 'manufacturing', 'oil-gas'], description: 'Team + RBAC', wave: 1 },
  { id: 'approval', label: 'Workflows', icon: 'GitPullRequest', category: 'platform', defaultFor: ['real-estate', 'residential', 'industrial', 'land-development'], description: 'Approval pipelines', wave: 1 },
  { id: 'settings-hub', label: 'Settings', icon: 'Settings', category: 'platform', defaultFor: ['real-estate', 'residential', 'industrial', 'land-development', 'construction', 'manufacturing', 'oil-gas'], description: 'Tenant + stakeholder config', wave: 1 },
];

export function getDefaultModules(projectType: ProjectType): string[] {
  return ALL_MODULES
    .filter((m) => m.defaultFor.includes(projectType) && m.wave === 1)
    .map((m) => m.id);
}

export function getModulesByCategory(category: ModuleCategory): ModuleDef[] {
  return ALL_MODULES.filter((m) => m.category === category);
}

export function getWaveModules(wave: 1 | 2 | 3 | 4): ModuleDef[] {
  return ALL_MODULES.filter((m) => m.wave === wave);
}

/* Category colours for sidebar — F: Brand tokens */
export const categoryConfig: Record<ModuleCategory, { label: string; color: string; border: string; bg: string }> = {
  ingest: { label: 'ONE/INGEST', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5' },
  experience: { label: 'ONE/EXPERIENCE', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5' },
  convert: { label: 'ONE/CONVERT', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  hold: { label: 'ONE/HOLD', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/5' },
  intelligence: { label: 'ONE/INTELLIGENCE', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5' },
  platform: { label: 'PLATFORM', color: 'text-gray-400', border: 'border-gray-500/30', bg: 'bg-gray-500/5' },
};
