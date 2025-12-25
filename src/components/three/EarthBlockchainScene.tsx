import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Glass Earth Sphere with transmission material
const GlassEarth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhysicalMaterial
        transmission={1}
        roughness={0.05}
        thickness={0.5}
        ior={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        color="#4a9eff"
        envMapIntensity={1}
      />
    </mesh>
  );
};

// Atmospheric glow around Earth
const AtmosphericGlow = () => {
  return (
    <mesh>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial
        color="#00bfff"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

// Orbiting blocks ring
const OrbitingBlocks = ({ blockRefs }: { blockRefs: React.MutableRefObject<THREE.Mesh[]> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const numBlocks = 14;
  
  const blocksData = useMemo(() => {
    return Array.from({ length: numBlocks }, (_, i) => ({
      angle: (i / numBlocks) * Math.PI * 2,
      radius: 3,
      yOffset: (Math.random() - 0.5) * 0.6,
      rotationSpeed: 0.3 + Math.random() * 0.2,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
    
    // Update individual block positions for line connections
    blocksData.forEach((block, i) => {
      const angle = block.angle + state.clock.elapsedTime * 0.3;
      const x = Math.cos(angle) * block.radius;
      const z = Math.sin(angle) * block.radius;
      
      if (blockRefs.current[i]) {
        blockRefs.current[i].position.set(x, block.yOffset, z);
        blockRefs.current[i].rotation.x += 0.01;
        blockRefs.current[i].rotation.y += 0.015;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {blocksData.map((block, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) blockRefs.current[i] = el;
          }}
          position={[
            Math.cos(block.angle) * block.radius,
            block.yOffset,
            Math.sin(block.angle) * block.radius,
          ]}
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshPhysicalMaterial
            transmission={0.8}
            roughness={0.1}
            thickness={0.3}
            ior={1.4}
            clearcoat={1}
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
};

// Dynamic line connections between blocks
const BlockConnections = ({ blockRefs }: { blockRefs: React.MutableRefObject<THREE.Mesh[]> }) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const { positions, indices } = useMemo(() => {
    const numBlocks = 14;
    const pos = new Float32Array(numBlocks * 3);
    const idx: number[] = [];
    
    // Connect i -> i+1 (ring)
    for (let i = 0; i < numBlocks; i++) {
      idx.push(i, (i + 1) % numBlocks);
    }
    
    // Connect i -> i+3 (cross connections)
    for (let i = 0; i < numBlocks; i++) {
      idx.push(i, (i + 3) % numBlocks);
    }
    
    return { positions: pos, indices: new Uint16Array(idx) };
  }, []);

  useFrame(() => {
    if (linesRef.current && blockRefs.current.length > 0) {
      const posAttr = linesRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;
      
      blockRefs.current.forEach((block, i) => {
        if (block) {
          const worldPos = new THREE.Vector3();
          block.getWorldPosition(worldPos);
          posArray[i * 3] = worldPos.x;
          posArray[i * 3 + 1] = worldPos.y;
          posArray[i * 3 + 2] = worldPos.z;
        }
      });
      
      posAttr.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={14}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          count={indices.length}
          array={indices}
          itemSize={1}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </lineSegments>
  );
};

// White particle starfield
const StarfieldParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, sizes } = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 15 + Math.random() * 35;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      sz[i] = Math.random() * 1.5 + 0.5;
    }
    
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
      pointsRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={2}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Camera controller with mouse parallax
const CameraController = () => {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useFrame((state) => {
    const targetX = mouseRef.current.x * 2;
    const targetY = mouseRef.current.y * 2;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  // Mouse event listener
  useMemo(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
};

// Main scene component
const Scene = () => {
  const blockRefs = useRef<THREE.Mesh[]>([]);

  return (
    <>
      <CameraController />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00bfff" />
      
      {/* Additional drei Stars for depth */}
      <Stars radius={50} depth={50} count={500} factor={2} saturation={0} fade speed={0.5} />
      
      {/* Custom starfield */}
      <StarfieldParticles />
      
      {/* Earth and atmosphere */}
      <GlassEarth />
      <AtmosphericGlow />
      
      {/* Orbiting blocks and connections */}
      <OrbitingBlocks blockRefs={blockRefs} />
      <BlockConnections blockRefs={blockRefs} />
    </>
  );
};

// Exported component with Canvas
export const EarthBlockchainScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 20, 60]} />
        <Scene />
      </Canvas>
    </div>
  );
};
