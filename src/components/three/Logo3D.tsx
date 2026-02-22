import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import { Group } from 'three';

const blockPositions = [
  { pos: [0, 0.38, 0] as [number, number, number] },   // top
  { pos: [0.38, 0, 0] as [number, number, number] },   // right
  { pos: [0, -0.38, 0] as [number, number, number] },  // bottom
  { pos: [-0.38, 0, 0] as [number, number, number] },  // left
];

const Logo3D = () => {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Micro-tilt: ~1.5 degree sine oscillation
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.026;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.017;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0}>
      <group ref={groupRef}>
        {blockPositions.map((block, i) => (
          <RoundedBox
            key={i}
            args={[0.45, 0.45, 0.12]}
            radius={0.08}
            smoothness={2}
            position={block.pos}
            rotation={[0, 0, Math.PI / 4]}
          >
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0.25}
              clearcoat={0.8}
              clearcoatRoughness={0.15}
            />
          </RoundedBox>
        ))}
      </group>
    </Float>
  );
};

export default Logo3D;
