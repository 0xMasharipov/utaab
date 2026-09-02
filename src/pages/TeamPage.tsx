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
import ProfileCard from '@/components/team/ProfileCard';
import TeamProfileModal from '@/components/team/TeamProfileModal';
import TeamProfileDrawer from '@/components/team/TeamProfileDrawer';
import { useTeamMembers, primaryLink, type TeamMemberView } from '@/hooks/useTeamMembers';
import SEO from '@/components/SEO';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const TeamPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { members } = useTeamMembers();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberView | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleCardClick = (member: TeamMemberView) => {
    setSelectedMember(member);
    setProfileOpen(true);
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="UTAAB Team — Founders, Contributors & Advisors"
        description="Meet the UTAAB team — the founders, contributors, and advisors building the Web3 student ecosystem."
        path="/team"
      />
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 sm:pb-18">
        <div className="section-container text-center">
          {/* Tagline badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">
              {t('team.badge', 'The People Behind UTAAB')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4"
          >
            {t('team.title', 'Our Team')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
          >
            {t('team.subtitle', 'Builders of UTAAB')}
          </motion.p>

          {/* Decorative accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent/60"
          />
        </div>
      </section>

      {/* Card Grid */}
      <section className="pb-28">
        <div className="section-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7 sm:gap-8 lg:gap-10 max-w-6xl mx-auto"
          >
            {members.map((member) => {
              const link = primaryLink(member);
              const showTag =
                member.tag.trim().toLowerCase() !== member.position.trim().toLowerCase();
              return (
                <motion.div
                  key={member.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
                  }}
                >
                  <ProfileCard
                    avatarUrl={member.image}
                    name={member.name}
                    title={member.position}
                    status={showTag ? member.tag : undefined}
                    handle={member.description}
                    contactText="Contact"
                    onContactClick={link ? () => window.open(link, '_blank', 'noopener,noreferrer') : undefined}
                    onClick={() => handleCardClick(member)}
                  />
                </motion.div>
              );
            })}

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
