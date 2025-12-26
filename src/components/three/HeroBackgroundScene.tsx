import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Detect mobile for performance optimization
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// BlockchainGlobe: Spherical globe made of neon blue glowing dots
const BlockchainGlobe = ({ dotCount = isMobile ? 2000 : 4000 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const radius = 1.0;
    
    // Fibonacci sphere distribution for even spacing
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      positions[i * 3] = Math.cos(theta) * radiusAtY * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [dotCount]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0015; // Extremely slow rotation
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.012}
        color="#00F0FF"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// OrbitingBlocks: Small matte white cubes orbiting the globe
const OrbitingBlocks = ({ blocksRef }: { blocksRef: React.MutableRefObject<THREE.Mesh[]> }) => {
  const blockCount = 8;
  
  const orbitalData = useMemo(() => {
    return Array.from({ length: blockCount }, (_, i) => ({
      radiusX: 2.0 + Math.random() * 0.4,
      radiusY: 1.8 + Math.random() * 0.4,
      radiusZ: 1.9 + Math.random() * 0.4,
      speed: 0.0008 + Math.random() * 0.0002,
      offset: (i / blockCount) * Math.PI * 2,
      tiltX: (Math.random() - 0.5) * 0.3,
      tiltZ: (Math.random() - 0.5) * 0.3,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    blocksRef.current.forEach((block, i) => {
      if (block) {
        const data = orbitalData[i];
        const angle = time * data.speed * 60 + data.offset;
        
        block.position.x = Math.cos(angle) * data.radiusX;
        block.position.y = Math.sin(angle * 0.7 + data.tiltX) * data.radiusY * 0.3;
        block.position.z = Math.sin(angle) * data.radiusZ;
        
        // Extremely slow self-rotation
        block.rotation.x += 0.002;
        block.rotation.y += 0.001;
      }
    });
  });

  return (
    <group>
      {orbitalData.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) blocksRef.current[i] = el;
          }}
        >
          <boxGeometry args={[0.06, 0.04, 0.04]} />
          <meshStandardMaterial
            color="#D8D8D8"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};

// ConnectionLines: Thin white lines connecting blocks to each other
const ConnectionLines = ({ blocksRef }: { blocksRef: React.MutableRefObject<THREE.Mesh[]> }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const connections = useMemo(() => {
    // Ring connections + geometric cross-connections
    return [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(connections.length * 6);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [connections.length]);

  useFrame(() => {
    if (lineRef.current && blocksRef.current.length === 8) {
      const posArray = geometry.attributes.position.array as Float32Array;
      
      connections.forEach(([a, b], i) => {
        const blockA = blocksRef.current[a];
        const blockB = blocksRef.current[b];
        
        if (blockA && blockB) {
          posArray[i * 6] = blockA.position.x;
          posArray[i * 6 + 1] = blockA.position.y;
          posArray[i * 6 + 2] = blockA.position.z;
          posArray[i * 6 + 3] = blockB.position.x;
          posArray[i * 6 + 4] = blockB.position.y;
          posArray[i * 6 + 5] = blockB.position.z;
        }
      });
      
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// GlobeToBlockConnections: Lines connecting blocks to nearest globe surface
const GlobeToBlockConnections = ({ blocksRef }: { blocksRef: React.MutableRefObject<THREE.Mesh[]> }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const connectionCount = 6;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(connectionCount * 6);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (lineRef.current && blocksRef.current.length >= connectionCount) {
      const posArray = geometry.attributes.position.array as Float32Array;
      const globeRadius = 1.0;
      
      for (let i = 0; i < connectionCount; i++) {
        const block = blocksRef.current[i];
        
        if (block) {
          // Block position
          posArray[i * 6] = block.position.x;
          posArray[i * 6 + 1] = block.position.y;
          posArray[i * 6 + 2] = block.position.z;
          
          // Nearest point on globe surface (normalized direction * radius)
          const len = Math.sqrt(
            block.position.x ** 2 + 
            block.position.y ** 2 + 
            block.position.z ** 2
          );
          
          posArray[i * 6 + 3] = (block.position.x / len) * globeRadius;
          posArray[i * 6 + 4] = (block.position.y / len) * globeRadius;
          posArray[i * 6 + 5] = (block.position.z / len) * globeRadius;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// AmbientParticles: Minimal soft white particles for depth
const AmbientParticles = ({ count = isMobile ? 50 : 100 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const spread = 8;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.0008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0008;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0008;
    }
    
    velocitiesRef.current = velocities;
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame(() => {
    if (pointsRef.current && velocitiesRef.current) {
      const posArray = geometry.attributes.position.array as Float32Array;
      const velocities = velocitiesRef.current;
      const halfSpread = 4;
      
      for (let i = 0; i < count; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Wrap around boundaries
        for (let j = 0; j < 3; j++) {
          if (posArray[i * 3 + j] > halfSpread) posArray[i * 3 + j] = -halfSpread;
          if (posArray[i * 3 + j] < -halfSpread) posArray[i * 3 + j] = halfSpread;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.006}
        color="#FFFFFF"
        transparent
        opacity={0.12}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// Scene: Orchestrates all 3D elements with proper lighting
const Scene = () => {
  const blocksRef = useRef<THREE.Mesh[]>([]);

  return (
    <>
      {/* Pure black background */}
      <color attach="background" args={['#000000']} />
      
      {/* Neutral white lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.15} />
      {/* Rim lighting for depth separation */}
      <directionalLight position={[-5, -3, -5]} intensity={0.12} />
      
      {/* Main elements */}
      <BlockchainGlobe />
      <OrbitingBlocks blocksRef={blocksRef} />
      <ConnectionLines blocksRef={blocksRef} />
      <GlobeToBlockConnections blocksRef={blocksRef} />
      <AmbientParticles />
    </>
  );
};

// Main component with Canvas
const HeroBackgroundScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`absolute inset-0 -z-10 transition-opacity duration-1000 ease-out pointer-events-none ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Canvas
        camera={{ position: [0, 0.2, 4.5], fov: 70, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        style={{ background: '#000000', pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: false }}
        onCreated={() => setIsLoaded(true)}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroBackgroundScene;
