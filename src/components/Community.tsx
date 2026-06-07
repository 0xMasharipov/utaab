import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { NavArrowRight } from 'iconoir-react';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { Link } from 'react-router-dom';

export const Community = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { getTransitionClasses } = useLanguageTransition();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="community" className="relative py-20 md:py-28 overflow-hidden" ref={ref}>
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(var(--accent)/0.08),transparent_70%)]" />

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={getTransitionClasses("text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-glow-soft")}>
            {t('community.cta.title')}
          </h2>
          <p className={getTransitionClasses("text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed")}>
            {t('community.cta.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {/* Primary CTA */}
          <button
            onClick={() => scrollToSection('join')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-semibold backdrop-blur-sm hover:bg-accent/30 hover:border-accent/50 hover:shadow-[0_0_30px_hsl(var(--accent)/0.25)] transition-all duration-300"
          >
            <span className={getTransitionClasses()}>{t('community.cta.joinBtn')}</span>
            <NavArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => scrollToSection('projects')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border/40 text-foreground font-semibold backdrop-blur-sm hover:bg-white/[0.06] hover:border-border/60 transition-all duration-300"
          >
            <span className={getTransitionClasses()}>{t('community.cta.projectsBtn')}</span>
          </button>

          {/* Tertiary CTA */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-muted-foreground font-semibold hover:text-foreground hover:bg-white/[0.04] transition-all duration-300"
          >
            <span className={getTransitionClasses()}>{t('community.cta.updatesBtn')}</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
