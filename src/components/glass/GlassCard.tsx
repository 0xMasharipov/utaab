import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          variant === 'default' && 'bg-white/[0.06] backdrop-blur-xl border-white/[0.12] shadow-lg',
          variant === 'strong' && 'bg-white/[0.10] backdrop-blur-2xl border-white/[0.18] shadow-xl',
          variant === 'subtle' && 'bg-white/[0.04] backdrop-blur-lg border-white/[0.08] shadow-md',
          hover && 'hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(213_94%_68%/0.15)] hover:border-white/20',
          glow && 'hover:shadow-[0_0_40px_hsl(213_94%_68%/0.2)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
