import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GraduationCap, Wrench, Network, Heart, Rocket, Globe, TrendingUp, ArrowRight, Users2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import GlassCard from '@/components/glass/GlassCard';
import GlassSectionWrapper from '@/components/glass/GlassSectionWrapper';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import TeamOverlapCard from '@/components/team/TeamOverlapCard';
import TeamProfileModal from '@/components/team/TeamProfileModal';
import TeamProfileDrawer from '@/components/team/TeamProfileDrawer';
import type { TeamMember } from '@/components/team/TeamOverlapCard';

import zinurbekImg from '@/assets/team/zinurbek.png';
import umutImg from '@/assets/team/umut.png';
import abdullaImg from '@/assets/team/abdulla.png';
import yunusImg from '@/assets/team/yunus.png';
import abdulbakiImg from '@/assets/team/abdulbaki.png';
import yanaImg from '@/assets/team/yana.png';
import shuaybImg from '@/assets/team/shuayb.png';
import ibrahimImg from '@/assets/team/ibrahim.png';
import burakImg from '@/assets/team/burak.png';
import anarImg from '@/assets/team/anar.png';

const teamMembers: TeamMember[] = [
  { key: 'zinurbek', image: zinurbekImg, tag: 'Founder', linkedin: 'https://linkedin.com/in/masharipov' },
  { key: 'yunus', image: yunusImg, tag: 'Leadership', linkedin: 'https://linkedin.com/in/yunus-emre-e-80921034b' },
  { key: 'abdulla', image: abdullaImg, tag: 'Engineering', linkedin: 'https://linkedin.com/in/abdulla-hamzali-59b5a5229' },
  { key: 'abdulbaki', image: abdulbakiImg, tag: 'Operations' },
  { key: 'umut', image: umutImg, tag: 'Operations' },
  { key: 'anar', image: anarImg, tag: 'Operations', linkedin: 'https://linkedin.com/in/anar-malikov-0430203b6' },
  { key: 'yana', image: yanaImg, tag: 'Engineering', linkedin: 'https://linkedin.com/in/yanina-isak-a62191367' },
  { key: 'shuayb', image: shuaybImg, tag: 'Engineering', linkedin: 'https://linkedin.com/in/shuayb-allahverdiyev-933813291' },
  { key: 'ibrahim', image: ibrahimImg, tag: 'Marketing' },
  { key: 'burak', image: burakImg, tag: 'Operations', linkedin: 'https://linkedin.com/in/burak-deniz-yaman-63aa263b3' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { getTransitionClasses } = useLanguageTransition();

  const whatWeDo = [
    { icon: GraduationCap, titleKey: 'aboutPage.whatWeDo.educate.title', descKey: 'aboutPage.whatWeDo.educate.description' },
    { icon: Wrench, titleKey: 'aboutPage.whatWeDo.build.title', descKey: 'aboutPage.whatWeDo.build.description' },
    { icon: Network, titleKey: 'aboutPage.whatWeDo.connect.title', descKey: 'aboutPage.whatWeDo.connect.description' },
    { icon: Heart, titleKey: 'aboutPage.whatWeDo.support.title', descKey: 'aboutPage.whatWeDo.support.description' },
  ];

  const impact = [
    { icon: Rocket, titleKey: 'aboutPage.impact.projects.title', descKey: 'aboutPage.impact.projects.description' },
    { icon: Globe, titleKey: 'aboutPage.impact.initiatives.title', descKey: 'aboutPage.impact.initiatives.description' },
    { icon: TrendingUp, titleKey: 'aboutPage.impact.outcomes.title', descKey: 'aboutPage.impact.outcomes.description' },
  ];

  const whyItems = [
    'aboutPage.whyUtaab.item1',
    'aboutPage.whyUtaab.item2',
    'aboutPage.whyUtaab.item3',
    'aboutPage.whyUtaab.item4',
  ];

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
    setProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* 1. Hero */}
      <section className="pt-32 pb-16 sm:pb-20">
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
            className={getTransitionClasses("text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed")}
          >
            {t('aboutPage.hero.subtitle')}
          </motion.p>
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
                <GlassCard variant="subtle" className="p-6">
                  <p className={getTransitionClasses("text-muted-foreground text-base sm:text-lg leading-relaxed")}>
                    {t(key)}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </GlassSectionWrapper>

      {/* 3. Mission & Vision */}
      <GlassSectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <GlassCard hover className="p-8 sm:p-10 h-full">
              <h2 className={getTransitionClasses("text-2xl sm:text-3xl font-bold mb-4 text-foreground")}>
                {t('aboutPage.mission.title')}
              </h2>
              <p className={getTransitionClasses("text-muted-foreground text-lg leading-relaxed")}>
                {t('aboutPage.mission.text')}
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <GlassCard hover className="p-8 sm:p-10 h-full">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {whatWeDo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard hover glow className="p-6 sm:p-8 text-center h-full group">
                <item.icon className="h-12 w-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className={getTransitionClasses("text-lg font-bold text-foreground mb-2")}>{t(item.titleKey)}</h3>
                <p className={getTransitionClasses("text-muted-foreground text-sm leading-relaxed")}>{t(item.descKey)}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {impact.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <GlassCard hover className="p-8 text-center h-full group">
                <item.icon className="h-14 w-14 text-accent mx-auto mb-5 group-hover:scale-110 transition-transform" />
                <h3 className={getTransitionClasses("text-xl font-bold text-foreground mb-3")}>{t(item.titleKey)}</h3>
                <p className={getTransitionClasses("text-muted-foreground leading-relaxed")}>{t(item.descKey)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </GlassSectionWrapper>

      {/* 6. Team */}
      <GlassSectionWrapper>
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-4")}
          >
            {t('team.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={getTransitionClasses("text-muted-foreground text-lg")}
          >
            {t('team.subtitle')}
          </motion.p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 max-w-6xl mx-auto"
        >
          {teamMembers.map((member) => (
            <TeamOverlapCard key={member.key} member={member} onClick={() => handleCardClick(member)} />
          ))}
        </motion.div>

        {isMobile ? (
          <TeamProfileDrawer member={selectedMember} open={profileOpen} onOpenChange={setProfileOpen} />
        ) : (
          <TeamProfileModal member={selectedMember} open={profileOpen} onOpenChange={setProfileOpen} />
        )}
      </GlassSectionWrapper>

      {/* 7. Closing CTA */}
      <GlassSectionWrapper>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard variant="strong" className="p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <Users2 className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className={getTransitionClasses("text-3xl sm:text-4xl font-bold text-foreground mb-6")}>
              {t('aboutPage.cta.title')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/#join')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-3 text-base"
              >
                {t('aboutPage.cta.joinButton')}
                <ArrowRight className="ml-2 h-4 w-4" />
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
