import { User, Linkedin } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import AnimatedImage from '@/components/common/AnimatedImage';
import type { TeamMemberView } from '@/hooks/useTeamMembers';

interface TeamProfileDrawerProps {
  member: TeamMemberView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamProfileDrawer = ({ member, open, onOpenChange }: TeamProfileDrawerProps) => {
  if (!member) return null;
  const showTag = member.tag.trim().toLowerCase() !== member.position.trim().toLowerCase();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white/[0.06] backdrop-blur-2xl border-t border-[rgba(148,163,184,0.2)] max-h-[85vh]">
        <DrawerTitle className="sr-only">{member.name}</DrawerTitle>
        <div className="overflow-y-auto px-5 pb-8 pt-2">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/[0.1] mb-4">
            {member.image ? (
              <AnimatedImage
                src={member.image}
                alt={member.name}
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
              {showTag && member.tag}
            </span>
            <h2 className="font-bold text-xl text-foreground mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {member.name}
            </h2>
            <p className="text-sm font-semibold text-primary/80 mb-3">
              {member.position}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {member.description}
            </p>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:border-primary/30 hover:bg-white/[0.12] transition-all text-sm text-muted-foreground hover:text-primary"
                aria-label={`View ${member.name}'s LinkedIn profile`}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TeamProfileDrawer;
