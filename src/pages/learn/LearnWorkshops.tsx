import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { Button } from '@/components/ui/button';

export const LearnWorkshops = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBlobBackground />
      <Navbar />

      <section className="relative pt-32 pb-32 sm:pt-40 sm:pb-40 min-h-[80vh] flex items-center">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl mx-auto"
          >
            {/* Floating icon */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex p-6 rounded-3xl bg-accent/10 border border-accent/20 mb-8"
            >
              <Rocket className="h-12 w-12 text-accent" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-glow-soft">
              {t('learn.workshops')}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-3">
              {t('learnPage.workshops.comingSoonText')}
            </p>
            <p className="text-sm text-white/40 mb-10">
              {t('learnPage.workshops.stayTuned')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/#community')}
                className="bg-gradient-to-r from-blue-600/90 to-blue-500/90 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-2xl py-3 px-6"
              >
                {t('learnPage.workshops.followUpdates')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/learn/guides')}
                className="bg-white/[0.06] border-white/20 hover:bg-white/[0.12] text-white font-semibold rounded-2xl py-3 px-6"
              >
                {t('learnPage.workshops.exploreGuides')}
              </Button>
            </div>

            <p className="text-xs uppercase tracking-[3px] text-white/20 mt-12 font-semibold">
              CONNECT · LEARN · BUILD
            </p>
          </motion.div>
        </div>
      </section>

      <Footer onPrivacyClick={() => {}} />
    </div>
  );
};

export default LearnWorkshops;
