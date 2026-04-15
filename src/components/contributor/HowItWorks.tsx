import { motion } from 'framer-motion';
import { ClipboardCheck, Brain, Archery } from 'iconoir-react';
import GlassCard from '@/components/glass/GlassCard';
import { useTranslation } from 'react-i18next';

const icons = [ClipboardCheck, Brain, Archery];

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: icons[0], title: t('contributor.howItWorks.step1Title'), description: t('contributor.howItWorks.step1Desc') },
    { icon: icons[1], title: t('contributor.howItWorks.step2Title'), description: t('contributor.howItWorks.step2Desc') },
    { icon: icons[2], title: t('contributor.howItWorks.step3Title'), description: t('contributor.howItWorks.step3Desc') },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('contributor.howItWorks.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('contributor.howItWorks.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard hover glow className="p-8 h-full text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-7 h-7 text-secondary" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-secondary mb-2 tracking-wider uppercase">{t('contributor.howItWorks.step')} {i + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
