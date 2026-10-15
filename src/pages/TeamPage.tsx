import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { useIsMobile } from '@/hooks/use-mobile';
import UtaabTeamRoster from '@/components/ui/utaab-team-roster';
import TeamProfileModal from '@/components/team/TeamProfileModal';
import TeamProfileDrawer from '@/components/team/TeamProfileDrawer';
import { useTeamMembers, type TeamMemberView } from '@/hooks/useTeamMembers';
import SEO from '@/components/SEO';

const TeamPage = () => {
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

      <UtaabTeamRoster members={members} profileOpen={profileOpen} onProfile={handleCardClick} />

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
