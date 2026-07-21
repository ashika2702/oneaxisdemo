export interface Project {
  id: string;
  name: string;
  type: 'real-estate' | 'construction' | 'manufacturing' | 'industrial' | 'oil-gas' | 'residential' | 'land-development';
  status: 'uploading' | 'processing' | 'ready' | 'active' | 'completed';
  stage: 'sales' | 'design' | 'construction' | 'operations';
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  files: ProjectFile[];
  units: Unit[];
  rooms: Room[];
  lots: Lot[];
  materials: Material[];
  pricingRules: PricingRule[];
  stakeholders: Stakeholder[];
  aiInsights: AIInsight[];
  scenarios: Scenario[];
  panoramas: PanoramaSpot[];
  geoSite: GeoSite | null;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'csv' | 'excel' | 'cad' | 'bim' | ' brochure';
  size: number;
  url: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  uploadedAt: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  basePrice: number;
  status: 'available' | 'sold' | 'reserved' | 'coming-soon';
  view: string;
  facing: string;
  materials: Record<string, string>;
  customizationPrice: number;
  position: { x: number; y: number; width: number; height: number };
}

export interface Room {
  id: string;
  name: string;
  floor: number;
  type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining' | 'garage' | 'pool' | 'garden' | 'balcony' | 'lobby' | 'study' | 'gym' | 'theater' | 'wine-cellar' | 'maid-room' | 'laundry' | 'foyer' | 'hallway' | 'outdoor';
  area: number;
  width: number;
  depth: number;
  height: number;
  position: { x: number; z: number };
  materials: Record<string, string>;
  features: string[];
  images: string[];
  panoramaUrl: string | null;
}

export interface Lot {
  id: string;
  // Core identification
  lotNumber?: string;
  number?: string;
  label?: string;
  // Dimensions
  area: number;
  frontage?: number;
  depth?: number;
  // Pricing & Status
  price: number;
  status: 'available' | 'sold' | 'reserved' | 'hold';
  stage?: string;
  // Plan visualization (ingestion engine)
  path?: string;
  d?: string;
  centerX?: number;
  centerY?: number;
  cx?: number;
  cy?: number;
  // Features
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  // Geographic/ zoning data
  zone?: string;
  setbacks?: { front: number; rear: number; side: number };
  maxHeight?: number;
  maxCoverage?: number;
  viewRating?: number;
  sunExposure?: 'full' | 'partial' | 'shaded';
  slope?: 'flat' | 'gentle' | 'moderate' | 'steep';
  utilities?: string[];
  position?: { x: number; z: number; width: number; depth: number };
  soilType?: string;
  floodZone?: boolean;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  color: string;
  thumbnail: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
}

export interface PricingRule {
  id: string;
  name: string;
  type: 'floor-premium' | 'view-premium' | 'corner-premium' | 'material-upgrade' | 'lot-size' | 'location-premium' | 'custom';
  condition: string;
  amount: number;
  percentage: boolean;
  active: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: string;
  type: 'investor' | 'client' | 'contractor' | 'consultant' | 'regulator' | 'buyer' | 'agent';
  status: 'pending' | 'active' | 'approved';
  lastActive: string;
}

export interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'recommendation' | 'benchmark' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  category: string;
  read: boolean;
  createdAt: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  changes: ScenarioChange[];
  totalCost: number;
  costDelta: number;
  timelineImpact: number;
  createdAt: string;
}

export interface ScenarioChange {
  field: string;
  oldValue: string;
  newValue: string;
  costImpact: number;
}

export interface PanoramaSpot {
  id: string;
  name: string;
  roomId: string | null;
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  imageUrl: string;
  thumbnailUrl: string;
  hotspots: PanoramaHotspot[];
}

export interface PanoramaHotspot {
  id: string;
  yaw: number;
  pitch: number;
  label: string;
  targetSpotId: string | null;
  type: 'navigate' | 'info' | 'label';
  info: string;
}

export interface GeoSite {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  timezone: string;
  elevation: number;
  climateZone: string;
  sunPath: SunPosition[];
  windData: WindData;
  rainfallData: RainfallData;
}

export interface SunPosition {
  time: string;
  altitude: number;
  azimuth: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface WindData {
  prevailingDirection: number;
  averageSpeed: number;
  maxSpeed: number;
  seasonal: { season: string; direction: number; speed: number }[];
}

export interface RainfallData {
  annual: number;
  wettestMonth: string;
  driestMonth: string;
  monthly: { month: string; mm: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'insight' | 'action' | 'comparison';
  data?: any;
}

export interface HandoffStage {
  id: string;
  name: string;
  key: 'sales' | 'design' | 'construction' | 'operations';
  status: 'locked' | 'in-progress' | 'completed';
  deliverables: Deliverable[];
  stakeholders: string[];
  dueDate: string;
  completedAt?: string;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'document' | 'model' | 'approval' | 'report';
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  dueDate: string;
}

export interface BrochureTemplate {
  id: string;
  name: string;
  coverImage: string;
  sections: BrochureSection[];
  colors: { primary: string; secondary: string; accent: string };
  fonts: { heading: string; body: string };
}

export interface BrochureSection {
  id: string;
  type: 'cover' | 'overview' | 'exterior' | 'interior' | 'floorplan' | 'pricing' | 'materials' | 'location' | 'contact' | 'finishes' | 'amenities' | 'testimonials';
  title: string;
  enabled: boolean;
  order: number;
}

export interface Notification {
  id: string;
  type: 'unit-sold' | 'price-change' | 'approval-needed' | 'document-ready' | 'chat-message' | 'deadline' | 'milestone';
  title: string;
  message: string;
  projectId: string;
  read: boolean;
  createdAt: string;
  actionUrl: string | null;
}

export type ViewMode = '3d' | 'stack' | 'floorplan' | 'pricing' | 'scenario' | 'handoff' | 'rooms' | 'lots' | 'panorama' | 'brochure' | 'sitemap' | 'lot-ingestion' | 'lot-array' | 'true-view' | 'comparison-cart' | 'agent-copilot' | 'prompt-render' | 'sunlight' | 'template-market' | 'neighbourhood' | 'sustainability' | 'reports' | 'financial' | 'pitch-deck' | 'marketing' | 'algorithms' | 'live-data' | 'environmental' | 'infrastructure' | 'city-twin' | 'construction-phase' | 'annotations' | 'solar' | 'pulse' | 'revenue-risk' | 'concierge' | 'hold' | 'org' | 'approval' | 'versioning' | 'flywheel' | 'settings-hub' | 'buyer-portal' | 'settlement-radar';

export interface LotStage {
  id: string;
  name: string;
  color: string;
  lots: string[];
}

export interface LotPlan {
  id: string;
  name: string;
  imageUrl: string;
  viewBox: { width: number; height: number };
  lots: Lot[];
  stages: LotStage[];
  mapLocation?: { lat: number; lng: number; zoom: number };
}
