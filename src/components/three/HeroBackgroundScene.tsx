import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Vector2, Color, Mesh, DoubleSide } from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRippleRadius;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calculate distance from mouse (convert mouse from -1,1 to 0,1 space)
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float dist = distance(uv, mouseUv);
    
    // Ambient wave + Ripple wave effect
    float ambient = sin(uv.x * 6.0 + uTime * 0.8) * cos(uv.y * 5.0 + uTime * 0.6) * 0.015;
    float ripple = sin(dist * 25.0 - uTime * 3.0) * exp(-dist / uRippleRadius) * 0.08;
    pos.z += ambient;
    pos.z += ripple;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uGridColor;
  uniform float uGridSize;
  uniform vec2 uMouse;
  uniform float uRippleRadius;
  uniform float uTime;

  void main() {
    // Create grid pattern
    vec2 gridUv = fract(vUv * uGridSize);
    vec2 gridCenter = vec2(0.5);
    
    // Distance from grid cell center (creates dots)
    float dot = distance(gridUv, gridCenter);
    
    // Mouse influence for size/opacity variation
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float dist = distance(vUv, mouseUv);
    float mouseInfluence = smoothstep(uRippleRadius, 0.0, dist);
    
    // Dot size with mouse influence
    float dotSize = 0.1 + mouseInfluence * 0.06;
    float dotMask = smoothstep(dotSize, dotSize - 0.03, dot);
    
    // Add subtle glow
    float glow = smoothstep(dotSize + 0.1, dotSize, dot) * 0.3;
    
    // Apply color with varying opacity
    float opacity = (dotMask + glow) * (0.3 + mouseInfluence * 0.7);
    
    gl_FragColor = vec4(uGridColor, opacity);
  }
`;

interface RippleGridProps {
  mousePos: React.RefObject<Vector2>;
}

const RippleGrid = ({ mousePos }: RippleGridProps) => {
  const meshRef = useRef<Mesh>(null);
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new Vector2(0, 0) },
    uResolution: { value: new Vector2(size.width, size.height) },
    uGridColor: { value: new Color('#3b82f6') },
    uRippleRadius: { value: 0.8 },
    uGridSize: { value: 40.0 },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (mousePos.current) {
      uniforms.uMouse.value.lerp(mousePos.current, 0.03);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[4, 4, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
      />
    </mesh>
  );
};

const Scene = ({ mousePos }: RippleGridProps) => {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <RippleGrid mousePos={mousePos} />
    </>
  );
};

// Cache DPR to avoid forced reflow during render
const cachedDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

const HeroBackgroundScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const mousePos = useRef(new Vector2(0, 0));
  const containerRef = useRef<HTMLDivElement>(null);
  // Cache window dimensions to avoid forced reflows on every pointer move
  const windowSize = useRef({ width: 1, height: 1 });
  const rafId = useRef<number>(0);

  // Update cached window size only when necessary
  useEffect(() => {
    const updateSize = () => {
      windowSize.current.width = window.innerWidth || 1;
      windowSize.current.height = window.innerHeight || 1;
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    // Cancel any pending RAF to avoid stacking
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    // Batch the update in the next animation frame to avoid forced reflows
    rafId.current = requestAnimationFrame(() => {
      mousePos.current.set(
        (event.clientX / windowSize.current.width) * 2 - 1,
        -(event.clientY / windowSize.current.height) * 2 + 1
      );
    });
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handlePointerMove]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: 'none'
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 2],
          fov: 50,
          near: 0.1,
          far: 100
        }}
        dpr={cachedDpr}
        gl={{ 
          antialias: true,
          alpha: true
        }}
        onCreated={() => setIsLoaded(true)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene mousePos={mousePos} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroBackgroundScene;
