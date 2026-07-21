import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls, PerspectiveCamera, Environment, ContactShadows,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import {
  Eye, Scissors, Layers, Camera, Sun, Moon,
  RotateCcw, FileText, Share2, Download, X,
  Clock, Construction, Monitor, BoxSelect, Aperture,
  Plus, Minus, Undo2, Redo2, History, PanelRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import Building3DRealistic from './Building3DRealistic';
import Building3DLightweight from './Building3DLightweight';
import ConstructionSite3D from './ConstructionSite3D';
import ManufacturingLine3D from './ManufacturingLine3D';
import IndustrialFacility3D from './IndustrialFacility3D';
import OilRig3D from './OilRig3D';

// ─── Types ───
type ViewMode = 'block' | 'standard' | 'realistic' | 'photorealistic';
type ToolMode = 'orbit' | 'walkthrough' | 'cut-section' | 'measure' | 'annotate';
type LayerType = 'structure' | 'architecture' | 'mep' | 'finishes' | 'furniture';

interface BOMItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  supplier: string;
  leadTime: string;
  status: 'ordered' | 'in-stock' | 'pending';
  linkedTo: string; // 3D element ID
}

interface EditRecord {
  id: string;
  user: string;
  avatar: string;
  action: string;
  element: string;
  timestamp: string;
  before: string;
  after: string;
}

interface Screenshot {
  id: string;
  url: string;
  label: string;
  timestamp: string;
  view: string;
}

// ─── Mock BOM Data ───
const mockBOM: BOMItem[] = [
  { id: 'b1', name: 'Structural Concrete C30', category: 'Structure', quantity: 2400, unit: 'm³', costPerUnit: 185, totalCost: 444000, supplier: 'Lafarge UAE', leadTime: '3-5 days', status: 'ordered', linkedTo: 'floor-slab' },
  { id: 'b2', name: 'Reinforcement Steel T16', category: 'Structure', quantity: 180, unit: 'ton', costPerUnit: 650, totalCost: 117000, supplier: 'Emirates Steel', leadTime: '2 weeks', status: 'in-stock', linkedTo: 'columns' },
  { id: 'b3', name: 'Curtain Wall System', category: 'Facade', quantity: 2800, unit: 'm²', costPerUnit: 420, totalCost: 1176000, supplier: 'Schuco ME', leadTime: '8 weeks', status: 'ordered', linkedTo: 'facade' },
  { id: 'b4', name: 'Porcelain Floor Tile', category: 'Finishes', quantity: 3600, unit: 'm²', costPerUnit: 45, totalCost: 162000, supplier: 'RAK Ceramics', leadTime: '1 week', status: 'in-stock', linkedTo: 'flooring' },
  { id: 'b5', name: 'MEP Ductwork', category: 'MEP', quantity: 850, unit: 'm', costPerUnit: 120, totalCost: 102000, supplier: 'Trosten', leadTime: '3 weeks', status: 'pending', linkedTo: 'mep' },
  { id: 'b6', name: 'LED Lighting System', category: 'MEP', quantity: 240, unit: 'unit', costPerUnit: 85, totalCost: 20400, supplier: 'Philips ME', leadTime: '1 week', status: 'in-stock', linkedTo: 'mep' },
  { id: 'b7', name: 'Elevator System', category: 'Vertical Transport', quantity: 3, unit: 'unit', costPerUnit: 120000, totalCost: 360000, supplier: 'KONE', leadTime: '12 weeks', status: 'ordered', linkedTo: 'elevator' },
  { id: 'b8', name: 'Fire Suppression', category: 'Safety', quantity: 1, unit: 'system', costPerUnit: 180000, totalCost: 180000, supplier: 'Ansul ME', leadTime: '6 weeks', status: 'pending', linkedTo: 'fire' },
];

// ─── Mock Edit History ───
const mockEdits: EditRecord[] = [
  { id: 'e1', user: 'Alex Morgan', avatar: 'AM', action: 'Modified', element: 'Unit 8C Kitchen Layout', timestamp: '2 min ago', before: 'Standard L-shape', after: 'Island + Pantry' },
  { id: 'e2', user: 'Sarah Chen', avatar: 'SC', action: 'Approved', element: 'Facade Material Change', timestamp: '15 min ago', before: 'Porcelain Cladding', after: 'Natural Stone' },
  { id: 'e3', user: 'Marcus Johnson', avatar: 'MJ', action: 'Added', element: 'Balcony Railing Detail', timestamp: '1 hr ago', before: '-', after: 'Glass + SS Handrail' },
  { id: 'e4', user: 'Alex Morgan', avatar: 'AM', action: 'Changed', element: 'Floor 10 Unit Mix', timestamp: '3 hr ago', before: '2x 2BR + 2x 1BR', after: '3x 2BR + 1x Studio' },
  { id: 'e5', user: 'Khalid Al-Mansouri', avatar: 'KA', action: 'Reviewed', element: 'MEP Routing Floor 5-8', timestamp: '5 hr ago', before: 'Pending Review', after: 'Approved with Notes' },
];

// ─── Lighting Controller ───
function LightingController({ sunAngle, intensity }: { sunAngle: number; intensity: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  const sunX = Math.cos(sunAngle) * 30;
  const sunY = Math.sin(sunAngle) * 30;

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.set(sunX, sunY, 15);
      lightRef.current.intensity = intensity;
      // Color temperature changes with angle
      const t = Math.max(0, Math.min(1, sunY / 30));
      const color = new THREE.Color();
      color.setHSL(0.1 + t * 0.05, 0.3 + t * 0.2, 0.5 + t * 0.4);
      lightRef.current.color.copy(color);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.2 + intensity * 0.3;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight
        ref={lightRef}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight args={['#87CEEB', '#2d4a22', 0.3]} />
    </>
  );
}

// ─── Cut Section Planes ───
function CutSectionPlanes({ enabled, xCut, yCut, zCut }: { enabled: boolean; xCut: number; yCut: number; zCut: number }) {
  const { gl } = useThree();

  useEffect(() => {
    if (enabled) {
      gl.localClippingEnabled = true;
    } else {
      gl.localClippingEnabled = false;
    }
    return () => { gl.localClippingEnabled = false; };
  }, [enabled, gl]);

  if (!enabled) return null;

  return (
    <>
      <planeHelper args={[new THREE.Plane(new THREE.Vector3(1, 0, 0), -xCut), 20, '#ef4444']} />
      <planeHelper args={[new THREE.Plane(new THREE.Vector3(0, 1, 0), -yCut), 20, '#22c55e']} />
      <planeHelper args={[new THREE.Plane(new THREE.Vector3(0, 0, 1), -zCut), 20, '#3b82f6']} />
    </>
  );
}

// ─── Screenshot Capturer (logic embedded in main component) ───

// ─── First Person Controls ───
function FirstPersonController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const speed = 8;
    const damping = 0.9;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    if (keys.current['w']) velocity.current.addScaledVector(forward, speed * delta);
    if (keys.current['s']) velocity.current.addScaledVector(forward, -speed * delta);
    if (keys.current['a']) velocity.current.addScaledVector(right, -speed * delta);
    if (keys.current['d']) velocity.current.addScaledVector(right, speed * delta);

    velocity.current.multiplyScalar(damping);
    camera.position.add(velocity.current);
    camera.position.y = Math.max(1.6, camera.position.y); // Eye height
  });

  return null;
}

// ─── Main Enhanced Viewer ───
interface Enhanced3DViewerProps {
  projectType: string;
  units: any[];
  selectedUnit: string | null;
  onSelectUnit: (id: string) => void;
}

export default function Enhanced3DViewer({ projectType, units, selectedUnit, onSelectUnit }: Enhanced3DViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('realistic');
  const [toolMode, setToolMode] = useState<ToolMode>('orbit');
  const [showBOM, setShowBOM] = useState(false);
  const [showEdits, setShowEdits] = useState(false);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [showLighting, setShowLighting] = useState(false);
  const [showCutSection, setShowCutSection] = useState(false);
  const [showPhasing, setShowPhasing] = useState(false);
  const [showExplode, setShowExplode] = useState(false);
  const [showWalkthroughHelp, setShowWalkthroughHelp] = useState(false);
  const [sunAngle, setSunAngle] = useState(0.6);
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [xCut, setXCut] = useState(0);
  const [yCut, setYCut] = useState(20);
  const [zCut, setZCut] = useState(0);
  const [phase, setPhase] = useState(1);
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<LayerType | 'all'>('all');
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [activeBOMItem, setActiveBOMItem] = useState<string | null>(null);
  const canvasRef = useRef<any>(null);

  // Take screenshot
  const takeScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const newShot: Screenshot = {
      id: `ss-${Date.now()}`,
      url,
      label: `${viewMode} - ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      view: viewMode,
    };
    setScreenshots(prev => [newShot, ...prev].slice(0, 20));
  }, [viewMode]);

  // Get camera position based on project type
  const getCameraConfig = () => {
    switch (projectType) {
      case 'construction': return { pos: [25, 18, 25] as [number, number, number], fov: 50 };
      case 'manufacturing': return { pos: [15, 10, 15] as [number, number, number], fov: 55 };
      case 'industrial': return { pos: [30, 20, 30] as [number, number, number], fov: 50 };
      case 'oil-gas': return { pos: [20, 15, 20] as [number, number, number], fov: 50 };
      default: return { pos: [18, 14, 18] as [number, number, number], fov: 45 };
    }
  };

  const cam = getCameraConfig();

  const layers: { key: LayerType; label: string; color: string }[] = [
    { key: 'structure', label: 'Structure', color: '#94a3b8' },
    { key: 'architecture', label: 'Architecture', color: '#60a5fa' },
    { key: 'mep', label: 'MEP', color: '#f59e0b' },
    { key: 'finishes', label: 'Finishes', color: '#a78bfa' },
    { key: 'furniture', label: 'Furniture', color: '#34d399' },
  ];

  const totalBOMCost = mockBOM.reduce((a, b) => a + b.totalCost, 0);

  return (
    <div className="h-full flex flex-col relative">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-10">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-800 rounded-lg p-0.5 mr-2">
          {[
            { key: 'block' as ViewMode, label: 'Block', icon: <BoxSelect className="w-3.5 h-3.5" /> },
            { key: 'standard' as ViewMode, label: 'Standard', icon: <Monitor className="w-3.5 h-3.5" /> },
            { key: 'realistic' as ViewMode, label: 'Realistic', icon: <Aperture className="w-3.5 h-3.5" /> },
            { key: 'photorealistic' as ViewMode, label: 'Photo', icon: <Camera className="w-3.5 h-3.5" /> },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === m.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              {m.icon}
              <span className="hidden md:inline">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Tools */}
        {[
          { key: 'orbit' as ToolMode, icon: <RotateCcw className="w-3.5 h-3.5" />, label: 'Orbit' },
          { key: 'walkthrough' as ToolMode, icon: <Eye className="w-3.5 h-3.5" />, label: 'Walk' },
          { key: 'cut-section' as ToolMode, icon: <Scissors className="w-3.5 h-3.5" />, label: 'Cut' },
          { key: 'measure' as ToolMode, icon: <Plus className="w-3.5 h-3.5" />, label: 'Measure' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => {
              setToolMode(t.key);
              if (t.key === 'walkthrough') setShowWalkthroughHelp(true);
              if (t.key === 'cut-section') setShowCutSection(!showCutSection);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all mr-0.5 ${
              toolMode === t.key ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {t.icon}
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}

        <div className="flex-1" />

        {/* Right-side tools */}
        <button onClick={() => setShowPhasing(!showPhasing)} className={`p-1.5 rounded-md text-xs mr-0.5 ${showPhasing ? 'bg-amber-600/20 text-amber-400' : 'text-gray-400 hover:bg-gray-800'}`}>
          <Construction className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setShowExplode(!showExplode)} className={`p-1.5 rounded-md text-xs mr-0.5 ${showExplode ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}>
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setShowLighting(!showLighting)} className={`p-1.5 rounded-md text-xs mr-0.5 ${showLighting ? 'bg-yellow-600/20 text-yellow-400' : 'text-gray-400 hover:bg-gray-800'}`}>
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setShowBOM(!showBOM)} className={`p-1.5 rounded-md text-xs mr-0.5 ${showBOM ? 'bg-green-600/20 text-green-400' : 'text-gray-400 hover:bg-gray-800'}`}>
          <FileText className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setShowEdits(!showEdits)} className={`p-1.5 rounded-md text-xs mr-0.5 ${showEdits ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}>
          <History className="w-3.5 h-3.5" />
        </button>
        <button onClick={takeScreenshot} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 mr-0.5">
          <Camera className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setShowScreenshots(!showScreenshots)} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 relative">
          <PanelRight className="w-3.5 h-3.5" />
          {screenshots.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[9px] text-white flex items-center justify-center">{screenshots.length}</span>
          )}
        </button>
      </div>

      {/* ─── Main Canvas Area ─── */}
      <div className="flex-1 relative">
        <Canvas shadows gl={{ localClippingEnabled: showCutSection }} ref={canvasRef}>
          <PerspectiveCamera makeDefault position={cam.pos} fov={cam.fov} />

          {toolMode === 'orbit' && (
            <OrbitControls
              enablePan enableZoom enableRotate
              autoRotate={!showCutSection && !showExplode}
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={60}
            />
          )}

          {toolMode === 'walkthrough' && <FirstPersonController enabled={true} />}

          <LightingController sunAngle={sunAngle} intensity={lightIntensity} />

          {viewMode === 'photorealistic' && <Environment preset="sunset" />}
          {viewMode !== 'block' && <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={50} blur={2} />}

          <CutSectionPlanes enabled={showCutSection && toolMode === 'cut-section'} xCut={xCut} yCut={yCut} zCut={zCut} />

          {/* Grid for block view */}
          {viewMode === 'block' && (
            <Grid
              position={[0, -0.01, 0]}
              args={[100, 100]}
              cellSize={1}
              cellThickness={0.3}
              cellColor="#1e293b"
              sectionSize={5}
              sectionThickness={0.8}
              sectionColor="#334155"
              fadeDistance={60}
              infiniteGrid
            />
          )}

          {/* Render the appropriate 3D model */}
          <group position={[0, showExplode ? explodeAmount * 2 : 0, 0]}>
            {projectType === 'real-estate' && viewMode === 'block' && (
              <Building3DLightweight units={units} selectedUnit={selectedUnit} onSelectUnit={onSelectUnit} />
            )}
            {projectType === 'real-estate' && viewMode !== 'block' && (
              <Building3DRealistic
                units={units}
                selectedUnit={selectedUnit}
                onSelectUnit={onSelectUnit}
                viewMode={viewMode}
                explodeAmount={explodeAmount}
                selectedLayer={selectedLayer}
                phase={showPhasing ? phase : 1}
              />
            )}
            {projectType === 'construction' && <ConstructionSite3D />}
            {projectType === 'manufacturing' && <ManufacturingLine3D />}
            {projectType === 'industrial' && <IndustrialFacility3D />}
            {projectType === 'oil-gas' && <OilRig3D />}
          </group>

          {/* Screenshot capture handled by toolbar button */}
        </Canvas>

        {/* View mode indicator */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-gray-900/80 text-gray-300 border-gray-700 backdrop-blur">
            {viewMode.toUpperCase()} VIEW
            {toolMode === 'walkthrough' && ' | WALKTHROUGH'}
            {toolMode === 'cut-section' && ' | CUT SECTION'}
          </Badge>
        </div>

        {/* Walkthrough help */}
        <AnimatePresence>
          {showWalkthroughHelp && toolMode === 'walkthrough' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel rounded-xl p-4 max-w-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">Walkthrough Mode</h3>
                <button onClick={() => setShowWalkthroughHelp(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">W</kbd> Forward</div>
                <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">S</kbd> Backward</div>
                <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">A</kbd> Left</div>
                <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">D</kbd> Right</div>
                <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">Mouse</kbd> Look</div>
                <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">ESC</kbd> Exit</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Cut Section Panel ─── */}
        <AnimatePresence>
          {showCutSection && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="absolute top-12 left-2 w-64 glass-panel rounded-xl p-4"
            >
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-red-400" />
                Cut Sections
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-red-400 mb-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> X-Axis Cut
                  </label>
                  <Slider value={[xCut]} onValueChange={([v]) => setXCut(v)} min={-20} max={20} step={0.5} />
                </div>
                <div>
                  <label className="text-xs text-green-400 mb-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Y-Axis Cut
                  </label>
                  <Slider value={[yCut]} onValueChange={([v]) => setYCut(v)} min={0} max={40} step={0.5} />
                </div>
                <div>
                  <label className="text-xs text-blue-400 mb-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Z-Axis Cut
                  </label>
                  <Slider value={[zCut]} onValueChange={([v]) => setZCut(v)} min={-20} max={20} step={0.5} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Lighting Panel ─── */}
        <AnimatePresence>
          {showLighting && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="absolute top-12 left-2 w-64 glass-panel rounded-xl p-4"
            >
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-400" />
                Lighting Controls
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1">Time of Day</label>
                  <Slider value={[sunAngle]} onValueChange={([v]) => setSunAngle(v)} min={0} max={Math.PI} step={0.05} />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Dawn</span>
                    <span>Noon</span>
                    <span>Dusk</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1">Intensity</label>
                  <Slider value={[lightIntensity]} onValueChange={([v]) => setLightIntensity(v)} min={0.2} max={2} step={0.1} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Moon className="w-3 h-3" />
                  <span>Night mode available in Photorealistic view</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Phasing Panel ─── */}
        <AnimatePresence>
          {showPhasing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 glass-panel rounded-xl p-4"
            >
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Construction className="w-4 h-4 text-amber-400" />
                Construction Phasing
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPhase(Math.max(0, phase - 0.05))}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <Slider value={[phase]} onValueChange={([v]) => setPhase(v)} min={0} max={1} step={0.01} />
                  </div>
                  <button
                    onClick={() => setPhase(Math.min(1, phase + 0.05))}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Foundation</span>
                  <span className="text-amber-400 font-semibold">{Math.round(phase * 100)}% Complete</span>
                  <span className="text-gray-400">Handover</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all" style={{ width: `${phase * 100}%` }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Explode Panel ─── */}
        <AnimatePresence>
          {showExplode && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="absolute top-12 left-2 w-64 glass-panel rounded-xl p-4"
            >
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Layer Explode
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1">Explode Amount</label>
                  <Slider value={[explodeAmount]} onValueChange={([v]) => setExplodeAmount(v)} min={0} max={5} step={0.1} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Filter Layers</label>
                  {[{ key: 'all' as const, label: 'All Layers', color: '#94a3b8' }, ...layers].map(layer => (
                    <button
                      key={layer.key}
                      onClick={() => setSelectedLayer(layer.key)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                        selectedLayer === layer.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── BOM Panel ─── */}
        <AnimatePresence>
          {showBOM && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-0 right-0 bottom-0 w-80 glass-panel border-l border-gray-700 overflow-y-auto scrollbar-thin z-20"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  Bill of Materials
                </h3>
                <button onClick={() => setShowBOM(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <div className="glass-panel rounded-lg p-3 mb-3 bg-gradient-to-r from-green-950/50 to-emerald-950/50 border-green-500/20">
                  <div className="text-xs text-gray-400">Total Project Cost</div>
                  <div className="text-xl font-bold text-white">${(totalBOMCost / 1000000).toFixed(2)}M</div>
                  <div className="text-xs text-green-400">{mockBOM.length} line items</div>
                </div>
                <div className="space-y-2">
                  {mockBOM.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setActiveBOMItem(activeBOMItem === item.id ? null : item.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        activeBOMItem === item.id
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium">{item.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.status === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'ordered' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>{item.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{item.category} | {item.supplier}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{item.quantity} {item.unit}</span>
                        <span className="text-white font-semibold">${(item.totalCost / 1000).toFixed(0)}K</span>
                      </div>
                      {activeBOMItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 pt-2 border-t border-gray-700 space-y-1 text-xs text-gray-400"
                        >
                          <div className="flex justify-between"><span>Cost/Unit:</span><span className="text-gray-300">${item.costPerUnit}/{item.unit}</span></div>
                          <div className="flex justify-between"><span>Lead Time:</span><span className="text-gray-300">{item.leadTime}</span></div>
                          <div className="flex justify-between"><span>Linked to:</span><span className="text-blue-400">{item.linkedTo}</span></div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Edit History Panel ─── */}
        <AnimatePresence>
          {showEdits && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-0 right-0 bottom-0 w-80 glass-panel border-l border-gray-700 overflow-y-auto scrollbar-thin z-20"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  Edit History
                </h3>
                <button onClick={() => setShowEdits(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {mockEdits.map(edit => (
                  <div key={edit.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0 self-start">
                      {edit.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm text-white font-medium">{edit.user}</span>
                        <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px] px-1">{edit.action}</Badge>
                      </div>
                      <div className="text-sm text-gray-300 mb-1">{edit.element}</div>
                      <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg p-2 mb-1">
                        <div className="flex items-center gap-1 text-red-400 mb-0.5">
                          <Undo2 className="w-3 h-3" /> {edit.before}
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <Redo2 className="w-3 h-3" /> {edit.after}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {edit.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Screenshots Panel ─── */}
        <AnimatePresence>
          {showScreenshots && (
            <motion.div
              initial={{ opacity: 0, y: 300 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 300 }}
              className="absolute bottom-0 left-0 right-0 h-40 glass-panel border-t border-gray-700 overflow-x-auto scrollbar-thin z-20"
            >
              <div className="p-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white font-medium">Screenshots ({screenshots.length})</span>
                <button onClick={() => setShowScreenshots(false)} className="ml-auto text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 px-3 pb-3">
                {screenshots.length === 0 && (
                  <div className="text-gray-500 text-sm">Take screenshots with the camera button to see them here</div>
                )}
                {screenshots.map(shot => (
                  <div key={shot.id} className="relative flex-shrink-0 group">
                    <img src={shot.url} alt={shot.label} className="h-24 w-40 object-cover rounded-lg border border-gray-700" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button className="p-1.5 bg-gray-800 rounded-lg text-gray-300 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-gray-800 rounded-lg text-gray-300 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{shot.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
