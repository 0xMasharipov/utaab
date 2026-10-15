import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import FooterASCIIFallback from './FooterASCIIFallback';

const GradientASCII = lazy(() => import('@/components/ui/gradient-ascii'));

export default function FooterASCII() {
  const ref = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [nearby, setNearby] = useState(false);
  const [rendererAvailable, setRendererAvailable] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      const tokens = getComputedStyle(element);
      setPalette(['--footer-ascii-deep', '--footer-ascii-blue', '--footer-ascii-ice', '--footer-ascii-light']
        .map(token => tokens.getPropertyValue(token).trim()));
      setNearby(true);
      observer.disconnect();
    }, { rootMargin: '250px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="footer-ascii" aria-hidden="true">
      {nearby && !rendererAvailable && palette.length > 0 && <FooterASCIIFallback colors={palette} />}
      {nearby && palette.length > 0 && (
        <Suspense fallback={null}>
          <GradientASCII colors={palette} shape="horizon" characters=" =+xX01#@"
            continuousMotion fullHeight onRendererChange={setRendererAvailable}
            cellSize={14} density={0.75} glyphOpacity={0.85} gradientOpacity={0.28}
            glow={0.3} flicker={0.1} flow={0.45} speed={0.7} grain={0.01}
            softness={0.7} dpr={1.25} mouseInteraction clickEffect="wave" />
        </Suspense>
      )}
    </div>
  );
}