import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavArrowRight } from 'iconoir-react';

export const Hero = () => {
  const { t } = useTranslation();
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoReady = useCallback(() => setVideoReady(true), []);

  useEffect(() => {
    const mqlMobile = window.matchMedia('(max-width: 767px)');
    const mqlTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const getDevice = () => {
      if (mqlMobile.matches) return 'mobile';
      if (mqlTablet.matches) return 'tablet';
      return 'desktop';
    };
    setDeviceType(getDevice());
    const onChange = () => setDeviceType(getDevice());
    mqlMobile.addEventListener('change', onChange);
    mqlTablet.addEventListener('change', onChange);
    return () => {
      mqlMobile.removeEventListener('change', onChange);
      mqlTablet.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    setVideoReady(false);
  }, [deviceType]);

  const isMobile = deviceType === 'mobile';
  const videoSrc = deviceType === 'mobile'
    ? '/videos/hero-mobile.mp4'
    : deviceType === 'tablet'
      ? '/videos/hero-tablet.mp4'
      : '/videos/hero-cube.mp4';

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
      {/* Background Video */}
      <video
        key={deviceType}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
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
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
            className="font-montserrat mb-3 text-base md:text-lg lg:text-xl"
            style={{
              fontWeight: 400,
              color: 'rgba(230,238,248,0.72)',
              maxWidth: 520,
            }}
          >
            {t('hero.description')}
          </motion.p>

          {/* Supporting line */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-montserrat mb-8 text-sm md:text-base"
            style={{
              fontWeight: 600,
              color: 'rgba(200,220,255,0.65)',
              maxWidth: 480,
            }}
          >
            {t('hero.supportingLine')}
          </motion.p>

          {/* Buttons — Explore Projects (primary) then Join the Movement (outline) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
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
          </motion.div>
        </div>

        {/* Right column — spacer (video shows through) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};
