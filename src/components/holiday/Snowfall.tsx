import { useMemo, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Snowflake {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  isBackground: boolean;
  driftAmount: number;
}

export const Snowfall = () => {
  const isMobile = useIsMobile();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const particleCount = isMobile ? 60 : 120;

  const snowflakes = useMemo<Snowflake[]>(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 7,
      opacity: 0.3 + Math.random() * 0.3,
      isBackground: Math.random() > 0.3,
      driftAmount: 15 + Math.random() * 15,
    })),
  [particleCount]);

  if (prefersReducedMotion) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white snowflake"
          style={{
            width: flake.size,
            height: flake.size,
            left: `${flake.left}%`,
            top: -10,
            opacity: flake.opacity,
            filter: flake.isBackground ? 'none' : 'blur(0.5px)',
            animationName: 'snowfall',
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            '--drift-amount': `${flake.driftAmount}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
