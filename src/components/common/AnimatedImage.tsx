import { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderClassName?: string;
  containerClassName?: string;
}

const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ placeholderClassName, containerClassName, className, onLoad, loading, decoding, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    return (
      <div ref={containerRef} className={cn('relative overflow-hidden', containerClassName)}>
        <div
          className={cn(
            'absolute inset-0 bg-muted/40 animate-pulse rounded-md pointer-events-none transition-opacity duration-300',
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
          className={cn(
            'transition-all duration-[250ms] ease-out',
            visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.99] translate-y-0.5',
            className
          )}
        />
      </div>
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

export default AnimatedImage;
