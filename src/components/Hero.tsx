import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavArrowRight } from 'iconoir-react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const detectDevice = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches) return 'tablet';
  return 'desktop';
};

export const Hero = () => {
  const { t } = useTranslation();
  // Synchronous initializer — no wrong-source first render, no wasted download.
  const [deviceType, setDeviceType] = useState<DeviceType>(() => detectDevice());
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoReady = useCallback(() => setVideoReady(true), []);

  useEffect(() => {
    const mqlMobile = window.matchMedia('(max-width: 767px)');
    const mqlTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const onChange = () => setDeviceType(detectDevice());
    mqlMobile.addEventListener('change', onChange);
    mqlTablet.addEventListener('change', onChange);
    return () => {
      mqlMobile.removeEventListener('change', onChange);
      mqlTablet.removeEventListener('change', onChange);
    };
  }, []);

  const isMobile = deviceType === 'mobile';
  const videoSrc = deviceType === 'mobile'
    ? '/videos/hero-mobile.mp4'
    : deviceType === 'tablet'
      ? '/videos/hero-tablet.mp4'
      : '/videos/hero-cube.mp4';

  // Swap source without remounting the <video> element when the viewport class changes.
  useEffect(() => {
    setVideoReady(false);
    const v = videoRef.current;
    if (v) {
      try { v.load(); } catch {}
    }
  }, [videoSrc]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] md:min-h-screen overflow-hidden"
      style={{ background: '#061224' }}
    >
      {/* Crossfade base layer — animated gradient that smoothly hands off to video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          zIndex: 0,
          opacity: videoReady ? 0 : 1,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(28,63,104,0.55), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(47,111,181,0.35), transparent 65%), #061224',
        }}
      />

      {/* Background Video — preloaded via <link rel="preload"> in index.html so the
          file is already cached by the time this element mounts. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // @ts-ignore — fetchpriority is valid HTML, not yet in React types
        fetchpriority="high"
        controls={false}
        onCanPlay={handleVideoReady}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        // @ts-ignore
        x-webkit-airplay="deny"
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 hero-video-no-controls"
        style={{ zIndex: 0, opacity: videoReady ? 1 : 0 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark navy gradient overlay — responsive */}
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? 'linear-gradient(180deg, rgba(6,18,36,0.92) 0%, rgba(6,18,36,0.75) 60%, rgba(6,18,36,0.5) 100%)'
            : 'linear-gradient(90deg, rgba(6,18,36,0.92) 0%, rgba(6,18,36,0.80) 35%, rgba(6,18,36,0.45) 65%, rgba(6,18,36,0) 100%)',
          zIndex: 1,
        }}
      />

      {/* Atmospheric glow layer */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse at 65% 50%, rgba(47,111,181,0.08), transparent 70%)',
            'radial-gradient(ellipse at 20% 40%, rgba(28,63,104,0.12), transparent 60%)',
          ].join(', '),
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Quiet handoff into the page background. Keeping this inside the hero
          preserves its full viewport height while removing any visible seam. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-[clamp(180px,20vh,220px)] pointer-events-none"
        style={{
          zIndex: 3,
          background:
            'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.38) 42%, hsl(var(--background) / 0.88) 76%, hsl(var(--background)) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-center"
        style={{
          maxWidth: 1400,
          paddingTop: isMobile ? 80 : 120,
          paddingBottom: isMobile ? 60 : 120,
        }}
      >
        {/* Left column — text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Tagline */}
          <div className="mb-6 hero-fade-in" style={{ animationDelay: '0s' }}>
            <span
              style={{
                color: 'rgba(127,179,255,0.7)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase' as const,
              }}
            >
              
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-montserrat leading-tight mb-4 md:mb-6"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              lineHeight: 1.1,
              color: '#F3F7FB',
            }}
          >
            {t('hero.headline')}{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7FB3FF 0%, #4F8FE8 45%, #A9CFFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('hero.headlineHighlight')}
            </span>
          </h1>

          {/* Description */}
          <p
            className="font-montserrat mb-3 text-base md:text-lg lg:text-xl hero-fade-in"
            style={{
              fontWeight: 400,
              color: 'rgba(230,238,248,0.72)',
              maxWidth: 520,
              animationDelay: '0.25s',
            }}
          >
            {t('hero.description')}
          </p>

          {/* Supporting line */}
          <p
            className="font-montserrat mb-8 text-sm md:text-base hero-fade-in"
            style={{
              fontWeight: 600,
              color: 'rgba(200,220,255,0.65)',
              maxWidth: 480,
              animationDelay: '0.35s',
            }}
          >
            {t('hero.supportingLine')}
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto hero-fade-in"
            style={{ animationDelay: '0.45s' }}
          >
            <button
              onClick={scrollToProjects}
              className="hero-btn-primary group/btn rounded-full text-white text-[15px] tracking-wide transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {t('hero.explore')}
              <NavArrowRight width={16} height={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" strokeWidth={1.5} />
            </button>

            <button
              onClick={scrollToJoin}
              className="hero-btn-outline group rounded-full text-[15px] tracking-wide transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {t('hero.joinUs')}
              <NavArrowRight width={16} height={16} className="transition-transform duration-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Right column — spacer (video shows through) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};
