import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function OilRig3D() {
  const derrickRef = useRef<THREE.Group>(null);
  const pumpRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pumpRef.current) {
      pumpRef.current.rotation.z = Math.sin(t * 1.5) * 0.25;
    }
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 10) * 0.2 + Math.sin(t * 7 + 1) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(t * 8 + 2) * 0.1;
    }
    if (flareRef.current) {
      flareRef.current.intensity = 2 + Math.sin(t * 15) * 0.5;
    }
  });

  return (
    <group>
      {/* Ocean surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 32, 32]} />
        <meshStandardMaterial color="#1A3A5C" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Platform base (spar) */}
      <mesh position={[0, -8, 0]} castShadow>
        <cylinderGeometry args={[6, 5, 16, 16]} />
        <meshStandardMaterial color="#C53030" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Red/white hazard stripes */}
      {[-4, -1, 2, 5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[6.05 - (i * 0.05), 6.05 - (i * 0.05), 1, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
        </mesh>
      ))}

      {/* Main deck */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[22, 1, 20]} />
        <meshStandardMaterial color="#F7FAFC" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Deck grating pattern */}
      <mesh position={[0, 1.01, 0]}>
        <planeGeometry args={[20, 18]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
      </mesh>

      {/* Derrick / Drilling Tower */}
      <group ref={derrickRef} position={[5, 1, -5]}>
        {/* Tower legs */}
        {[
          [-1.5, -1.5], [-1.5, 1.5], [1.5, -1.5], [1.5, 1.5],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 8, z]} castShadow>
            <boxGeometry args={[0.3, 16, 0.3]} />
            <meshStandardMaterial color="#C53030" roughness={0.5} metalness={0.3} />
          </mesh>
        ))}
        {/* Cross bracing */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = 2 + i * 2.5;
          return (
            <group key={i}>
              <mesh position={[0, y, -1.5]} castShadow>
                <boxGeometry args={[3, 0.15, 0.15]} />
                <meshStandardMaterial color="#9B2C2C" roughness={0.6} metalness={0.4} />
              </mesh>
              <mesh position={[0, y, 1.5]} castShadow>
                <boxGeometry args={[3, 0.15, 0.15]} />
                <meshStandardMaterial color="#9B2C2C" roughness={0.6} metalness={0.4} />
              </mesh>
              <mesh position={[-1.5, y, 0]} castShadow>
                <boxGeometry args={[0.15, 0.15, 3]} />
                <meshStandardMaterial color="#9B2C2C" roughness={0.6} metalness={0.4} />
              </mesh>
              <mesh position={[1.5, y, 0]} castShadow>
                <boxGeometry args={[0.15, 0.15, 3]} />
                <meshStandardMaterial color="#9B2C2C" roughness={0.6} metalness={0.4} />
              </mesh>
            </group>
          );
        })}
        {/* Top block */}
        <mesh position={[0, 17, 0]} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#C53030" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Drill line */}
        <mesh position={[0, 9, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 14, 4]} />
          <meshStandardMaterial color="#1A202C" />
        </mesh>
        {/* Hook */}
        <mesh position={[0, 2, 0]} castShadow>
          <torusGeometry args={[0.3, 0.08, 8, 16]} />
          <meshStandardMaterial color="#718096" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Pumping Unit (Nodding Donkey) */}
      <group position={[-6, 1, 5]} ref={pumpRef}>
        {/* Base */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 2]} />
          <meshStandardMaterial color="#2D3748" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Samson post */}
        <mesh position={[-0.8, 2, 0]} castShadow>
          <boxGeometry args={[0.4, 2.5, 0.4]} />
          <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Walking beam */}
        <mesh position={[1.5, 3.2, 0]} castShadow rotation={[0, 0, -0.3]}>
          <boxGeometry args={[5, 0.25, 0.3]} />
          <meshStandardMaterial color="#C53030" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Horse head */}
        <mesh position={[3.5, 2.5, 0]} castShadow>
          <boxGeometry args={[0.8, 1.5, 0.3]} />
          <meshStandardMaterial color="#C53030" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Pitman arm */}
        <mesh position={[-0.5, 1.5, 0]} castShadow>
          <boxGeometry args={[0.15, 2.5, 0.15]} />
          <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Crank */}
        <mesh position={[-0.8, 0.8, 0.5]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
          <meshStandardMaterial color="#2D3748" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Wellheads / Christmas Trees */}
      {[
        [-2, 7], [0, 7], [2, 7],
        [-1, 9], [1, 9],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 1, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.2, 8]} />
            <meshStandardMaterial color="#2D3748" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Valves */}
          {[-0.3, 0.3].map((vx, vi) => (
            <mesh key={vi} position={[vx, 1.3, 0]} castShadow>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#C53030" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}
          {/* Side pipes */}
          <mesh position={[0, 0.8, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
            <meshStandardMaterial color="#718096" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Processing Modules */}
      <group position={[-8, 1, -6]}>
        {/* Separator vessel */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
          <meshStandardMaterial color="#A0AEC0" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 4, 0]} castShadow>
          <sphereGeometry args={[1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#A0AEC0" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Pressure gauge */}
        <mesh position={[1.6, 3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[1.6, 3.05, 0]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial color="#48BB78" />
        </mesh>
      </group>

      {/* Gas Flare Stack */}
      <group position={[10, 1, -7]}>
        {/* Stack */}
        <mesh position={[0, 6, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 12, 8]} />
          <meshStandardMaterial color="#718096" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Guy wires */}
        {[0, Math.PI * 0.67, Math.PI * 1.33].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 2, 3, Math.sin(angle) * 2]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.01, 0.01, 7, 4]} />
            <meshStandardMaterial color="#A0AEC0" />
          </mesh>
        ))}
        {/* Flame */}
        <mesh ref={flameRef} position={[0, 12.5, 0]}>
          <coneGeometry args={[0.4, 1.5, 8]} />
          <meshBasicMaterial color="#F6AD55" transparent opacity={0.8} />
        </mesh>
        <pointLight ref={flareRef} position={[0, 13, 0]} color="#F6AD55" intensity={2} distance={20} />
        {/* Inner flame */}
        <mesh position={[0, 12.3, 0]}>
          <coneGeometry args={[0.2, 1, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Helicopter Pad */}
      <group position={[0, 1, -10]}>
        {/* Platform */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[4, 4, 0.4, 24]} />
          <meshStandardMaterial color="#2D3748" roughness={0.7} />
        </mesh>
        {/* H marking */}
        <mesh position={[0, 0.42, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[4, 0.6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[4, 0.6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Circle border */}
        <mesh position={[0, 0.41, 0]}>
          <ringGeometry args={[3.5, 3.8, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Support columns */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 3, -2, Math.sin(angle) * 3]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 4.4, 6]} />
              <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.5} />
            </mesh>
          );
        })}
      </group>

      {/* Living Quarters */}
      <group position={[8, 1, 4]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[5, 5, 4]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
        </mesh>
        {/* Windows */}
        {Array.from({ length: 3 }, (_, floor) =>
          Array.from({ length: 4 }, (_, w) => (
            <mesh key={`${floor}-${w}`} position={[-1.5 + w * 1, 1.5 + floor * 1.5, 2.05]}>
              <planeGeometry args={[0.6, 0.8]} />
              <meshPhysicalMaterial color="#87CEEB" transmission={0.5} transparent opacity={0.5} roughness={0.1} />
            </mesh>
          ))
        )}
        {/* Deck */}
        <mesh position={[0, 5.3, 0]} castShadow>
          <boxGeometry args={[5.5, 0.2, 4.5]} />
          <meshStandardMaterial color="#4A5568" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Lifeboats */}
        {[-2, 2].map((x, i) => (
          <mesh key={i} position={[x, 5.5, 2.5]} castShadow rotation={[0.3, 0, 0]}>
            <boxGeometry args={[1.2, 0.6, 2]} />
            <meshStandardMaterial color="#F97316" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Cranes */}
      <group position={[-10, 1, 0]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[0.5, 8, 0.5]} />
          <meshStandardMaterial color="#C53030" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[3, 7.5, 0]} castShadow>
          <boxGeometry args={[6, 0.4, 0.4]} />
          <meshStandardMaterial color="#C53030" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[5, 5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 5, 4]} />
          <meshStandardMaterial color="#1A202C" />
        </mesh>
      </group>

      {/* Railing around deck */}
      <group>
        {Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const r = 10.5;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 1.5, Math.sin(angle) * r]}>
              <cylinderGeometry args={[0.05, 0.05, 1, 4]} />
              <meshStandardMaterial color="#F6E05E" roughness={0.5} metalness={0.3} />
            </mesh>
          );
        })}
      </group>

      {/* Mooring lines */}
      {[
        [20, 0, 0], [-20, 0, 0], [0, 0, 18], [0, 0, -18],
      ].map(([x, _y, z], i) => (
        <group key={i}>
          <mesh position={[x * 0.6, -1, z * 0.6]} rotation={[0, 0, Math.atan2(x, z)]}>
            <cylinderGeometry args={[0.08, 0.08, Math.sqrt(x * x + z * z) * 0.5, 4]} />
            <meshStandardMaterial color="#4A5568" roughness={0.6} />
          </mesh>
          {/* Anchor buoy */}
          <mesh position={[x, 0.5, z]} castShadow>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial color="#F6E05E" roughness={0.5} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Supply vessel */}
      <group position={[25, 0, 10]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[15, 2, 5]} />
          <meshStandardMaterial color="#2B6CB0" roughness={0.6} />
        </mesh>
        <mesh position={[-5, 2.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 4]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
        </mesh>
        {/* Deck cargo */}
        <mesh position={[2, 2.3, 0]} castShadow>
          <boxGeometry args={[4, 0.6, 3]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
      </group>

      {/* Labels */}
      <Text position={[0, 20, 18]} fontSize={1.5} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
        MARINER OFFSHORE PLATFORM
      </Text>
      <Text position={[0, 18.5, 18]} fontSize={0.6} color="#F6AD55" anchorX="center" anchorY="middle">
        OFFSHORE PRODUCTION | 45,000 BPD
      </Text>
    </group>
  );
}
