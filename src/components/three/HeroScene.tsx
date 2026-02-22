import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Logo3D from './Logo3D';
import OrbitNodes from './OrbitNodes';

const cachedDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;

const HeroScene = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
        dpr={cachedDpr}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 4, 3]} intensity={0.8} />
          <directionalLight position={[-3, -2, -4]} intensity={0.3} color="#4a9eff" />

          <Logo3D />
          <OrbitNodes />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
