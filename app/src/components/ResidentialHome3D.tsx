import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  viewMode?: 'block' | 'standard' | 'realistic' | 'photorealistic';
  explodeAmount?: number;
  selectedLayer?: string | null;
  phase?: number;
  onRoomSelect?: (roomId: string) => void;
  selectedRoom?: string | null;
  timeOfDay?: 'day' | 'sunset' | 'night';
}

/* ─────────── LUXURY VILLA 3D MODEL ───────────
   Two-story mansion with full interior, pool, garage,
   landscaping. Procedurally generated in Three.js.
   ──────────────────────────────────────────── */

export default function ResidentialHome3D({
  viewMode = 'realistic',
  explodeAmount = 0,
  onRoomSelect,
  selectedRoom,
  timeOfDay = 'day',
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const poolWaterRef = useRef<THREE.Mesh>(null);
  const fountainRef = useRef<THREE.Group>(null);

  // Animated pool water shimmer
  useFrame((state) => {
    if (poolWaterRef.current?.material) {
      const mat = poolWaterRef.current.material as THREE.MeshPhysicalMaterial;
      mat.roughness = 0.05 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
    if (fountainRef.current) {
      fountainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  const isBlock = viewMode === 'block';
  const isRealistic = viewMode === 'realistic' || viewMode === 'photorealistic';

  // Colors
  const wallColor = isBlock ? '#94a3b8' : '#F5F0E8';
  const roofColor = isBlock ? '#64748b' : '#3D3530';

  const windowColor = isBlock ? '#60a5fa' : '#87CEEB';
  const doorColor = isBlock ? '#475569' : '#5C4033';
  const garageColor = isBlock ? '#94a3b8' : '#E8E0D4';
  const poolColor = '#00A8E8';
  const grassColor = isBlock ? '#4ade80' : '#4A7C59';
  const treeColor = isBlock ? '#22c55e' : '#2D5A3D';
  const trunkColor = '#5C4033';
  const driveColor = isBlock ? '#9ca3af' : '#B8B0A4';
  const trimColor = '#FFFFFF';
  const balconyColor = '#E8E0D4';

  const explodeY = explodeAmount * 3;

  // Lighting based on time of day
  const sunColor = timeOfDay === 'day' ? '#FFF8E7' : timeOfDay === 'sunset' ? '#FF8C42' : '#4A5568';
  const skyColor = timeOfDay === 'day' ? '#87CEEB' : timeOfDay === 'sunset' ? '#FF6B35' : '#1A202C';
  const ambientIntensity = timeOfDay === 'day' ? 0.6 : timeOfDay === 'sunset' ? 0.4 : 0.15;
  const sunIntensity = timeOfDay === 'day' ? 1.5 : timeOfDay === 'sunset' ? 0.8 : 0.1;

  // Materials
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: wallColor, roughness: isRealistic ? 0.85 : 0.5, metalness: 0,
  }), [wallColor, isRealistic]);

  const roofMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: roofColor, roughness: isRealistic ? 0.9 : 0.5, metalness: 0.05,
  }), [roofColor, isRealistic]);

  const windowMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: windowColor, metalness: 0.1, roughness: 0.05, transmission: isRealistic ? 0.4 : 0,
    transparent: true, opacity: 0.7, envMapIntensity: 1,
  }), [windowColor, isRealistic]);

  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0, roughness: 0, transmission: 0.9, transparent: true, opacity: 0.3,
  }), []);

  const poolMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: poolColor, metalness: 0.1, roughness: 0.05, transmission: 0.3,
    transparent: true, opacity: 0.85,
  }), [poolColor]);

  return (
    <group ref={groupRef}>
      {/* ─── LIGHTING ─── */}
      <ambientLight intensity={ambientIntensity} color={skyColor} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-10, 8, -5]} intensity={0.3} color={skyColor} />
      <pointLight position={[0, 2, 0]} intensity={timeOfDay === 'night' ? 0.8 : 0} color="#FFD700" distance={15} />
      <pointLight position={[8, 2, 8]} intensity={timeOfDay === 'night' ? 0.5 : 0} color="#FFF0D0" distance={10} />

      {/* ─── SKY DOME ─── */}
      {isRealistic && (
        <mesh>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color={skyColor} side={THREE.BackSide} />
        </mesh>
      )}

      {/* ─── GROUND / LAWN ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={grassColor} roughness={1} />
      </mesh>

      {/* Driveway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 18]} receiveShadow>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial color={driveColor} roughness={0.9} />
      </mesh>

      {/* Walkway to entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10]} receiveShadow>
        <planeGeometry args={[2, 6]} />
        <meshStandardMaterial color={driveColor} roughness={0.85} />
      </mesh>

      {/* ═══════════════════════════════════════
         MAIN HOUSE STRUCTURE
         ═══════════════════════════════════════ */}
      <group position={[0, explodeY * 0.5, 0]}>
        {/* ─── FOUNDATION / SLAB ─── */}
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <boxGeometry args={[16, 0.3, 14]} />
          <meshStandardMaterial color="#8B8680" roughness={0.95} />
        </mesh>

        {/* ─── GROUND FLOOR ─── */}
        <group position={[0, 1.5, 0]}>
          {/* Main living block */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[14, 3, 12]} />
            <primitive object={wallMat} attach="material" />
          </mesh>

          {/* Grand entrance projection */}
          <mesh position={[0, -0.5, 6.5]} castShadow receiveShadow>
            <boxGeometry args={[5, 2, 1.5]} />
            <primitive object={wallMat} attach="material" />
          </mesh>

          {/* Portico roof */}
          <mesh position={[0, 0.6, 7]} castShadow>
            <boxGeometry args={[6, 0.2, 3]} />
            <meshStandardMaterial color={roofColor} roughness={0.9} />
          </mesh>

          {/* Portico columns */}
          {[[-2.2, -0.5, 7.2], [2.2, -0.5, 7.2]].map((pos, i) => (
            <mesh key={`col-${i}`} position={pos as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 2.5, 8]} />
              <meshStandardMaterial color={trimColor} roughness={0.3} />
            </mesh>
          ))}

          {/* Front door */}
          <mesh position={[0, -0.3, 7.3]}>
            <boxGeometry args={[1.4, 2.4, 0.1]} />
            <meshStandardMaterial color={doorColor} roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Door handle */}
          <mesh position={[0.5, -0.3, 7.38]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* ─── GROUND FLOOR WINDOWS ─── */}
          {/* Living room large window - front left */}
          <mesh position={[-4, 0, 6.05]}>
            <boxGeometry args={[3, 2, 0.15]} />
            <primitive object={windowMat} attach="material" />
          </mesh>
          {/* Window frame */}
          <mesh position={[-4, 0, 6.06]}>
            <boxGeometry args={[3.15, 2.15, 0.05]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} />
          </mesh>

          {/* Dining room window - front right */}
          <mesh position={[4, 0, 6.05]}>
            <boxGeometry args={[2.5, 2, 0.15]} />
            <primitive object={windowMat} attach="material" />
          </mesh>
          <mesh position={[4, 0, 6.06]}>
            <boxGeometry args={[2.65, 2.15, 0.05]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} />
          </mesh>

          {/* Side windows - left */}
          {[-2, 1.5].map((z, i) => (
            <mesh key={`sw-l-${i}`} position={[-7.05, 0, z]}>
              <boxGeometry args={[0.15, 1.8, 2]} />
              <primitive object={windowMat} attach="material" />
            </mesh>
          ))}

          {/* Side windows - right */}
          {[2, -1.5].map((z, i) => (
            <mesh key={`sw-r-${i}`} position={[7.05, 0, z]}>
              <boxGeometry args={[0.15, 1.8, 2]} />
              <primitive object={windowMat} attach="material" />
            </mesh>
          ))}

          {/* Rear windows */}
          {[-3.5, 0, 3.5].map((x, i) => (
            <mesh key={`rw-${i}`} position={[x, 0, -6.05]}>
              <boxGeometry args={[2, 1.8, 0.15]} />
              <primitive object={windowMat} attach="material" />
            </mesh>
          ))}

          {/* Interior wall dividers (visible through windows) */}
          <mesh position={[0, 0, 2]}>
            <boxGeometry args={[0.1, 2.8, 8]} />
            <meshStandardMaterial color="#EDE8E0" roughness={0.9} />
          </mesh>
          <mesh position={[-3.5, 0, -1]}>
            <boxGeometry args={[7, 2.8, 0.1]} />
            <meshStandardMaterial color="#EDE8E0" roughness={0.9} />
          </mesh>
        </group>

        {/* ─── FIRST FLOOR (offset back for visual interest) ─── */}
        <group position={[0, 4.5 + explodeY * 0.3, -1]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[13, 3, 11]} />
            <primitive object={wallMat} attach="material" />
          </mesh>

          {/* Master bedroom balcony - front */}
          <mesh position={[0, -1, 5.8]} castShadow>
            <boxGeometry args={[6, 0.2, 2]} />
            <meshStandardMaterial color={balconyColor} roughness={0.7} />
          </mesh>
          {/* Balcony railing */}
          {[-2.8, 0, 2.8].map((x, i) => (
            <mesh key={`brl-${i}`} position={[x, -0.3, 6.5]} castShadow>
              <boxGeometry args={[0.05, 0.6, 0.05]} />
              <meshStandardMaterial color={trimColor} roughness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 0.05, 6.5]}>
            <boxGeometry args={[5.6, 0.05, 0.05]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} />
          </mesh>

          {/* First floor windows */}
          <mesh position={[-3, 0, 5.55]}>
            <boxGeometry args={[2.5, 2, 0.15]} />
            <primitive object={windowMat} attach="material" />
          </mesh>
          <mesh position={[3, 0, 5.55]}>
            <boxGeometry args={[2.5, 2, 0.15]} />
            <primitive object={windowMat} attach="material" />
          </mesh>
          {/* Side windows */}
          {[-2, 2].map((x, i) => (
            <mesh key={`ff-sw-${i}`} position={[x, 0, -5.55]}>
              <boxGeometry args={[2, 1.8, 0.15]} />
              <primitive object={windowMat} attach="material" />
            </mesh>
          ))}
        </group>

        {/* ─── ROOF ─── */}
        <group position={[0, 6.3 + explodeY * 0.5, -0.5]}>
          {/* Main roof - hipped style using rotated planes */}
          <mesh position={[0, 0, 0]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[15, 0.3, 8]} />
            <primitive object={roofMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[-0.25, 0, 0]} castShadow>
            <boxGeometry args={[15, 0.3, 8]} />
            <primitive object={roofMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[14, 0.3, 7]} />
            <primitive object={roofMat} attach="material" />
          </mesh>

          {/* Chimney */}
          <mesh position={[4, 0.8, -1]} castShadow>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial color="#8B7355" roughness={0.95} />
          </mesh>
          <mesh position={[4, 1.9, -1]}>
            <boxGeometry args={[0.9, 0.2, 0.9]} />
            <meshStandardMaterial color={roofColor} roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════
         GARAGE (detached, right side)
         ═══════════════════════════════════════ */}
      <group position={[10, 0, 4]}>
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 2.5, 6]} />
          <meshStandardMaterial color={garageColor} roughness={0.8} />
        </mesh>
        {/* Garage door */}
        <mesh position={[0, 0.3, 3.05]}>
          <boxGeometry args={[3.5, 2.2, 0.1]} />
          <meshStandardMaterial color="#C0C0C0" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Garage door panels */}
        {[-0.6, 0, 0.6].map((y, i) => (
          <mesh key={`gp-${i}`} position={[0, 0.3 + y * 0.01, 3.12]}>
            <boxGeometry args={[3.4, 0.03, 0.01]} />
            <meshStandardMaterial color="#A0A0A0" roughness={0.5} />
          </mesh>
        ))}
        {/* Garage roof */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <boxGeometry args={[5.5, 0.2, 6.5]} />
          <primitive object={roofMat} attach="material" />
        </mesh>
        {/* Side window */}
        <mesh position={[2.55, 1, 0]}>
          <boxGeometry args={[0.1, 1, 1.5]} />
          <primitive object={windowMat} attach="material" />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════
         SWIMMING POOL (back left)
         ═══════════════════════════════════════ */}
      <group position={[-8, 0, -6]}>
        {/* Pool deck */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
          <planeGeometry args={[10, 7]} />
          <meshStandardMaterial color="#D4C5A9" roughness={0.85} />
        </mesh>
        {/* Pool basin */}
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[7, 0.8, 4]} />
          <meshStandardMaterial color="#E8E0D0" roughness={0.9} />
        </mesh>
        {/* Pool water */}
        <mesh ref={poolWaterRef} position={[0, -0.05, 0]}>
          <boxGeometry args={[6.6, 0.05, 3.6]} />
          <primitive object={poolMat} attach="material" />
        </mesh>
        {/* Pool ladder */}
        <mesh position={[0, -0.1, 2]}>
          <boxGeometry args={[1.2, 0.6, 0.05]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Pool tiles (edge) */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[7.2, 0.05, 4.2]} />
          <meshStandardMaterial color="#F0E8D8" roughness={0.7} />
        </mesh>

        {/* Fountain / water feature */}
        <group ref={fountainRef} position={[0, 0, -3.5]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.8, 0.8, 12]} />
            <meshStandardMaterial color="#E8E0D4" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.4, 12, 12]} />
            <primitive object={poolMat} attach="material" />
          </mesh>
          {/* Water spout */}
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Lounge chairs */}
        {[-2.5, 2.5].map((x, i) => (
          <group key={`lounge-${i}`} position={[x, 0.2, 1]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.8, 0.15, 2]} />
              <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.2, -0.6]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.8]} />
              <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══════════════════════════════════════
         LANDSCAPING
         ═══════════════════════════════════════ */}

      {/* Trees */}
      {[
        [-12, 0, -10], [-14, 0, -5], [-13, 0, 5], [-11, 0, 12],
        [12, 0, -12], [14, 0, -8], [13, 0, 10], [15, 0, 3],
        [-6, 0, 16], [6, 0, 16], [16, 0, -2], [-15, 0, 0],
        [8, 0, -14], [-9, 0, -15],
      ].map((pos, i) => (
        <group key={`tree-${i}`} position={pos as [number, number, number]}>
          {/* Trunk */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.95} />
          </mesh>
          {/* Foliage - multi-sphere for fullness */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[1.2 + (i % 3) * 0.2, 8, 6]} />
            <meshStandardMaterial color={treeColor} roughness={0.9} />
          </mesh>
          <mesh position={[0.3, 2.8, 0.2]} castShadow>
            <sphereGeometry args={[0.7, 6, 6]} />
            <meshStandardMaterial color={treeColor} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Shrubs near entrance */}
      {[-3, 3].map((x, i) => (
        <group key={`shrub-${i}`} position={[x, 0, 8]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <sphereGeometry args={[0.5, 8, 6]} />
            <meshStandardMaterial color="#3A6B4A" roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.6, 0.1]} castShadow>
            <sphereGeometry args={[0.35, 6, 6]} />
            <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Garden bed - front */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.03, 8]} receiveShadow>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial color="#5A3A1A" roughness={0.95} />
      </mesh>
      {/* Flowers */}
      {[-6, -5.3, -4.6, -4].map((x, i) => (
        <mesh key={`flower-${i}`} position={[x, 0.2, 8]} castShadow>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color={['#FF6B6B', '#FFE66D', '#FF8CC8', '#C44569'][i]} roughness={0.8} />
        </mesh>
      ))}

      {/* Garden bed - right side */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9, 0.03, 0]} receiveShadow>
        <planeGeometry args={[1.5, 8]} />
        <meshStandardMaterial color="#5A3A1A" roughness={0.95} />
      </mesh>

      {/* Hedge row - back fence */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={`hedge-${i}`} position={[-12 + i * 2.5, 0.5, -13]} castShadow>
          <boxGeometry args={[1.5, 1, 0.8]} />
          <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
        </mesh>
      ))}

      {/* Fence posts */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`fence-${i}`} position={[-14, 0.6, -12 + i * 3.5]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 6]} />
          <meshStandardMaterial color="#F5F0E8" roughness={0.5} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════
         OUTDOOR LIGHTING
         ═══════════════════════════════════════ */}
      {[-6, 6].map((x, i) => (
        <group key={`lamp-${i}`} position={[x, 0, 7.5]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.2, 6]} />
            <meshStandardMaterial color="#2C2C2C" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#FFF8E7" emissive="#FFD700" emissiveIntensity={timeOfDay === 'night' ? 2 : 0.2} />
          </mesh>
          <pointLight position={[0, 1.3, 0]} intensity={timeOfDay === 'night' ? 0.6 : 0} color="#FFF0D0" distance={6} />
        </group>
      ))}

      {/* ═══════════════════════════════════════
         CAR IN DRIVEWAY
         ═══════════════════════════════════════ */}
      <group position={[0, 0.5, 18]}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.8, 4.5]} />
          <meshStandardMaterial color="#1A1A2E" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 0.7, -0.2]} castShadow>
          <boxGeometry args={[1.9, 0.6, 2.5]} />
          <meshStandardMaterial color="#1A1A2E" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Windows */}
        <mesh position={[0, 0.7, -0.2]}>
          <boxGeometry args={[1.95, 0.5, 2.3]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
        {/* Wheels */}
        {[[-1.1, -0.3, 1.3], [1.1, -0.3, 1.3], [-1.1, -0.3, -1.3], [1.1, -0.3, -1.3]].map((pos, i) => (
          <mesh key={`wheel-${i}`} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.15, 12]} />
            <meshStandardMaterial color="#2C2C2C" roughness={0.6} />
          </mesh>
        ))}
        {/* Headlights */}
        {[-0.7, 0.7].map((x, i) => (
          <mesh key={`hl-${i}`} position={[x, 0, 2.26]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshStandardMaterial color="#FFF8E7" emissive="#FFD700" emissiveIntensity={timeOfDay === 'night' ? 3 : 0} />
          </mesh>
        ))}
      </group>

      {/* ═══════════════════════════════════════
         CLICKABLE ROOM ZONES (transparent overlays)
         ═══════════════════════════════════════ */}
      {[
        { id: 'living', pos: [-3.5, 1.5, 4] as [number, number, number], size: [5, 2.8, 3.5] as [number, number, number] },
        { id: 'kitchen', pos: [3.5, 1.5, 4] as [number, number, number], size: [5, 2.8, 3.5] as [number, number, number] },
        { id: 'master-bed', pos: [0, 4.5, 1] as [number, number, number], size: [6, 2.8, 4] as [number, number, number] },
        { id: 'bedroom2', pos: [-4, 4.5, -2] as [number, number, number], size: [4, 2.8, 3.5] as [number, number, number] },
        { id: 'bedroom3', pos: [4, 4.5, -2] as [number, number, number], size: [4, 2.8, 3.5] as [number, number, number] },
      ].map((room) => (
        <mesh
          key={room.id}
          position={room.pos}
          onClick={(e) => {
            e.stopPropagation();
            onRoomSelect?.(room.id);
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={room.size} />
          <meshStandardMaterial
            color="#4A90D9"
            transparent
            opacity={selectedRoom === room.id ? 0.25 : 0.01}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Room labels (floating text above rooms) */}
      {selectedRoom && [
        { id: 'living', label: 'Living Room', pos: [-3.5, 3.2, 4] as [number, number, number] },
        { id: 'kitchen', label: 'Kitchen', pos: [3.5, 3.2, 4] as [number, number, number] },
        { id: 'master-bed', label: 'Master Suite', pos: [0, 6.2, 1] as [number, number, number] },
        { id: 'bedroom2', label: 'Bedroom 2', pos: [-4, 6.2, -2] as [number, number, number] },
        { id: 'bedroom3', label: 'Bedroom 3', pos: [4, 6.2, -2] as [number, number, number] },
      ].filter(r => r.id === selectedRoom).map((room) => (
        <group key={`label-${room.id}`} position={room.pos}>
          <mesh>
            <planeGeometry args={[3, 0.5]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
