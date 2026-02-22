import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, Vector3, AdditiveBlending } from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface RingConfig {
  radius: number;
  speed: number;
  nodeCount: number;
  mobileNodeCount: number;
  tiltX: number;
}

const rings: RingConfig[] = [
  { radius: 2.5, speed: 0.15, nodeCount: 5, mobileNodeCount: 3, tiltX: 0 },
  { radius: 3.5, speed: -0.10, nodeCount: 6, mobileNodeCount: 3, tiltX: 0 },
  { radius: 4.5, speed: 0.08, nodeCount: 4, mobileNodeCount: 2, tiltX: Math.PI / 9 },
];

const OrbitRing = ({ config, isMobile }: { config: RingConfig; isMobile: boolean }) => {
  const groupRef = useRef<Group>(null);
  const count = isMobile ? config.mobileNodeCount : config.nodeCount;

  const offsets = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.3,
      yOff: (Math.random() - 0.5) * 0.4,
    })),
  [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * config.speed;
    }
  });

  return (
    <group ref={groupRef} rotation={[config.tiltX, 0, 0]}>
      {offsets.map((o, i) => {
        const x = Math.cos(o.angle) * config.radius;
        const z = Math.sin(o.angle) * config.radius;
        return (
          <group key={i} position={[x, o.yOff, z]}>
            {/* Glow shell */}
            <mesh>
              <boxGeometry args={[0.22, 0.22, 0.22]} />
              <meshBasicMaterial
                color="#6baeff"
                transparent
                opacity={0.12}
                blending={AdditiveBlending}
              />
            </mesh>
            {/* Block node */}
            <RoundedBox args={[0.14, 0.14, 0.14]} radius={0.02} smoothness={2}>
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.6}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.1}
                ior={1.4}
                thickness={0.1}
              />
            </RoundedBox>
          </group>
        );
      })}
    </group>
  );
};

const OrbitNodes = () => {
  const isMobile = useIsMobile();

  return (
    <group>
      {rings.map((config, i) => (
        <OrbitRing key={i} config={config} isMobile={isMobile} />
      ))}
    </group>
  );
};

export default OrbitNodes;
