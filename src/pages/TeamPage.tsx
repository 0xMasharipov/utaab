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

const teamMembers = [
  { key: 'zinurbek', icon: '🚀' },
  { key: 'yunus', icon: '⚡' },
  { key: 'abdulla', icon: '🔧' },
  { key: 'abdulbaki', icon: '📊' },
  { key: 'umut', icon: '🤝' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const TeamPage = () => {
  const { t } = useTranslation();
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 sm:pb-16">
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

      {/* Team Grid */}
      <section className="pb-20">
        <div className="section-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.key} variants={cardVariants}>
                <GlassCard hover glow className="p-8 text-center group">
                  {/* Avatar */}
                  <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/[0.06] border-2 border-white/[0.12] flex items-center justify-center group-hover:border-accent/40 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    <User className="w-12 h-12 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  </div>

                  <h3 className="text-foreground font-bold text-xl mb-1">
                    {t(`team.members.${member.key}.name`)}
                  </h3>
                  <p className="text-accent text-sm font-semibold mb-4">
                    {t(`team.members.${member.key}.position`)}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {t(`team.members.${member.key}.description`)}
                  </p>

                  {/* LinkedIn placeholder */}
                  <div className="flex justify-center">
                    <button className="glass border border-white/10 p-2.5 rounded-xl transition-all hover:scale-110 hover:border-accent/30 text-muted-foreground hover:text-accent" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
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
