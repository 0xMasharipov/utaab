import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import GlassCard from '@/components/glass/GlassCard';
import GlassSectionWrapper from '@/components/glass/GlassSectionWrapper';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const { getTransitionClasses } = useLanguageTransition();

  const features = [
    { icon: Users, titleKey: 'community.features.collaborative.title', descriptionKey: 'community.features.collaborative.description' },
    { icon: Target, titleKey: 'community.features.goalOriented.title', descriptionKey: 'community.features.goalOriented.description' },
    { icon: Lightbulb, titleKey: 'community.features.innovative.title', descriptionKey: 'community.features.innovative.description' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-10 sm:pb-14">
        <div className="section-container text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={getTransitionClasses("text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6")}
          >
            {t('community.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={getTransitionClasses("text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto")}
          >
            {t('community.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <GlassSectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard hover className="p-8 sm:p-10 h-full">
              <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-4 text-foreground")}>
                {t('community.mission')}
              </h2>
              <p className={getTransitionClasses("text-muted-foreground text-lg leading-relaxed")}>
                {t('community.description')}
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard hover className="p-8 sm:p-10 h-full">
              <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-4 text-foreground")}>
                {t('community.visionTitle')}
              </h2>
              <p className={getTransitionClasses("text-muted-foreground text-lg leading-relaxed")}>
                {t('community.vision')}
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Values */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-4")}
          >
            {t('aboutPage.valuesTitle', 'Our Values')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard hover glow className="p-8 text-center h-full group">
                <feature.icon className="h-14 w-14 text-accent mb-5 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className={getTransitionClasses("text-xl font-bold mb-3 text-foreground")}>{t(feature.titleKey)}</h3>
                <p className={getTransitionClasses("text-muted-foreground leading-relaxed")}>{t(feature.descriptionKey)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard hover className="p-8 sm:p-12 text-center max-w-3xl mx-auto mb-16">
            <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-6 text-foreground")}>
              {t('aboutPage.philosophyTitle', 'Our Philosophy')}
            </h2>
            <p className={getTransitionClasses("text-muted-foreground text-lg leading-relaxed mb-8")}>
              {t('aboutPage.philosophyText', 'We believe that blockchain technology has the potential to reshape industries, empower individuals, and create transparent systems. Through education, collaboration, and hands-on building, we are nurturing the next generation of blockchain innovators.')}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3"
            >
              {t('aboutPage.exploreCTA', 'Explore Our Ecosystem')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </GlassCard>
        </motion.div>
      </GlassSectionWrapper>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyPopup onAccept={() => {}} onCustomize={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default About;
