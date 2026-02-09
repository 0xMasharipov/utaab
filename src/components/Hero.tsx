import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { lazy, Suspense, useState, useEffect } from 'react';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the 3D scene for better performance - deferred until after initial paint
const HeroBackgroundScene = lazy(() => import('@/components/three/HeroBackgroundScene'));
import MobileHeroBackground from '@/components/three/MobileHeroBackground';

// Hook to defer loading heavy components until after initial render
const useDeferredLoad = (delay = 100) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    // Wait for the page to be fully interactive before loading heavy 3D scene
    // This ensures TTI is not blocked by Three.js initialization
    const loadAfterInteractive = () => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
        return () => window.cancelIdleCallback(id);
      } else {
        const timer = setTimeout(() => setShouldLoad(true), delay);
        return () => clearTimeout(timer);
      }
    };
    
    // Defer loading until after the page has finished initial parsing and layout
    if (document.readyState === 'complete') {
      return loadAfterInteractive();
    } else {
      const handleLoad = () => loadAfterInteractive();
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [delay]);
  
  return shouldLoad;
};

export const Hero = () => {
  const { t } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();
  const isMobile = useIsMobile();
  // Skip Three.js on mobile to save ~215KB and improve TTI
  const shouldLoadScene = useDeferredLoad(500) && !isMobile;

  const scrollToJoin = () => {
    const element = document.getElementById('join');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Per-letter animation for "Join our community"
  const subtitleWords = t('hero.subtitle').split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 3D Blockchain Background - deferred loading */}
      {shouldLoadScene && (
        <Suspense fallback={
          <div className="absolute inset-0 bg-black" />
        }>
          <HeroBackgroundScene />
        </Suspense>
      )}
      {!shouldLoadScene && <MobileHeroBackground />}

      {/* Content overlay */}
      <div className="section-container relative z-10 text-center py-24 sm:py-28 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={getTransitionClasses("text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-glow-hero leading-tight px-2")}>
            {t('hero.title')}
          </h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={getTransitionClasses("text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold mb-6 sm:mb-8 text-accent text-glow-accent px-2")}
        >
          {subtitleWords.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-3">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={`${wordIndex}-${charIndex}`}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={getTransitionClasses("text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-glow-muted max-w-3xl mx-auto mb-8 sm:mb-12 px-4")}
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button onClick={scrollToJoin} className={getTransitionClasses("btn-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group min-h-[44px]")}>
            {t('hero.cta')}
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
