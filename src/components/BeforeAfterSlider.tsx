import { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin, Layers, ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
  showLabels?: boolean;
}

/* ────────────────────────────────────────────────
   BEFORE/AFTER SLIDER
   The "sorcery" feature. Drag to reveal the
   transformation from current empty land to the
   developed vision. Creates viral social media
   moments and powerful sales presentations.
   ──────────────────────────────────────────── */

export default function BeforeAfterSlider({
  beforeLabel = 'Current',
  afterLabel = 'Vision',
  height = 500,
  showLabels = true,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Auto-demo animation on first load
  useEffect(() => {
    let start: number | null = null;
    const duration = 2000;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setSliderPosition(30 + eased * 40); // 30% → 70%
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percent);
    },
    []
  );

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  // Generate procedural before/after images since we don't have real photos
  // The "before" shows empty land/satellite view
  // The "after" shows the developed 3D community
  const beforeBg = `linear-gradient(135deg, #C4A96E 0%, #B8A05E 30%, #A89150 50%, #C9B070 70%, #B5A360 100%)`;
  const afterBg = `linear-gradient(135deg, #3A5F3A 0%, #2D4A2D 25%, #4A704A 40%, #5A8A5A 55%, #3D6B3D 70%, #4A7A4A 100%)`;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden cursor-ew-resize select-none"
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* AFTER layer (full width - the VISION) */}
      <div
        className="absolute inset-0"
        style={{ background: afterBg }}
      >
        {/* Simulated developed community */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Road network */}
            <rect x="0" y="230" width="800" height="40" fill="#808080" />
            <rect x="380" y="0" width="40" height="500" fill="#808080" />
            <rect x="0" y="380" width="800" height="30" fill="#808080" />
            <rect x="180" y="0" width="25" height="500" fill="#707070" />
            <rect x="580" y="0" width="25" height="500" fill="#707070" />
            
            {/* Buildings */}
            <rect x="220" y="100" width="140" height="110" fill="#E8E0D4" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            <rect x="420" y="100" width="140" height="110" fill="#E8E0D4" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            <rect x="620" y="100" width="140" height="110" fill="#E8E0D4" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            <rect x="220" y="280" width="140" height="90" fill="#DDD5C5" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            <rect x="420" y="280" width="140" height="90" fill="#DDD5C5" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            <rect x="620" y="280" width="140" height="90" fill="#DDD5C5" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            <rect x="50" y="280" width="110" height="90" fill="#E0D8C8" stroke="#C4B8A8" strokeWidth="2" rx="4" />
            
            {/* Windows */}
            {[240, 260, 280, 300].map((x) =>
              [110, 130, 150].map((y) => (
                <rect key={`w-${x}-${y}`} x={x} y={y} width="12" height="16" fill="#87CEEB" opacity="0.7" />
              ))
            )}
            
            {/* Trees */}
            {[
              [100, 80], [150, 200], [350, 60], [350, 420], 
              [550, 60], [750, 200], [750, 400], [100, 420],
              [200, 230], [500, 230], [700, 230]
            ].map(([x, y], i) => (
              <g key={`tree-${i}`}>
                <circle cx={x} cy={y} r="18" fill="#2D5A3D" opacity="0.9" />
                <circle cx={x + 5} cy={y - 5} r="12" fill="#3A6B4A" opacity="0.8" />
              </g>
            ))}
            
            {/* Green spaces */}
            <rect x="0" y="420" width="800" height="80" fill="#4A7C59" opacity="0.6" />
            <rect x="0" y="0" width="800" height="80" fill="#4A7C59" opacity="0.4" />
            
            {/* Park areas */}
            <ellipse cx="100" cy="180" rx="60" ry="40" fill="#5A8A5A" opacity="0.5" />
            <ellipse cx="700" cy="160" rx="50" ry="35" fill="#5A8A5A" opacity="0.5" />
            
            {/* Labels */}
            <text x="280" y="160" textAnchor="middle" fill="#8B7355" fontSize="11" fontWeight="bold">Building A</text>
            <text x="480" y="160" textAnchor="middle" fill="#8B7355" fontSize="11" fontWeight="bold">Building B</text>
            <text x="680" y="160" textAnchor="middle" fill="#8B7355" fontSize="11" fontWeight="bold">Building C</text>
            <text x="280" y="330" textAnchor="middle" fill="#8B7355" fontSize="11" fontWeight="bold">Building D</text>
            <text x="480" y="330" textAnchor="middle" fill="#8B7355" fontSize="11" fontWeight="bold">Building E</text>
            <text x="680" y="330" textAnchor="middle" fill="#8B7355" fontSize="11" fontWeight="bold">Building F</text>
          </svg>
        </div>
        
        {/* After label */}
        {showLabels && (
          <div className="absolute top-4 right-4 bg-emerald-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> {afterLabel}
          </div>
        )}
      </div>

      {/* BEFORE layer (clipped - the CURRENT) */}
      <div
        className="absolute inset-0"
        style={{
          background: beforeBg,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        {/* Simulated empty land */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Empty plots */}
            {[200, 400, 600].map((x) =>
              [90, 270].map((y) => (
                <g key={`plot-${x}-${y}`}>
                  <rect x={x} y={y} width="160" height="120" fill="#C4A96E" stroke="#B8A05E" strokeWidth="2" strokeDasharray="8,4" rx="2" />
                  <text x={x + 80} y={y + 65} textAnchor="middle" fill="#A08840" fontSize="12" fontWeight="bold">LOT {String.fromCharCode(65 + (x/200))}{(y/180).toFixed(0)}</text>
                </g>
              ))
            )}
            
            {/* Dirt road */}
            <rect x="0" y="230" width="800" height="40" fill="#B09860" />
            <rect x="380" y="0" width="40" height="500" fill="#B09860" />
            
            {/* Sparse vegetation */}
            {[80, 150, 350, 550, 720, 780].map((x, i) => (
              <circle key={`sparse-${i}`} cx={x} cy={150 + (i % 3) * 100} r="10" fill="#8B9A5E" opacity="0.5" />
            ))}
            
            {/* Mountains in background */}
            <polygon points="0,80 150,20 300,60 450,10 600,50 800,30 800,120 0,120" fill="#8A8A7A" opacity="0.3" />
            
            {/* Labels */}
            <text x="280" y="160" textAnchor="middle" fill="#A08840" fontSize="11">Empty Plot</text>
            <text x="480" y="160" textAnchor="middle" fill="#A08840" fontSize="11">Empty Plot</text>
            <text x="680" y="160" textAnchor="middle" fill="#A08840" fontSize="11">Empty Plot</text>
            <text x="280" y="330" textAnchor="middle" fill="#A08840" fontSize="11">Empty Plot</text>
            <text x="480" y="330" textAnchor="middle" fill="#A08840" fontSize="11">Empty Plot</text>
            <text x="680" y="330" textAnchor="middle" fill="#A08840" fontSize="11">Empty Plot</text>
          </svg>
        </div>
        
        {/* Before label */}
        {showLabels && (
          <div className="absolute top-4 left-4 bg-amber-600/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {beforeLabel}
          </div>
        )}
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <ArrowLeftRight className="w-5 h-5 text-gray-700" />
        </div>
        
        {/* Dashed line above and below handle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[calc(50%-24px)] bg-white/50 border-l-2 border-dashed border-white/80" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-[calc(50%-24px)] bg-white/50 border-l-2 border-dashed border-white/80" />
      </div>

      {/* Percentage indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3">
        <span className="text-amber-400 text-xs font-semibold">{beforeLabel}</span>
        <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full" style={{ width: `${sliderPosition}%` }} />
        </div>
        <span className="text-emerald-400 text-xs font-semibold">{afterLabel}</span>
      </div>
    </div>
  );
}
