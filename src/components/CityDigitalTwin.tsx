import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sun, Moon, CloudRain, TreePine, Car,
  Radio, Cloud, Gauge, Flame,
  Layers, Building2
} from 'lucide-react';

/* ─── TYPES ─── */
type ViewMode = 'basic' | 'shaded' | 'toytown' | 'night';
type WeatherMode = 'clear' | 'rain';

/* ─── CITY DATA ─── */
const BUILDINGS = [
  { x: 0, z: -18, w: 8, d: 6, h: 12 },
  { x: 12, z: -14, w: 6, d: 8, h: 10 },
  { x: 18, z: 0, w: 6, d: 8, h: 15 },
  { x: 12, z: 14, w: 8, d: 6, h: 8 },
  { x: 0, z: 18, w: 8, d: 6, h: 14 },
  { x: -12, z: 14, w: 6, d: 8, h: 9 },
  { x: -18, z: 0, w: 6, d: 8, h: 11 },
  { x: -12, z: -14, w: 8, d: 6, h: 7 },
  { x: -30, z: -30, w: 10, d: 8, h: 20 },
  { x: 30, z: -30, w: 8, d: 10, h: 18 },
  { x: 30, z: 30, w: 10, d: 8, h: 16 },
  { x: -30, z: 30, w: 8, d: 10, h: 14 },
  { x: -25, z: -10, w: 6, d: 6, h: 6 },
  { x: 25, z: 10, w: 6, d: 6, h: 5 },
  { x: 10, z: -30, w: 8, d: 6, h: 8 },
  { x: -10, z: 30, w: 6, d: 8, h: 10 },
];

const TREES = Array.from({ length: 60 }, (_, i) => ({
  x: Math.sin(i * 2.618) * (12 + (i % 20)),
  z: Math.cos(i * 2.618) * (12 + (i % 20)),
  scale: 0.6 + (i % 5) * 0.12,
}));

/* ─── COLORS PER VIEW MODE ─── */
function buildingColor(idx: number, viewMode: ViewMode): string {
  const palette = ['#E8DCC8', '#D4C5B0', '#C9B8A0', '#DDD0BC', '#B8A890', '#D8CBB8', '#CEC0AA', '#E0D4C0', '#B0A080', '#A89878', '#C0B090', '#D0C0A0', '#8B9D83', '#7A8B73', '#A09070', '#908060'];
  if (viewMode === 'basic') return '#888888';
  if (viewMode === 'night') return new THREE.Color(palette[idx % palette.length]).multiplyScalar(0.25).getHexString();
  return palette[idx % palette.length];
}

const groundColor = (vm: ViewMode) => vm === 'night' ? '#1A1A25' : vm === 'toytown' ? '#7CB342' : '#5B8C3E';
const roadColor = (vm: ViewMode) => vm === 'night' ? '#2A2A35' : '#4A4A55';
const treeColor = (vm: ViewMode) => vm === 'night' ? '#2D4A1E' : '#4A7C32';
const trunkColor = (vm: ViewMode) => vm === 'night' ? '#4A3B2A' : '#6B5344';

/* ─── BUILDING MESH ─── */
function CityBuildings({ viewMode }: { viewMode: ViewMode }) {
  const isNight = viewMode === 'night';
  const isBasic = viewMode === 'basic';

  return (
    <group>
      {BUILDINGS.map((b, i) => (
        <group key={i}>
          <mesh position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshLambertMaterial color={buildingColor(i, viewMode)} wireframe={isBasic} />
          </mesh>
          {/* Night windows */}
          {isNight && (
            <group>
              {Array.from({ length: Math.max(0, Math.floor(b.h / 2.5)) }, (_, row) =>
                Array.from({ length: Math.max(0, Math.floor(b.w / 2.5)) }, (_, col) => {
                  if (Math.sin(i * 100 + row * 13 + col * 7) < -0.3) return null;
                  return (
                    <mesh
                      key={`${row}-${col}`}
                      position={[b.x - b.w / 2 + 1.2 + col * 2.2, 1.5 + row * 2.5, b.z + b.d / 2 + 0.06]}
                    >
                      <planeGeometry args={[0.7, 0.7]} />
                      <meshBasicMaterial color="#FFDD88" />
                    </mesh>
                  );
                })
              )}
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

/* ─── GROUND & ROADS ─── */
function GroundPlane({ viewMode }: { viewMode: ViewMode }) {
  const gc = groundColor(viewMode);
  const rc = roadColor(viewMode);
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshLambertMaterial color={gc} />
      </mesh>
      {/* Central park */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshLambertMaterial color={gc} />
      </mesh>
      {/* Roads (simplified) */}
      {[
        { x1: -40, z1: 0, x2: 40, z2: 0, w: 4 },
        { x1: 0, z1: -40, x2: 0, z2: 40, w: 4 },
        { x1: -40, z1: -40, x2: 40, z2: -40, w: 5 },
        { x1: 40, z1: -40, x2: 40, z2: 40, w: 5 },
        { x1: 40, z1: 40, x2: -40, z2: 40, w: 5 },
        { x1: -40, z1: 40, x2: -40, z2: -40, w: 5 },
      ].map((road, i) => {
        const dx = road.x2 - road.x1;
        const dz = road.z2 - road.z1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);
        return (
          <mesh key={i} position={[(road.x1 + road.x2) / 2, 0.01, (road.z1 + road.z2) / 2]} rotation={[-Math.PI / 2, 0, angle]} receiveShadow>
            <planeGeometry args={[road.w, len]} />
            <meshLambertMaterial color={rc} />
          </mesh>
        );
      })}
      {/* Street lamps (night only) */}
      {viewMode === 'night' && Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 20;
        return (
          <group key={`lamp-${i}`} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.05, 0.08, 5, 6]} />
              <meshLambertMaterial color="#444" />
            </mesh>
            <pointLight position={[0, 5, 0]} color="#FFDD88" intensity={0.5} distance={12} />
            <mesh position={[0, 5, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#FFDD88" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ─── TREES ─── */
function TreeCanopy({ viewMode }: { viewMode: ViewMode }) {
  const tc = treeColor(viewMode);
  const trc = trunkColor(viewMode);

  return (
    <group>
      {TREES.map((tree, i) => (
        <group key={i}>
          {/* Trunk */}
          <mesh position={[tree.x, 0.5 * tree.scale, tree.z]}>
            <cylinderGeometry args={[0.15 * tree.scale, 0.2 * tree.scale, 1 * tree.scale, 6]} />
            <meshLambertMaterial color={trc} />
          </mesh>
          {/* Leaves */}
          <mesh position={[tree.x, 1.4 * tree.scale, tree.z]}>
            <coneGeometry args={[0.7 * tree.scale, 1.2 * tree.scale, 6]} />
            <meshLambertMaterial color={tc} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── TRAFFIC ─── */
function TrafficSystem({ enabled }: { enabled: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const vehicleCount = 40;

  const paths = useMemo(() => {
    const pts: THREE.Vector3[][] = [];
    [
      [-30, -30, 30, -30], [30, -30, 30, 30], [30, 30, -30, 30], [-30, 30, -30, -30],
      [-40, 0, 40, 0], [0, -40, 0, 40],
    ].forEach(([x1, z1, x2, z2]) => {
      const line: THREE.Vector3[] = [];
      for (let i = 0; i <= 15; i++) {
        line.push(new THREE.Vector3(x1 + (x2 - x1) * (i / 15), 0.15, z1 + (z2 - z1) * (i / 15)));
      }
      pts.push(line);
      pts.push([...line].reverse());
    });
    return pts;
  }, []);

  const vehicles = useMemo(() =>
    Array.from({ length: vehicleCount }, (_, i) => ({
      pathIdx: i % paths.length,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      offset: (Math.random() - 0.5) * 1.2,
      color: new THREE.Color(0.3 + Math.random() * 0.7, 0.3 + Math.random() * 0.5, 0.4 + Math.random() * 0.6),
    })),
  [paths.length]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current || !enabled) return;
    vehicles.forEach((v, i) => {
      v.progress += v.speed;
      if (v.progress > 1) v.progress -= 1;
      const path = paths[v.pathIdx];
      if (!path) return;
      const idx = Math.min(Math.floor(v.progress * (path.length - 1)), path.length - 2);
      const t = v.progress * (path.length - 1) - idx;
      const p1 = path[idx];
      const p2 = path[idx + 1];
      if (!p1 || !p2) return;
      dummy.position.set(p1.x + (p2.x - p1.x) * t + v.offset, 0.15, p1.z + (p2.z - p1.z) * t);
      dummy.lookAt(p2.x + v.offset, 0.15, p2.z);
      dummy.scale.set(0.3, 0.2, 0.5);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, v.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!enabled) return null;

  const geom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mat = useMemo(() => new THREE.MeshLambertMaterial(), []);

  return (
    <instancedMesh ref={meshRef} args={[geom, mat, vehicleCount]} />
  );
}

/* ─── RAIN ─── */
function RainSystem({ enabled }: { enabled: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;

  const geom = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !enabled) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= 0.6;
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3 + 1] = 25 + Math.random() * 5;
        arr[i * 3] = (Math.random() - 0.5) * 80;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!enabled) return null;

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial color="#88AAFF" size={0.08} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── LIGHTING ─── */
function DynamicLighting({ viewMode, timeOfDay }: { viewMode: ViewMode; timeOfDay: number }) {
  const isNight = viewMode === 'night';
  const sunAngle = timeOfDay * Math.PI;
  const sunX = Math.cos(sunAngle) * 30;
  const sunY = Math.max(Math.sin(sunAngle) * 30 + 5, 2);

  const lightColor = isNight ? '#4466AA' : '#FFFFFF';
  const hemiSky = isNight ? '#0A0A20' : '#87CEEB';
  const hemiGround = isNight ? '#050510' : (viewMode === 'toytown' ? '#8FB85C' : '#6B8E5A');
  const intensity = isNight ? 0.08 : (viewMode === 'toytown' ? 1.1 : 0.9);
  const hemiIntensity = isNight ? 0.1 : 0.5;

  return (
    <>
      <hemisphereLight color={hemiSky} groundColor={hemiGround} intensity={hemiIntensity} />
      <directionalLight
        position={[sunX, sunY, 10]}
        color={lightColor}
        intensity={intensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      {isNight && <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />}
    </>
  );
}

/* ─── SCENE ─── */
function Scene({ viewMode, weatherMode, timeOfDay, trafficEnabled }: {
  viewMode: ViewMode; weatherMode: WeatherMode; timeOfDay: number; trafficEnabled: boolean;
}) {
  const fogColor = viewMode === 'night' ? '#0A0A18' : viewMode === 'toytown' ? '#B0D4E8' : '#C8D8E8';

  return (
    <>
      <fog attach="fog" args={[fogColor, 40, 90]} />
      <PerspectiveCamera makeDefault position={[50, 35, 50]} fov={35} />
      <OrbitControls enablePan enableZoom enableRotate minDistance={15} maxDistance={100} maxPolarAngle={Math.PI / 2.2} target={[0, 0, 0]} />
      <DynamicLighting viewMode={viewMode} timeOfDay={timeOfDay} />
      <GroundPlane viewMode={viewMode} />
      <CityBuildings viewMode={viewMode} />
      <TreeCanopy viewMode={viewMode} />
      <TrafficSystem enabled={trafficEnabled && viewMode !== 'basic'} />
      <RainSystem enabled={weatherMode === 'rain'} />
    </>
  );
}

/* ─── MAIN UI ─── */
export default function CityDigitalTwin() {
  const [viewMode, setViewMode] = useState<ViewMode>('toytown');
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('clear');
  const [timeOfDay, setTimeOfDay] = useState(0.5);
  const [trafficEnabled, setTrafficEnabled] = useState(true);
  const [dataMode, setDataMode] = useState<'live' | 'demo'>('live');

  const totalFlow = 36464;
  const totalQueued = 12083;
  const totalCO2 = 11853;

  const viewConfig: Record<ViewMode, { label: string; color: string }> = {
    basic: { label: 'Basic', color: 'bg-gray-600' },
    shaded: { label: 'Shaded', color: 'bg-blue-600' },
    toytown: { label: 'Toy Town', color: 'bg-emerald-600' },
    night: { label: 'Night', color: 'bg-indigo-600' },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Metrics bar */}
      <div className="flex-shrink-0 bg-gray-900/90 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] text-red-400 font-medium">LIVE</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]"><Car className="w-3 h-3 text-blue-400" /><span className="text-gray-400">FLOW:</span><span className="text-white font-mono">{(totalFlow / 1000).toFixed(1)}K</span></div>
            <div className="flex items-center gap-1 text-[10px]"><Gauge className="w-3 h-3 text-amber-400" /><span className="text-gray-400">QUEUED:</span><span className="text-amber-400 font-mono">{(totalQueued / 1000).toFixed(1)}K</span></div>
            <div className="flex items-center gap-1 text-[10px]"><Cloud className="w-3 h-3 text-gray-400" /><span className="text-gray-400">CO₂:</span><span className="text-white font-mono">{totalCO2} kg/h</span></div>
            <div className="flex items-center gap-1 text-[10px]"><Flame className="w-3 h-3 text-orange-400" /><span className="text-gray-400">FUEL:</span><span className="text-orange-400 font-mono">{(totalCO2 * 0.435).toFixed(0)} L/h</span></div>
          </div>
          <div className="flex gap-1 bg-gray-800 rounded p-0.5">
            <button onClick={() => setDataMode('live')} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${dataMode === 'live' ? 'bg-red-500 text-white' : 'text-gray-400'}`}><Radio className="w-2.5 h-2.5" />LIVE</button>
            <button onClick={() => setDataMode('demo')} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${dataMode === 'demo' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>DEMO</button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas shadows>
          <Scene viewMode={viewMode} weatherMode={weatherMode} timeOfDay={timeOfDay} trafficEnabled={trafficEnabled} />
        </Canvas>

        {/* View mode selector */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 bg-black/60 backdrop-blur-sm rounded-lg p-1.5 border border-gray-700">
          {(Object.keys(viewConfig) as ViewMode[]).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-medium transition-all ${viewMode === mode ? `${viewConfig[mode].color} text-white` : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
              {mode === 'basic' && <Layers className="w-3.5 h-3.5" />}
              {mode === 'shaded' && <Building2 className="w-3.5 h-3.5" />}
              {mode === 'toytown' && <TreePine className="w-3.5 h-3.5" />}
              {mode === 'night' && <Moon className="w-3.5 h-3.5" />}
              {viewConfig[mode].label}
            </button>
          ))}
        </div>

        {/* Weather controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 bg-black/60 backdrop-blur-sm rounded-lg p-1.5 border border-gray-700">
          <button onClick={() => setWeatherMode(w => w === 'clear' ? 'rain' : 'clear')} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-medium ${weatherMode === 'rain' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-400 hover:text-white'}`}>
            {weatherMode === 'rain' ? <CloudRain className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            {weatherMode === 'rain' ? 'Rain' : 'Clear'}
          </button>
          <button onClick={() => setTrafficEnabled(t => !t)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-medium ${trafficEnabled ? 'bg-emerald-500/30 text-emerald-300' : 'text-gray-400 hover:text-white'}`}>
            <Car className="w-3.5 h-3.5" />Traffic {trafficEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Time scrubber */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
          <Sun className="w-4 h-4 text-amber-400" />
          <input type="range" min="0" max="1" step="0.01" value={timeOfDay} onChange={e => setTimeOfDay(Number(e.target.value))} className="w-48 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-amber-500" />
          <Moon className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] text-gray-400 w-12 text-right">{Math.floor(timeOfDay * 24)}:00</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
          <div className="text-[9px] text-gray-500 mb-1 uppercase tracking-wider">Legend</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#E8DCC8] rounded-sm" /><span className="text-[9px] text-gray-400">Office</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#C9B8A0] rounded-sm" /><span className="text-[9px] text-gray-400">Residential</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-600 rounded-full" /><span className="text-[9px] text-gray-400">Tree</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
