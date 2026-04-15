import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { NavArrowRight } from 'iconoir-react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';

const cards = [
  {
    image: '/images/about/UTAAB_Education.png',
    titleKey: 'about.cards.education.title',
    descriptionKey: 'about.cards.education.description',
  },
  {
    image: '/images/about/UTAAB_Projects_1.png',
    titleKey: 'about.cards.projects.title',
    descriptionKey: 'about.cards.projects.description',
  },
  {
    image: '/images/about/UTAAB_Ecosystem.png',
    titleKey: 'about.cards.ecosystem.title',
    descriptionKey: 'about.cards.ecosystem.description',
  },
  {
    image: '/images/about/UTAAB_Support.png',
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
              <GlassCard hover className="relative overflow-hidden min-h-[280px] h-full group p-0">
                {/* Layer 1: Grid background */}
                <div
                  className="absolute inset-0 z-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, hsl(213 94% 68%) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                  aria-hidden="true"
                />

                {/* Layer 2: 3D Image */}
                <AnimatedImage
                  src={card.image}
                  alt=""
                  aria-hidden="true"
                  containerClassName="absolute bottom-0 right-0 w-[65%] h-auto z-10 translate-x-[5%] translate-y-[5%]"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  placeholderClassName="opacity-0"
                />

                {/* Layer 3: Gradient overlay */}
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    background:
                      'linear-gradient(to top, hsl(217 50% 8% / 0.8) 0%, hsl(217 50% 8% / 0.5) 40%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Layer 4: Text content */}
                <div className="relative z-30 p-6 sm:p-8 flex flex-col h-full">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(card.descriptionKey)}
                  </p>
                </div>
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
            <NavArrowRight className="h-4 w-4 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
