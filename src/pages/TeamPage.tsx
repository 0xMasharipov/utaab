import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Linkedin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';

import zinurbekImg from '@/assets/team/zinurbek.png';
import umutImg from '@/assets/team/umut.png';
import abdullaImg from '@/assets/team/abdulla.png';
import yunusImg from '@/assets/team/yunus.png';

interface TeamMember {
  key: string;
  image?: string;
}

const founder: TeamMember = { key: 'zinurbek', image: zinurbekImg };

const leaders: TeamMember[] = [
  { key: 'yunus', image: yunusImg },
  { key: 'abdulla', image: abdullaImg },
  { key: 'abdulbaki' },
  { key: 'umut', image: umutImg },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const MemberAvatar = ({ image, size, className = '' }: { image?: string; size: number; className?: string }) => {
  const sizeClass = size === 160 ? 'w-40 h-40' : 'w-28 h-28';
  const iconSize = size === 160 ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className={`${sizeClass} rounded-full p-[3px] bg-gradient-to-br from-accent/40 via-primary/30 to-accent/20 shrink-0 ${className}`}>
      <div className="w-full h-full rounded-full overflow-hidden bg-muted/30 backdrop-blur-sm flex items-center justify-center group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)] transition-all duration-500">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <User className={`${iconSize} text-muted-foreground group-hover:text-accent transition-colors duration-300`} />
        )}
      </div>
    </div>
  );
};

const TeamPage = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

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
            {t('teamPage.title', 'Our Team')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t('teamPage.subtitle', 'Builders of UTAAB')}
          </motion.p>
        </div>
      </section>

      {/* Founder Featured Card */}
      <section className="pb-10">
        <div className="section-container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="strong" hover glow className="p-8 sm:p-10 group">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <MemberAvatar image={founder.image} size={160} />
                <div className="text-center lg:text-left flex-1">
                  <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-2">
                    {t('teamPage.founderLabel', 'Founder & President')}
                  </p>
                  <h2 className="text-foreground font-bold text-2xl sm:text-3xl mb-2">
                    {t(`team.members.${founder.key}.name`)}
                  </h2>
                  <p className="text-accent/80 text-sm font-medium mb-4">
                    {t(`team.members.${founder.key}.position`)}
                  </p>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
                    {t(`team.members.${founder.key}.description`)}
                  </p>
                  <div className="flex justify-center lg:justify-start mt-5">
                    <button className="glass border border-white/10 p-2.5 rounded-xl transition-all hover:scale-110 hover:border-accent/30 text-muted-foreground hover:text-accent" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="pb-24">
        <div className="section-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {leaders.map((member) => (
              <motion.div key={member.key} variants={cardVariants}>
                <GlassCard hover glow className="p-7 text-center group h-full">
                  <MemberAvatar image={member.image} size={112} className="mx-auto mb-5" />
                  <h3 className="text-foreground font-bold text-lg mb-1">
                    {t(`team.members.${member.key}.name`)}
                  </h3>
                  <p className="text-accent text-xs font-semibold mb-3">
                    {t(`team.members.${member.key}.position`)}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {t(`team.members.${member.key}.description`)}
                  </p>
                  <div className="flex justify-center">
                    <button className="glass border border-white/10 p-2 rounded-xl transition-all hover:scale-110 hover:border-accent/30 text-muted-foreground hover:text-accent" aria-label="LinkedIn">
                      <Linkedin className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyPopup onAccept={() => {}} onCustomize={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default TeamPage;
