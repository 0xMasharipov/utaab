import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassSectionWrapperProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div';
}

const GlassSectionWrapper = forwardRef<HTMLElement, GlassSectionWrapperProps>(
  ({ className, as: Component = 'section', children, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          'relative py-16 sm:py-20 md:py-24',
          className
        )}
        {...props}
      >
        <div className="section-container relative z-10">
          {children}
        </div>
      </Component>
    );
  }
);

GlassSectionWrapper.displayName = 'GlassSectionWrapper';
export default GlassSectionWrapper;
