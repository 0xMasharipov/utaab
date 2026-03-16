import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Linkedin, Globe, Send } from 'lucide-react';
import AnimatedImage from '@/components/common/AnimatedImage';

export interface TeamMember {
  key: string;
  image?: string;
  tag: string;
  linkedin?: string;
  // Database-driven fields
  db_name?: string;
  db_role?: string;
  db_bio?: string;
  twitter_url?: string;
  instagram_url?: string;
  telegram_url?: string;
  website_url?: string;
  linkedin_url?: string;
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
  const { t, i18n } = useTranslation();

  const name = member.db_name || t(`team.members.${member.key}.name`);
  const role = member.db_role || t(`team.members.${member.key}.position`);
  const bio = member.db_bio || t(`team.members.${member.key}.description`);

  const hasSocials = member.linkedin_url || member.twitter_url || member.telegram_url || member.website_url;

  return (
    <motion.div
      variants={cardVariants}
      className="relative cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={name}
    >
      {/* Image Card */}
      <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden border border-white/[0.08] shadow-lg transition-all duration-[240ms] motion-safe:group-hover:border-white/[0.16]">
        {member.image ? (
          <AnimatedImage
            src={member.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
            containerClassName="w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 flex items-center justify-center">
            <User className="w-20 h-20 text-muted-foreground/50" />
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 70%)',
          }}
        />

        {/* Dark Glass Info Card */}
        <div
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 w-[65%] sm:w-[52%] lg:w-[48%] max-h-[140px] sm:max-h-[160px] rounded-[22px] p-3 sm:p-3.5 lg:p-4 transition-all duration-[240ms] motion-safe:group-hover:border-slate-400/30"
          style={{
            background: 'rgba(10, 18, 40, 0.62)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.20)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}
        >
          {/* Tag */}
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[#93C5FD] mb-0.5 block">
            {member.tag}
          </span>

          {/* Name */}
          <h3
            className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] leading-tight mb-0.5 line-clamp-1"
            style={{ color: '#F8FAFC', fontFamily: 'Montserrat, sans-serif' }}
          >
            {name}
          </h3>

          {/* Role */}
          <p className="text-[12px] sm:text-[13px] font-semibold mb-1" style={{ color: '#93C5FD' }}>
            {role}
          </p>

          {/* Bio */}
          <p
            className="text-[12px] leading-relaxed line-clamp-2"
            style={{ color: 'rgba(226,232,240,0.78)' }}
          >
            {bio}
          </p>

          {/* Social icons */}
          {hasSocials && (
            <div className="flex items-center gap-2 mt-1.5" onClick={e => e.stopPropagation()}>
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {member.telegram_url && (
                <a href={member.telegram_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </a>
              )}
              {member.website_url && (
                <a href={member.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamOverlapCard;
