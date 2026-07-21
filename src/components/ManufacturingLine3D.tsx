import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function ManufacturingLine3D() {
  const beltRef = useRef<THREE.Mesh>(null);
  const armRef = useRef<THREE.Group>(null);
  const fanRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beltRef.current) {
      beltRef.current.position.x = Math.sin(t * 2) * 0.3;
    }
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(t * 0.5) * 0.3 - 0.5;
    }
    if (fanRef.current) {
      fanRef.current.rotation.x = t * 3;
    }
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#4A5568" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Safety lines on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -8]}>
        <planeGeometry args={[40, 0.3]} />
        <meshStandardMaterial color="#F6E05E" roughness={0.9} />
      </mesh>

      {/* Conveyor Belt System */}
      <group position={[0, 0, 0]}>
        {/* Main frame */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[16, 0.2, 1.5]} />
          <meshStandardMaterial color="#718096" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Legs */}
        {[-7, -3.5, 0, 3.5, 7].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0.6]} castShadow>
            <boxGeometry args={[0.15, 1, 0.15]} />
            <meshStandardMaterial color="#2D3748" roughness={0.6} metalness={0.4} />
          </mesh>
        ))}
        {/* Belt */}
        <mesh position={[0, 1.15, 0]} ref={beltRef}>
          <boxGeometry args={[15.5, 0.1, 1.3]} />
          <meshStandardMaterial color="#1A202C" roughness={0.9} />
        </mesh>
        {/* Products on belt */}
        {[-5, -2, 1, 4].map((x, i) => (
          <mesh key={i} position={[x + Math.sin(i) * 0.5, 1.4, 0]} castShadow>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color={['#3182CE', '#38A169', '#805AD5', '#D69E2E'][i]} roughness={0.4} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Robotic Arm Station 1 */}
      <group position={[-5, 0, 4]} ref={armRef}>
        {/* Base */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 0.6, 16]} />
          <meshStandardMaterial color="#2B6CB0" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, 1.5, 0]} castShadow rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.25, 2, 0.25]} />
          <meshStandardMaterial color="#2D3748" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Upper arm */}
        <mesh position={[0.5, 2.8, 0]} castShadow rotation={[0, 0, -0.8]}>
          <boxGeometry args={[1.5, 0.2, 0.2]} />
          <meshStandardMaterial color="#2D3748" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Wrist */}
        <mesh position={[1.2, 2.2, 0]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Gripper */}
        <mesh position={[1.2, 1.9, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.1]} />
          <meshStandardMaterial color="#718096" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Robotic Arm Station 2 */}
      <group position={[5, 0, 4]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 0.6, 16]} />
          <meshStandardMaterial color="#38A169" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.25, 2, 0.25]} />
          <meshStandardMaterial color="#2D3748" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* CNC Machine */}
      <group position={[-10, 0, -3]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[3, 3, 2.5]} />
          <meshStandardMaterial color="#2D3748" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Door window */}
        <mesh position={[0, 1.8, 1.3]}>
          <planeGeometry args={[1.5, 1]} />
          <meshPhysicalMaterial color="#63B3ED" transmission={0.7} transparent opacity={0.5} roughness={0.1} />
        </mesh>
        {/* Status light */}
        <mesh position={[1.2, 3.2, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#48BB78" emissive="#48BB78" emissiveIntensity={0.8} />
        </mesh>
        {/* Spindle */}
        <mesh position={[0, 1, 0.5]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#A0AEC0" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Quality Control Station */}
      <group position={[10, 0, -3]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[2.5, 2.4, 2]} />
          <meshStandardMaterial color="#4A5568" roughness={0.5} />
        </mesh>
        {/* Scanner light */}
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshBasicMaterial color="#4299E1" transparent opacity={0.6} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 1.8, 1.05]}>
          <planeGeometry args={[1.2, 0.8]} />
          <meshStandardMaterial color="#1A202C" roughness={0.2} />
        </mesh>
        <mesh position={[0.2, 1.9, 1.1]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshBasicMaterial color="#48BB78" />
        </mesh>
      </group>

      {/* Welding Station */}
      <group position={[0, 0, -6]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[4, 1.6, 3]} />
          <meshStandardMaterial color="#744210" roughness={0.7} />
        </mesh>
        {/* Welding sparks effect */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[-1 + i * 0.3, 1.8, 0.5]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color={['#F6E05E', '#F6AD55', '#ECC94B', '#D69E2E', '#ED8936'][i]} />
          </mesh>
        ))}
      </group>

      {/* Overhead Crane */}
      <group>
        {/* Rail */}
        <mesh position={[0, 6, -2]} castShadow>
          <boxGeometry args={[30, 0.3, 0.3]} />
          <meshStandardMaterial color="#718096" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Trolley */}
        <mesh position={[3, 5.5, -2]} castShadow>
          <boxGeometry args={[1.5, 0.8, 1]} />
          <meshStandardMaterial color="#E53E3E" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Hook cable */}
        <mesh position={[3, 3.5, -2]}>
          <cylinderGeometry args={[0.03, 0.03, 3.5, 4]} />
          <meshStandardMaterial color="#1A202C" />
        </mesh>
        {/* Hook */}
        <mesh position={[3, 1.5, -2]} castShadow>
          <torusGeometry args={[0.3, 0.08, 8, 16]} />
          <meshStandardMaterial color="#718096" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Exhaust Fans */}
      {[-12, 0, 12].map((x, i) => (
        <group key={i} position={[x, 5, -8]} ref={i === 1 ? fanRef : undefined}>
          <mesh castShadow>
            <cylinderGeometry args={[1, 1, 0.5, 16]} />
            <meshStandardMaterial color="#A0AEC0" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Blades */}
          {Array.from({ length: 6 }, (_, b) => (
            <mesh key={b} rotation={[0, 0, (b / 6) * Math.PI * 2]} position={[0, 0.3, 0]}>
              <boxGeometry args={[0.15, 0.05, 1.6]} />
              <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Pallet racks */}
      <group position={[-15, 0, 5]}>
        {Array.from({ length: 4 }, (_, shelf) => (
          <mesh key={shelf} position={[0, 0.8 + shelf * 1.5, 0]} castShadow>
            <boxGeometry args={[6, 0.1, 2]} />
            <meshStandardMaterial color="#718096" roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
        {/* Vertical supports */}
        {[-3, 3].map((x) =>
          Array.from({ length: 4 }, (_, shelf) => (
            <mesh key={`${x}-${shelf}`} position={[x, 0.8 + shelf * 1.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.1, 2]} />
              <meshStandardMaterial color="#4A5568" roughness={0.5} metalness={0.6} />
            </mesh>
          ))
        )}
        {/* Boxes on shelves */}
        {[
          [-1, 1.2, 0], [1, 1.2, 0], [-2, 2.7, 0], [0, 2.7, 0], [2, 2.7, 0],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color={['#3182CE', '#38A169', '#805AD5', '#D69E2E', '#E53E3E'][i]} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Labels */}
      <Text position={[0, 8, 12]} fontSize={1.5} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
        PRECISION MANUFACTURING PLANT
      </Text>
      <Text position={[0, 6.5, 12]} fontSize={0.6} color="#48BB78" anchorX="center" anchorY="middle">
        OPERATIONAL | 4 Production Lines | OEE: 87%
      </Text>
    </group>
  );
}
