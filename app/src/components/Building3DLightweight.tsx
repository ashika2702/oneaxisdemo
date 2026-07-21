import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  type: string;
  status: 'available' | 'sold' | 'reserved' | 'coming-soon';
}

interface Props {
  units: Unit[];
  selectedUnit: string | null;
  onSelectUnit: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  available: '#10b981',
  sold: '#6b7280',
  reserved: '#3b82f6',
  'coming-soon': '#f59e0b',
};

export default function Building3DLightweight({ units, selectedUnit, onSelectUnit }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const unitsByFloor = useMemo(() => {
    const grouped: Record<number, Unit[]> = {};
    units.forEach((u) => {
      if (!grouped[u.floor]) grouped[u.floor] = [];
      grouped[u.floor].push(u);
    });
    return grouped;
  }, [units]);

  const maxFloor = Math.max(...units.map((u) => u.floor), 1);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[50, 50, '#1e293b', '#1e293b']} position={[0, 0, 0]} />

      {/* Building floors */}
      {Array.from({ length: maxFloor }, (_, floorIdx) => {
        const floor = floorIdx + 1;
        const floorUnits = unitsByFloor[floor] || [];
        const yPos = floorIdx * 1.4;

        return (
          <group key={floor} position={[0, yPos + 0.1, 0]}>
            {/* Floor slab */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <boxGeometry args={[8, 0.08, 6]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Units */}
            {floorUnits.map((unit, uIdx) => {
              const isSelected = selectedUnit === unit.id;
              const xPos = (uIdx - floorUnits.length / 2 + 0.5) * 1.8;
              const color = STATUS_COLORS[unit.status] || '#6b7280';

              return (
                <group
                  key={unit.id}
                  position={[xPos, 0.55, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectUnit(unit.id);
                  }}
                  onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                  onPointerOut={() => { document.body.style.cursor = 'default'; }}
                >
                  {/* Unit box - simplified block */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.6, 1, 1.2]} />
                    <meshStandardMaterial
                      color={isSelected ? '#3b82f6' : color}
                      transparent
                      opacity={isSelected ? 0.9 : 0.75}
                      emissive={isSelected ? '#1d4ed8' : '#000000'}
                      emissiveIntensity={isSelected ? 0.4 : 0}
                      roughness={0.5}
                    />
                  </mesh>

                  {/* Wireframe edges */}
                  <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(1.6, 1, 1.2)]} />
                    <lineBasicMaterial color={isSelected ? '#60a5fa' : '#334155'} />
                  </lineSegments>

                  {/* Unit label */}
                  <Text position={[0, 0, 0.65]} fontSize={0.22} color={isSelected ? '#fff' : '#94a3b8'} anchorX="center" anchorY="middle">
                    {unit.unitNumber}
                  </Text>

                  {/* Floor label on first unit */}
                  {uIdx === 0 && (
                    <Text position={[-3.5, 0, 0]} fontSize={0.3} color="#64748b" anchorX="center" anchorY="middle">
                      L{floor}
                    </Text>
                  )}
                </group>
              );
            })}
          </group>
        );
      })}

      {/* Building label */}
      <Text position={[0, maxFloor * 1.4 + 2, 6]} fontSize={0.8} color="#e2e8f0" anchorX="center" anchorY="middle" fontWeight="bold">
        AZURE HEIGHTS TOWER
      </Text>
      <Text position={[0, maxFloor * 1.4 + 1.2, 6]} fontSize={0.35} color="#64748b" anchorX="center" anchorY="middle">
        {units.length} Units | {maxFloor} Floors | Lightweight View
      </Text>
    </group>
  );
}
