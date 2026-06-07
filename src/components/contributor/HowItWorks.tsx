import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { EYEBROW, SECTION_TITLE, SECTION_SUBTITLE } from '@/lib/designTokens';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    { title: t('contributor.howItWorks.step1Title'), description: t('contributor.howItWorks.step1Desc') },
    { title: t('contributor.howItWorks.step2Title'), description: t('contributor.howItWorks.step2Desc') },
    { title: t('contributor.howItWorks.step3Title'), description: t('contributor.howItWorks.step3Desc') },
  ];

  return (
    <section className="py-20 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <div className={`${EYEBROW} mb-4`}>01 — {t('contributor.howItWorks.step')}</div>
          <h2 className={SECTION_TITLE}>{t('contributor.howItWorks.title')}</h2>
          <p className={`${SECTION_SUBTITLE} mt-4`}>{t('contributor.howItWorks.subtitle')}</p>
        </motion.div>

        <ol className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 py-7 md:py-9"
            >
              <span className="text-3xl md:text-4xl font-extralight text-foreground/20 tabular-nums leading-none w-10 md:w-14">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
