import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function IndustrialFacility3D() {
  const turbineRef = useRef<THREE.Group>(null);
  const turbineRef2 = useRef<THREE.Group>(null);
  const smokeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (turbineRef.current) turbineRef.current.rotation.y = t * 0.8;
    if (turbineRef2.current) turbineRef2.current.rotation.y = t * 0.6 + 0.5;
    if (smokeRef.current) smokeRef.current.position.y = 12 + Math.sin(t * 0.5) * 0.5;
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#6B7B5E" roughness={0.95} />
      </mesh>

      {/* Paved areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#7A7568" roughness={0.9} />
      </mesh>

      {/* Main Facility Building */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[20, 8, 12]} />
          <meshStandardMaterial color="#C0B298" roughness={0.8} />
        </mesh>
        {/* Windows row */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[-7 + i * 2, 5, 6.05]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshPhysicalMaterial color="#87CEEB" transmission={0.6} transparent opacity={0.6} roughness={0.1} />
          </mesh>
        ))}
        {/* Loading docks */}
        {[-6, -2, 2, 6].map((x, i) => (
          <group key={i} position={[x, 0, -6.2]}>
            <mesh castShadow>
              <boxGeometry args={[2.5, 2.5, 0.5]} />
              <meshStandardMaterial color="#5A5A5A" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, -0.5]}>
              <planeGeometry args={[2, 2]} />
              <meshStandardMaterial color="#1A1A2E" roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Company sign */}
        <mesh position={[0, 8.5, 6.1]}>
          <boxGeometry args={[6, 1, 0.2]} />
          <meshStandardMaterial color="#1E3A5F" roughness={0.5} />
        </mesh>
      </group>

      {/* Wind Turbines */}
      {[-20, 20].map((x, i) => (
        <group key={i} position={[x, 0, -15]}>
          {/* Tower */}
          <mesh position={[0, 6, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.8, 12, 8]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Nacelle */}
          <mesh position={[0, 12, 0]} castShadow>
            <boxGeometry args={[3, 1.5, 1.5]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Hub */}
          <mesh position={[0, 12, 0.8]} castShadow>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#CBD5E0" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Blades */}
          <group position={[0, 12, 0.8]} ref={i === 0 ? turbineRef : turbineRef2}>
            {Array.from({ length: 3 }, (_, b) => (
              <mesh key={b} rotation={[0, 0, (b / 3) * Math.PI * 2]} position={[0, 4, 0]} castShadow>
                <boxGeometry args={[0.3, 8, 0.1]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} metalness={0.1} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Solar Panel Array */}
      <group position={[-15, 0, 15]}>
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[col * 1.8, 0.5, row * 2.5]}
              rotation={[-0.3, 0, 0]}
              castShadow
            >
              <boxGeometry args={[1.5, 0.05, 2]} />
              <meshPhysicalMaterial
                color="#1A365D"
                roughness={0.1}
                metalness={0.8}
                reflectivity={0.9}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Transformer Station */}
      <group position={[12, 0, 10]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[4, 3, 3]} />
          <meshStandardMaterial color="#B7791F" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Warning stripes */}
        <mesh position={[0, 2.5, 1.55]}>
          <planeGeometry args={[4, 0.5]} />
          <meshStandardMaterial color="#F6E05E" roughness={0.9} />
        </mesh>
        {/* Insulators */}
        {[-1.5, 0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
        ))}
        {/* Power lines */}
        <mesh position={[0, 5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 8, 4]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
      </group>

      {/* Storage Tanks */}
      {[
        [-8, -10], [-3, -10], [2, -10],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[2.5, 2.5, 6, 16]} />
            <meshStandardMaterial color={['#A0AEC0', '#718096', '#4A5568'][i]} roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Dome top */}
          <mesh position={[0, 6, 0]} castShadow>
            <sphereGeometry args={[2.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={['#A0AEC0', '#718096', '#4A5568'][i]} roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Ladder */}
          <mesh position={[2.3, 3, 0]}>
            <boxGeometry args={[0.1, 6, 0.3]} />
            <meshStandardMaterial color="#4A5568" roughness={0.7} />
          </mesh>
          {/* Level indicator */}
          <mesh position={[2.6, 2, 0]}>
            <planeGeometry args={[0.5, 3]} />
            <meshStandardMaterial color="#2D3748" />
          </mesh>
          <mesh position={[2.65, 2.5, 0]}>
            <planeGeometry args={[0.3, 1.5]} />
            <meshBasicMaterial color={['#48BB78', '#ECC94B', '#48BB78'][i]} />
          </mesh>
        </group>
      ))}

      {/* Smokestack */}
      <group position={[15, 0, -8]}>
        <mesh position={[0, 8, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1.2, 16, 12]} />
          <meshStandardMaterial color="#A0AEC0" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Red/white stripes */}
        {[4, 8, 12].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.85 + (16-y)*0.02, 0.85 + (16-y)*0.02 + 0.05, 1.5, 12]} />
            <meshStandardMaterial color="#E53E3E" roughness={0.6} />
          </mesh>
        ))}
        {/* Smoke particles */}
        <group ref={smokeRef} position={[0, 16, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 1.5, 0]}>
              <sphereGeometry args={[0.5 + i * 0.3, 8, 8]} />
              <meshStandardMaterial color="#E2E8F0" transparent opacity={0.3 - i * 0.1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Pipelines */}
      <group>
        {/* Horizontal pipes */}
        <mesh position={[0, 1, -6]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 30, 8]} />
          <meshStandardMaterial color="#D69E2E" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Vertical supports */}
        {[-10, -5, 0, 5, 10].map((x, i) => (
          <mesh key={i} position={[x, 0.5, -6]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 1, 6]} />
            <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.5} />
          </mesh>
        ))}
        {/* Pipe connections */}
        <mesh position={[-10, 2, -6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
          <meshStandardMaterial color="#C05621" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Control Room */}
      <group position={[18, 0, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[5, 3, 4]} />
          <meshStandardMaterial color="#2D3748" roughness={0.5} />
        </mesh>
        {/* Large windows */}
        <mesh position={[0, 2, 2.05]}>
          <planeGeometry args={[4, 1.5]} />
          <meshPhysicalMaterial color="#63B3ED" transmission={0.5} transparent opacity={0.4} roughness={0.1} />
        </mesh>
        {/* Screens inside */}
        <mesh position={[-1, 2.2, 2.1]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshBasicMaterial color="#48BB78" />
        </mesh>
        <mesh position={[1, 2.2, 2.1]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshBasicMaterial color="#4299E1" />
        </mesh>
        {/* Satellite dish */}
        <mesh position={[0, 3.8, 0]} castShadow rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[1.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#A0AEC0" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
          <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Fence */}
      <group>
        {Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const r = 35;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 0.8, Math.sin(angle) * r]}>
              <boxGeometry args={[0.1, 1.6, 0.1]} />
              <meshStandardMaterial color="#4A5568" roughness={0.6} metalness={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* Labels */}
      <Text position={[0, 10, 14]} fontSize={1.5} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
        GREENFIELD INDUSTRIAL COMPLEX
      </Text>
      <Text position={[0, 8.5, 14]} fontSize={0.6} color="#48BB78" anchorX="center" anchorY="middle">
        RENEWABLE + TRADITIONAL | 85MW CAPACITY
      </Text>
    </group>
  );
}
