import { useTranslation } from 'react-i18next';
import { User, Linkedin, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import AnimatedImage from '@/components/common/AnimatedImage';
import type { TeamMember } from './TeamOverlapCard';

interface TeamProfileModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamProfileModal = ({ member, open, onOpenChange }: TeamProfileModalProps) => {
  const { t } = useTranslation();
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none overflow-hidden sm:rounded-[28px] [&>button]:hidden">
        <div className="rounded-[28px] overflow-hidden border" style={{ background: 'rgba(10, 18, 40, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'rgba(148, 163, 184, 0.20)' }}>
          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {member.image ? (
              <AnimatedImage
                src={member.image}
                alt={t(`team.members.${member.key}.name`)}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 flex items-center justify-center">
                <User className="w-24 h-24 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <DialogTitle className="sr-only">{t(`team.members.${member.key}.name`)}</DialogTitle>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-2 block">
              {member.tag}
            </span>
            <h2 className="font-bold text-2xl mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: '#F8FAFC' }}>
              {t(`team.members.${member.key}.name`)}
            </h2>
            <p className="text-sm font-semibold mb-4" style={{ color: '#93C5FD' }}>
              {t(`team.members.${member.key}.position`)}
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(226,232,240,0.78)' }}>
              {t(`team.members.${member.key}.description`)}
            </p>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:border-primary/30 hover:bg-white/[0.12] transition-all text-sm text-muted-foreground hover:text-primary"
                aria-label={`View ${t(`team.members.${member.key}.name`)}'s LinkedIn profile`}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamProfileModal;
