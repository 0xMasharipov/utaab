import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Dot-composed globe
const BlockchainGlobe = ({ dotCount = 5000 }: { dotCount?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(dotCount * 3);
    const radius = 1;
    
    for (let i = 0; i < dotCount; i++) {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / dotCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [dotCount]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00F0FF"
        size={0.01}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Orbiting matte blocks
const OrbitingBlocks = ({ blockRefs }: { blockRefs: React.MutableRefObject<THREE.Mesh[]> }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const blockData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      radiusX: 1.6 + Math.random() * 0.4,
      radiusY: 1.4 + Math.random() * 0.4,
      radiusZ: 1.5 + Math.random() * 0.4,
      phaseOffset: (i / 10) * Math.PI * 2,
      tiltX: (Math.random() - 0.5) * 0.5,
      tiltZ: (Math.random() - 0.5) * 0.5,
    }));
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.001 * 60; // Slower orbital motion
    
    blockRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const data = blockData[i];
        const angle = time + data.phaseOffset;
        
        mesh.position.x = Math.cos(angle) * data.radiusX;
        mesh.position.y = Math.sin(angle * 0.7) * data.tiltX + Math.sin(angle) * data.radiusY * 0.3;
        mesh.position.z = Math.sin(angle) * data.radiusZ;
        
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.002;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {blockData.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) blockRefs.current[i] = el;
          }}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#E0E0E0"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Connection lines between blocks (Delaunay-style)
const ConnectionLines = ({ blockRefs }: { blockRefs: React.MutableRefObject<THREE.Mesh[]> }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  // Define connections (triangulated pattern)
  const connections = useMemo(() => {
    const conn: [number, number][] = [];
    // Create a ring connection
    for (let i = 0; i < 10; i++) {
      conn.push([i, (i + 1) % 10]);
    }
    // Add cross connections for triangulation
    conn.push([0, 3], [0, 7], [2, 5], [2, 8], [4, 7], [4, 9], [6, 9], [1, 6], [3, 8], [5, 0]);
    return conn;
  }, []);

  useFrame(() => {
    if (lineRef.current && blockRefs.current.length === 10) {
      const positions = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      let idx = 0;
      
      connections.forEach(([a, b]) => {
        const meshA = blockRefs.current[a];
        const meshB = blockRefs.current[b];
        
        if (meshA && meshB) {
          positions.setXYZ(idx++, meshA.position.x, meshA.position.y, meshA.position.z);
          positions.setXYZ(idx++, meshB.position.x, meshB.position.y, meshB.position.z);
        }
      });
      
      positions.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(connections.length * 2 * 3), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="white"
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </lineSegments>
  );
};

// Ambient drifting particles
const AmbientParticles = ({ count = 150 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute in a large cube around the scene
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      
      // Random slow drift direction
      vel[i * 3] = (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      
      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i) + velocities[i * 3];
        let y = posAttr.getY(i) + velocities[i * 3 + 1];
        let z = posAttr.getZ(i) + velocities[i * 3 + 2];
        
        // Wrap around if too far
        if (Math.abs(x) > 4) x *= -0.9;
        if (Math.abs(y) > 3) y *= -0.9;
        if (Math.abs(z) > 3) z *= -0.9;
        
        posAttr.setXYZ(i, x, y, z);
      }
      
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="white"
        size={0.008}
        transparent
        opacity={0.1}
        sizeAttenuation
      />
    </points>
  );
};

// Main scene
const Scene = () => {
  const blockRefs = useRef<THREE.Mesh[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particleCount = isMobile ? 75 : 150;
  const globeDotCount = isMobile ? 2500 : 5000;

  return (
    <>
      {/* Minimal white lighting with rim light for depth */}
      <ambientLight color="white" intensity={0.5} />
      <directionalLight color="white" intensity={0.2} position={[5, 3, 5]} />
      <directionalLight color="white" intensity={0.15} position={[-5, -3, -5]} />
      
      {/* Scene elements */}
      <BlockchainGlobe dotCount={globeDotCount} />
      <OrbitingBlocks blockRefs={blockRefs} />
      <ConnectionLines blockRefs={blockRefs} />
      <AmbientParticles count={particleCount} />
    </>
  );
};

// Exported component
export const HeroBackgroundScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`absolute inset-0 -z-10 transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 75, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        style={{ background: '#000000' }}
        gl={{ antialias: true, alpha: false }}
        onCreated={() => setIsLoaded(true)}
      >
        <color attach="background" args={['#000000']} />
        <Scene />
      </Canvas>
    </div>
  );
};
