import { useCallback, useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedImage from '@/components/common/AnimatedImage';
import utaabMark from '@/assets/utaab-logo-diamond.png';

export interface ProfileCardProps {
  avatarUrl?: string;
  name: string;
  title: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: number;
  className?: string;
  onContactClick?: () => void;
  onClick?: () => void;
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

const ProfileCard = ({
  avatarUrl,
  name,
  title,
  handle,
  status,
  contactText = 'Contact',
  showUserInfo = true,
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  behindGlowEnabled = true,
  behindGlowColor = 'hsl(217 91% 60% / 0.45)',
  behindGlowSize = 320,
  className,
  onContactClick,
  onClick,
}: ProfileCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  useEffect(() => {
    if (!enableTilt) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    setTiltEnabled(!reduced && (!coarse || enableMobileTilt));
  }, [enableTilt, enableMobileTilt]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el || !tiltEnabled) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const sensitivity = e.pointerType === 'touch' ? mobileTiltSensitivity : 10;
      el.style.setProperty('--px', `${px * 100}%`);
      el.style.setProperty('--py', `${py * 100}%`);
      el.style.setProperty('--rx', `${(0.5 - py) * sensitivity}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * sensitivity}deg`);
    },
    [tiltEnabled, mobileTiltSensitivity],
  );

  const resetTilt = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--px', '50%');
    el.style.setProperty('--py', '50%');
  }, []);

  return (
    <div className={cn('relative', className)} style={{ perspective: '1000px' }}>
      {/* Behind glow */}
      {behindGlowEnabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-60"
          style={{
            width: behindGlowSize,
            height: behindGlowSize,
            background: `radial-gradient(circle, ${behindGlowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        aria-label={onClick ? name : undefined}
        className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[28px] border border-white/[0.10] shadow-xl transition-[transform,border-color] duration-200 ease-out will-change-transform motion-safe:hover:border-white/25"
        style={{
          transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
          transformStyle: 'preserve-3d',
          background:
            'linear-gradient(160deg, hsl(217 60% 18% / 0.9) 0%, hsl(222 47% 9% / 0.95) 55%, hsl(220 60% 14% / 0.9) 100%)',
        }}
      >
        {/* Avatar */}
        {avatarUrl ? (
          <AnimatedImage
            src={avatarUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
            containerClassName="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10">
            <User className="h-20 w-20 text-muted-foreground/50" />
          </div>
        )}

        {/* Holographic sheen following the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-70"
          style={{
            background:
              'radial-gradient(circle at var(--px, 50%) var(--py, 50%), hsl(199 89% 60% / 0.45) 0%, hsl(217 91% 60% / 0.28) 30%, transparent 60%)',
          }}
        />
        {/* Glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-25 mix-blend-overlay"
          style={{
            background:
              'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 48%, transparent 62%)',
          }}
        />
        {/* Grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.10] mix-blend-soft-light"
          style={{ backgroundImage: GRAIN, backgroundSize: '140px 140px' }}
        />

        {/* Holographic grainy UTAAB corner mark (top-left) */}
        <div aria-hidden className="pointer-events-none absolute left-4 top-4 z-20 h-9 w-9">
          <img
            src={utaabMark}
            alt=""
            className="h-full w-full object-contain opacity-40"
            style={{ filter: 'saturate(1.6) drop-shadow(0 0 6px hsl(199 89% 60% / 0.55))' }}
          />
          <div
            className="absolute inset-0 opacity-60 mix-blend-color-dodge"
            style={{
              background:
                'linear-gradient(135deg, hsl(199 89% 60% / 0.6), hsl(217 91% 60% / 0.35), hsl(190 90% 70% / 0.5))',
              WebkitMaskImage: `url(${utaabMark})`,
              maskImage: `url(${utaabMark})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: GRAIN,
              backgroundSize: '60px 60px',
              WebkitMaskImage: `url(${utaabMark})`,
              maskImage: `url(${utaabMark})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
        </div>

        {/* Bottom scrim */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to top, rgba(3,7,18,0.88) 0%, rgba(3,7,18,0.35) 38%, transparent 68%)',
          }}
        />

        {/* Info */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#93C5FD]">
            {status}
          </p>
          <h3
            className="text-[18px] font-bold leading-tight text-[#F8FAFC] sm:text-[20px]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {name}
          </h3>
          <p className="text-[13px] font-semibold" style={{ color: '#93C5FD' }}>
            {title}
          </p>

          {showUserInfo && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/15 p-2 pl-3 backdrop-blur-md"
              style={{ background: 'rgba(10,18,40,0.55)' }}
            >
              <span className="truncate text-[12px] text-slate-300/80">{handle}</span>
              {onContactClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick();
                  }}
                  className="shrink-0 rounded-xl border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[12px] font-semibold text-slate-100 transition-colors hover:border-primary/40 hover:bg-white/[0.16]"
                >
                  {contactText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
