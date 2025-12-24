import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Blockchain cube component
const BlockchainCube = ({ position, scale = 1, rotationSpeed = 0.005 }: { 
  position: [number, number, number]; 
  scale?: number;
  rotationSpeed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 1.5;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.x += rotationSpeed;
      edgesRef.current.rotation.y += rotationSpeed * 1.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        {/* Solid cube with transparency */}
        <mesh ref={meshRef} scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#1a5fb4"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Glowing edges */}
        <lineSegments ref={edgesRef} scale={scale}>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color="#60a5fa" linewidth={2} />
        </lineSegments>
      </group>
    </Float>
  );
};

// Network lines connecting cubes
const NetworkLines = ({ points }: { points: [number, number, number][] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create line geometry
  const linePoints = points.map(p => new THREE.Vector3(...p));
  
  return (
    <group ref={groupRef}>
      {linePoints.slice(0, -1).map((point, i) => {
        const nextPoint = linePoints[i + 1];
        const direction = new THREE.Vector3().subVectors(nextPoint, point);
        const length = direction.length();
        const midPoint = new THREE.Vector3().addVectors(point, nextPoint).multiplyScalar(0.5);
        
        return (
          <mesh key={i} position={midPoint}>
            <cylinderGeometry args={[0.01, 0.01, length, 8]} />
            <meshStandardMaterial
              color="#3b82f6"
              transparent
              opacity={0.6}
              emissive="#3b82f6"
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Floating particles
const ParticleField = ({ count = 200 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    // Blue-ish colors
    colors[i * 3] = 0.2 + Math.random() * 0.2;
    colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0005;
      points.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Network nodes (small glowing spheres)
const NetworkNode = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color="#60a5fa"
        emissive="#3b82f6"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Mouse interaction camera controller
const CameraController = () => {
  const { camera } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x += (mousePosition.current.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (mousePosition.current.y * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  // Update mouse position
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mousePosition.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePosition.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  return null;
};

// Main scene component
const Scene = () => {
  // Cube positions
  const cubePositions: [number, number, number][] = [
    [-3, 1, -2],
    [2, -1, -1],
    [0, 2, -3],
    [-2, -2, 0],
    [3, 0.5, -2],
    [-1, 0, 1],
    [1.5, -2, -3],
    [-3, -0.5, -4],
  ];

  // Node positions (between cubes)
  const nodePositions: [number, number, number][] = [
    [-0.5, 0, -1.5],
    [1, 0.5, -2],
    [-2.5, -0.5, -1],
    [0.5, -1.5, -2],
    [-1.5, 1.5, -2.5],
    [2.5, -0.5, -1.5],
  ];

  // Connection lines
  const connections = [
    [cubePositions[0], cubePositions[2]],
    [cubePositions[1], cubePositions[3]],
    [cubePositions[2], cubePositions[4]],
    [cubePositions[3], cubePositions[5]],
    [cubePositions[4], cubePositions[6]],
    [cubePositions[0], cubePositions[5]],
    [cubePositions[1], cubePositions[4]],
    [cubePositions[5], cubePositions[7]],
  ];

  return (
    <>
      <CameraController />
      
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#1a5fb4" />

      {/* Stars background */}
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Blockchain cubes */}
      {cubePositions.map((pos, i) => (
        <BlockchainCube
          key={i}
          position={pos}
          scale={0.6 + Math.random() * 0.4}
          rotationSpeed={0.003 + Math.random() * 0.004}
        />
      ))}

      {/* Network nodes */}
      {nodePositions.map((pos, i) => (
        <NetworkNode key={i} position={pos} />
      ))}

      {/* Connection lines */}
      {connections.map((points, i) => (
        <NetworkLines key={i} points={points as [number, number, number][]} />
      ))}

      {/* Particle field */}
      <ParticleField count={150} />
    </>
  );
};

export const BlockchainScene = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
