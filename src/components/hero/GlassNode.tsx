import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

type GeometryType = 'icosahedron' | 'octahedron' | 'dodecahedron' | 'tetrahedron';

interface GlassNodeProps {
  position: [number, number, number];
  geometry?: GeometryType;
  size?: number;
  color?: string;
  floatSpeed?: number;
  floatIntensity?: number;
}

export const GlassNode = ({
  position,
  geometry = 'icosahedron',
  size = 1,
  color = '#4a9eff',
  floatSpeed = 1,
  floatIntensity = 0.3,
}: GlassNodeProps) => {
  const meshRef = useRef<Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y =
        initialY + Math.sin(state.clock.elapsedTime * floatSpeed) * floatIntensity;
      
      // Slow rotation
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'octahedron':
        return <octahedronGeometry args={[size, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[size, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[size, 0]} />;
      case 'icosahedron':
      default:
        return <icosahedronGeometry args={[size, 0]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.25}
        roughness={0.05}
        metalness={0.1}
        transmission={0.95}
        thickness={1.5}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};
