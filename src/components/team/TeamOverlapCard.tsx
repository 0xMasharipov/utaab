import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Linkedin } from 'lucide-react';
import AnimatedImage from '@/components/common/AnimatedImage';

export interface TeamMember {
  key: string;
  image?: string;
  tag: string;
  linkedin?: string;
}

interface TeamOverlapCardProps {
  member: TeamMember;
  onClick: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const TeamOverlapCard = ({ member, onClick }: TeamOverlapCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={cardVariants}
      className="relative cursor-pointer group motion-safe:hover:-translate-y-1 transition-transform duration-[240ms] ease-out pb-4 pr-4 sm:pb-5 sm:pr-5 lg:pb-6 lg:pr-6"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={t(`team.members.${member.key}.name`)}
    >
      {/* Image Card */}
      <div className="relative aspect-[4/5] sm:aspect-[4/5] rounded-[28px] overflow-hidden border border-white/[0.08] shadow-lg motion-safe:group-hover:border-white/[0.16] transition-all duration-[240ms]">
        {member.image ? (
          <AnimatedImage
            src={member.image}
            alt={t(`team.members.${member.key}.name`)}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 flex items-center justify-center">
            <User className="w-20 h-20 text-muted-foreground/50" />
          </div>
        )}
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)',
          }}
        />
      </div>

      {/* Glass Info Card */}
      <div className="absolute bottom-0 right-0 z-20 w-[60%] sm:w-[58%] lg:w-[55%] rounded-[20px] sm:rounded-[22px] lg:rounded-[24px] p-3.5 sm:p-4 lg:p-[18px] backdrop-blur-[14px] bg-white/[0.08] border border-[rgba(148,163,184,0.18)] shadow-xl motion-safe:group-hover:border-[rgba(148,163,184,0.28)] transition-all duration-[240ms]">
        {/* Tag */}
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-1 block">
          {member.tag}
        </span>

        {/* Name */}
        <h3 className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] text-foreground leading-tight mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {t(`team.members.${member.key}.name`)}
        </h3>

        {/* Role */}
        <p className="text-[12px] sm:text-[13px] font-semibold text-primary/80 mb-1.5">
          {t(`team.members.${member.key}.position`)}
        </p>

        {/* Bio */}
        <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
          {t(`team.members.${member.key}.description`)}
        </p>

        {/* LinkedIn */}
        <button
          className="p-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] hover:border-primary/30 hover:bg-white/[0.12] transition-all duration-200 text-muted-foreground hover:text-primary"
          aria-label="LinkedIn"
          onClick={(e) => e.stopPropagation()}
        >
          <Linkedin className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TeamOverlapCard;
