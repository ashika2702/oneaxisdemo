import { create } from 'zustand';
import type { Project, Unit, ChatMessage, ViewMode } from '@/types';

interface AppState {
  // Projects
  projects: Project[];
  activeProjectId: string | null;
  activeView: ViewMode;
  
  // UI State
  sidebarOpen: boolean;
  chatOpen: boolean;
  presentationMode: boolean;
  uploadDialogOpen: boolean;
  scenarioDialogOpen: boolean;
  
  // Actions
  setActiveProject: (id: string | null) => void;
  setActiveView: (view: ViewMode) => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  togglePresentation: () => void;
  setUploadDialog: (open: boolean) => void;
  setScenarioDialog: (open: boolean) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Unit actions
  updateUnit: (projectId: string, unitId: string, updates: Partial<Unit>) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  
  // Auth
  user: { name: string; email: string; role: string } | null;
  setUser: (user: any) => void;
}

const demoProject: Project = {
  id: 'demo-1',
  name: 'Azure Heights Tower',
  type: 'real-estate',
  status: 'ready',
  stage: 'sales',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-06-19T14:30:00Z',
  thumbnail: '/projects/azure-heights.jpg',
  files: [
    { id: 'f1', name: 'Site_Plan_Master.pdf', type: 'pdf', size: 4500000, url: '#', status: 'processed', uploadedAt: '2025-01-15T10:00:00Z' },
    { id: 'f2', name: 'Floor_Plans_Levels_1-12.dwg', type: 'cad', size: 12000000, url: '#', status: 'processed', uploadedAt: '2025-01-15T10:05:00Z' },
    { id: 'f3', name: 'Unit_Pricing_Schedule.xlsx', type: 'excel', size: 890000, url: '#', status: 'processed', uploadedAt: '2025-01-15T10:10:00Z' },
    { id: 'f4', name: 'Elevations_and_Sections.pdf', type: 'pdf', size: 3200000, url: '#', status: 'processed', uploadedAt: '2025-01-15T10:15:00Z' },
  ],
  units: Array.from({ length: 48 }, (_, i) => {
    const floor = Math.floor(i / 4) + 1;
    const types = ['A', 'B', 'C', 'D'];
    const type = types[i % 4];
    const areas = [850, 1200, 1450, 2100];
    const basePrices = [425000, 680000, 870000, 1250000];
    const views = ['City View', 'Park View', 'Marina View', 'Corner Premium'];
    const statuses: Array<'available' | 'sold' | 'reserved' | 'coming-soon'> = ['available', 'available', 'sold', 'reserved', 'available', 'coming-soon'];
    
    return {
      id: `unit-${i + 1}`,
      unitNumber: `${floor}${String.fromCharCode(65 + (i % 4))}`,
      floor,
      type: `${type}-Type ${type === 'A' ? 'Studio' : type === 'B' ? '1 BR' : type === 'C' ? '2 BR' : '3 BR'}`,
      area: areas[i % 4],
      bedrooms: type === 'A' ? 0 : type === 'B' ? 1 : type === 'C' ? 2 : 3,
      bathrooms: type === 'A' ? 1 : type === 'B' ? 1 : type === 'C' ? 2 : 3,
      price: basePrices[i % 4] * (1 + (floor - 1) * 0.02),
      basePrice: basePrices[i % 4],
      status: statuses[i % 5],
      view: views[i % 4],
      facing: ['North', 'South', 'East', 'West'][i % 4],
      materials: {
        flooring: 'Porcelain Tile',
        kitchen: 'Standard White',
        bathroom: 'Standard Chrome',
      },
      customizationPrice: 0,
      position: { x: (i % 4) * 0.25, y: (11 - Math.floor(i / 4)) * 0.083, width: 0.25, height: 0.083 },
    };
  }),
  rooms: [],
  lots: [],
  panoramas: [],
  geoSite: null,
  materials: [
    { id: 'm1', name: 'Porcelain Tile', category: 'Flooring', pricePerUnit: 45, unit: 'sqm', color: '#E8DDD4', thumbnail: '', availability: 'in-stock' },
    { id: 'm2', name: 'Oak Hardwood', category: 'Flooring', pricePerUnit: 120, unit: 'sqm', color: '#C4956A', thumbnail: '', availability: 'in-stock' },
    { id: 'm3', name: 'Marble Premium', category: 'Flooring', pricePerUnit: 280, unit: 'sqm', color: '#F5F5F0', thumbnail: '', availability: 'limited' },
    { id: 'm4', name: 'Standard White', category: 'Kitchen', pricePerUnit: 0, unit: 'unit', color: '#FFFFFF', thumbnail: '', availability: 'in-stock' },
    { id: 'm5', name: 'Italian walnut', category: 'Kitchen', pricePerUnit: 8500, unit: 'unit', color: '#5C4033', thumbnail: '', availability: 'in-stock' },
    { id: 'm6', name: 'Matte Black', category: 'Kitchen', pricePerUnit: 12000, unit: 'unit', color: '#1A1A1A', thumbnail: '', availability: 'in-stock' },
    { id: 'm7', name: 'Standard Chrome', category: 'Bathroom', pricePerUnit: 0, unit: 'unit', color: '#C0C0C0', thumbnail: '', availability: 'in-stock' },
    { id: 'm8', name: 'Brushed Gold', category: 'Bathroom', pricePerUnit: 3500, unit: 'unit', color: '#D4AF37', thumbnail: '', availability: 'in-stock' },
    { id: 'm9', name: 'Matte Black Bath', category: 'Bathroom', pricePerUnit: 4200, unit: 'unit', color: '#2C2C2C', thumbnail: '', availability: 'limited' },
  ],
  pricingRules: [
    { id: 'pr1', name: 'Floor Premium', type: 'floor-premium', condition: 'per floor above 1', amount: 2, percentage: true, active: true },
    { id: 'pr2', name: 'Marina View', type: 'view-premium', condition: 'marina facing', amount: 8, percentage: true, active: true },
    { id: 'pr3', name: 'Corner Unit', type: 'corner-premium', condition: 'corner position', amount: 5, percentage: true, active: true },
  ],
  stakeholders: [
    { id: 's1', name: 'Ahmed Al-Rashid', email: 'ahmed@azure-dev.com', role: 'Project Director', type: 'client', status: 'active', lastActive: '2025-06-19T12:00:00Z' },
    { id: 's2', name: 'Sarah Chen', email: 'sarah@investor-cap.com', role: 'Lead Investor', type: 'investor', status: 'approved', lastActive: '2025-06-18T16:30:00Z' },
    { id: 's3', name: 'Marcus Johnson', email: 'marcus@buildco.com', role: 'General Contractor', type: 'contractor', status: 'active', lastActive: '2025-06-19T09:15:00Z' },
  ],
  aiInsights: [
    { id: 'ai1', type: 'recommendation', title: 'Optimize Unit Mix on Floors 8-12', description: 'Based on 47 similar projects, converting two 1-BR units to studios on floors 8-12 could increase total project revenue by 3.2% due to higher demand in that segment.', confidence: 87, category: 'Revenue Optimization', read: false, createdAt: '2025-06-19T08:00:00Z' },
    { id: 'ai2', type: 'risk', title: 'View Corridor Risk - West Wing', description: 'A planned development 400m west may impact marina views for units 9D-12D by 2027. Consider premium pricing acceleration for these units.', confidence: 72, category: 'Market Risk', read: false, createdAt: '2025-06-18T14:00:00Z' },
    { id: 'ai3', type: 'opportunity', title: 'Kitchen Upgrade Attach Rate', description: 'Projects with Italian walnut kitchen options see 68% upgrade selection vs 45% for standard offerings. Consider making this the base for Type C and D units.', confidence: 91, category: 'Sales Strategy', read: true, createdAt: '2025-06-17T10:00:00Z' },
    { id: 'ai4', type: 'benchmark', title: 'Pricing Benchmark - Marina View', description: 'Your marina view premium is 8% below market average for comparable developments. Market data suggests room for 10-12% premium without demand impact.', confidence: 78, category: 'Pricing', read: false, createdAt: '2025-06-16T09:30:00Z' },
  ],
  scenarios: [],
};

const constructionProject: Project = {
  id: 'demo-2',
  name: 'Al Safa Towers',
  type: 'construction',
  status: 'active',
  stage: 'construction',
  createdAt: '2025-03-10T10:00:00Z',
  updatedAt: '2025-06-19T14:30:00Z',
  thumbnail: '/projects/al-safa.jpg',
  files: [
    { id: 'f5', name: 'Structural_Plans.pdf', type: 'pdf', size: 5200000, url: '#', status: 'processed', uploadedAt: '2025-03-10T10:00:00Z' },
    { id: 'f6', name: 'MEP_Drawings.dwg', type: 'cad', size: 8900000, url: '#', status: 'processed', uploadedAt: '2025-03-10T10:05:00Z' },
    { id: 'f7', name: 'BOQ_Master.xlsx', type: 'excel', size: 1200000, url: '#', status: 'processed', uploadedAt: '2025-03-10T10:10:00Z' },
  ],
  units: [],
  materials: [],
  pricingRules: [],
  stakeholders: [
    { id: 's4', name: 'Khalid Al-Mansouri', email: 'khalid@alsafa.ae', role: 'Project Manager', type: 'client', status: 'active', lastActive: '2025-06-19T12:00:00Z' },
    { id: 's5', name: 'Thomas Wright', email: 'thomas@structural.co', role: 'Structural Engineer', type: 'consultant', status: 'active', lastActive: '2025-06-18T16:30:00Z' },
  ],
  aiInsights: [
    { id: 'ai5', type: 'risk', title: 'Weather Delay Risk - Q3', description: 'Historical data shows 18% higher rainfall in Q3. Consider accelerating facade work in Q2.', confidence: 82, category: 'Schedule Risk', read: false, createdAt: '2025-06-19T08:00:00Z' },
    { id: 'ai6', type: 'opportunity', title: 'Material Cost Dip', description: 'Steel prices dropped 8% this month. Lock in procurement now for floors 7-12 to save ~$340K.', confidence: 91, category: 'Procurement', read: false, createdAt: '2025-06-18T14:00:00Z' },
  ],
  scenarios: [],
  rooms: [],
  lots: [],
  panoramas: [],
  geoSite: null,
};

const manufacturingProject: Project = {
  id: 'demo-3',
  name: 'Precision Manufacturing Plant',
  type: 'manufacturing',
  status: 'active',
  stage: 'operations',
  createdAt: '2024-11-01T09:00:00Z',
  updatedAt: '2025-06-19T14:30:00Z',
  thumbnail: '/projects/manufacturing.jpg',
  files: [
    { id: 'f8', name: 'Plant_Layout.dwg', type: 'cad', size: 15000000, url: '#', status: 'processed', uploadedAt: '2024-11-01T09:00:00Z' },
    { id: 'f9', name: 'Production_Schedule.xlsx', type: 'excel', size: 2100000, url: '#', status: 'processed', uploadedAt: '2024-11-01T09:05:00Z' },
  ],
  units: [],
  materials: [],
  pricingRules: [],
  stakeholders: [
    { id: 's6', name: 'Li Wei', email: 'li@precision-mfg.com', role: 'Plant Manager', type: 'client', status: 'active', lastActive: '2025-06-19T12:00:00Z' },
  ],
  aiInsights: [
    { id: 'ai7', type: 'recommendation', title: 'Line 2 Optimization', description: 'Line 2 OEE is 73% vs 87% benchmark. Conveyor belt replacement could increase throughput by 12%.', confidence: 85, category: 'Operations', read: false, createdAt: '2025-06-19T08:00:00Z' },
  ],
  scenarios: [],
  rooms: [],
  lots: [],
  panoramas: [],
  geoSite: null,
};

const industrialProject: Project = {
  id: 'demo-4',
  name: 'Greenfield Industrial Complex',
  type: 'industrial',
  status: 'ready',
  stage: 'design',
  createdAt: '2025-05-20T08:00:00Z',
  updatedAt: '2025-06-19T14:30:00Z',
  thumbnail: '/projects/industrial.jpg',
  files: [
    { id: 'f10', name: 'Site_Master_Plan.pdf', type: 'pdf', size: 8200000, url: '#', status: 'processed', uploadedAt: '2025-05-20T08:00:00Z' },
    { id: 'f11', name: 'Process_P&ID.dwg', type: 'cad', size: 22000000, url: '#', status: 'processed', uploadedAt: '2025-05-20T08:05:00Z' },
  ],
  units: [],
  materials: [],
  pricingRules: [],
  stakeholders: [
    { id: 's7', name: 'Rashid Al-Farsi', email: 'rashid@greenfield.com', role: 'Operations Director', type: 'client', status: 'active', lastActive: '2025-06-19T12:00:00Z' },
  ],
  aiInsights: [
    { id: 'ai8', type: 'opportunity', title: 'Solar Integration ROI', description: 'Adding 2MW solar array reduces grid dependency by 35% with 4.2-year payback period.', confidence: 88, category: 'Sustainability', read: false, createdAt: '2025-06-19T08:00:00Z' },
  ],
  scenarios: [],
  rooms: [],
  lots: [],
  panoramas: [],
  geoSite: null,
};

const oilGasProject: Project = {
  id: 'demo-5',
  name: 'Mariner Offshore Platform',
  type: 'oil-gas',
  status: 'active',
  stage: 'operations',
  createdAt: '2023-01-15T06:00:00Z',
  updatedAt: '2025-06-19T14:30:00Z',
  thumbnail: '/projects/offshore.jpg',
  files: [
    { id: 'f12', name: 'Platform_As_Built.ifc', type: 'bim', size: 45000000, url: '#', status: 'processed', uploadedAt: '2023-01-15T06:00:00Z' },
    { id: 'f13', name: 'Inspection_Reports.pdf', type: 'pdf', size: 18000000, url: '#', status: 'processed', uploadedAt: '2025-06-01T10:00:00Z' },
  ],
  units: [],
  materials: [],
  pricingRules: [],
  stakeholders: [
    { id: 's8', name: 'Omar Hassan', email: 'omar@mariner-energy.com', role: 'Asset Manager', type: 'client', status: 'active', lastActive: '2025-06-19T12:00:00Z' },
    { id: 's9', name: 'Dr. Sarah Mitchell', email: 'sarah@offshore-safety.org', role: 'Safety Inspector', type: 'regulator', status: 'active', lastActive: '2025-06-18T16:30:00Z' },
  ],
  aiInsights: [
    { id: 'ai9', type: 'risk', title: 'Corrosion Alert - Pipeline C12', description: 'IoT sensors indicate accelerated corrosion on Pipeline C12. Inspection recommended within 14 days.', confidence: 79, category: 'Asset Integrity', read: false, createdAt: '2025-06-19T08:00:00Z' },
    { id: 'ai10', type: 'recommendation', title: 'Turbine Efficiency Decline', description: 'Gas turbine efficiency dropped 4% over 6 months. Predictive model suggests compressor blade fouling.', confidence: 87, category: 'Maintenance', read: false, createdAt: '2025-06-18T14:00:00Z' },
  ],
  scenarios: [],
  rooms: [],
  lots: [],
  panoramas: [],
  geoSite: null,
};

const residentialProject: Project = {
  id: 'demo-6',
  name: 'Palm Jumeirah Villa',
  type: 'residential',
  status: 'ready',
  stage: 'sales',
  createdAt: '2025-04-01T08:00:00Z',
  updatedAt: '2025-06-21T10:00:00Z',
  thumbnail: '/projects/villa.jpg',
  files: [
    { id: 'f20', name: 'Villa_Architecture.pdf', type: 'pdf', size: 8500000, url: '#', status: 'processed', uploadedAt: '2025-04-01T08:00:00Z' },
    { id: 'f21', name: 'Interior_Design.dwg', type: 'cad', size: 15000000, url: '#', status: 'processed', uploadedAt: '2025-04-01T08:05:00Z' },
    { id: 'f22', name: 'Landscape_Plan.pdf', type: 'pdf', size: 6200000, url: '#', status: 'processed', uploadedAt: '2025-04-01T08:10:00Z' },
  ],
  units: [],
  rooms: [
    { id: 'r1', name: 'Grand Foyer', floor: 0, type: 'foyer', area: 25, width: 5, depth: 5, height: 4.5, position: { x: 0, z: 6 }, materials: { flooring: 'Marble', walls: 'Paint', ceiling: 'Gypsum' }, features: ['Double Height', 'Chandelier', 'Guest Closet'], images: [], panoramaUrl: null },
    { id: 'r2', name: 'Living Room', floor: 0, type: 'living', area: 65, width: 8, depth: 8, height: 3.5, position: { x: -4, z: 2 }, materials: { flooring: 'Oak Hardwood', walls: 'Fabric', ceiling: 'Wood' }, features: ['Sea View', 'Fireplace', 'Built-in Shelves'], images: [], panoramaUrl: null },
    { id: 'r3', name: 'Kitchen', floor: 0, type: 'kitchen', area: 35, width: 5, depth: 7, height: 3, position: { x: 4, z: 2 }, materials: { flooring: 'Porcelain Tile', walls: 'Subway Tile', cabinets: 'Walnut' }, features: ['Island', 'Walk-in Pantry', 'Miele Appliances'], images: [], panoramaUrl: null },
    { id: 'r4', name: 'Dining Room', floor: 0, type: 'dining', area: 30, width: 6, depth: 5, height: 3.5, position: { x: 0, z: -2 }, materials: { flooring: 'Oak Hardwood', walls: 'Grasscloth', ceiling: 'Gypsum' }, features: ['Butler Pantry', 'Wine Display', 'Garden View'], images: [], panoramaUrl: null },
    { id: 'r5', name: 'Guest Suite', floor: 0, type: 'bedroom', area: 28, width: 5, depth: 5.5, height: 3, position: { x: -6, z: -3 }, materials: { flooring: 'Carpet', walls: 'Paint', ceiling: 'Gypsum' }, features: ['En-suite', 'Walk-in Closet', 'Pool View'], images: [], panoramaUrl: null },
    { id: 'r6', name: 'Maid Room', floor: 0, type: 'maid-room', area: 18, width: 4, depth: 4.5, height: 2.8, position: { x: 6, z: -3 }, materials: { flooring: 'Tile', walls: 'Paint', ceiling: 'Gypsum' }, features: ['En-suite', 'Separate Entrance'], images: [], panoramaUrl: null },
    { id: 'r7', name: 'Garage', floor: 0, type: 'garage', area: 45, width: 6, depth: 7.5, height: 3.2, position: { x: 10, z: 4 }, materials: { flooring: 'Epoxy', walls: 'Paint', ceiling: 'Exposed' }, features: ['3 Cars', 'EV Charging', 'Storage'], images: [], panoramaUrl: null },
    { id: 'r8', name: 'Master Suite', floor: 1, type: 'bedroom', area: 72, width: 9, depth: 8, height: 3.5, position: { x: 0, z: 1 }, materials: { flooring: 'Oak Hardwood', walls: 'Silk', ceiling: 'Coffered' }, features: ['Sea View', 'Sitting Area', 'His/Hers Walk-in', 'Balcony'], images: [], panoramaUrl: null },
    { id: 'r9', name: 'Master Bath', floor: 1, type: 'bathroom', area: 25, width: 5, depth: 5, height: 3, position: { x: 0, z: -4 }, materials: { flooring: 'Marble', walls: 'Marble', fixtures: 'Brushed Gold' }, features: ['Freestanding Tub', 'Rain Shower', 'Heated Floors'], images: [], panoramaUrl: null },
    { id: 'r10', name: 'Bedroom 2', floor: 1, type: 'bedroom', area: 28, width: 5.5, depth: 5, height: 3, position: { x: -6, z: 2 }, materials: { flooring: 'Carpet', walls: 'Paint', ceiling: 'Gypsum' }, features: ['En-suite', 'Built-in Closet', 'Garden View'], images: [], panoramaUrl: null },
    { id: 'r11', name: 'Bedroom 3', floor: 1, type: 'bedroom', area: 26, width: 5, depth: 5.2, height: 3, position: { x: 6, z: 2 }, materials: { flooring: 'Carpet', walls: 'Paint', ceiling: 'Gypsum' }, features: ['En-suite', 'Balcony Access'], images: [], panoramaUrl: null },
    { id: 'r12', name: 'Study', floor: 1, type: 'study', area: 22, width: 4.5, depth: 5, height: 3, position: { x: -6, z: -3 }, materials: { flooring: 'Oak Hardwood', walls: 'Wood Panel', ceiling: 'Gypsum' }, features: ['Built-in Library', 'Sea View'], images: [], panoramaUrl: null },
    { id: 'r13', name: 'Gym', floor: 1, type: 'gym', area: 30, width: 6, depth: 5, height: 3, position: { x: 6, z: -3 }, materials: { flooring: 'Rubber', walls: 'Mirror', ceiling: 'Acoustic' }, features: ['Sea View', 'Equipment Niche'], images: [], panoramaUrl: null },
    { id: 'r14', name: 'Swimming Pool', floor: 0, type: 'pool', area: 80, width: 10, depth: 8, height: 0, position: { x: -8, z: -6 }, materials: { finish: 'Glass Mosaic', coping: 'Limestone' }, features: ['Infinity Edge', 'Jacuzzi', 'Heated', 'LED Lighting'], images: [], panoramaUrl: null },
    { id: 'r15', name: 'Garden', floor: 0, type: 'garden', area: 200, width: 20, depth: 10, height: 0, position: { x: 0, z: -12 }, materials: { lawn: 'Bermuda', pathway: 'Travertine' }, features: ['Pergola', 'BBQ Area', 'Fire Pit'], images: [], panoramaUrl: null },
  ],
  lots: [],
  materials: [
    { id: 'm1', name: 'Porcelain Tile', category: 'Flooring', pricePerUnit: 45, unit: 'sqm', color: '#E8DDD4', thumbnail: '', availability: 'in-stock' },
    { id: 'm2', name: 'Oak Hardwood', category: 'Flooring', pricePerUnit: 120, unit: 'sqm', color: '#C4956A', thumbnail: '', availability: 'in-stock' },
    { id: 'm3', name: 'Marble Premium', category: 'Flooring', pricePerUnit: 280, unit: 'sqm', color: '#F5F5F0', thumbnail: '', availability: 'limited' },
    { id: 'm10', name: 'Walnut Cabinetry', category: 'Kitchen', pricePerUnit: 15000, unit: 'unit', color: '#5C4033', thumbnail: '', availability: 'in-stock' },
    { id: 'm11', name: 'Brushed Gold Fixtures', category: 'Bathroom', pricePerUnit: 4200, unit: 'unit', color: '#D4AF37', thumbnail: '', availability: 'in-stock' },
  ],
  pricingRules: [],
  stakeholders: [
    { id: 's15', name: 'Fatima Al-Zahra', email: 'fatima@palm-villas.ae', role: 'Property Owner', type: 'client', status: 'active', lastActive: '2025-06-21T09:00:00Z' },
    { id: 's16', name: 'Jean-Pierre Dubois', email: 'jp@luxury-interiors.com', role: 'Interior Designer', type: 'consultant', status: 'active', lastActive: '2025-06-20T16:00:00Z' },
  ],
  aiInsights: [
    { id: 'ai20', type: 'recommendation', title: 'Kitchen Upgrade ROI', description: 'Villas with walnut cabinetry and Miele appliance packages sell 23% faster in Palm Jumeirah. Consider making this the standard package.', confidence: 89, category: 'Sales Strategy', read: false, createdAt: '2025-06-21T08:00:00Z' },
    { id: 'ai21', type: 'opportunity', title: 'Pool Configuration Premium', description: 'Infinity-edge pools with jacuzzi generate a 15% price premium over standard pools in comparable villas.', confidence: 84, category: 'Pricing', read: false, createdAt: '2025-06-20T14:00:00Z' },
  ],
  scenarios: [],
  panoramas: [
    {
      id: 'p1', name: 'Grand Foyer', roomId: 'r1',
      position: { x: 0, y: 1.6, z: 6 }, rotation: { yaw: 0, pitch: 0 },
      imageUrl: '/panoramas/foyer.jpg', thumbnailUrl: '/panoramas/foyer-thumb.jpg',
      hotspots: [
        { id: 'h1', yaw: -30, pitch: 0, label: 'To Living Room', targetSpotId: 'p2', type: 'navigate', info: '' },
        { id: 'h2', yaw: 45, pitch: -10, label: 'Chandelier', targetSpotId: null, type: 'info', info: 'Swarovski crystal chandelier, 3m drop' },
      ],
    },
    {
      id: 'p2', name: 'Living Room', roomId: 'r2',
      position: { x: -4, y: 1.6, z: 2 }, rotation: { yaw: 90, pitch: 0 },
      imageUrl: '/panoramas/living.jpg', thumbnailUrl: '/panoramas/living-thumb.jpg',
      hotspots: [
        { id: 'h3', yaw: 120, pitch: 0, label: 'To Kitchen', targetSpotId: 'p3', type: 'navigate', info: '' },
        { id: 'h4', yaw: -60, pitch: 0, label: 'Sea View', targetSpotId: null, type: 'info', info: 'Panoramic sea view overlooking the Palm' },
      ],
    },
    {
      id: 'p3', name: 'Kitchen', roomId: 'r3',
      position: { x: 4, y: 1.6, z: 2 }, rotation: { yaw: -90, pitch: 0 },
      imageUrl: '/panoramas/kitchen.jpg', thumbnailUrl: '/panoramas/kitchen-thumb.jpg',
      hotspots: [
        { id: 'h5', yaw: 0, pitch: 0, label: 'To Dining', targetSpotId: 'p4', type: 'navigate', info: '' },
        { id: 'h6', yaw: -45, pitch: 0, label: 'Island Detail', targetSpotId: null, type: 'info', info: 'Calacatta marble island, 3.2m x 1.2m' },
      ],
    },
    {
      id: 'p4', name: 'Dining Room', roomId: 'r4',
      position: { x: 0, y: 1.6, z: -2 }, rotation: { yaw: 180, pitch: 0 },
      imageUrl: '/panoramas/dining.jpg', thumbnailUrl: '/panoramas/dining-thumb.jpg',
      hotspots: [
        { id: 'h7', yaw: 90, pitch: 0, label: 'To Master Suite', targetSpotId: 'p5', type: 'navigate', info: '' },
      ],
    },
    {
      id: 'p5', name: 'Master Suite', roomId: 'r8',
      position: { x: 0, y: 1.6, z: 1 }, rotation: { yaw: 0, pitch: 0 },
      imageUrl: '/panoramas/master.jpg', thumbnailUrl: '/panoramas/master-thumb.jpg',
      hotspots: [
        { id: 'h8', yaw: 90, pitch: 0, label: 'Master Bath', targetSpotId: 'p6', type: 'navigate', info: '' },
        { id: 'h9', yaw: -30, pitch: -5, label: 'Balcony View', targetSpotId: null, type: 'info', info: 'Private balcony with sea view' },
      ],
    },
    {
      id: 'p6', name: 'Master Bathroom', roomId: 'r9',
      position: { x: 0, y: 1.6, z: -4 }, rotation: { yaw: 180, pitch: 0 },
      imageUrl: '/panoramas/master-bath.jpg', thumbnailUrl: '/panoramas/master-bath-thumb.jpg',
      hotspots: [
        { id: 'h10', yaw: 0, pitch: 0, label: 'Back to Bedroom', targetSpotId: 'p5', type: 'navigate', info: '' },
      ],
    },
  ],
  geoSite: {
    lat: 25.1213,
    lng: 55.1385,
    address: 'Frond N, Palm Jumeirah',
    city: 'Dubai',
    country: 'UAE',
    timezone: 'GST+4',
    elevation: 2,
    climateZone: 'Hot Desert (BWh)',
    sunPath: [],
    windData: { prevailingDirection: 315, averageSpeed: 14, maxSpeed: 42, seasonal: [] },
    rainfallData: { annual: 94, wettestMonth: 'March', driestMonth: 'June', monthly: [] },
  },
};

const landDevelopmentProject: Project = {
  id: 'demo-7',
  name: 'Emerald Hills Estates',
  type: 'land-development',
  status: 'ready',
  stage: 'sales',
  createdAt: '2025-02-15T09:00:00Z',
  updatedAt: '2025-06-21T10:00:00Z',
  thumbnail: '/projects/emerald-hills.jpg',
  files: [
    { id: 'f30', name: 'Master_Plan_2025.pdf', type: 'pdf', size: 12000000, url: '#', status: 'processed', uploadedAt: '2025-02-15T09:00:00Z' },
    { id: 'f31', name: 'Topographical_Survey.dwg', type: 'cad', size: 25000000, url: '#', status: 'processed', uploadedAt: '2025-02-15T09:05:00Z' },
    { id: 'f32', name: 'Soil_Reports.pdf', type: 'pdf', size: 8500000, url: '#', status: 'processed', uploadedAt: '2025-02-15T09:10:00Z' },
  ],
  units: [],
  rooms: [],
  lots: [
    { id: 'l1', lotNumber: 'A-01', area: 1200, frontage: 30, depth: 40, price: 2400000, status: 'available', zone: 'Estate', setbacks: { front: 8, rear: 6, side: 5 }, maxHeight: 12, maxCoverage: 40, viewRating: 9, sunExposure: 'full', slope: 'gentle', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber', 'Gas'], position: { x: -20, z: -15, width: 30, depth: 40 }, soilType: 'Sandy Loam', floodZone: false },
    { id: 'l2', lotNumber: 'A-02', area: 1100, frontage: 28, depth: 40, price: 2200000, status: 'available', zone: 'Estate', setbacks: { front: 8, rear: 6, side: 5 }, maxHeight: 12, maxCoverage: 40, viewRating: 8, sunExposure: 'full', slope: 'flat', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber', 'Gas'], position: { x: 15, z: -15, width: 28, depth: 40 }, soilType: 'Sandy Loam', floodZone: false },
    { id: 'l3', lotNumber: 'A-03', area: 950, frontage: 25, depth: 38, price: 1800000, status: 'sold', zone: 'R-1', setbacks: { front: 6, rear: 5, side: 4 }, maxHeight: 10, maxCoverage: 45, viewRating: 7, sunExposure: 'partial', slope: 'flat', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber'], position: { x: -22, z: 30, width: 25, depth: 38 }, soilType: 'Clay Loam', floodZone: false },
    { id: 'l4', lotNumber: 'A-04', area: 850, frontage: 22, depth: 38, price: 1530000, status: 'reserved', zone: 'R-1', setbacks: { front: 6, rear: 5, side: 4 }, maxHeight: 10, maxCoverage: 45, viewRating: 6, sunExposure: 'partial', slope: 'gentle', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber'], position: { x: 18, z: 30, width: 22, depth: 38 }, soilType: 'Clay Loam', floodZone: false },
    { id: 'l5', lotNumber: 'B-01', area: 600, frontage: 20, depth: 30, price: 900000, status: 'available', zone: 'R-2', setbacks: { front: 5, rear: 4, side: 3 }, maxHeight: 8, maxCoverage: 50, viewRating: 5, sunExposure: 'full', slope: 'flat', utilities: ['Water', 'Electricity', 'Sewer'], position: { x: -25, z: 75, width: 20, depth: 30 }, soilType: 'Sandy', floodZone: false },
    { id: 'l6', lotNumber: 'B-02', area: 580, frontage: 20, depth: 29, price: 870000, status: 'available', zone: 'R-2', setbacks: { front: 5, rear: 4, side: 3 }, maxHeight: 8, maxCoverage: 50, viewRating: 5, sunExposure: 'partial', slope: 'flat', utilities: ['Water', 'Electricity', 'Sewer'], position: { x: 0, z: 75, width: 20, depth: 29 }, soilType: 'Sandy', floodZone: false },
    { id: 'l7', lotNumber: 'B-03', area: 620, frontage: 21, depth: 30, price: 930000, status: 'hold', zone: 'R-2', setbacks: { front: 5, rear: 4, side: 3 }, maxHeight: 8, maxCoverage: 50, viewRating: 6, sunExposure: 'full', slope: 'flat', utilities: ['Water', 'Electricity', 'Sewer'], position: { x: 25, z: 75, width: 21, depth: 30 }, soilType: 'Sandy', floodZone: false },
    { id: 'l8', lotNumber: 'C-01', area: 1500, frontage: 35, depth: 45, price: 3750000, status: 'available', zone: 'Estate', setbacks: { front: 10, rear: 8, side: 6 }, maxHeight: 15, maxCoverage: 35, viewRating: 10, sunExposure: 'full', slope: 'gentle', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber', 'Gas', 'Solar Ready'], position: { x: 0, z: -55, width: 35, depth: 45 }, soilType: 'Sandy Loam', floodZone: false },
    { id: 'l9', lotNumber: 'C-02', area: 2000, frontage: 40, depth: 50, price: 6000000, status: 'sold', zone: 'Estate', setbacks: { front: 12, rear: 10, side: 8 }, maxHeight: 15, maxCoverage: 30, viewRating: 10, sunExposure: 'full', slope: 'flat', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber', 'Gas', 'Solar Ready'], position: { x: -30, z: -60, width: 40, depth: 50 }, soilType: 'Sandy Loam', floodZone: false },
    { id: 'l10', lotNumber: 'C-03', area: 1800, frontage: 38, depth: 48, price: 4500000, status: 'available', zone: 'Estate', setbacks: { front: 10, rear: 8, side: 6 }, maxHeight: 15, maxCoverage: 35, viewRating: 10, sunExposure: 'full', slope: 'gentle', utilities: ['Water', 'Electricity', 'Sewer', 'Fiber', 'Gas', 'Solar Ready'], position: { x: 35, z: -58, width: 38, depth: 48 }, soilType: 'Sandy Loam', floodZone: false },
  ],
  materials: [],
  pricingRules: [],
  stakeholders: [
    { id: 's20', name: 'Robert Chen', email: 'robert@emerald-hills.com', role: 'Development Director', type: 'client', status: 'active', lastActive: '2025-06-21T10:00:00Z' },
    { id: 's21', name: 'Aisha Mohammed', email: 'aisha@dubai-land.gov', role: 'Planning Officer', type: 'regulator', status: 'active', lastActive: '2025-06-20T14:00:00Z' },
  ],
  aiInsights: [
    { id: 'ai30', type: 'opportunity', title: 'Premium Lot Pricing Gap', description: 'Estate zone lots with lake views are priced 18% below comparable developments. Market supports $4.5M+ for C-01 and C-03.', confidence: 86, category: 'Pricing', read: false, createdAt: '2025-06-21T08:00:00Z' },
    { id: 'ai31', type: 'recommendation', title: 'Infrastructure Timing', description: 'Complete road and utility installation before Q3 to capture peak buying season. 67% of sales in this region close Oct-Dec.', confidence: 91, category: 'Sales Strategy', read: false, createdAt: '2025-06-20T12:00:00Z' },
  ],
  scenarios: [],
  panoramas: [],
  geoSite: {
    lat: 25.067,
    lng: 55.278,
    address: 'Emirates Road Exit 77',
    city: 'Dubai',
    country: 'UAE',
    timezone: 'GST+4',
    elevation: 45,
    climateZone: 'Hot Desert (BWh)',
    sunPath: [],
    windData: { prevailingDirection: 315, averageSpeed: 16, maxSpeed: 48, seasonal: [] },
    rainfallData: { annual: 88, wettestMonth: 'February', driestMonth: 'June', monthly: [] },
  },
};

const initialChat: ChatMessage[] = [
  {
    id: 'c1',
    role: 'assistant',
    content: 'Welcome to OneAxis AI. I have analyzed your Azure Heights Tower project. I can help you optimize pricing, compare unit configurations, predict sales velocity, and generate scenarios. What would you like to explore?',
    timestamp: '2025-06-19T14:00:00Z',
    type: 'text',
  },
];

export const useStore = create<AppState>((set) => ({
  projects: [demoProject, constructionProject, manufacturingProject, industrialProject, oilGasProject, residentialProject, landDevelopmentProject],
  activeProjectId: 'demo-1',
  activeView: '3d',
  sidebarOpen: true,
  chatOpen: false,
  presentationMode: false,
  uploadDialogOpen: false,
  scenarioDialogOpen: false,
  chatMessages: initialChat,
  user: { name: 'Alex Morgan', email: 'alex@oneaxis.live', role: 'Project Manager' },

  setActiveProject: (id) => set({ activeProjectId: id }),
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  togglePresentation: () => set((s) => ({ presentationMode: !s.presentationMode })),
  setUploadDialog: (open) => set({ uploadDialogOpen: open }),
  setScenarioDialog: (open) => set({ scenarioDialogOpen: open }),
  
  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, updates) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, ...updates } : p),
  })),
  deleteProject: (id) => set((s) => ({
    projects: s.projects.filter((p) => p.id !== id),
    activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
  })),
  
  updateUnit: (projectId, unitId, updates) => set((s) => ({
    projects: s.projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        units: p.units.map((u) => u.id === unitId ? { ...u, ...updates } : u),
      };
    }),
  })),
  
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  
  setUser: (user) => set({ user }),
}));

// Helper to get active project
export const getActiveProject = (state: AppState) => 
  state.projects.find((p) => p.id === state.activeProjectId) || null;
