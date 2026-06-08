import { useEffect, useRef, useState } from 'react';
import templateAsset from '@/assets/utaab-certificate-template.png.asset.json';

const TEMPLATE_URL = templateAsset.url;

/**
 * Non-WebGL certificate preview.
 * Uses a static <img> with a CSS pointer-driven tilt and a soft blue glow.
 * No Canvas, no three.js, no Suspense traps — cannot crash on GPU/driver issues.
 */
export default function Certificate3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
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
        el.style.transform = `perspective(1200px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg)`;
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
  }, []);

  return (
    <div
      role="img"
      aria-label="UTAAB certificate preview"
      className="relative w-full aspect-[1/1.414] rounded-2xl overflow-visible"
    >
      {/* Soft radial blue glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -m-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div
          ref={ref}
          className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(59,130,246,0.45)] transition-transform duration-200 ease-out"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <img
            src={TEMPLATE_URL}
            alt="UTAAB certificate"
            className="w-full h-full object-contain select-none pointer-events-none bg-[#0b1a33] transition-opacity duration-700 ease-out"
            style={{ opacity: loaded ? 1 : 0 }}
            draggable={false}
            loading="eager"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.10) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
