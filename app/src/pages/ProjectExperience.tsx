import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Grid3X3, Map, Image, MapPin, Presentation,
  Minimize2, ChevronLeft, ChevronRight, X,
  Bed, Bath, Square, Car, Eye, Share2, Heart, Filter,
  ArrowUpDown, Check, Flame, TrendingUp, Mail,
  Building2, Waves, Dumbbell, ShoppingBag, Trees,
  Train, School, HeartPulse, Utensils,
  Link2, Copy, CheckCheck,
  AlertTriangle, DollarSign,
  Smartphone, Monitor, Tablet,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type ViewMode = "before-after" | "block" | "array" | "unit" | "gallery" | "location";
type UnitStatus = "available" | "reserved" | "sold" | "held";
type UnitType = "apartment" | "penthouse" | "townhouse" | "studio";
type GalleryCategory = "exterior" | "interior" | "amenities" | "drone" | "lifestyle";

interface Unit {
  id: string;
  unitNumber: string;
  type: UnitType;
  bedrooms: number;
  bathrooms: number;
  cars: number;
  area: number;
  price: number;
  status: UnitStatus;
  floor: number;
  block: string;
  facing: string;
  svgPath: string;
  floorPlanSvg: string;
  features: string[];
  images: string[];
}

interface Block {
  id: string;
  name: string;
  label: string;
  svgPath: string;
  totalUnits: number;
  sold: number;
  reserved: number;
  color: string;
}

/* ═══════════════════════════════════════════
   MOCK DATA — Azure Heights
   ═══════════════════════════════════════════ */
const BLOCKS: Block[] = [
  { id: "b1", name: "Tower A — The Crown", label: "A", svgPath: "M200,120 L320,120 L320,280 L280,300 L240,300 L200,280 Z", totalUnits: 45, sold: 12, reserved: 8, color: "#3b82f6" },
  { id: "b2", name: "Tower B — The Spire", label: "B", svgPath: "M360,100 L480,100 L480,260 L440,280 L400,280 L360,260 Z", totalUnits: 36, sold: 18, reserved: 6, color: "#8b5cf6" },
  { id: "b3", name: "Garden Villas", label: "V", svgPath: "M120,320 L280,320 L280,420 L200,440 L120,420 Z", totalUnits: 24, sold: 20, reserved: 2, color: "#10b981" },
  { id: "b4", name: "The Terraces", label: "T", svgPath: "M320,340 L500,340 L500,430 L420,450 L340,440 L320,420 Z", totalUnits: 32, sold: 8, reserved: 14, color: "#f59e0b" },
  { id: "b5", name: "The Pavilion", label: "P", svgPath: "M540,200 L640,200 L640,320 L600,340 L540,320 Z", totalUnits: 16, sold: 4, reserved: 3, color: "#06b6d4" },
];

const AMENITY_MARKERS = [
  { id: "pool", name: "Infinity Pool", icon: Waves, x: 250, y: 180, type: "leisure" },
  { id: "gym", name: "Fitness Centre", icon: Dumbbell, x: 420, y: 150, type: "wellness" },
  { id: "garden", name: "Zen Garden", icon: Trees, x: 180, y: 370, type: "green" },
  { id: "retail", name: "Retail Promenade", icon: ShoppingBag, x: 580, y: 280, type: "retail" },
  { id: "lounge", name: "Sky Lounge", icon: Building2, x: 260, y: 100, type: "social" },
];

const NEARBY_AMENITIES = [
  { name: "Central Station", distance: "450m", type: "transport", icon: Train },
  { name: "St. Mary's Primary", distance: "600m", type: "education", icon: School },
  { name: "Westfield Mall", distance: "800m", type: "retail", icon: ShoppingBag },
  { name: "Royal Hospital", distance: "1.2km", type: "health", icon: HeartPulse },
  { name: "Harbour Dining", distance: "300m", type: "dining", icon: Utensils },
  { name: "Metro Line", distance: "200m", type: "transport", icon: Train },
];

const UNITS: Unit[] = Array.from({ length: 48 }, (_, i) => {
  const types: UnitType[] = ["studio", "apartment", "penthouse", "townhouse"];
  const type = types[i % 4];
  const bedMap: Record<UnitType, number> = { studio: 0, apartment: 2, penthouse: 3, townhouse: 3 };
  const bathMap: Record<UnitType, number> = { studio: 1, apartment: 2, penthouse: 3, townhouse: 2 };
  const areaMap: Record<UnitType, number> = { studio: 45, apartment: 85, penthouse: 180, townhouse: 220 };
  const priceMap: Record<UnitType, number> = { studio: 680000, apartment: 1250000, penthouse: 3200000, townhouse: 2800000 };
  const statuses: UnitStatus[] = ["available", "reserved", "sold", "held"];
  const status = statuses[i % 4 === 0 ? 0 : i % 7 === 0 ? 1 : i % 3 === 0 ? 2 : 3];
  const blocks = ["A", "B", "V", "T", "P"];
  const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const facings = ["North", "South", "East", "West", "NE", "NW"];

  return {
    id: `u${i + 1}`,
    unitNumber: `${blocks[i % 5]}${String(floors[i % 10]).padStart(2, "0")}${String((i % 6) + 1)}`,
    type,
    bedrooms: bedMap[type],
    bathrooms: bathMap[type],
    cars: type === "penthouse" ? 3 : type === "townhouse" ? 2 : 1,
    area: areaMap[type] + (i % 20),
    price: priceMap[type] + (i * 15000),
    status,
    floor: floors[i % 10],
    block: blocks[i % 5],
    facing: facings[i % 6],
    svgPath: "",
    floorPlanSvg: "",
    features: type === "penthouse" ? ["Private Terrace", "Butler Pantry", "Smart Home", "City Views"]
      : type === "townhouse" ? ["Private Garden", "Double Garage", "Study", "Outdoor Kitchen"]
      : type === "studio" ? ["Built-in Robe", "Balcony", "Study Nook"]
      : ["Ensuite", "Balcony", "Storage Cage", "AirCon"],
    images: [`/unit-${type}-${(i % 3) + 1}.jpg`],
  };
});

const GALLERY_IMAGES: Record<GalleryCategory, { url: string; caption: string }[]> = {
  exterior: [
    { url: "/gallery/ext-hero.jpg", caption: "Azure Heights — Evening View" },
    { url: "/gallery/ext-day.jpg", caption: "Tower A & B from the Park" },
    { url: "/gallery/ext-lobby.jpg", caption: "Grand Lobby Entrance" },
    { url: "/gallery/ext-garden.jpg", caption: "Landscaped Gardens" },
  ],
  interior: [
    { url: "/gallery/int-living.jpg", caption: "Premium Living Room" },
    { url: "/gallery/int-kitchen.jpg", caption: "Designer Kitchen" },
    { url: "/gallery/int-bedroom.jpg", caption: "Master Suite" },
    { url: "/gallery/int-bath.jpg", caption: "Spa Bathroom" },
  ],
  amenities: [
    { url: "/gallery/amen-pool.jpg", caption: "Infinity Pool Deck" },
    { url: "/gallery/amen-gym.jpg", caption: "Fitness Centre" },
    { url: "/gallery/amen-lounge.jpg", caption: "Sky Lounge" },
    { url: "/gallery/amen-cinema.jpg", caption: "Private Cinema" },
  ],
  drone: [
    { url: "/gallery/drone-aerial.jpg", caption: "Aerial Site View" },
    { url: "/gallery/drone-sunset.jpg", caption: "Sunset Over the Towers" },
    { url: "/gallery/drone-context.jpg", caption: "Neighbourhood Context" },
    { url: "/gallery/drone-progress.jpg", caption: "Construction Progress" },
  ],
  lifestyle: [
    { url: "/gallery/life-couple.jpg", caption: "Morning Coffee on the Balcony" },
    { url: "/gallery/life-family.jpg", caption: "Family in the Garden" },
    { url: "/gallery/life-friends.jpg", caption: "Poolside Entertaining" },
    { url: "/gallery/life-wfh.jpg", caption: "Work from Home Setup" },
  ],
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
const statusColor = (s: UnitStatus) => ({
  available: { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400", border: "border-emerald-500/20" },
  reserved: { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400", border: "border-amber-500/20" },
  sold: { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400", border: "border-red-500/20" },
  held: { bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-400", border: "border-blue-500/20" },
}[s]);

const fmtPrice = (n: number) => `$${(n / 1000000).toFixed(2)}M`;
const fmtArea = (n: number) => `${n}m²`;

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function ProjectExperience() {
  const [view, setView] = useState<ViewMode>("before-after");
  const [presentationMode, setPresentationMode] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<GalleryCategory>("exterior");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50);
  const [arrayFilters, setArrayFilters] = useState({ type: "all" as string, status: "all" as string, block: "all" as string, sort: "price-asc" as string });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [teaserCopied, setTeaserCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [floorPlanOverlay, setFloorPlanOverlay] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);

  // Filtered units for array view
  const filteredUnits = UNITS.filter(u => {
    if (arrayFilters.type !== "all" && u.type !== arrayFilters.type) return false;
    if (arrayFilters.status !== "all" && u.status !== arrayFilters.status) return false;
    if (arrayFilters.block !== "all" && u.block !== arrayFilters.block) return false;
    return true;
  }).sort((a, b) => {
    if (arrayFilters.sort === "price-asc") return a.price - b.price;
    if (arrayFilters.sort === "price-desc") return b.price - a.price;
    if (arrayFilters.sort === "area-asc") return a.area - b.area;
    if (arrayFilters.sort === "area-desc") return b.area - a.area;
    return a.unitNumber.localeCompare(b.unitNumber);
  });

  // Block-level stats
  const blockStats = BLOCKS.map(b => ({
    ...b,
    available: b.totalUnits - b.sold - b.reserved,
    percentSold: Math.round((b.sold / b.totalUnits) * 100),
  }));

  // Toggle favorite
  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Copy teaser link
  const copyTeaser = () => {
    navigator.clipboard.writeText("https://stedaxis.com/t/azure-heights");
    setTeaserCopied(true);
    setTimeout(() => setTeaserCopied(false), 2000);
  };

  // Revenue at risk calculation
  const revenueAtRisk = UNITS.filter(u => u.status === "held").reduce((sum, u) => sum + u.price, 0);
  const availableRevenue = UNITS.filter(u => u.status === "available").reduce((sum, u) => sum + u.price, 0);

  /* ─── Before/After View ─── */
  const BeforeAfterView = () => (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Hero Video Background */}
      <div className="relative h-[55%] overflow-hidden bg-[#0f0f0f]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {/* Simulated video/image */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f0f]" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 60%),
                              radial-gradient(circle at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 50%)`,
          }} />
          {/* Animated particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/10"
              style={{
                left: `${20 + (i * 3.5) % 60}%`,
                top: `${10 + (i * 7.2) % 70}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          {/* Building silhouette */}
          <svg viewBox="0 0 800 400" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[900px] opacity-30">
            <rect x="250" y="100" width="80" height="300" rx="2" fill="#1e293b" />
            <rect x="340" y="60" width="90" height="340" rx="2" fill="#1e293b" />
            <rect x="440" y="120" width="70" height="280" rx="2" fill="#1e293b" />
            <rect x="520" y="80" width="85" height="320" rx="2" fill="#1e293b" />
            {/* Windows */}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 12 }).map((_, col) => (
                <rect key={`${row}-${col}`} x={260 + col * 55 + (col > 3 ? 15 : 0) + (col > 7 ? 10 : 0)} y={120 + row * 35} width="18" height="22" rx="1" fill="#334155" opacity="0.6" />
              ))
            )}
          </svg>
        </motion.div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Now Selling</span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-white/40 text-[10px] font-medium">Sydney CBD</span>
            </div>
            <h1 className="text-[42px] font-bold text-white leading-none tracking-tight mb-2">Azure Heights</h1>
            <p className="text-[15px] text-white/40 mb-4">A landmark residential collection — 153 residences across 5 buildings</p>
            <div className="flex items-center gap-4 text-[12px] text-white/30">
              <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" />Studio — 3 Bed</span>
              <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" />45 — 220m²</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />From $680,000</span>
            </div>
          </motion.div>
        </div>

        {/* Before/After Slider */}
        <div className="absolute right-8 bottom-8 w-[320px]">
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-xl border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-white/60">Interactive Preview</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/25 uppercase tracking-wider">Flat PDF</span>
                <div className="w-8 h-4 rounded-full bg-white/[0.08] relative">
                  <motion.div
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white/60"
                    animate={{ left: beforeAfterSlider > 50 ? "18px" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-medium">Live</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={beforeAfterSlider}
              onChange={(e) => setBeforeAfterSlider(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b3b45 0%, #3b3b45 ${beforeAfterSlider}%, #10b981 ${beforeAfterSlider}%, #10b981 100%)`,
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-white/20">Traditional</span>
              <span className="text-[10px] text-emerald-400/60 font-medium">OneAxis Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex-shrink-0 grid grid-cols-6 gap-px bg-white/[0.03] border-y border-white/[0.03]">
        {[
          { label: "Total Units", value: "153", change: "5 buildings" },
          { label: "Available", value: "68", change: "44%", positive: true },
          { label: "Reserved", value: "33", change: "21%", positive: true },
          { label: "Sold", value: "52", change: "34%", positive: true },
          { label: "Avg $/m²", value: "$14,200", change: "+8% YoY", positive: true },
          { label: "Revenue At Risk", value: fmtPrice(revenueAtRisk), change: "held units", alert: true },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="bg-[#0A0A0A] px-5 py-3"
          >
            <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-[18px] font-semibold ${s.alert ? "text-amber-400" : "text-white/90"}`}>{s.value}</p>
            <p className={`text-[10px] ${s.positive ? "text-emerald-400/60" : s.alert ? "text-amber-400/50" : "text-white/25"}`}>{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick access grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: Map, label: "Block View", desc: "Interactive site plan", view: "block" as ViewMode, color: "#3b82f6" },
            { icon: Grid3X3, label: "Array View", desc: "Filter all 153 units", view: "array" as ViewMode, color: "#8b5cf6" },
            { icon: Image, label: "Gallery", desc: "Photos, drone & 360°", view: "gallery" as ViewMode, color: "#10b981" },
            { icon: MapPin, label: "Location", desc: "Neighbourhood & amenities", view: "location" as ViewMode, color: "#f59e0b" },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              onClick={() => setView(item.view)}
              className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] rounded-xl p-5 text-left transition-all"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${item.color}15` }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <h3 className="text-[14px] font-medium text-white/80 group-hover:text-white/90 mb-1">{item.label}</h3>
              <p className="text-[11px] text-white/25">{item.desc}</p>
              <ArrowUpDown className="absolute top-4 right-4 w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Revenue Risk Panel */}
        <div className="bg-gradient-to-r from-amber-500/[0.04] to-transparent border border-amber-500/10 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-white/80 mb-1">Revenue at Risk — Morning Briefing</h3>
                <p className="text-[11px] text-white/30 mb-3 max-w-[500px]">
                  4 units on hold approaching expiry. 2 quiet buyers haven't engaged in 7+ days.
                  Recommended actions ready for approval.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-white/40">{fmtPrice(revenueAtRisk)} at risk</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white/40">{fmtPrice(availableRevenue)} opportunity</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] font-medium hover:bg-amber-500/20 transition-colors">
              View Actions
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Block View (Interactive Site Plan) ─── */
  const BlockView = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* SVG Map */}
      <div className="flex-1 relative bg-[#080808] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 720 500"
          className="w-full h-full"
          style={{ maxHeight: "100%" }}
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="siteGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0f0f0f" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width="720" height="500" fill="url(#siteGrad)" />
          <rect width="720" height="500" fill="url(#grid)" />

          {/* Roads */}
          <rect x="0" y="280" width="720" height="30" fill="#1a1a1a" opacity="0.6" />
          <rect x="320" y="0" width="25" height="500" fill="#1a1a1a" opacity="0.6" />
          <text x="360" y="298" fill="rgba(255,255,255,0.12)" fontSize="9" textAnchor="middle" fontFamily="Inter">PARK AVENUE</text>
          <text x="332" y="200" fill="rgba(255,255,255,0.12)" fontSize="9" textAnchor="middle" fontFamily="Inter" transform="rotate(90, 332, 200)">CENTRAL WAY</text>

          {/* Water feature */}
          <ellipse cx="580" cy="420" rx="100" ry="50" fill="#0c4a6e" opacity="0.3" />
          <ellipse cx="580" cy="420" rx="80" ry="35" fill="#0e5a82" opacity="0.2" />
          <text x="580" y="425" fill="rgba(255,255,255,0.15)" fontSize="9" textAnchor="middle" fontFamily="Inter">WATER GARDEN</text>

          {/* Blocks */}
          {blockStats.map((block) => {
            const isSelected = selectedBlock?.id === block.id;
            const isHovered = hoveredUnit === block.id;
            return (
              <g
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                onMouseEnter={() => setHoveredUnit(block.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={block.svgPath}
                  fill={isSelected ? `${block.color}30` : isHovered ? `${block.color}18` : `${block.color}08`}
                  stroke={isSelected ? block.color : `${block.color}40`}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  filter={isSelected ? "url(#glow)" : undefined}
                  transition="all 0.3s"
                />
                {/* Block label */}
                <text
                  x={block.svgPath.match(/M(\d+)/)?.[1] ? parseInt(block.svgPath.match(/M(\d+)/)![1]) + 40 : 0}
                  y={block.svgPath.match(/M\d+,(\d+)/)?.[1] ? parseInt(block.svgPath.match(/M\d+,(\d+)/)![1]) + 30 : 0}
                  fill={isSelected ? "#fff" : `${block.color}99`}
                  fontSize="16"
                  fontWeight="bold"
                  fontFamily="Inter"
                >
                  {block.label}
                </text>
                {/* Availability indicator */}
                <rect
                  x={block.svgPath.match(/M(\d+)/)?.[1] ? parseInt(block.svgPath.match(/M\d+,(\d+)/)![1]) + 20 : 0}
                  y={block.svgPath.match(/M\d+,(\d+)/)?.[1] ? parseInt(block.svgPath.match(/M\d+,(\d+)/)![1]) + 55 : 0}
                  width={block.available / block.totalUnits * 60}
                  height="4"
                  rx="2"
                  fill="#10b981"
                  opacity="0.8"
                />
                <rect
                  x={block.svgPath.match(/M(\d+)/)?.[1] ? parseInt(block.svgPath.match(/M\d+,(\d+)/)![1]) + 20 : 0}
                  y={block.svgPath.match(/M\d+,(\d+)/)?.[1] ? parseInt(block.svgPath.match(/M\d+,(\d+)/)![1]) + 55 : 0}
                  width={60}
                  height="4"
                  rx="2"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}

          {/* Amenity markers */}
          {AMENITY_MARKERS.map((amenity) => (
            <g key={amenity.id} style={{ cursor: "pointer" }}>
              <circle cx={amenity.x} cy={amenity.y} r="14" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <foreignObject x={amenity.x - 7} y={amenity.y - 7} width="14" height="14">
                <div className="flex items-center justify-center h-full">
                  <amenity.icon className="w-3 h-3 text-white/50" />
                </div>
              </foreignObject>
              <text x={amenity.x} y={amenity.y + 24} fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle" fontFamily="Inter">{amenity.name}</text>
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(20, 450)">
            <text x="0" y="0" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter" fontWeight="600">LEGEND</text>
            {[
              { color: "#10b981", label: "Available" },
              { color: "#f59e0b", label: "Reserved" },
              { color: "#ef4444", label: "Sold" },
              { color: "#3b82f6", label: "Selected" },
            ].map((l, i) => (
              <g key={l.label} transform={`translate(${i * 70}, 14)`}>
                <rect x="0" y="-6" width="8" height="8" rx="2" fill={l.color} opacity="0.8" />
                <text x="12" y="0" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="Inter">{l.label}</text>
              </g>
            ))}
          </g>
        </svg>

        {/* Floating controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => setSelectedBlock(null)}
            className="w-9 h-9 rounded-lg bg-[#0A0A0A]/80 backdrop-blur border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.05] transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>

      {/* Block detail sidebar */}
      <AnimatePresence>
        {selectedBlock && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-l border-white/[0.04] bg-[#0A0A0A] overflow-hidden flex-shrink-0"
          >
            <div className="w-[320px] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-white/90">{selectedBlock.name}</h3>
                  <p className="text-[11px] text-white/30">Block {selectedBlock.label} — {selectedBlock.totalUnits} units</p>
                </div>
                <button onClick={() => setSelectedBlock(null)} className="w-7 h-7 rounded-lg hover:bg-white/[0.05] flex items-center justify-center">
                  <X className="w-4 h-4 text-white/30" />
                </button>
              </div>

              {/* Availability donut */}
              <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="#1a1a1a" strokeWidth="6" />
                  {(() => {
                    const circ = 2 * Math.PI * 28;
                    const soldOffset = circ * (selectedBlock.sold / selectedBlock.totalUnits);
                    const reservedOffset = circ * (selectedBlock.reserved / selectedBlock.totalUnits);
                    return (
                      <>
                        <circle cx="35" cy="35" r="28" fill="none" stroke="#ef4444" strokeWidth="6"
                          strokeDasharray={`${soldOffset} ${circ - soldOffset}`} strokeLinecap="round" transform="rotate(-90 35 35)" />
                        <circle cx="35" cy="35" r="28" fill="none" stroke="#f59e0b" strokeWidth="6"
                          strokeDasharray={`${reservedOffset} ${circ - reservedOffset}`}
                          strokeDashoffset={-soldOffset} strokeLinecap="round" transform="rotate(-90 35 35)" />
                      </>
                    );
                  })()}
                  <text x="35" y="32" fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle" fontWeight="600">{Math.round((selectedBlock.sold / selectedBlock.totalUnits) * 100)}%</text>
                  <text x="35" y="44" fill="rgba(255,255,255,0.25)" fontSize="7" textAnchor="middle">sold</text>
                </svg>
                <div className="space-y-2 flex-1">
                  {[
                    { label: "Available", value: selectedBlock.totalUnits - selectedBlock.sold - selectedBlock.reserved, color: "#10b981" },
                    { label: "Reserved", value: selectedBlock.reserved, color: "#f59e0b" },
                    { label: "Sold", value: selectedBlock.sold, color: "#ef4444" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <span className="text-white/70 font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Units in this block */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">Units</h4>
                {UNITS.filter(u => u.block === selectedBlock.label).slice(0, 12).map(unit => {
                  const st = statusColor(unit.status);
                  return (
                    <button
                      key={unit.id}
                      onClick={() => { setSelectedUnit(unit); setView("unit"); }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-white/[0.08] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                        <span className="text-[12px] text-white/70 font-medium">{unit.unitNumber}</span>
                        <span className="text-[10px] text-white/25">{unit.bedrooms}bd · {fmtArea(unit.area)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-white/50">{fmtPrice(unit.price)}</span>
                        <ChevronRight className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => { setArrayFilters(prev => ({ ...prev, block: selectedBlock.label })); setView("array"); }}
                className="w-full mt-4 py-2.5 rounded-lg bg-white/[0.06] text-white/60 text-[12px] font-medium hover:bg-white/[0.1] hover:text-white/80 transition-colors"
              >
                View All in Array
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ─── Array View ─── */
  const ArrayView = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filters bar */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-white/[0.03] flex items-center gap-3">
        <Filter className="w-3.5 h-3.5 text-white/20" />
        {[
          { key: "type" as const, label: "Type", options: ["all", "studio", "apartment", "penthouse", "townhouse"] },
          { key: "status" as const, label: "Status", options: ["all", "available", "reserved", "sold", "held"] },
          { key: "block" as const, label: "Block", options: ["all", "A", "B", "V", "T", "P"] },
        ].map(f => (
          <select
            key={f.key}
            value={arrayFilters[f.key]}
            onChange={(e) => setArrayFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[11px] text-white/60 outline-none focus:border-white/15"
          >
            {f.options.map(o => (
              <option key={o} value={o} className="bg-[#0A0A0A]">{o === "all" ? f.label : o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        ))}
        <select
          value={arrayFilters.sort}
          onChange={(e) => setArrayFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="ml-auto bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[11px] text-white/60 outline-none focus:border-white/15"
        >
          <option value="price-asc" className="bg-[#0A0A0A]">Price: Low to High</option>
          <option value="price-desc" className="bg-[#0A0A0A]">Price: High to Low</option>
          <option value="area-asc" className="bg-[#0A0A0A]">Area: Small to Large</option>
          <option value="area-desc" className="bg-[#0A0A0A]">Area: Large to Small</option>
        </select>
        <span className="text-[10px] text-white/20">{filteredUnits.length} units</span>
      </div>

      {/* Unit grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredUnits.map((unit, i) => {
              const st = statusColor(unit.status);
              return (
                <motion.div
                  key={unit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.01, 0.3) }}
                  onClick={() => { setSelectedUnit(unit); setView("unit"); }}
                  className={`group relative bg-white/[0.02] hover:bg-white/[0.05] border ${st.border} rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg`}
                >
                  {/* Unit visual */}
                  <div className="h-[140px] relative bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-[28px] font-bold text-white/10 group-hover:text-white/15 transition-colors">{unit.unitNumber}</span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <Bed className="w-3 h-3 text-white/15" />
                        <span className="text-[10px] text-white/15">{unit.bedrooms}</span>
                        <Bath className="w-3 h-3 text-white/15 ml-1" />
                        <span className="text-[10px] text-white/15">{unit.bathrooms}</span>
                        <Car className="w-3 h-3 text-white/15 ml-1" />
                        <span className="text-[10px] text-white/15">{unit.cars}</span>
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full ${st.bg} ${st.text} text-[9px] font-semibold uppercase tracking-wider`}>
                      {unit.status}
                    </div>
                    {/* Favorite */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(unit.id); }}
                      className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                      <Heart className={`w-3 h-3 ${favorites.has(unit.id) ? "text-red-400 fill-red-400" : "text-white/30"}`} />
                    </button>
                    {/* Block badge */}
                    <div className="absolute bottom-2.5 left-2.5 px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-white/30 font-medium">
                      Block {unit.block} · Floor {unit.floor}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-white/80">{fmtPrice(unit.price)}</span>
                      <span className="text-[10px] text-white/25">{fmtArea(unit.area)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/20">
                      <span className="capitalize">{unit.type}</span>
                      <span>·</span>
                      <span>{unit.facing} facing</span>
                    </div>
                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {unit.features.slice(0, 3).map(f => (
                        <span key={f} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[8px] text-white/25">{f}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  /* ─── Unit Detail View ─── */
  const UnitDetailView = () => {
    if (!selectedUnit) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-[13px] text-white/30">Select a unit to view details</p>
            <button onClick={() => setView("array")} className="mt-3 px-4 py-2 rounded-lg bg-white/[0.06] text-white/50 text-[11px] hover:bg-white/[0.1]">
              Browse Units
            </button>
          </div>
        </div>
      );
    }

    const unit = selectedUnit;
    const st = statusColor(unit.status);

    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Floor Plan */}
        <div className="flex-1 relative bg-[#080808] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 600 450" className="w-[90%] max-w-[700px]">
            <defs>
              <linearGradient id="fpGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1e2e" />
                <stop offset="100%" stopColor="#16162a" />
              </linearGradient>
            </defs>
            {/* Room outline */}
            <rect x="50" y="50" width="500" height="350" rx="4" fill="url(#fpGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            {/* Living room */}
            <rect x="50" y="50" width="280" height="200" rx="2" fill="rgba(59,130,246,0.05)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="190" y="150" fill="rgba(255,255,255,0.2)" fontSize="12" textAnchor="middle" fontFamily="Inter">Living</text>
            {/* Kitchen */}
            <rect x="330" y="50" width="120" height="120" rx="2" fill="rgba(16,185,129,0.05)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="390" y="115" fill="rgba(255,255,255,0.2)" fontSize="11" textAnchor="middle" fontFamily="Inter">Kitchen</text>
            {/* Master bedroom */}
            <rect x="50" y="250" width="200" height="150" rx="2" fill="rgba(139,92,246,0.05)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="150" y="330" fill="rgba(255,255,255,0.2)" fontSize="12" textAnchor="middle" fontFamily="Inter">Master Bed</text>
            {/* Bedroom 2 */}
            <rect x="250" y="250" width="150" height="150" rx="2" fill="rgba(245,158,11,0.05)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="325" y="330" fill="rgba(255,255,255,0.2)" fontSize="11" textAnchor="middle" fontFamily="Inter">Bed 2</text>
            {/* Bathroom */}
            <rect x="450" y="50" width="100" height="90" rx="2" fill="rgba(6,182,212,0.05)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="500" y="98" fill="rgba(255,255,255,0.2)" fontSize="10" textAnchor="middle" fontFamily="Inter">Bath</text>
            {/* Ensuite */}
            <rect x="400" y="250" width="150" height="100" rx="2" fill="rgba(236,72,153,0.05)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x="475" y="305" fill="rgba(255,255,255,0.2)" fontSize="10" textAnchor="middle" fontFamily="Inter">Ensuite</text>
            {/* Balcony */}
            <rect x="400" y="350" width="150" height="50" rx="2" fill="rgba(234,179,8,0.05)" stroke="rgba(234,179,8,0.15)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="475" y="380" fill="rgba(234,179,8,0.3)" fontSize="10" textAnchor="middle" fontFamily="Inter">Balcony</text>
            {/* Dimensions */}
            <line x1="50" y1="415" x2="550" y2="415" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <text x="300" y="435" fill="rgba(255,255,255,0.15)" fontSize="9" textAnchor="middle" fontFamily="Inter">12.5m</text>
            <line x1="570" y1="50" x2="570" y2="400" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <text x="585" y="225" fill="rgba(255,255,255,0.15)" fontSize="9" textAnchor="middle" fontFamily="Inter" transform="rotate(90, 585, 225)">8.2m</text>
          </svg>

          {/* Overlay controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <button
              onClick={() => setFloorPlanOverlay(!floorPlanOverlay)}
              className="px-3 py-1.5 rounded-lg bg-[#0A0A0A]/80 backdrop-blur border border-white/[0.06] text-[11px] text-white/50 hover:text-white/70 transition-colors"
            >
              {floorPlanOverlay ? "Hide Dimensions" : "Show Dimensions"}
            </button>
          </div>
        </div>

        {/* Right: Unit Info */}
        <div className="w-[380px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setView("array")} className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFav(unit.id)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                >
                  <Heart className={`w-4 h-4 ${favorites.has(unit.id) ? "text-red-400 fill-red-400" : "text-white/30"}`} />
                </button>
                <button
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors relative"
                >
                  <Share2 className="w-4 h-4 text-white/30" />
                  <AnimatePresence>
                    {shareMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[#141414] border border-white/[0.06] rounded-xl shadow-2xl py-2 z-50"
                      >
                        <button onClick={copyTeaser} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
                          <Link2 className="w-3.5 h-3.5" /> Copy Link
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
                          <Mail className="w-3.5 h-3.5" /> Email to Client
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            {/* Unit identity */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full ${st.bg} ${st.text} text-[9px] font-semibold uppercase tracking-wider`}>
                  {unit.status}
                </span>
                <span className="text-[10px] text-white/20">Block {unit.block} · Floor {unit.floor}</span>
              </div>
              <h2 className="text-[22px] font-bold text-white/90 mb-1">Unit {unit.unitNumber}</h2>
              <p className="text-[12px] text-white/30 capitalize">{unit.type} · {unit.facing} facing</p>
            </div>

            {/* Price */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[28px] font-bold text-white/90">{fmtPrice(unit.price)}</span>
                <span className="text-[12px] text-white/25">{Math.round(unit.price / unit.area).toLocaleString()}/m²</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px]">
                <span className="text-emerald-400/60 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 8% below market
                </span>
                <span className="text-white/15">|</span>
                <span className="text-white/25">Est. stamp duty: ${Math.round(unit.price * 0.05).toLocaleString()}</span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { icon: Bed, label: "Beds", value: String(unit.bedrooms) },
                { icon: Bath, label: "Baths", value: String(unit.bathrooms) },
                { icon: Car, label: "Cars", value: String(unit.cars) },
                { icon: Square, label: "Area", value: fmtArea(unit.area) },
              ].map(s => (
                <div key={s.label} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-center">
                  <s.icon className="w-4 h-4 text-white/20 mx-auto mb-1" />
                  <p className="text-[14px] font-semibold text-white/70">{s.value}</p>
                  <p className="text-[9px] text-white/20">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-5">
              <h4 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">Features</h4>
              <div className="flex flex-wrap gap-1.5">
                {unit.features.map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-white/40">{f}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-2">
              <button className="w-full py-3 rounded-xl bg-white/[0.08] text-white/80 text-[13px] font-medium hover:bg-white/[0.12] transition-colors">
                Reserve Now — $5,000 Hold
              </button>
              <button className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50 text-[12px] hover:bg-white/[0.06] transition-colors">
                Download Floor Plan PDF
              </button>
              <button
                onClick={() => setView("gallery")}
                className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50 text-[12px] hover:bg-white/[0.06] transition-colors"
              >
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─── Gallery View ─── */
  const GalleryView = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Category tabs */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-white/[0.03] flex items-center gap-1">
        {(["exterior", "interior", "amenities", "drone", "lifestyle"] as GalleryCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setGalleryCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all ${
              galleryCategory === cat ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50 hover:bg-white/[0.03]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          key={galleryCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {GALLERY_IMAGES[galleryCategory].map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f0f] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image className="w-8 h-8 text-white/8 group-hover:text-white/12 transition-colors" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[11px] text-white/60 font-medium text-left">{img.caption}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* 360 Preview card */}
        <div className="mt-6 bg-gradient-to-r from-[#0f172a] to-[#0A0A0A] border border-white/[0.04] rounded-xl p-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
            <Eye className="w-7 h-7 text-white/20" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-medium text-white/70 mb-0.5">360° Virtual Tour Available</h4>
            <p className="text-[11px] text-white/25">Walk through every room, balcony, and amenity space in immersive 360°</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/[0.06] text-white/50 text-[11px] font-medium hover:bg-white/[0.1] hover:text-white/70 transition-colors">
            Launch Tour
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.15] transition-colors">
              <X className="w-5 h-5 text-white/60" />
            </button>
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.15] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
            )}
            {lightboxIndex < GALLERY_IMAGES[galleryCategory].length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.15] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white/60" />
              </button>
            )}
            <div className="text-center">
              <div className="w-[80vw] max-w-[1000px] h-[70vh] bg-gradient-to-br from-[#1a1a2e] to-[#0f0f0f] rounded-xl flex items-center justify-center">
                <Image className="w-20 h-20 text-white/10" />
              </div>
              <p className="mt-4 text-[13px] text-white/50">
                {GALLERY_IMAGES[galleryCategory][lightboxIndex]?.caption}
              </p>
              <p className="mt-1 text-[11px] text-white/20">
                {lightboxIndex + 1} / {GALLERY_IMAGES[galleryCategory].length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ─── Location View ─── */
  const LocationView = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Map area */}
      <div className="flex-1 relative bg-[#080808] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 700 500" className="w-full h-full" style={{ maxHeight: "100%" }}>
          <defs>
            <radialGradient id="locGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#0A0A0A" />
            </radialGradient>
          </defs>
          <rect width="700" height="500" fill="url(#locGrad)" />

          {/* Street grid */}
          {[80, 160, 240, 320, 400, 480].map(y => (
            <line key={`h-${y}`} x1="0" y1={y} x2="700" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[100, 200, 300, 400, 500, 600].map(x => (
            <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Main roads */}
          <rect x="0" y="220" width="700" height="40" fill="#1a1a1a" opacity="0.5" />
          <rect x="280" y="0" width="35" height="500" fill="#1a1a1a" opacity="0.5" />
          <text x="350" y="245" fill="rgba(255,255,255,0.12)" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="600">PARK AVENUE</text>
          <text x="297" y="150" fill="rgba(255,255,255,0.12)" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="600" transform="rotate(90, 297, 150)">CENTRAL WAY</text>

          {/* Project location */}
          <circle cx="350" cy="240" r="30" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="350" cy="240" r="8" fill="#3b82f6" />
          <text x="350" y="210" fill="#3b82f6" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="600">AZURE HEIGHTS</text>

          {/* Nearby amenities */}
          {[
            { x: 150, y: 180, name: "Central Station", color: "#10b981" },
            { x: 500, y: 160, name: "Westfield", color: "#8b5cf6" },
            { x: 200, y: 360, name: "Royal Hospital", color: "#ef4444" },
            { x: 550, y: 320, name: "St. Mary's", color: "#f59e0b" },
            { x: 400, y: 100, name: "Harbour Dining", color: "#06b6d4" },
          ].map(a => (
            <g key={a.name}>
              <circle cx={a.x} cy={a.y} r="6" fill={a.color} opacity="0.8" />
              <text x={a.x} y={a.y - 12} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="middle" fontFamily="Inter">{a.name}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Sidebar */}
      <div className="w-[300px] border-l border-white/[0.04] bg-[#0A0A0A] overflow-y-auto">
        <div className="p-5">
          <h3 className="text-[15px] font-semibold text-white/90 mb-1">Location</h3>
          <p className="text-[11px] text-white/30 mb-4">45 Park Avenue, Sydney CBD 2000</p>

          {/* Walk score */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/40">Walk Score</span>
              <span className="text-[18px] font-bold text-emerald-400">98</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: "98%" }} />
            </div>
            <p className="text-[10px] text-white/20 mt-1.5">Walker's Paradise — daily errands do not require a car</p>
          </div>

          {/* Transport score */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/40">Transit Score</span>
              <span className="text-[18px] font-bold text-blue-400">100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div className="h-full rounded-full bg-blue-400" style={{ width: "100%" }} />
            </div>
            <p className="text-[10px] text-white/20 mt-1.5">Rider's Paradise — world-class public transport</p>
          </div>

          {/* Nearby amenities list */}
          <h4 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-3">Nearby Amenities</h4>
          <div className="space-y-2">
            {NEARBY_AMENITIES.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <a.icon className="w-4 h-4 text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white/60 truncate">{a.name}</p>
                  <p className="text-[10px] text-white/20 capitalize">{a.type}</p>
                </div>
                <span className="text-[11px] text-white/30 font-medium">{a.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Teaser Link Bar ─── */
  const TeaserBar = () => (
    <div className="flex-shrink-0 px-6 py-2.5 border-t border-white/[0.03] bg-[#0A0A0A] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link2 className="w-3.5 h-3.5 text-white/20" />
        <span className="text-[11px] text-white/30">Public teaser link:</span>
        <code className="text-[11px] text-emerald-400/60 bg-emerald-500/[0.06] px-2 py-0.5 rounded">stedaxis.com/t/azure-heights</code>
        <button
          onClick={copyTeaser}
          className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
        >
          {teaserCopied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {teaserCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/15">Share:</span>
        <button className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
          <Smartphone className="w-3 h-3 text-white/25" />
        </button>
        <button className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
          <Monitor className="w-3 h-3 text-white/25" />
        </button>
        <button className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
          <Tablet className="w-3 h-3 text-white/25" />
        </button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  const views: Record<ViewMode, React.ReactNode> = {
    "before-after": <BeforeAfterView />,
    block: <BlockView />,
    array: <ArrayView />,
    unit: <UnitDetailView />,
    gallery: <GalleryView />,
    location: <LocationView />,
  };

  const viewLabels: Record<ViewMode, string> = {
    "before-after": "Overview",
    block: "Block View",
    array: "Array View",
    unit: "Unit Detail",
    gallery: "Gallery",
    location: "Location",
  };

  return (
    <AdminLayout hideSidebar={presentationMode}>
      <div className="h-full flex flex-col bg-[#0A0A0A]">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b3b45] to-[#4a4a55] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[13px] font-semibold text-white/90">Project Experience</h1>
                <span className="text-[10px] text-white/20">/</span>
                <span className="text-[11px] text-white/40">{viewLabels[view]}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex items-center rounded-lg p-[2px] bg-white/[0.03] border border-white/[0.04]">
              {([
                { id: "before-after" as ViewMode, icon: Layers, label: "Overview" },
                { id: "block" as ViewMode, icon: Map, label: "Block" },
                { id: "array" as ViewMode, icon: Grid3X3, label: "Array" },
                { id: "gallery" as ViewMode, icon: Image, label: "Gallery" },
                { id: "location" as ViewMode, icon: MapPin, label: "Location" },
              ]).map(v => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                    view === v.id ? "bg-white/[0.08] text-white/80" : "text-white/25 hover:text-white/50"
                  }`}
                  title={v.label}
                >
                  <v.icon className="w-3 h-3" />
                  <span className="hidden lg:inline">{v.label}</span>
                </button>
              ))}
            </div>

            {/* Presentation mode */}
            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                presentationMode ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.03] text-white/30 hover:text-white/50 border border-white/[0.04]"
              }`}
            >
              {presentationMode ? <Minimize2 className="w-3 h-3" /> : <Presentation className="w-3 h-3" />}
              {presentationMode ? "Exit" : "Present"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {views[view]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Teaser link bar */}
        <TeaserBar />
      </div>
    </AdminLayout>
  );
}
