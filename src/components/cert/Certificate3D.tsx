import {
  Component,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Group, MathUtils } from 'three';
import { Skeleton } from '@/components/ui/skeleton';
import templateAsset from '@/assets/utaab-certificate-template.png.asset.json';
import { detectWebGL, preloadImage } from '@/lib/web3/webglSupport';

const TEMPLATE_URL = templateAsset.url;
const WATCHDOG_MS = 2500;

type CertMode = 'pending' | 'webgl' | 'fallback';
type FallbackReason =
  | 'webgl-unavailable'
  | 'webgl-software'
  | 'texture-failed'
  | 'render-error'
  | 'context-lost'
  | 'watchdog-timeout';

function logMode(mode: 'webgl' | FallbackReason) {
  if (typeof console !== 'undefined') {
    // single info line per session, helpful for diagnostics
    console.info(`[cert3d] mode=${mode}`);
  }
}

/* ---------- Error boundary around the Canvas ---------- */
class CanvasErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ---------- 3D textured plane ---------- */
function CertificatePlane({ onReady }: { onReady: () => void }) {
  const groupRef = useRef<Group>(null);
  const texture = useTexture(TEMPLATE_URL);

  // Proper sRGB color space
  // @ts-ignore — three's typing for colorSpace varies by version
  texture.colorSpace = (THREE as any).SRGBColorSpace ?? texture.colorSpace;
  texture.anisotropy = 8;

  useEffect(() => {
    onReady();
  }, [onReady]);

  const target = useRef({ x: 0, y: 0 });
  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    target.current.x = MathUtils.lerp(target.current.x, pointer.y * 0.18, 0.08);
    target.current.y = MathUtils.lerp(target.current.y, pointer.x * 0.28, 0.08);
    groupRef.current.rotation.x = target.current.x;
    groupRef.current.rotation.y = target.current.y;
  });

  const w = 1.1;
  const h = 1.555;

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#0b1a33" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

/* ---------- CSS-only tilt fallback (no WebGL) ---------- */
function CertificateTiltFallback() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 14).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div
        ref={ref}
        className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(59,130,246,0.45)] transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={TEMPLATE_URL}
          alt="UTAAB certificate preview"
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
          loading="eager"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.10) 100%)',
          }}
        />
      </div>
    </div>
  );
}

export default function Certificate3D() {
  const [mode, setMode] = useState<CertMode>('pending');
  const watchdogRef = useRef<number | null>(null);
  const loggedRef = useRef(false);

  const goFallback = (reason: FallbackReason) => {
    if (mode === 'fallback') return;
    if (!loggedRef.current) {
      loggedRef.current = true;
      logMode(reason);
    }
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    setMode('fallback');
  };

  const goWebGL = () => {
    if (mode === 'webgl') return;
    if (!loggedRef.current) {
      loggedRef.current = true;
      logMode('webgl');
    }
    setMode('webgl');
  };

  // Decide once on mount.
  useEffect(() => {
    let cancelled = false;
    const support = detectWebGL();

    if (support === 'unavailable') {
      goFallback('webgl-unavailable');
      return;
    }
    if (support === 'software') {
      goFallback('webgl-software');
      return;
    }

    // Pre-validate the texture before mounting Canvas.
    preloadImage(TEMPLATE_URL).then((ok) => {
      if (cancelled) return;
      if (!ok) {
        goFallback('texture-failed');
        return;
      }
      goWebGL();
      // Start watchdog — if Canvas never fires onCreated, fall back.
      watchdogRef.current = window.setTimeout(() => {
        goFallback('watchdog-timeout');
      }, WATCHDOG_MS);
    });

    return () => {
      cancelled = true;
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      role="img"
      aria-label="Interactive 3D UTAAB certificate preview"
      className="relative w-full aspect-[1/1.414] rounded-2xl overflow-hidden"
    >
      {/* Soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -m-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)',
        }}
      />

      {mode === 'pending' && <Skeleton className="absolute inset-4 rounded-xl" />}

      {mode === 'fallback' && <CertificateTiltFallback />}

      {mode === 'webgl' && (
        <CanvasErrorBoundary onError={() => goFallback('render-error')}>
          <Suspense fallback={<Skeleton className="absolute inset-4 rounded-xl" />}>
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 3.4], fov: 32 }}
              gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: true }}
              style={{ background: 'transparent' }}
              frameloop={reduceMotion ? 'demand' : 'always'}
              onCreated={({ gl }) => {
                // Watchdog cleared — context is live.
                if (watchdogRef.current) {
                  clearTimeout(watchdogRef.current);
                  watchdogRef.current = null;
                }
                const dom = gl.domElement;
                const onLost = (e: Event) => {
                  e.preventDefault();
                  goFallback('context-lost');
                };
                dom.addEventListener('webglcontextlost', onLost);
                dom.addEventListener('webglcontextcreationerror', () =>
                  goFallback('context-lost'),
                );
              }}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[3, 4, 5]} intensity={0.8} />
              <directionalLight position={[-4, -2, 3]} intensity={0.3} color="#3b82f6" />
              <Suspense fallback={null}>
                <CertificatePlane
                  onReady={() => {
                    if (watchdogRef.current) {
                      clearTimeout(watchdogRef.current);
                      watchdogRef.current = null;
                    }
                  }}
                />
              </Suspense>
            </Canvas>
          </Suspense>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}
