import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const TeamPage = () => {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        const lang = i18n.language;
        setTeamMembers(data.map(m => ({
          key: m.id,
          image: m.image_url || undefined,
          tag: m.department,
          db_name: m.full_name,
          db_role: m.role_title,
          db_bio: (lang === 'tr' && m.bio_tr) || (lang === 'ru' && m.bio_ru) || (lang === 'ar' && m.bio_ar) || m.bio_en || '',
          linkedin_url: m.linkedin_url || undefined,
          twitter_url: m.twitter_url || undefined,
          telegram_url: m.telegram_url || undefined,
          website_url: m.website_url || undefined,
          instagram_url: m.instagram_url || undefined,
        })));
      }
      setLoading(false);
    };
    fetchTeam();
  }, [i18n.language]);

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
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
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
          )}
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
