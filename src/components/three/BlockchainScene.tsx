import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Glass cube with inner blue glow
const GlassCube = ({ position, scale = 1, rotationSpeed = 0.005 }: { 
  position: [number, number, number]; 
  scale?: number;
  rotationSpeed?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += rotationSpeed;
      groupRef.current.rotation.y += rotationSpeed * 1.5;
    }
    // Pulsing glow effect
    if (innerRef.current) {
      const material = innerRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={position}>
        {/* Outer glass shell */}
        <mesh scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.92}
            roughness={0.05}
            thickness={0.5}
            ior={1.5}
            transparent
            opacity={0.25}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Inner glowing blue core */}
        <mesh ref={innerRef} scale={scale * 0.55}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#60a5fa"
            emissiveIntensity={1.5}
            transparent
            opacity={0.85}
          />
        </mesh>
        
        {/* Glowing wireframe edges */}
        <lineSegments scale={scale * 1.02}>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color="#93c5fd" transparent opacity={0.6} />
        </lineSegments>
      </group>
    </Float>
  );
};

// Glass pipe connecting two points
const GlassPipe = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const { midPoint, length, quaternion } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(end, start);
    const len = direction.length();
    
    // Calculate rotation to align cylinder with direction
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
    
    return { midPoint: mid, length: len, quaternion: quat };
  }, [start, end]);

  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (innerRef.current) {
      const material = innerRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 3 + start.x) * 0.5;
    }
  });

  return (
    <group position={midPoint} quaternion={quaternion}>
      {/* Outer glass tube */}
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, length, 16, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          roughness={0.1}
          thickness={0.2}
          ior={1.4}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <cylinderGeometry args={[0.025, 0.025, length, 8]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#60a5fa"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
};

// Glass pipes network
const GlassPipes = ({ connections }: { connections: [THREE.Vector3, THREE.Vector3][] }) => {
  return (
    <group>
      {connections.map((connection, i) => (
        <GlassPipe key={i} start={connection[0]} end={connection[1]} />
      ))}
    </group>
  );
};

// Single glowing spherical particle
const GlowingParticle = ({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing scale
      const scale = 0.7 + Math.sin(state.clock.elapsedTime * 2.5 + delay) * 0.3;
      meshRef.current.scale.setScalar(scale);
      
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.15;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.6 + delay) * 0.1;
      
      // Update emissive intensity
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 3 + delay) * 1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color="#60a5fa"
        emissive="#3b82f6"
        emissiveIntensity={2.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

// Particle field with spherical glowing particles
const GlowingParticleField = ({ count = 100 }: { count?: number }) => {
  const particles = useMemo(() => {
    const positions: { position: [number, number, number]; delay: number }[] = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18
        ],
        delay: Math.random() * Math.PI * 2
      });
    }
    return positions;
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
      groupRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <GlowingParticle key={i} position={particle.position} delay={particle.delay} />
      ))}
    </group>
  );
};

// Mouse interaction camera controller
const CameraController = () => {
  const { camera } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Smooth camera movement
    targetPosition.current.x += (mousePosition.current.x * 0.5 - targetPosition.current.x) * 0.02;
    targetPosition.current.y += (mousePosition.current.y * 0.5 - targetPosition.current.y) * 0.02;
    
    camera.position.x = targetPosition.current.x;
    camera.position.y = targetPosition.current.y;
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

  // Convert to Vector3 for pipe connections
  const cubeVectors = cubePositions.map(p => new THREE.Vector3(...p));

  // Connection lines between cubes
  const connections: [THREE.Vector3, THREE.Vector3][] = [
    [cubeVectors[0], cubeVectors[2]],
    [cubeVectors[1], cubeVectors[3]],
    [cubeVectors[2], cubeVectors[4]],
    [cubeVectors[3], cubeVectors[5]],
    [cubeVectors[4], cubeVectors[6]],
    [cubeVectors[0], cubeVectors[5]],
    [cubeVectors[1], cubeVectors[4]],
    [cubeVectors[5], cubeVectors[7]],
  ];

  return (
    <>
      <CameraController />
      
      {/* Enhanced lighting for glass effect */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#93c5fd" />
      
      {/* Environment for glass reflections */}
      <Environment preset="night" />

      {/* Stars background */}
      <Stars
        radius={50}
        depth={50}
        count={800}
        factor={2}
        saturation={0.2}
        fade
        speed={0.3}
      />

      {/* Glass cubes with inner glow */}
      {cubePositions.map((pos, i) => (
        <GlassCube
          key={i}
          position={pos}
          scale={0.7 + Math.random() * 0.3}
          rotationSpeed={0.003 + Math.random() * 0.003}
        />
      ))}

      {/* Glass pipes connecting cubes */}
      <GlassPipes connections={connections} />

      {/* Glowing spherical particles */}
      <GlowingParticleField count={80} />
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
