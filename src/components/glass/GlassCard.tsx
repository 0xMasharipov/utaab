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
          'rounded-2xl border transition-all duration-300 relative overflow-hidden',
          variant === 'default' && 'bg-white/[0.06] backdrop-blur-xl border-white/[0.12] shadow-lg',
          variant === 'strong' && 'bg-white/[0.10] backdrop-blur-2xl border-white/[0.18] shadow-xl',
          variant === 'subtle' && 'bg-white/[0.04] backdrop-blur-lg border-white/[0.08] shadow-md',
          hover && 'hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(213_94%_68%/0.15)] hover:border-white/20',
          glow && 'hover:shadow-[0_0_40px_hsl(213_94%_68%/0.2)]',
          className
        )}
        {...props}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-55 md:opacity-55 max-md:opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            backgroundPosition: 'center',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.85) 100%)',
          }}
        />
        {/* Content */}
        <div className="relative z-[2]">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
