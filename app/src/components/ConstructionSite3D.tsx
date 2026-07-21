import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function ConstructionSite3D() {
  const craneRef = useRef<THREE.Group>(null);
  const craneRef2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (craneRef.current) {
      craneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
    if (craneRef2.current) {
      craneRef2.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08 + 1) * 0.2;
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#C4A96A" roughness={1} />
      </mesh>

      {/* Foundation slab */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[20, 0.4, 15]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.9} />
      </mesh>

      {/* Building under construction - concrete skeleton */}
      {Array.from({ length: 6 }, (_, floor) => {
        const y = 0.8 + floor * 2.5;
        const progress = floor < 4 ? 1 : floor === 4 ? 0.7 : 0.3;
        return (
          <group key={floor} position={[0, y, 0]}>
            {/* Columns */}
            {[
              [-8, -5], [-8, 5], [8, -5], [8, 5],
              [-4, -5], [-4, 5], [4, -5], [4, 5],
              [0, -5], [0, 5], [-8, 0], [8, 0],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, 1, z]} castShadow>
                <boxGeometry args={[0.4, 2.5, 0.4]} />
                <meshStandardMaterial color="#D4D4D8" roughness={0.8} />
              </mesh>
            ))}
            {/* Floor slab */}
            {progress > 0.5 && (
              <mesh position={[0, 2.3, 0]} castShadow>
                <boxGeometry args={[18 * progress, 0.2, 12 * progress]} />
                <meshStandardMaterial color="#B8B8C0" roughness={0.9} />
              </mesh>
            )}
            {/* Rebar sticking out */}
            {floor >= 4 && Array.from({ length: 8 }, (_, i) => (
              <mesh key={`rebar-${i}`} position={[-6 + i * 2, 2.6, 4]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 1, 4]} />
                <meshStandardMaterial color="#B87333" roughness={0.6} metalness={0.8} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Tower Crane 1 */}
      <group ref={craneRef} position={[-15, 0, -10]}>
        {/* Tower */}
        <mesh position={[0, 10, 0]} castShadow>
          <boxGeometry args={[1, 20, 1]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Jib */}
        <mesh position={[8, 19.5, 0]} castShadow>
          <boxGeometry args={[16, 0.8, 0.8]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Counter jib */}
        <mesh position={[-4, 19.5, 0]} castShadow>
          <boxGeometry args={[8, 0.8, 0.8]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Counterweight */}
        <mesh position={[-7, 18.5, 0]} castShadow>
          <boxGeometry args={[2, 1.5, 1]} />
          <meshStandardMaterial color="#4B5563" roughness={0.7} />
        </mesh>
        {/* Cable */}
        <mesh position={[12, 15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 9, 4]} />
          <meshStandardMaterial color="#1F2937" />
        </mesh>
        {/* Load */}
        <mesh position={[12, 10, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 1]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        {/* Cab */}
        <mesh position={[1, 20.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1.2, 1.5]} />
          <meshStandardMaterial color="#374151" roughness={0.5} />
        </mesh>
      </group>

      {/* Tower Crane 2 */}
      <group ref={craneRef2} position={[18, 0, 5]}>
        <mesh position={[0, 8, 0]} castShadow>
          <boxGeometry args={[0.8, 16, 0.8]} />
          <meshStandardMaterial color="#EF4444" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[6, 15.5, 0]} castShadow>
          <boxGeometry args={[12, 0.6, 0.6]} />
          <meshStandardMaterial color="#EF4444" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[10, 12, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 7, 4]} />
          <meshStandardMaterial color="#1F2937" />
        </mesh>
      </group>

      {/* Excavator */}
      <group position={[12, 0, -8]}>
        {/* Body */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[3, 1.2, 2]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.6} />
        </mesh>
        {/* Cab */}
        <mesh position={[-0.5, 2, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#374151" roughness={0.4} />
        </mesh>
        {/* Tracks */}
        <mesh position={[0, 0.3, -1]} castShadow>
          <boxGeometry args={[3.5, 0.4, 0.8]} />
          <meshStandardMaterial color="#1F2937" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 1]} castShadow>
          <boxGeometry args={[3.5, 0.4, 0.8]} />
          <meshStandardMaterial color="#1F2937" roughness={0.8} />
        </mesh>
        {/* Arm */}
        <mesh position={[2.5, 1.5, 0]} rotation={[0, 0, -0.5]} castShadow>
          <boxGeometry args={[3, 0.3, 0.3]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.6} />
        </mesh>
        {/* Bucket */}
        <mesh position={[4, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 0.8, 0.8]} />
          <meshStandardMaterial color="#6B7280" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>

      {/* Dump truck */}
      <group position={[-10, 0, 8]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[2.5, 1.5, 1.8]} />
          <meshStandardMaterial color="#DC2626" roughness={0.6} />
        </mesh>
        <mesh position={[-2, 0.8, 0]} castShadow>
          <boxGeometry args={[1.5, 1.2, 1.8]} />
          <meshStandardMaterial color="#DC2626" roughness={0.6} />
        </mesh>
        {/* Wheels */}
        {[-1.2, 1.2].map((x) =>
          [-0.8, 0.8].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.4, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 12]} />
              <meshStandardMaterial color="#1F2937" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* Scaffolding */}
      <group position={[8, 0, -5]}>
        {Array.from({ length: 5 }, (_, y) =>
          Array.from({ length: 3 }, (_, x) => (
            <mesh key={`${x}-${y}`} position={[x * 1.5, 0.5 + y * 2, 0]} castShadow>
              <boxGeometry args={[0.1, 2, 0.1]} />
              <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.4} />
            </mesh>
          ))
        )}
        {/* Cross bars */}
        {Array.from({ length: 4 }, (_, y) => (
          <mesh key={`bar-${y}`} position={[1.5, 1.5 + y * 2, 0]} castShadow>
            <boxGeometry args={[3, 0.1, 0.1]} />
            <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Safety fencing */}
      <group>
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const r = 22;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 0.6, Math.sin(angle) * r]} castShadow>
              <boxGeometry args={[0.1, 1.2, 0.1]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* Material piles */}
      <mesh position={[-8, 0.5, 12]} castShadow>
        <coneGeometry args={[3, 1.5, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.95} />
      </mesh>
      <mesh position={[-4, 0.4, 13]} castShadow>
        <coneGeometry args={[2, 1, 8]} />
        <meshStandardMaterial color="#A0AEC0" roughness={0.9} />
      </mesh>

      {/* Site office container */}
      <group position={[-18, 0, 8]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[4, 2.4, 2.5]} />
          <meshStandardMaterial color="#1E40AF" roughness={0.6} />
        </mesh>
        <mesh position={[-1, 1.5, 1.3]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#93C5FD" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* Workers (simplified) */}
      {[
        [2, 0.5, 3], [5, 0.5, -2], [-3, 0.5, 5], [8, 0.5, 8],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
            <meshStandardMaterial color={['#F97316', '#FACC15', '#EF4444', '#3B82F6'][i]} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#FDBA74" />
          </mesh>
          {/* Hard hat */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <sphereGeometry args={[0.2, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={['#F97316', '#FACC15', '#EF4444', '#3B82F6'][i]} />
          </mesh>
        </group>
      ))}

      {/* Labels */}
      <Text position={[0, 18, 8]} fontSize={1.5} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
        AL SAFA TOWERS
      </Text>
      <Text position={[0, 16.5, 8]} fontSize={0.6} color="#F59E0B" anchorX="center" anchorY="middle">
        CONSTRUCTION SITE | Phase 2 of 4
      </Text>
      <Text position={[0, 15.5, 8]} fontSize={0.5} color="#9CA3AF" anchorX="center" anchorY="middle">
        6 Floors | 2 Tower Cranes | 24 Workers On-Site
      </Text>

      {/* Progress indicator */}
      <Text position={[-18, 3.5, 12]} fontSize={0.5} color="#ffffff" anchorX="center" anchorY="middle">
        PROGRESS: 67%
      </Text>
    </group>
  );
}
