import { useTranslation } from 'react-i18next';
import { User, Linkedin } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import AnimatedImage from '@/components/common/AnimatedImage';
import type { TeamMember } from './TeamOverlapCard';

interface TeamProfileDrawerProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamProfileDrawer = ({ member, open, onOpenChange }: TeamProfileDrawerProps) => {
  const { t } = useTranslation();
  if (!member) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white/[0.06] backdrop-blur-2xl border-t border-[rgba(148,163,184,0.2)] max-h-[85vh]">
        <DrawerTitle className="sr-only">{t(`team.members.${member.key}.name`)}</DrawerTitle>
        <div className="overflow-y-auto px-5 pb-8 pt-2">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/[0.1] mb-4">
            {member.image ? (
              <AnimatedImage
                src={member.image}
                alt={t(`team.members.${member.key}.name`)}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground/50" />
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary mb-1 block">
              {member.tag}
            </span>
            <h2 className="font-bold text-xl text-foreground mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t(`team.members.${member.key}.name`)}
            </h2>
            <p className="text-sm font-semibold text-primary/80 mb-3">
              {t(`team.members.${member.key}.position`)}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {t(`team.members.${member.key}.description`)}
            </p>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:border-primary/30 hover:bg-white/[0.12] transition-all text-sm text-muted-foreground hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TeamProfileDrawer;
