import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin,
  Grid3X3, X, Navigation, Info, RotateCcw, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanoramaHotspot {
  id: string;
  yaw: number;
  pitch: number;
  label: string;
  targetSpotId: string | null;
  type: 'navigate' | 'info' | 'label';
  info: string;
}

interface PanoramaSpot {
  id: string;
  name: string;
  roomId: string | null;
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  imageUrl: string;
  thumbnailUrl: string;
  hotspots: PanoramaHotspot[];
}

interface Props {
  spots: PanoramaSpot[];
  onClose: () => void;
}

/* ────────────────────────────────────────────────
   360° PANORAMA VIEWER (Matterport-like)
   Equirectangular image viewer with drag navigation,
   hotspot overlays, mini-map, and room-to-room
   walkthrough capability.
   ──────────────────────────────────────────── */

export default function PanoramaViewer({ spots, onClose }: Props) {
  const [currentSpotIdx, setCurrentSpotIdx] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [fov, setFov] = useState(75);
  const [isDragging, setIsDragging] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showHotspots] = useState(true);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, yaw: 0, pitch: 0 });

  const currentSpot = spots[currentSpotIdx] || spots[0];

  // Mouse/touch drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      yaw,
      pitch,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [yaw, pitch]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const sensitivity = 0.3;
    setYaw(dragStart.current.yaw - dx * sensitivity);
    setPitch(Math.max(-45, Math.min(45, dragStart.current.pitch + dy * sensitivity)));
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.05;
    setFov((prev) => Math.max(30, Math.min(120, prev + delta)));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setYaw((y) => y - 15);
      if (e.key === 'ArrowRight') setYaw((y) => y + 15);
      if (e.key === 'ArrowUp') setPitch((p) => Math.max(-45, p - 10));
      if (e.key === 'ArrowDown') setPitch((p) => Math.min(45, p + 10));
      if (e.key === '+') setFov((f) => Math.max(30, f - 5));
      if (e.key === '-') setFov((f) => Math.min(120, f + 5));
      if (e.key === 'Escape') { if (isFullscreen) setIsFullscreen(false); else onClose(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, isFullscreen]);

  // Navigate to another spot
  const navigateToSpot = (targetId: string) => {
    const idx = spots.findIndex((s) => s.id === targetId);
    if (idx >= 0) {
      setCurrentSpotIdx(idx);
      setYaw(0);
      setPitch(0);
      setActiveInfo(null);
    }
  };

  // Calculate hotspot position on screen
  const getHotspotScreenPos = (h: PanoramaHotspot) => {
    const relYaw = ((h.yaw - yaw + 540) % 360) - 180;
    const relPitch = h.pitch - pitch;
    if (Math.abs(relYaw) > fov / 2 || Math.abs(relPitch) > fov / 2) return null;
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = cx + (relYaw / (fov / 2)) * cx;
    const y = cy - (relPitch / (fov / 2)) * cy;
    return { x, y, visible: true };
  };

  // Generate a procedural equirectangular gradient background
  // since we don't have actual 360 photos
  const getPanoramaGradient = (spot: PanoramaSpot) => {
    const roomColors: Record<string, string> = {
      'Living Room': 'from-amber-900 via-amber-800 to-amber-950',
      'Kitchen': 'from-orange-900 via-orange-800 to-orange-950',
      'Master Suite': 'from-indigo-900 via-indigo-800 to-indigo-950',
      'Bedroom': 'from-blue-900 via-blue-800 to-blue-950',
      'Bathroom': 'from-cyan-900 via-cyan-800 to-cyan-950',
      'Foyer': 'from-stone-800 via-stone-700 to-stone-900',
      'Balcony': 'from-sky-900 via-sky-800 to-sky-950',
      'Garage': 'from-gray-800 via-gray-700 to-gray-900',
    };
    return roomColors[spot.name] || 'from-gray-900 via-gray-800 to-gray-950';
  };

  // Simulated 360 view using CSS perspective transform
  // In production, this would be a real equirectangular image
  const panoramaStyle: React.CSSProperties = {
    width: '300%',
    height: '200%',
    position: 'absolute',
    top: '-50%',
    left: '-100%',
    background: `radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 60%), linear-gradient(to bottom, ${timeOfDay === 'night' ? '#0a0a1a' : '#1a2035'} 0%, ${timeOfDay === 'night' ? '#0a0a0a' : '#2a3045'} 50%, ${timeOfDay === 'night' ? '#1a1a2e' : '#3a4055'} 100%)`,
    transform: `translate(${-yaw / 360 * 33.33}%, ${pitch / 90 * 25}%)`,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  // Room indicators at bottom
  const roomPreviewColors: Record<string, string> = {
    'Living Room': 'bg-amber-900',
    'Kitchen': 'bg-orange-900',
    'Master Suite': 'bg-indigo-900',
    'Bedroom': 'bg-blue-900',
    'Bathroom': 'bg-cyan-900',
    'Foyer': 'bg-stone-800',
    'Balcony': 'bg-sky-900',
    'Garage': 'bg-gray-800',
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black select-none ${isFullscreen ? 'fixed inset-0 z-50' : 'flex-1 rounded-xl'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 360 Panorama Background (simulated with gradient) */}
      <div style={panoramaStyle} className={`bg-gradient-to-b ${getPanoramaGradient(currentSpot)}`}>
        {/* Floor */}
        <div
          className="absolute bottom-0 w-full"
          style={{
            height: '40%',
            background: `linear-gradient(to bottom, transparent 0%, ${timeOfDay === 'night' ? '#1a1510' : '#8B7355'} 30%, ${timeOfDay === 'night' ? '#0a0a0a' : '#6B5344'} 100%)`,
          }}
        />
        {/* Ceiling */}
        <div
          className="absolute top-0 w-full"
          style={{
            height: '25%',
            background: `linear-gradient(to top, transparent 0%, ${timeOfDay === 'night' ? '#1a1a2e' : '#F5F0E8'} 40%, ${timeOfDay === 'night' ? '#0a0a1a' : '#E8E0D4'} 100%)`,
          }}
        />
        {/* Simulated walls with architectural features */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Back wall */}
          <div className="absolute" style={{
            width: '33%', height: '35%',
            top: '25%', left: '33%',
            background: timeOfDay === 'night' ? '#1a1a2e' : '#E8E0D4',
            border: '2px solid rgba(255,255,255,0.1)',
          }}>
            {/* Window on back wall */}
            <div className="absolute" style={{
              width: '40%', height: '50%',
              top: '20%', left: '30%',
              background: timeOfDay === 'night' ? '#0a0a2e' : '#87CEEB',
              border: '4px solid #5C4033',
            }} />
          </div>
          {/* Left wall */}
          <div className="absolute" style={{
            width: '20%', height: '35%',
            top: '25%', left: '13%',
            background: timeOfDay === 'night' ? '#151525' : '#DDD5C5',
            transform: 'skewY(5deg)',
          }} />
          {/* Right wall */}
          <div className="absolute" style={{
            width: '20%', height: '35%',
            top: '25%', right: '13%',
            background: timeOfDay === 'night' ? '#151525' : '#DDD5C5',
            transform: 'skewY(-5deg)',
          }} />
        </div>
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Hotspots */}
      {showHotspots && currentSpot.hotspots.map((hotspot) => {
        const pos = getHotspotScreenPos(hotspot);
        if (!pos) return null;
        return (
          <motion.div
            key={hotspot.id}
            className="absolute z-10"
            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {hotspot.type === 'navigate' ? (
              <button
                onClick={(e) => { e.stopPropagation(); hotspot.targetSpotId && navigateToSpot(hotspot.targetSpotId); }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-all">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  {hotspot.label}
                </span>
              </button>
            ) : hotspot.type === 'info' ? (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === hotspot.id ? null : hotspot.id); }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/40 backdrop-blur-sm border-2 border-blue-400/60 flex items-center justify-center group-hover:bg-blue-500/60 transition-all">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <AnimatePresence>
                  {activeInfo === hotspot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-10 bg-black/80 backdrop-blur-md rounded-lg p-3 w-48 border border-gray-700"
                    >
                      <p className="text-white text-xs">{hotspot.info}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/80 text-[10px] bg-black/40 px-1.5 py-0.5 rounded">{hotspot.label}</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Button size="sm" variant="outline" className="bg-black/50 border-gray-700 text-white hover:bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-700">
            <span className="text-white text-sm font-medium">{currentSpot.name}</span>
            <span className="text-gray-400 text-xs ml-2">{currentSpotIdx + 1} / {spots.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button size="sm" variant="outline" className="bg-black/50 border-gray-700 text-white hover:bg-black/70" onClick={() => setTimeOfDay(t => t === 'day' ? 'sunset' : t === 'sunset' ? 'night' : 'day')}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/50 border-gray-700 text-white hover:bg-black/70" onClick={() => setShowMinimap(!showMinimap)}>
            <Grid3X3 className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/50 border-gray-700 text-white hover:bg-black/70" onClick={() => setFov((f) => Math.max(30, f - 5))}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/50 border-gray-700 text-white hover:bg-black/70" onClick={() => setFov((f) => Math.min(120, f + 5))}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/50 border-gray-700 text-white hover:bg-black/70" onClick={() => setIsFullscreen(!isFullscreen)}>
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-20 left-4 z-20 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center">
          <div
            className="text-white text-xs font-bold transition-transform duration-100"
            style={{ transform: `rotate(${-yaw}deg)` }}
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-amber-400">N</span>
            <span className="absolute top-1/2 -right-3 -translate-y-1/2">E</span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2">S</span>
            <span className="absolute top-1/2 -left-3 -translate-y-1/2">W</span>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        onClick={(e) => { e.stopPropagation(); setYaw((y) => y - 30); }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        onClick={(e) => { e.stopPropagation(); setYaw((y) => y + 30); }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom: Room thumbnails + mini-map */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="flex items-end justify-between">
          {/* Room selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {spots.map((spot, idx) => (
              <button
                key={spot.id}
                onClick={(e) => { e.stopPropagation(); setCurrentSpotIdx(idx); setYaw(0); setPitch(0); }}
                className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentSpotIdx ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <div className={`h-12 ${roomPreviewColors[spot.name] || 'bg-gray-800'} flex items-center justify-center`}>
                  <span className="text-white/60 text-[10px]">{spot.name[0]}</span>
                </div>
                <div className="bg-black/70 px-1.5 py-1">
                  <span className="text-white text-[10px] truncate block">{spot.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mini-map */}
          {showMinimap && (
            <div className="w-32 h-32 bg-black/60 backdrop-blur-sm rounded-lg border border-gray-700 ml-4 flex-shrink-0 relative overflow-hidden">
              <span className="absolute top-1 left-1 text-[9px] text-gray-400">Floor Plan</span>
              {/* Simplified floor plan */}
              <svg viewBox="0 0 100 80" className="w-full h-full pt-4">
                {/* Rooms */}
                <rect x="5" y="5" width="40" height="35" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                <rect x="50" y="5" width="45" height="35" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                <rect x="5" y="45" width="45" height="30" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                <rect x="55" y="45" width="40" height="30" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                {/* Current position dot */}
                {currentSpot.position && (
                  <circle
                    cx={50 + currentSpot.position.x * 3}
                    cy={40 + currentSpot.position.z * 2}
                    r={3}
                    fill="#3B82F6"
                    className="animate-pulse"
                  >
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* View direction */}
                <line
                  x1={50 + (currentSpot.position?.x || 0) * 3}
                  y1={40 + (currentSpot.position?.z || 0) * 2}
                  x2={50 + (currentSpot.position?.x || 0) * 3 + Math.sin((yaw * Math.PI) / 180) * 8}
                  y2={40 + (currentSpot.position?.z || 0) * 2 - Math.cos((yaw * Math.PI) / 180) * 8}
                  stroke="#3B82F6"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* FOV indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="text-white/40 text-[10px] bg-black/40 px-2 py-0.5 rounded">{fov.toFixed(0)}° FOV</span>
      </div>
    </div>
  );
}


