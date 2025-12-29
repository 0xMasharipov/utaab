import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Detect mobile for performance optimization
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// BlockchainGlobe: Spherical globe made of neon blue glowing dots
const BlockchainGlobe = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const dotCount = isMobile ? 2000 : 4000;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const radius = 1.0;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle for Fibonacci sphere

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
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
      pointsRef.current.rotation.y += 0.0015;
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

// OrbitingBlocks: 8 matte white cubes orbiting the globe
const OrbitingBlocks = ({ blocksRef }: { blocksRef: React.MutableRefObject<THREE.Mesh[]> }) => {
  const groupRef = useRef<THREE.Group>(null);

  const blockData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      radiusX: 2.8 + Math.random() * 0.4,
      radiusY: 2.6 + Math.random() * 0.4,
      radiusZ: 2.7 + Math.random() * 0.4,
      speed: 0.0008 + Math.random() * 0.0002,
      offset: (i / 8) * Math.PI * 2,
      tiltX: (Math.random() - 0.5) * 0.3,
      tiltZ: (Math.random() - 0.5) * 0.3,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime * 60;
    blockData.forEach((block, i) => {
      const mesh = blocksRef.current[i];
      if (mesh) {
        const angle = time * block.speed + block.offset;
        mesh.position.x = Math.cos(angle) * block.radiusX;
        mesh.position.y = Math.sin(angle * 0.7 + block.tiltX) * block.radiusY * 0.3;
        mesh.position.z = Math.sin(angle) * block.radiusZ;
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.002;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {blockData.map((block, i) => (
        <mesh
          key={block.id}
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

// ConnectionLines: 12 thin white lines connecting blocks to each other
const ConnectionLines = ({ blocksRef }: { blocksRef: React.MutableRefObject<THREE.Mesh[]> }) => {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // 12 connections: ring (8) + cross-connections (4)
    const positions = new Float32Array(12 * 2 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (lineRef.current && blocksRef.current.length === 8) {
      const positions = geometry.attributes.position.array as Float32Array;
      let idx = 0;

      // Ring connections (0-1, 1-2, 2-3, 3-4, 4-5, 5-6, 6-7, 7-0)
      for (let i = 0; i < 8; i++) {
        const current = blocksRef.current[i];
        const next = blocksRef.current[(i + 1) % 8];
        if (current && next) {
          positions[idx++] = current.position.x;
          positions[idx++] = current.position.y;
          positions[idx++] = current.position.z;
          positions[idx++] = next.position.x;
          positions[idx++] = next.position.y;
          positions[idx++] = next.position.z;
        }
      }

      // Cross-connections (0-4, 1-5, 2-6, 3-7)
      for (let i = 0; i < 4; i++) {
        const a = blocksRef.current[i];
        const b = blocksRef.current[i + 4];
        if (a && b) {
          positions[idx++] = a.position.x;
          positions[idx++] = a.position.y;
          positions[idx++] = a.position.z;
          positions[idx++] = b.position.x;
          positions[idx++] = b.position.y;
          positions[idx++] = b.position.z;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#FFFFFF" transparent opacity={0.25} />
    </lineSegments>
  );
};

// GlobeToBlockConnections: 6 lines connecting blocks to nearest globe surface points
const GlobeToBlockConnections = ({ blocksRef }: { blocksRef: React.MutableRefObject<THREE.Mesh[]> }) => {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6 * 2 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (lineRef.current && blocksRef.current.length >= 6) {
      const positions = geometry.attributes.position.array as Float32Array;
      let idx = 0;
      const globeRadius = 1.0;

      for (let i = 0; i < 6; i++) {
        const block = blocksRef.current[i];
        if (block) {
          // Block position
          positions[idx++] = block.position.x;
          positions[idx++] = block.position.y;
          positions[idx++] = block.position.z;

          // Nearest point on globe surface
          const dir = block.position.clone().normalize();
          positions[idx++] = dir.x * globeRadius;
          positions[idx++] = dir.y * globeRadius;
          positions[idx++] = dir.z * globeRadius;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#FFFFFF" transparent opacity={0.15} />
    </lineSegments>
  );
};

// AmbientParticles: Minimal soft white drifting particles
const AmbientParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = isMobile ? 50 : 100;

  const { geometry, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const vels = new Float32Array(particleCount * 3);
    const spread = 8;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      vels[i * 3] = (Math.random() - 0.5) * 0.0008;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.0008;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.0008;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities: vels };
  }, [particleCount]);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = geometry.attributes.position.array as Float32Array;
      const bounds = 4;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around boundaries
        for (let j = 0; j < 3; j++) {
          if (positions[i * 3 + j] > bounds) positions[i * 3 + j] = -bounds;
          if (positions[i * 3 + j] < -bounds) positions[i * 3 + j] = bounds;
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
      <color attach="background" args={['#000000']} />
      
      {/* Neutral white lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.15} />
      <directionalLight position={[-5, -3, -5]} intensity={0.12} />
      
      <BlockchainGlobe />
      <OrbitingBlocks blocksRef={blocksRef} />
      <ConnectionLines blocksRef={blocksRef} />
      <GlobeToBlockConnections blocksRef={blocksRef} />
      <AmbientParticles />
    </>
  );
};

// HeroBackgroundScene: Main component with Canvas setup
const HeroBackgroundScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0.2, 4.5], fov: 70 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: 'none',
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroBackgroundScene;
