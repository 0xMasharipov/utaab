import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderClassName?: string;
  containerClassName?: string;
}

const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ placeholderClassName, containerClassName, className, onLoad, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse rounded-md pointer-events-none transition-opacity duration-500',
            loaded ? 'opacity-0' : 'opacity-100',
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
            'transition-all duration-500 ease-out',
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
        />
      </div>
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

export default AnimatedImage;
