import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { JoinForm } from './JoinForm';

export const Join = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();

  return (
    <section id="join" className="relative scroll-mt-24 py-20 md:py-32" ref={ref}>
      <div aria-hidden className="join-aura pointer-events-none absolute inset-0" />
      <div className="section-container relative">
        <motion.div
          id="join-form"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <h2 className={getTransitionClasses('text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground')}>
              {t('join.communityTitleStart')}{' '}
              <span className="text-accent text-glow-soft">{t('join.communityTitleEnd')}</span>
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              {t('join.communitySubtitle')}
            </p>
          </div>
          <JoinForm />
        </motion.div>
      </div>
    </section>
  );
};
