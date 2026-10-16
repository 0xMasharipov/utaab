import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import AnimatedImage from '@/components/common/AnimatedImage';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import type { TeamMemberView } from '@/hooks/useTeamMembers';
import '@/styles/team-roster.css';

interface RosterProps {
  members: TeamMemberView[];
  profileOpen: boolean;
  onProfile: (member: TeamMemberView) => void;
}

function Portrait({ member, slot, duplicate, selected, onSelect, onProfile }: {
  member: TeamMemberView; slot: string; duplicate: boolean; selected: boolean;
  onSelect: (slot: string | null, element?: HTMLElement) => void;
  onProfile: (member: TeamMemberView) => void;
}) {
  const { t } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();
  const [failed, setFailed] = useState(false);
  const pointerType = useRef('keyboard');
  const initials = member.name.trim().split(/\s+/).map(word => word[0]).filter(Boolean);
  return (
    <article className="team-roster-portrait" data-selected={selected} aria-hidden={duplicate || undefined}
      onPointerDown={event => { pointerType.current = event.pointerType; }}
      onPointerEnter={event => { if (event.pointerType === 'mouse') onSelect(slot, event.currentTarget); }}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) onSelect(null);
      }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onSelect(null); }}
      onKeyDown={event => { if (event.key === 'Escape') { onSelect(null); event.stopPropagation(); } }}>
      <div className="team-roster-photo">
        {member.image && !failed ? <AnimatedImage src={member.image} alt="" loading="lazy"
          className="h-full w-full object-cover" containerClassName="h-full w-full"
          onError={() => setFailed(true)} /> :
          <div className="team-roster-initials" aria-hidden="true">{initials[0]}{initials.length > 1 ? initials[initials.length - 1] : ''}</div>}
      </div>
      <Button variant="ghost" className="team-roster-hit" tabIndex={duplicate ? -1 : 0}
        aria-label={`${member.name}, ${member.position}`} aria-expanded={selected}
        aria-controls={`roster-${slot}`}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) onSelect(slot, event.currentTarget.parentElement ?? undefined); }}
        onClick={event => onSelect(selected && pointerType.current !== 'mouse' ? null : slot, event.currentTarget.parentElement ?? undefined)} />
      <span className={getTransitionClasses('team-roster-chip')}>{member.position}</span>
      <div id={`roster-${slot}`} className="team-roster-details" aria-hidden={!selected}
        {...(!selected ? { inert: '' } : {})}>
        <h2 className={getTransitionClasses()}>{member.name}</h2>
        <p className={getTransitionClasses('team-roster-role')}>{member.position}</p>
        {member.description && <p className={getTransitionClasses('team-roster-bio')}>{member.description}</p>}
        <Button variant="ghost" className="team-roster-profile" tabIndex={duplicate ? -1 : 0}
          onClick={() => onProfile(member)}>
          {t('team.roster.profile')}<ArrowUpRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </article>
  );
}

/** Natural-photo adaptation of the supplied drifting portrait roster. */
export default function UtaabTeamRoster({ members, profileOpen, onProfile }: RosterProps) {
  const { t, i18n } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();
  const root = useRef<HTMLElement>(null);
  const nudgeFrame = useRef(0);
  const [active, setActive] = useState<string | null>(null);
  const [unseen, setUnseen] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [columns, setColumns] = useState(window.innerWidth <= 1100 ? 2 : 3);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setUnseen(!entry?.isIntersecting));
    observer.observe(element);
    const visibility = () => setHidden(document.hidden);
    const resize = () => { setColumns(window.innerWidth <= 1100 ? 2 : 3); setActive(null); };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('resize', resize);
    return () => { observer.disconnect(); cancelAnimationFrame(nudgeFrame.current); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('resize', resize); };
  }, []);
  const select = useCallback((slot: string | null, card?: HTMLElement) => {
    cancelAnimationFrame(nudgeFrame.current);
    setActive(slot);
    if (!slot) {
      root.current?.querySelectorAll<HTMLElement>('.team-roster-nudge').forEach(element => { element.style.transform = ''; });
      return;
    }
    if (!card) return;
    const frame = card.closest<HTMLElement>('.team-roster-column, .team-roster-strip');
    const nudge = card.closest<HTMLElement>('.team-roster-nudge');
    if (!frame || !nudge) return;
    nudgeFrame.current = requestAnimationFrame(() => {
      const bounds = frame.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      const strip = frame.classList.contains('team-roster-strip');
      const delta = strip ? rect.left < bounds.left + 20 ? bounds.left + 20 - rect.left : rect.right > bounds.right - 20 ? bounds.right - 20 - rect.right : 0
        : rect.top < bounds.top + 30 ? bounds.top + 30 - rect.top : rect.bottom > bounds.bottom - 30 ? bounds.bottom - 30 - rect.bottom : 0;
      if (delta) nudge.style.transform = strip ? `translate3d(${delta}px,0,0)` : `translate3d(0,${delta}px,0)`;
    });
  }, []);
  useEffect(() => {
    if (!active) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('.team-roster-portrait')) select(null);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [active, select]);
  useEffect(() => { select(null); }, [i18n.language, select]);
  const halted = unseen || hidden || Boolean(active) || profileOpen;
  const renderTrack = (list: TeamMemberView[], prefix: string) => {
    // Fill a complete column before duplicating it; padding is decorative.
    const deck = list.length ? Array.from({ length: Math.max(4, list.length) }, (_, index) => ({ member: list[index % list.length], duplicate: index >= list.length })) : [];
    return <div className="team-roster-nudge"><div className="team-roster-track"
      style={{ '--team-roster-loop': `${Math.max(48, deck.length * 16)}s` } as CSSProperties}>
      {[0, 1].map(copy => <div key={copy} className="team-roster-set">
        {deck.map(({ member, duplicate }, index) => {
          const slot = `${prefix}-${copy}-${index}`;
          return <Portrait key={slot} member={member} slot={slot} duplicate={duplicate || copy === 1}
            selected={active === slot} onSelect={select} onProfile={onProfile} />;
        })}
      </div>)}
    </div></div>;
  };
  return <section ref={root} className="team-roster" data-halted={halted} aria-labelledby="utaab-team-title">
    <div className="team-roster-stage">
      <div className="team-roster-copy">
        <h1 id="utaab-team-title" className={getTransitionClasses('team-roster-title')}>
          {t('team.roster.heading')}
        </h1>
        <p className={getTransitionClasses('team-roster-intro')}>{t('team.roster.intro')}</p>
      </div>
      <div className="team-roster-wall" role="group" aria-label={t('team.title')}>
        {Array.from({ length: columns }, (_, column) => <div className="team-roster-column" key={column}>
          {renderTrack(members.filter((_, index) => index % columns === column), `c${column}`)}
        </div>)}
      </div>
      <div className="team-roster-strip" role="group" aria-label={t('team.title')}>
        {renderTrack(members, 's')}
      </div>
    </div>
    <nav className="team-roster-directory" aria-label={t('team.roster.directory')}>
      <p className={getTransitionClasses('team-roster-directory-heading')}>{t('team.roster.directory')}</p>
      <div className="team-roster-directory-list">{members.map(member => <Button key={member.id} variant="ghost" className="team-roster-directory-link"
        onClick={() => onProfile(member)}>{member.name}</Button>)}
      </div>
    </nav>
  </section>;
}