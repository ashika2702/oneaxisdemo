import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// ─── Realistic Building Generator ───
interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  status: 'available' | 'sold' | 'reserved' | 'coming-soon';
  view: string;
  facing: string;
}

type LayerType = 'structure' | 'architecture' | 'mep' | 'finishes' | 'furniture';

interface BuildingProps {
  units: Unit[];
  selectedUnit: string | null;
  onSelectUnit: (id: string) => void;
  viewMode?: 'standard' | 'realistic' | 'photorealistic';
  explodeAmount?: number;
  selectedLayer?: LayerType | 'all';
  phase?: number;
}

// Material definitions
const materials = {
  glass: new THREE.MeshPhysicalMaterial({
    color: '#87CEEB',
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.6,
    transparent: true,
    opacity: 0.7,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: '#C8C8C8',
    roughness: 0.9,
    metalness: 0.0,
  }),
  concreteDark: new THREE.MeshStandardMaterial({
    color: '#A0A0A0',
    roughness: 0.85,
    metalness: 0.05,
  }),
  steel: new THREE.MeshStandardMaterial({
    color: '#708090',
    roughness: 0.3,
    metalness: 0.8,
  }),
  facadeBeige: new THREE.MeshStandardMaterial({
    color: '#E8DCC4',
    roughness: 0.8,
    metalness: 0.0,
  }),
  facadeWhite: new THREE.MeshStandardMaterial({
    color: '#F5F5F0',
    roughness: 0.7,
    metalness: 0.0,
  }),
  balconyGlass: new THREE.MeshPhysicalMaterial({
    color: '#A8D8EA',
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.8,
    transparent: true,
    opacity: 0.4,
  }),
  balconyRailing: new THREE.MeshStandardMaterial({
    color: '#505050',
    roughness: 0.4,
    metalness: 0.7,
  }),
  ground: new THREE.MeshStandardMaterial({
    color: '#2d4a22',
    roughness: 1,
    metalness: 0,
  }),
  road: new THREE.MeshStandardMaterial({
    color: '#3a3a3a',
    roughness: 0.95,
    metalness: 0,
  }),
  lobbyGlass: new THREE.MeshPhysicalMaterial({
    color: '#d4e8f7',
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.9,
    transparent: true,
    opacity: 0.3,
  }),
  lightGlow: new THREE.MeshBasicMaterial({
    color: '#ffeebb',
    transparent: true,
    opacity: 0.8,
  }),
  roof: new THREE.MeshStandardMaterial({
    color: '#6b7b8d',
    roughness: 0.7,
    metalness: 0.3,
  }),
};

function getStatusColor(status: string): THREE.Color {
  switch (status) {
    case 'available': return new THREE.Color('#10b981');
    case 'sold': return new THREE.Color('#6b7280');
    case 'reserved': return new THREE.Color('#3b82f6');
    case 'coming-soon': return new THREE.Color('#f59e0b');
    default: return new THREE.Color('#6b7280');
  }
}

function Window({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <primitive object={materials.glass} attach="material" />
    </mesh>
  );
}

function Balcony({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[width, 0.05, 0.3]} />
        <primitive object={materials.concreteDark} attach="material" />
      </mesh>
      {/* Glass railing */}
      <mesh position={[0, 0.4, 0.28]}>
        <boxGeometry args={[width, 0.7, 0.02]} />
        <primitive object={materials.balconyGlass} attach="material" />
      </mesh>
      {/* Top rail */}
      <mesh position={[0, 0.76, 0.28]} castShadow>
        <boxGeometry args={[width, 0.04, 0.04]} />
        <primitive object={materials.balconyRailing} attach="material" />
      </mesh>
    </group>
  );
}

function FloorLevel({
  floor,
  floorUnits,
  selectedUnit,
  onSelectUnit,
  yPos,
  viewMode = 'realistic',
}: {
  floor: number;
  floorUnits: Unit[];
  selectedUnit: string | null;
  onSelectUnit: (id: string) => void;
  yPos: number;
  viewMode?: 'standard' | 'realistic' | 'photorealistic';
}) {
  const isLobby = floor === 1;
  const floorHeight = isLobby ? 4 : 3.2;
  const slabThickness = 0.2;
  const isPhoto = viewMode === 'photorealistic';
  void isPhoto; // Used for future material enhancement

  return (
    <group position={[0, yPos, 0]}>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, slabThickness, 10]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>

      {/* Lobby - glass front */}
      {isLobby && (
        <group>
          {/* Glass walls */}
          <mesh position={[0, floorHeight / 2, 5]}>
            <boxGeometry args={[14, floorHeight, 0.1]} />
            <primitive object={materials.lobbyGlass} attach="material" />
          </mesh>
          {/* Columns */}
          {[-6, -3, 0, 3, 6].map((x, i) => (
            <mesh key={i} position={[x, floorHeight / 2, 4.9]} castShadow>
              <boxGeometry args={[0.3, floorHeight, 0.3]} />
              <primitive object={materials.steel} attach="material" />
            </mesh>
          ))}
          {/* Entrance */}
          <mesh position={[0, 1.5, 5.1]}>
            <boxGeometry args={[3, 3, 0.05]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Entrance light */}
          <mesh position={[0, 3.2, 5.2]}>
            <boxGeometry args={[2, 0.1, 0.3]} />
            <primitive object={materials.lightGlow} attach="material" />
          </mesh>
          {/* Floor text */}
          <Text
            position={[-4, 1, 5.1]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            LOBBY
          </Text>
        </group>
      )}

      {/* Residential floors */}
      {!isLobby && (
        <>
          {/* Back wall */}
          <mesh position={[0, floorHeight / 2, -5]} castShadow>
            <boxGeometry args={[14, floorHeight, 0.2]} />
            <primitive object={materials.facadeBeige} attach="material" />
          </mesh>

          {/* Side walls */}
          <mesh position={[-7, floorHeight / 2, 0]} castShadow>
            <boxGeometry args={[0.2, floorHeight, 10]} />
            <primitive object={materials.facadeBeige} attach="material" />
          </mesh>
          <mesh position={[7, floorHeight / 2, 0]} castShadow>
            <boxGeometry args={[0.2, floorHeight, 10]} />
            <primitive object={materials.facadeBeige} attach="material" />
          </mesh>

          {/* Units on this floor */}
          {floorUnits.map((unit, idx) => {
            const isSelected = selectedUnit === unit.id;
            const xPos = (idx - 1.5) * 3;
            const statusColor = getStatusColor(unit.status);

            return (
              <group key={unit.id} position={[xPos, 0, 0]}>
                {/* Wall between units */}
                {idx > 0 && (
                  <mesh position={[-1.5, floorHeight / 2, 0]} castShadow>
                    <boxGeometry args={[0.15, floorHeight, 9]} />
                    <primitive object={materials.facadeWhite} attach="material" />
                  </mesh>
                )}

                {/* Front facade section */}
                <mesh
                  position={[0, floorHeight / 2, 5]}
                  onClick={(e) => { e.stopPropagation(); onSelectUnit(unit.id); }}
                  onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                  onPointerOut={() => { document.body.style.cursor = 'default'; }}
                >
                  <boxGeometry args={[2.8, floorHeight, 0.15]} />
                  <meshStandardMaterial
                    color={isSelected ? '#3b82f6' : statusColor}
                    roughness={0.6}
                    metalness={0.1}
                    emissive={isSelected ? '#1d4ed8' : '#000000'}
                    emissiveIntensity={isSelected ? 0.3 : 0}
                    transparent={!isSelected}
                    opacity={isSelected ? 1 : 0.85}
                  />
                </mesh>

                {/* Windows */}
                <Window position={[-0.7, floorHeight * 0.55, 5.05]} size={[0.8, 0.8]} />
                <Window position={[0.7, floorHeight * 0.55, 5.05]} size={[0.8, 0.8]} />
                <Window position={[-0.7, floorHeight * 0.25, 5.05]} size={[0.8, 0.5]} />
                <Window position={[0.7, floorHeight * 0.25, 5.05]} size={[0.8, 0.5]} />

                {/* Balcony */}
                <Balcony position={[0, 0.1, 5]} width={2.6} />

                {/* Unit label */}
                <Text
                  position={[0, floorHeight * 0.85, 5.1]}
                  fontSize={0.25}
                  color={isSelected ? '#ffffff' : '#333333'}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  {unit.unitNumber}
                </Text>

                {/* Floor indicator on first unit */}
                {idx === 0 && (
                  <Text
                    position={[-5, floorHeight / 2, 5.1]}
                    fontSize={0.35}
                    color="#888888"
                    anchorX="center"
                    anchorY="middle"
                  >
                    L{floor}
                  </Text>
                )}
              </group>
            );
          })}
        </>
      )}
    </group>
  );
}

function GroundPlane() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <primitive object={materials.ground} attach="material" />
      </mesh>
      {/* Road in front */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 12]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <primitive object={materials.road} attach="material" />
      </mesh>
      {/* Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 7.5]} receiveShadow>
        <planeGeometry args={[16, 1.5]} />
        <meshStandardMaterial color="#b8b8b8" roughness={0.9} />
      </mesh>
    </group>
  );
}

function RoofLevel({ yPos }: { yPos: number }) {
  return (
    <group position={[0, yPos, 0]}>
      {/* Main roof slab */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[14.5, 0.3, 10.5]} />
        <primitive object={materials.roof} attach="material" />
      </mesh>
      {/* Mechanical penthouse */}
      <mesh position={[3, 1, -2]} castShadow>
        <boxGeometry args={[4, 2, 3]} />
        <primitive object={materials.concreteDark} attach="material" />
      </mesh>
      {/* HVAC units */}
      <mesh position={[3, 2.3, -2]} castShadow>
        <boxGeometry args={[2, 0.6, 1.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      {/* Water tank */}
      <mesh position={[-3, 1.5, -2]} castShadow>
        <cylinderGeometry args={[1, 1, 1.5, 16]} />
        <meshStandardMaterial color="#A0AEC0" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 3, 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 4, 8]} />
        <primitive object={materials.steel} attach="material" />
      </mesh>
    </group>
  );
}

function StreetLights() {
  const positions: [number, number, number][] = [
    [-8, 0, 10], [8, 0, 10], [-8, 0, 15], [8, 0, 15],
  ];
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 5, 8]} />
            <primitive object={materials.steel} attach="material" />
          </mesh>
          <mesh position={[0.5, 4.8, 0]}>
            <boxGeometry args={[1, 0.1, 0.3]} />
            <primitive object={materials.lightGlow} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Trees() {
  const positions: [number, number, number][] = [
    [-10, 0, 8], [10, 0, 8], [-12, 0, 5], [12, 0, 5],
    [-6, 0, 18], [6, 0, 18], [-14, 0, 12], [14, 0, 12],
  ];
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Trunk */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.2, 8]} />
            <meshStandardMaterial color="#5C4033" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 2, 0]} castShadow>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#2d5a27' : '#3a6b33'} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Building3DRealistic({
  units,
  selectedUnit,
  onSelectUnit,
  viewMode = 'realistic',
  explodeAmount = 0,
  selectedLayer = 'all',
  phase = 1,
}: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isPhoto = viewMode === 'photorealistic';

  // Layer visibility
  const showLayer = (layer: LayerType) => selectedLayer === 'all' || selectedLayer === layer;

  // Group units by floor
  const unitsByFloor = useMemo(() => {
    const grouped: Record<number, Unit[]> = {};
    units.forEach((unit) => {
      if (!grouped[unit.floor]) grouped[unit.floor] = [];
      grouped[unit.floor].push(unit);
    });
    return grouped;
  }, [units]);

  const maxFloor = Math.max(...units.map((u) => u.floor));

  // Calculate Y positions for each floor with phasing
  let currentY = 0;
  const floorYPositions: Record<number, number> = {};
  const floorExplode: Record<number, number> = {};
  for (let f = 1; f <= maxFloor; f++) {
    floorYPositions[f] = currentY;
    floorExplode[f] = f * explodeAmount * 0.5; // Each floor separates more
    currentY += f === 1 ? 4.2 : 3.4; // Lobby is taller
  }

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <GroundPlane />
      <StreetLights />
      <Trees />

      {/* Building floors with phasing + explode */}
      {Array.from({ length: maxFloor }, (_, i) => i + 1)
        .filter((floor) => floor / maxFloor <= phase) // Phasing: only show built floors
        .map((floor) => (
          <group
            key={floor}
            position={[0, floorExplode[floor], 0]} // Explode offset
          >
            {showLayer('architecture') && (
              <FloorLevel
                floor={floor}
                floorUnits={unitsByFloor[floor] || []}
                selectedUnit={selectedUnit}
                onSelectUnit={onSelectUnit}
                yPos={floorYPositions[floor]}
                viewMode={viewMode}
              />
            )}
          </group>
        ))}

      {/* Structure layer (columns always visible if selected) */}
      {showLayer('structure') && (
        <group>
          {Array.from({ length: maxFloor }, (_, i) => i + 1)
            .filter((floor) => floor / maxFloor <= phase)
            .map((floor) => (
              <group key={`struct-${floor}`} position={[0, floorYPositions[floor] + floorExplode[floor], 0]}>
                {[-6, -2, 2, 6].map((x, ci) =>
                  [-4, 4].map((z, zi) => (
                    <mesh key={`${ci}-${zi}`} position={[x, 1.5, z]} castShadow>
                      <boxGeometry args={[0.4, 3, 0.4]} />
                      <meshStandardMaterial
                        color={isPhoto ? '#8B7355' : '#A0AEC0'}
                        roughness={isPhoto ? 0.9 : 0.5}
                        metalness={isPhoto ? 0 : 0.3}
                      />
                    </mesh>
                  ))
                )}
              </group>
            ))}
        </group>
      )}

      {/* Roof - only show if phasing complete */}
      {phase >= 1 && showLayer('architecture') && (
        <group position={[0, floorExplode[maxFloor] || 0, 0]}>
          <RoofLevel yPos={currentY} />
        </group>
      )}

      {/* Building label */}
      <Text
        position={[0, currentY + 5, 8]}
        fontSize={1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        AZURE HEIGHTS
      </Text>
      <Text
        position={[0, currentY + 3.8, 8]}
        fontSize={0.5}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        48 Units | 12 Floors | $42.8M
      </Text>
    </group>
  );
}
