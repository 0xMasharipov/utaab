import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import GlassCard from '@/components/glass/GlassCard';
import GlassSectionWrapper from '@/components/glass/GlassSectionWrapper';
import AnimatedImage from '@/components/common/AnimatedImage';

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

const teamMembers = [
  { key: 'zinurbek', image: zinurbekImg },
  { key: 'yunus', image: yunusImg },
  { key: 'abdulla', image: abdullaImg },
  { key: 'abdulbaki', image: abdulbakiImg },
  { key: 'umut', image: umutImg },
  { key: 'yana', image: yanaImg },
  { key: 'shuayb', image: shuaybImg },
  { key: 'ibrahim', image: ibrahimImg },
  { key: 'burak', image: burakImg },
  { key: 'anar', image: anarImg },
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full p-[2px] bg-gradient-to-br from-accent/30 via-primary/20 to-accent/15">
                <div className="w-full h-full rounded-full overflow-hidden bg-muted/20 flex items-center justify-center">
                  {member.image ? (
                    <AnimatedImage
                      src={member.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      containerClassName="w-full h-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  )}
                </div>
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
