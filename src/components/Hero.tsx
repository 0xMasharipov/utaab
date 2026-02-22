import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));

export const Hero = () => {
  const { t } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();

  const scrollToJoin = () => {
    const element = document.getElementById('join');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const subtitleWords = t('hero.subtitle').split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 75% 50%, #1e3a8a 0%, transparent 60%),
          radial-gradient(ellipse at 30% 30%, #0f2557 0%, transparent 50%),
          linear-gradient(135deg, #060e1f 0%, #0a1628 40%, #0d1f3c 100%)
        `,
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.5)',
      }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* 3D Scene */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Content overlay */}
      <div className="section-container relative z-10 text-center py-20 sm:py-24 md:py-28 pt-24 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={getTransitionClasses("text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 sm:mb-3 text-glow-hero leading-tight px-2")}>
            {t('hero.title')}
          </h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={getTransitionClasses("text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-5 text-accent text-glow-accent px-2")}
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
          className={getTransitionClasses("text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-glow-muted max-w-3xl mx-auto mb-6 sm:mb-8 px-4")}
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button onClick={scrollToJoin} className={getTransitionClasses("bg-gradient-to-r from-primary via-blue-500 to-accent text-white font-semibold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border border-white/20 hover:scale-105 hover:shadow-[0_0_35px_hsl(213_94%_68%/0.45)] transition-all duration-300 group min-h-[44px]")}>
            {t('hero.cta')}
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
