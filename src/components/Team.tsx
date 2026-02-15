import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';
import GlassSectionWrapper from '@/components/glass/GlassSectionWrapper';

const teamMembers = [
  { key: 'zinurbek', icon: '🚀' },
  { key: 'yunus', icon: '⚡' },
  { key: 'abdulla', icon: '🔧' },
  { key: 'abdulbaki', icon: '📊' },
  { key: 'umut', icon: '🤝' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const Team = () => {
  const { t } = useTranslation();

  return (
    <GlassSectionWrapper id="team">
      <div className="text-center mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          {t('team.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
        >
          {t('team.subtitle')}
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6"
      >
        {teamMembers.map((member) => (
          <motion.div key={member.key} variants={cardVariants}>
            <GlassCard hover glow className="p-6 text-center group">
              {/* Avatar placeholder */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center group-hover:border-accent/30 transition-colors duration-300">
                <User className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
              </div>

              <h3 className="text-foreground font-semibold text-lg mb-1">
                {t(`team.members.${member.key}.name`)}
              </h3>
              <p className="text-accent text-sm font-medium mb-3">
                {t(`team.members.${member.key}.position`)}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`team.members.${member.key}.description`)}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </GlassSectionWrapper>
  );
};
