import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoReady = useCallback(() => setVideoReady(true), []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setVideoReady(false);
  }, [isMobile]);

  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] md:min-h-screen overflow-hidden"
      style={{ background: '#061224' }}
    >
      {/* Background Video */}
      <video
        key={isMobile ? 'mobile' : 'desktop'}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/videos/hero-cube-poster.jpg"
        onCanPlay={handleVideoReady}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700"
        style={{ zIndex: 0, opacity: videoReady ? 1 : 0 }}
      >
        <source src={isMobile ? '/videos/hero-mobile.mp4' : '/videos/hero-cube.mp4'} type="video/mp4" />
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
            'radial-gradient(ellipse at 65% 50%, rgba(47,111,181,0.15), transparent 70%)',
            'radial-gradient(ellipse at 20% 40%, rgba(28,63,104,0.2), transparent 60%)',
          ].join(', '),
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade for seamless transition */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 120,
          background: 'linear-gradient(to bottom, transparent, #081624)',
          zIndex: 3,
          pointerEvents: 'none',
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span
              style={{
                color: 'rgba(127,179,255,0.7)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase' as const,
              }}
            >
              {t('hero.tagline')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-montserrat mb-8 text-base md:text-lg lg:text-xl"
            style={{
              fontWeight: 400,
              color: 'rgba(230,238,248,0.72)',
              maxWidth: 520,
            }}
          >
            {t('hero.description')}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={scrollToJoin}
              className="rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                background: 'rgba(11, 60, 109, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '16px 28px',
                fontWeight: 600,
                boxShadow: '0 4px 24px rgba(47,111,181,0.35)',
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'rgba(11, 60, 109, 0.9)';
                btn.style.boxShadow = '0 6px 30px rgba(47,111,181,0.5)';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'rgba(11, 60, 109, 0.75)';
                btn.style.boxShadow = '0 4px 24px rgba(47,111,181,0.35)';
              }}
            >
              {t('hero.joinUs')}
            </button>

            <button
              className="rounded-full font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#B4D2EB',
                padding: '16px 28px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'rgba(255, 255, 255, 0.12)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'rgba(255, 255, 255, 0.06)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              {t('hero.explore')}
            </button>
          </motion.div>
        </div>

        {/* Right column — spacer (video shows through) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};
