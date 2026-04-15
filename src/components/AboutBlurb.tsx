import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Rocket, Globe, Heart, ArrowRight } from 'lucide-react';

import { Link } from 'react-router-dom';
import GlassCard from '@/components/glass/GlassCard';

const cards = [
  {
    icon: GraduationCap,
    titleKey: 'about.cards.education.title',
    descriptionKey: 'about.cards.education.description',
  },
  {
    icon: Rocket,
    titleKey: 'about.cards.projects.title',
    descriptionKey: 'about.cards.projects.description',
  },
  {
    icon: Globe,
    titleKey: 'about.cards.ecosystem.title',
    descriptionKey: 'about.cards.ecosystem.description',
  },
  {
    icon: Heart,
    titleKey: 'about.cards.support.title',
    descriptionKey: 'about.cards.support.description',
  },
];

export const AboutBlurb = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-20 md:py-28 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('about.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t('about.blurb')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <GlassCard hover className="p-6 sm:p-8 text-center h-full group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <card.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t(card.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(card.descriptionKey)}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link
            to="/about"
            className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-[15px] font-semibold tracking-wide text-foreground bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.10] hover:shadow-[0_0_24px_hsl(var(--accent)/0.2)]"
          >
            {t('about.learnMore')}
            <ArrowRight className="h-4 w-4 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
