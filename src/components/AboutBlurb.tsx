import { useTranslation } from 'react-i18next';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState, KeyboardEvent } from 'react';
import { NavArrowRight } from 'iconoir-react';
import { Link } from 'react-router-dom';
import { GraduationCap, Boxes, Network, HeartHandshake, LucideIcon } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';
import { NUMERAL } from '@/lib/designTokens';
import { cn } from '@/lib/utils';

interface BuildCard {
  image: string;
  titleKey: string;
  descriptionKey: string;
  Icon: LucideIcon;
}

const cards: BuildCard[] = [
  {
    image: '/images/about/UTAAB_Education.webp',
    titleKey: 'about.cards.education.title',
    descriptionKey: 'about.cards.education.description',
    Icon: GraduationCap,
  },
  {
    image: '/images/about/UTAAB_Projects_1.webp',
    titleKey: 'about.cards.projects.title',
    descriptionKey: 'about.cards.projects.description',
    Icon: Boxes,
  },
  {
    image: '/images/about/UTAAB_Ecosystem.webp',
    titleKey: 'about.cards.ecosystem.title',
    descriptionKey: 'about.cards.ecosystem.description',
    Icon: Network,
  },
  {
    image: '/images/about/UTAAB_Support.webp',
    titleKey: 'about.cards.support.title',
    descriptionKey: 'about.cards.support.description',
    Icon: HeartHandshake,
  },
];

const GRID_LAYER = {
  backgroundImage:
    'linear-gradient(to right, hsl(213 94% 68%) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68%) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
} as const;

const OVERLAY =
  'linear-gradient(to top, hsl(217 50% 8% / 0.92) 0%, hsl(217 50% 8% / 0.6) 45%, transparent 100%)';

export const AboutBlurb = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((index + 1) % cards.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((index - 1 + cards.length) % cards.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  const spring = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 180, damping: 26, mass: 0.8 };

  return (
    <section id="about" className="py-16 md:py-24 relative" ref={ref}>
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
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('about.officialCommunity.text')}{' '}
            <a
              href={t('about.officialCommunity.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              {t('about.officialCommunity.linkLabel')}
            </a>
          </p>
        </motion.div>

        {/* Accordion — md and up */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden md:flex gap-3 lg:gap-4 h-[380px] lg:h-[420px] mb-10"
        >
          {cards.map((card, index) => {
            const isActive = index === activeIndex;
            const { Icon } = card;
            return (
              <motion.div
                key={card.titleKey}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={t(card.titleKey)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                animate={{ flexGrow: isActive ? 3.2 : 1 }}
                transition={spring}
                style={{ flexBasis: 0 }}
                className="relative min-w-0 cursor-pointer outline-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <GlassCard
                  className={cn(
                    'relative h-full w-full overflow-hidden p-0 group',
                    isActive
                      ? 'border-white/20 shadow-[0_18px_60px_-20px_hsl(213_94%_68%/0.45)]'
                      : 'border-white/[0.10] hover:border-white/[0.16]'
                  )}
                >
                  {/* Technical grid */}
                  <div
                    className={cn(
                      'absolute inset-0 z-0 transition-opacity duration-500',
                      isActive ? 'opacity-[0.07]' : 'opacity-[0.04]'
                    )}
                    style={GRID_LAYER}
                    aria-hidden="true"
                  />

                  {/* Accent wash on active */}
                  <div
                    className={cn(
                      'absolute inset-0 z-[1] transition-opacity duration-500',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                      background:
                        'radial-gradient(120% 90% at 50% 110%, hsl(213 94% 68% / 0.18) 0%, transparent 65%)',
                    }}
                    aria-hidden="true"
                  />

                  {/* Artwork */}
                  <AnimatedImage
                    src={card.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    sizes="(max-width: 1023px) 40vw, 420px"
                    containerClassName={cn(
                      'absolute z-10 transition-all duration-500 ease-out',
                      isActive
                        ? 'right-[1%] bottom-[15%] w-[44%] h-[62%] opacity-95'
                        : 'right-0 bottom-[30%] w-full h-[42%] opacity-40'
                    )}
                    className="w-full h-full object-contain object-right-bottom drop-shadow-[0_10px_30px_rgba(59,130,246,0.22)] transition-transform duration-500 group-hover:scale-[1.04]"
                    placeholderClassName="opacity-0"
                  />

                  {/* Bottom gradient */}
                  <div className="absolute inset-0 z-20" style={{ background: OVERLAY }} aria-hidden="true" />

                  {/* Index numeral */}
                  <span
                    className={cn(
                      NUMERAL,
                      'absolute top-4 left-4 lg:top-5 lg:left-5 z-30 text-2xl lg:text-3xl transition-colors duration-500',
                      isActive && 'text-foreground/40'
                    )}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Vertical hairline on collapsed rails */}
                  <div
                    className={cn(
                      'absolute left-1/2 top-16 bottom-24 w-px z-30 -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent transition-opacity duration-500',
                      isActive ? 'opacity-0' : 'opacity-100'
                    )}
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 z-30 p-5 lg:p-7">
                    <div
                      className={cn(
                        'mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-500',
                        isActive
                          ? 'bg-primary/20 border-accent/30 text-accent'
                          : 'bg-white/[0.05] border-white/10 text-foreground/60'
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </div>

                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: isActive ? 0.08 : 0 }}
                      className={cn(!isActive && 'pointer-events-none h-0 overflow-hidden')}
                    >
                      <h3 className="text-lg lg:text-xl font-bold text-foreground whitespace-nowrap">
                        {t(card.titleKey)}
                      </h3>
                      <div className="mt-2 mb-3 h-px w-12 bg-gradient-to-r from-accent/70 to-transparent" />
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                        {t(card.descriptionKey)}
                      </p>
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stack — mobile */}
        <div className="md:hidden flex flex-col gap-4 mb-10">
          {cards.map((card, index) => {
            const { Icon } = card;
            return (
              <motion.div
                key={card.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
              >
                <GlassCard className="relative overflow-hidden min-h-[180px] p-0">
                  <div className="absolute inset-0 z-0 opacity-[0.05]" style={GRID_LAYER} aria-hidden="true" />
                  <AnimatedImage
                    src={card.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    sizes="45vw"
                    containerClassName="absolute right-0 bottom-0 w-[52%] h-[92%] z-10 opacity-70"
                    className="w-full h-full object-contain object-right-bottom drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)]"
                    placeholderClassName="opacity-0"
                  />
                  <div
                    className="absolute inset-0 z-20"
                    style={{
                      background:
                        'linear-gradient(to right, hsl(217 50% 8% / 0.95) 30%, hsl(217 50% 8% / 0.55) 70%, transparent 100%)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-30 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 border border-accent/30 text-accent">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </div>
                      <span className={cn(NUMERAL, 'text-xl')} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{t(card.titleKey)}</h3>
                    <div className="mt-2 mb-2 h-px w-12 bg-gradient-to-r from-accent/70 to-transparent" />
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[75%]">
                      {t(card.descriptionKey)}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
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
