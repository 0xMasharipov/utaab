import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedImage from '@/components/common/AnimatedImage';

export interface ProfileCardProps {
  avatarUrl?: string;
  name: string;
  title: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  className?: string;
  onContactClick?: () => void;
  onClick?: () => void;
}

const ProfileCard = ({
  avatarUrl,
  name,
  title,
  handle,
  status,
  contactText = 'Contact',
  showUserInfo = true,
  className,
  onContactClick,
  onClick,
}: ProfileCardProps) => (
    <div className={cn('relative', className)}>
      <div
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        aria-label={onClick ? name : undefined}
        className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[28px] border border-white/[0.10] shadow-xl transition-colors duration-200 motion-safe:hover:border-white/25"
        style={{
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
            className="h-full w-full object-cover"
            containerClassName="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10">
            <User className="h-20 w-20 text-muted-foreground/50" />
          </div>
        )}

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

export default ProfileCard;
