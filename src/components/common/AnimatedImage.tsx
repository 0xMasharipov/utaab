import { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderClassName?: string;
  containerClassName?: string;
}

const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ placeholderClassName, containerClassName, className, onLoad, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const visible = loaded && inView;

    return (
      <div ref={containerRef} className={cn('relative overflow-hidden', containerClassName)}>
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse rounded-md pointer-events-none transition-opacity duration-500',
            visible ? 'opacity-0' : 'opacity-100',
            placeholderClassName
          )}
        />
        <img
          ref={ref}
          {...props}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          className={cn(
            'transition-all duration-[400ms] ease-out',
            visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.98] translate-y-1',
            className
          )}
        />
      </div>
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

export default AnimatedImage;
