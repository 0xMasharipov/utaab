import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { useIsMobile } from '@/hooks/use-mobile';
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

const TeamPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
    setProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-10 sm:pb-14">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4"
          >
            {t('team.title', 'Our Team')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t('team.subtitle', 'Builders of UTAAB')}
          </motion.p>
        </div>
      </section>

      {/* Card Grid */}
      <section className="pb-24">
        <div className="section-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 max-w-6xl mx-auto"
          >
            {teamMembers.map((member) => (
              <TeamOverlapCard
                key={member.key}
                member={member}
                onClick={() => handleCardClick(member)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Profile Modal / Drawer */}
      {isMobile ? (
        <TeamProfileDrawer
          member={selectedMember}
          open={profileOpen}
          onOpenChange={setProfileOpen}
        />
      ) : (
        <TeamProfileModal
          member={selectedMember}
          open={profileOpen}
          onOpenChange={setProfileOpen}
        />
      )}

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyPopup onAccept={() => {}} onCustomize={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default TeamPage;
