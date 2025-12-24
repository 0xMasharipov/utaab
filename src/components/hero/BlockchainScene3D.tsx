import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { Group } from 'three';
import { GlassNode } from './GlassNode';
import { ConnectionLine } from './ConnectionLine';

// Node positions for the blockchain network
const nodes: Array<{
  position: [number, number, number];
  geometry: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'tetrahedron';
  size: number;
  color: string;
  floatSpeed: number;
}> = [
  // Central node
  { position: [0, 0, 0], geometry: 'icosahedron', size: 0.8, color: '#4a9eff', floatSpeed: 0.8 },
  // Primary ring
  { position: [2.5, 0.8, -1], geometry: 'octahedron', size: 0.5, color: '#9b87f5', floatSpeed: 1.2 },
  { position: [-2.2, -0.5, 0.5], geometry: 'octahedron', size: 0.45, color: '#7dd3fc', floatSpeed: 1.0 },
  { position: [1.2, -1.8, 0.8], geometry: 'dodecahedron', size: 0.4, color: '#c4b5fd', floatSpeed: 1.4 },
  { position: [-1.5, 1.5, -0.5], geometry: 'tetrahedron', size: 0.35, color: '#60a5fa', floatSpeed: 1.1 },
  // Outer ring
  { position: [3.5, -1.2, -1.5], geometry: 'tetrahedron', size: 0.3, color: '#a78bfa', floatSpeed: 1.3 },
  { position: [-3.2, 0.3, -0.8], geometry: 'dodecahedron', size: 0.35, color: '#38bdf8', floatSpeed: 0.9 },
];

// Connections between nodes (indices into the nodes array)
const connections: Array<[number, number]> = [
  [0, 1], // Center to right
  [0, 2], // Center to left
  [0, 3], // Center to bottom-right
  [0, 4], // Center to top-left
  [1, 4], // Right to top-left
  [2, 3], // Left to bottom-right
  [1, 5], // Right to outer-right
  [2, 6], // Left to outer-left
  [3, 5], // Bottom-right to outer-right
  [4, 6], // Top-left to outer-left
];

const NetworkGroup = () => {
  const groupRef = useRef<Group>(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      // Smooth parallax effect based on mouse position
      const targetRotationY = (mouse.x * viewport.width) / 80;
      const targetRotationX = (mouse.y * viewport.height) / 80;

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Render all glass nodes */}
        {nodes.map((node, index) => (
          <GlassNode
            key={index}
            position={node.position}
            geometry={node.geometry}
            size={node.size}
            color={node.color}
            floatSpeed={node.floatSpeed}
            floatIntensity={0.15}
          />
        ))}

        {/* Render connection lines */}
        {connections.map(([startIdx, endIdx], index) => (
          <ConnectionLine
            key={index}
            start={nodes[startIdx].position}
            end={nodes[endIdx].position}
            color="#4a9eff"
            opacity={0.3}
          />
        ))}
      </group>
    </Float>
  );
};

const BlockchainScene3D = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4a9eff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#9b87f5" />
        <pointLight position={[0, -10, 5]} intensity={0.6} color="#7dd3fc" />

        {/* The blockchain network */}
        <NetworkGroup />

        {/* Environment for reflections */}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
};

export default BlockchainScene3D;
