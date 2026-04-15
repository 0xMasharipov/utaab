import { motion } from 'framer-motion';
import { GitMerge, ArrowDown } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ContributorHeroProps {
  onStartAssessment: () => void;
  onLearnMore: () => void;
}

const ContributorHero = ({ onStartAssessment, onLearnMore }: ContributorHeroProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)', top: '-20%', right: '-10%' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)', bottom: '-10%', left: '-5%' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] mb-8"
        >
          <GitMerge className="w-4 h-4 text-secondary" strokeWidth={1.5} />
          <span className="text-sm text-muted-foreground tracking-wide">{t('contributor.hero.badge')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-foreground leading-tight mb-6"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t('contributor.hero.title')}{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('contributor.hero.titleHighlight')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('contributor.hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={onStartAssessment}
            size="lg"
            className="bg-primary/80 backdrop-blur-xl hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all duration-300"
          >
            {t('contributor.hero.startAssessment')}
          </Button>
          <Button
            onClick={onLearnMore}
            variant="outline"
            size="lg"
            className="bg-white/[0.06] backdrop-blur-xl border-white/[0.12] hover:bg-white/[0.10] text-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300"
          >
            <ArrowDown className="w-5 h-5 mr-2" strokeWidth={1.5} />
            {t('contributor.hero.learnHow')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContributorHero;
