import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Group, MathUtils } from 'three';
import { Skeleton } from '@/components/ui/skeleton';
import templateAsset from '@/assets/utaab-certificate-template.png.asset.json';

function CertificateMesh() {
  const groupRef = useRef<Group>(null);
  const texture = useTexture(templateAsset.url);
  // Ensure proper color reproduction
  // @ts-ignore — three's typing for colorSpace varies by version
  texture.colorSpace = THREE.SRGBColorSpace ?? texture.colorSpace;
  texture.anisotropy = 8;

  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    target.current.x = MathUtils.lerp(target.current.x, pointer.y * 0.18, 0.08);
    target.current.y = MathUtils.lerp(target.current.y, pointer.x * 0.28, 0.08);
    groupRef.current.rotation.x = target.current.x;
    groupRef.current.rotation.y = target.current.y;
  });

  // A4 portrait ratio ~ 1 : 1.414
  const w = 1.3;
  const h = 1.84;
  const d = 0.04;

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={groupRef}>
        <RoundedBox args={[w, h, d]} radius={0.04} smoothness={4} castShadow receiveShadow>
          {/* Order matches BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back) */}
          <meshPhysicalMaterial attach="material-0" color="#0b1a33" metalness={0.6} roughness={0.4} />
          <meshPhysicalMaterial attach="material-1" color="#0b1a33" metalness={0.6} roughness={0.4} />
          <meshPhysicalMaterial attach="material-2" color="#0b1a33" metalness={0.6} roughness={0.4} />
          <meshPhysicalMaterial attach="material-3" color="#0b1a33" metalness={0.6} roughness={0.4} />
          <meshPhysicalMaterial
            attach="material-4"
            map={texture}
            metalness={0.25}
            roughness={0.35}
            clearcoat={0.7}
            clearcoatRoughness={0.2}
          />
          <meshPhysicalMaterial attach="material-5" color="#0a1428" metalness={0.5} roughness={0.55} />
        </RoundedBox>
      </group>
    </Float>
  );
}

export default function Certificate3D() {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      role="img"
      aria-label="Interactive 3D UTAAB certificate preview"
      className="relative w-full aspect-[1/1.414] rounded-2xl overflow-hidden"
    >
      {/* Soft radial glow behind canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -m-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)',
        }}
      />
      <Suspense fallback={<Skeleton className="absolute inset-0" />}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 2.8], fov: 32 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          frameloop={reduceMotion ? 'demand' : 'always'}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#3b82f6" />
          <Suspense fallback={null}>
            <CertificateMesh />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}
