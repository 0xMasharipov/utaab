import { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderClassName?: string;
  containerClassName?: string;
}

const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ placeholderClassName, containerClassName, className, onLoad, loading, decoding, style, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);
    // Eager images skip the viewport gate so their fade-in isn't held back
    // by the IntersectionObserver callback.
    const [inView, setInView] = useState(loading === 'eager');
    const [reducedMotion, setReducedMotion] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
      // Respect user accessibility preference — skip blur/scale/translate for reduced-motion users.
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mql.matches);
      const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      // Mobile gets a tighter margin to save cellular bandwidth — scroll
      // velocity per-pixel is lower so a smaller lookahead still feels smooth.
      const isMobileVp = typeof window !== 'undefined'
        && window.matchMedia('(max-width: 767px)').matches;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        // Larger rootMargin starts loading earlier so images are decoded before
        // they enter the viewport — eliminates the "static pop-in" effect.
        { rootMargin: isMobileVp ? '150px' : '300px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const visible = loaded && inView;

    // "Blur-up" technique — image develops into view like a Polaroid.
    // Premium ease-out-expo curve for a graceful settle.
    const imgStyle: React.CSSProperties = {
      transitionProperty: reducedMotion ? 'opacity' : 'opacity, filter, transform',
      transitionDuration: reducedMotion ? '300ms' : '600ms',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: visible ? 1 : 0,
      filter: visible || reducedMotion ? 'blur(0px)' : 'blur(8px)',
      transform: visible || reducedMotion ? 'scale(1)' : 'scale(0.97)',
      willChange: visible ? 'auto' : 'opacity, filter, transform',
      ...style,
    };

    return (
      <div ref={containerRef} className={cn('relative overflow-hidden', containerClassName)}>
        <div
          className={cn(
            'absolute inset-0 bg-muted/40 animate-pulse rounded-md pointer-events-none transition-opacity duration-[400ms] ease-out',
            visible ? 'opacity-0' : 'opacity-100',
            placeholderClassName
          )}
        />
        <img
          ref={ref}
          {...props}
          loading={loading ?? 'lazy'}
          decoding={decoding ?? 'async'}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          style={imgStyle}
          className={className}
        />
      </div>
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

export default AnimatedImage;
