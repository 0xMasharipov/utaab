import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Users, Rocket, Globe } from 'lucide-react';
import { JoinForm } from './JoinForm';

const perks = [
  { icon: GraduationCap, label: 'Free blockchain education' },
  { icon: Rocket, label: 'Build real Web3 projects' },
  { icon: Users, label: 'Student-led community' },
  { icon: Globe, label: 'Cross-border collaboration' },
];

export const Join = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="join" className="relative scroll-mt-24 py-20 md:py-32" ref={ref}>
      <div aria-hidden className="join-aura pointer-events-none absolute inset-0" />
      <div className="section-container relative">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-28"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">UTAAB · Join</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              {t('join.title')}
            </h2>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">{t('join.subtitle')}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {perks.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/30 px-4 py-3 backdrop-blur"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            id="join-form"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <JoinForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
