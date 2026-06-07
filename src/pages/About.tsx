import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { NavArrowRight } from 'iconoir-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';
import utaaCommunityAsset from '@/assets/utaa-community.avif.asset.json';
import GlassSectionWrapper from '@/components/glass/GlassSectionWrapper';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const { getTransitionClasses } = useLanguageTransition();

  const whatWeDo = [
    { titleKey: 'aboutPage.whatWeDo.educate.title', descKey: 'aboutPage.whatWeDo.educate.description' },
    { titleKey: 'aboutPage.whatWeDo.build.title', descKey: 'aboutPage.whatWeDo.build.description' },
    { titleKey: 'aboutPage.whatWeDo.connect.title', descKey: 'aboutPage.whatWeDo.connect.description' },
    { titleKey: 'aboutPage.whatWeDo.support.title', descKey: 'aboutPage.whatWeDo.support.description' },
  ];

  const impact = [
    { titleKey: 'aboutPage.impact.projects.title', descKey: 'aboutPage.impact.projects.description' },
    { titleKey: 'aboutPage.impact.initiatives.title', descKey: 'aboutPage.impact.initiatives.description' },
    { titleKey: 'aboutPage.impact.outcomes.title', descKey: 'aboutPage.impact.outcomes.description' },
  ];

  const whyItems = [
    'aboutPage.whyUtaab.item1',
    'aboutPage.whyUtaab.item2',
    'aboutPage.whyUtaab.item3',
    'aboutPage.whyUtaab.item4',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="About UTAAB — Student Blockchain & Web3 Community"
        description="What is UTAAB? A student-led Web3 ecosystem advancing blockchain education, real-world crypto projects, and global collaboration. Learn our mission, team and impact."
        path="/about"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About UTAAB',
            url: 'https://utaab.org/about',
            description: 'About the UTAAB student-led Web3 ecosystem — mission, projects and community.',
            mainEntity: {
              '@type': 'Organization',
              name: 'UTAAB',
              url: 'https://utaab.org',
              logo: 'https://utaab.org/favicon.png',
              description: 'UTAAB is a student-led Web3 ecosystem for blockchain education, real projects, and cross-border collaboration.',
            },
          },
        ]}
      />
      <AnimatedBlobBackground />
      <Navbar />

      {/* 1. Hero */}
      <section className="pt-32 pb-20 sm:pb-24">
        <div className="section-container text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={getTransitionClasses("text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight")}
          >
            {t('aboutPage.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className={getTransitionClasses("text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8")}
          >
            {t('aboutPage.hero.subtitle')}
          </motion.p>
          {/* Decorative accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent/60"
          />
        </div>
      </section>

      {/* 2. Why UTAAB */}
      <GlassSectionWrapper>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.h2 variants={fadeUp} className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-10 text-center")}>
            {t('aboutPage.whyUtaab.title')}
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {whyItems.map((key, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard variant="subtle" className="p-6 flex items-start gap-5">
                  <span className="shrink-0 text-accent/50 font-bold text-sm tracking-widest mt-1 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={getTransitionClasses("text-muted-foreground text-base sm:text-lg leading-relaxed")}>
                    {t(key)}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </GlassSectionWrapper>

      {/* Official University Community */}
      <GlassSectionWrapper>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <GlassCard hover className="p-0 overflow-hidden border-t-2 border-t-accent/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
              {/* Image */}
              <div className="relative min-h-[260px] md:min-h-[360px]">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, hsl(213 94% 68%) 1px, transparent 1px), linear-gradient(to bottom, hsl(213 94% 68%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                  aria-hidden="true"
                />
                <AnimatedImage
                  src={utaaCommunityAsset.url}
                  alt="Türk-Alman Üniversitesi (TAU) — official university community"
                  containerClassName="absolute inset-0"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none md:bg-[linear-gradient(to_right,transparent_60%,hsl(217_50%_8%/0.85)_100%)] bg-[linear-gradient(to_top,hsl(217_50%_8%/0.85)_0%,transparent_60%)]"
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center text-center md:text-left">
                <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-4 text-foreground")}>
                  {t('aboutPage.officialCommunity.title')}
                </h2>
                <p className={getTransitionClasses("text-muted-foreground text-base sm:text-lg leading-relaxed mb-6")}>
                  {t('aboutPage.officialCommunity.body')}
                </p>
                <div className="md:self-start">
                  <a
                    href={t('aboutPage.officialCommunity.url')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-accent border border-accent/30 hover:bg-accent/10 transition-colors"
                  >
                    {t('aboutPage.officialCommunity.linkLabel')}
                    <NavArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </GlassSectionWrapper>

      {/* 3. Mission & Vision */}
      <GlassSectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <GlassCard hover className="p-8 sm:p-10 h-full border-t-2 border-t-accent/30">
              <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-4 text-foreground")}>
                {t('aboutPage.mission.title')}
              </h2>
              <p className={getTransitionClasses("text-muted-foreground text-lg leading-relaxed")}>
                {t('aboutPage.mission.text')}
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <GlassCard hover className="p-8 sm:p-10 h-full border-t-2 border-t-primary/30">
              <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-4 text-foreground")}>
                {t('aboutPage.vision.title')}
              </h2>
              <p className={getTransitionClasses("text-muted-foreground text-lg leading-relaxed")}>
                {t('aboutPage.vision.text')}
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </GlassSectionWrapper>

      {/* 4. What We Actually Do */}
      <GlassSectionWrapper>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center")}
        >
          {t('aboutPage.whatWeDo.title')}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {whatWeDo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard variant="subtle" hover className="p-6 sm:p-7 h-full">
                <div className="text-2xl font-extralight text-foreground/25 tabular-nums mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className={getTransitionClasses('text-lg font-bold text-foreground mb-2')}>{t(item.titleKey)}</h3>
                <p className={getTransitionClasses('text-muted-foreground text-sm leading-relaxed')}>{t(item.descKey)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </GlassSectionWrapper>

      {/* 5. Real-World Impact */}
      <GlassSectionWrapper>
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-4")}
          >
            {t('aboutPage.impact.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={getTransitionClasses("text-muted-foreground text-lg max-w-2xl mx-auto")}
          >
            {t('aboutPage.impact.subtitle')}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {impact.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard variant="subtle" hover className="p-7 h-full">
                <div className="text-2xl font-extralight text-foreground/25 tabular-nums mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className={getTransitionClasses('text-xl font-bold text-foreground mb-3')}>{t(item.titleKey)}</h3>
                <p className={getTransitionClasses('text-muted-foreground leading-relaxed')}>{t(item.descKey)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </GlassSectionWrapper>

      {/* 6. Closing CTA */}
      <GlassSectionWrapper>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Radial glow behind CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] bg-accent/[0.06] rounded-full blur-3xl" />
          </div>
          <GlassCard variant="strong" className="relative p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <h2 className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-6")}>
              {t('aboutPage.cta.title')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/#join')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3 text-base"
              >
                {t('aboutPage.cta.joinButton')}
                <NavArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/#projects')}
                className="rounded-full px-8 py-3 text-base border-border"
              >
                {t('aboutPage.cta.exploreButton')}
              </Button>
            </div>
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
