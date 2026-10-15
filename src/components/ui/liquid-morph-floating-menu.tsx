import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Xmark, User, ArrowUpRight } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import AnimatedImage from '@/components/common/AnimatedImage';
import { LANGUAGES, resolveLanguage } from '@/components/common/LanguageSelector';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { useFloatingNavigation } from '@/hooks/useFloatingNavigation';
import lockup from '@/assets/utaab-lockup.png.asset.json';
import mark from '@/assets/menu-diamonds.png.asset.json';
import '@/styles/floating-navigation.css';

export interface FloatingMenuGroup {
  label: string;
  items: { label: string; destination: string; section?: boolean }[];
}
interface FloatingMenuProps {
  groups: FloatingMenuGroup[];
  routeKey: string;
  onNavigate: (destination: string, section?: boolean) => void;
}
const ease = [0.22, 1, 0.36, 1] as const;

export default function FloatingMenu({ groups, routeKey, onNavigate }: FloatingMenuProps) {
  const { t, i18n } = useTranslation();
  const { getTransitionClasses } = useLanguageTransition();
  const reducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollVisible, footerVisible } = useFloatingNavigation(routeKey);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLButtonElement>(null);
  const visible = !footerVisible && (scrollVisible || isOpen);
  const close = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }, []);

  useEffect(() => { setIsOpen(false); }, [routeKey]);
  useEffect(() => {
    if (!footerVisible) return;
    if (container.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement)?.blur();
    }
    setIsOpen(false);
  }, [footerVisible]);
  useEffect(() => {
    if (!isOpen) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) close();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(true); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [isOpen, close]);

  const go = (destination: string, section?: boolean) => {
    close(true);
    onNavigate(destination, section);
  };

  return (
    <div ref={container} className="floating-nav-anchor" data-visible={visible} data-open={isOpen}
      aria-hidden={!visible} {...(!visible ? { inert: '' } : {})}
      onKeyDown={event => {
        if (!isOpen || event.key !== 'Tab') return;
        const buttons = container.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
        const first = buttons?.[0];
        const last = buttons?.[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
      <div className={`liquid-nav ${isOpen ? 'liquid-nav--open' : ''}`}>
        <div className="liquid-nav-light" aria-hidden="true" />
        <AnimatePresence initial={false}>
          {isOpen && visible && (
            <motion.div id="public-floating-menu" className="liquid-nav-panel"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.45, ease }}>
              <nav aria-label={t('nav.menu', 'Menu')} className="liquid-nav-content">
                <div className="liquid-nav-header">
                  <Button ref={firstLink} variant="ghost" className="liquid-nav-brand"
                    aria-label="UTAAB - Home" onClick={() => go('hero', true)}>
                    <AnimatedImage src={lockup.url} alt="UTAAB" width={1544} height={368} className="liquid-nav-lockup" />
                  </Button>
                  <Button size="icon" variant="ghost" className="liquid-nav-close"
                    aria-label={t('nav.close', 'Close')} onClick={() => close(true)}>
                    <Xmark className="h-5 w-5" />
                  </Button>
                </div>
                <div className="liquid-nav-links">
                  {groups.map((group, groupIndex) => (
                    <section key={group.label} className="liquid-nav-group">
                      <h2 className={getTransitionClasses('liquid-nav-group-label')}>{group.label}</h2>
                      {group.items.map((item, index) => (
                        <motion.div key={item.destination}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: reducedMotion ? 0 : 0.12 + (groupIndex * 3 + index) * 0.025, duration: 0.3 }}>
                          <Button variant="ghost" className="liquid-nav-link"
                            onClick={() => go(item.destination, item.section)}>
                            <span className={getTransitionClasses('liquid-nav-link-label')}>
                              <span>{item.label}</span><span aria-hidden="true">{item.label}</span>
                            </span>
                            <ArrowUpRight className="liquid-nav-link-arrow h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </section>
                  ))}
                </div>
                <div className="liquid-nav-actions">
                  <Button onClick={() => go('join', true)} className="liquid-nav-join">{t('nav.join')}</Button>
                  <Button variant="ghost" className="liquid-nav-signin" onClick={() => go('/education/sign-in')}>
                    <User className="h-4 w-4 shrink-0" />{t('nav.studentAuthOptions')}
                  </Button>
                </div>
                <div className="liquid-nav-languages" aria-label="Language">
                  {LANGUAGES.map(language => (
                    <Button key={language.code} variant="ghost" title={language.name} aria-label={language.name}
                      aria-pressed={resolveLanguage(i18n.language).code === language.code}
                      onClick={() => void i18n.changeLanguage(language.code)} className="liquid-nav-language">
                      {language.short}
                    </Button>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        <Button ref={trigger} variant="ghost" className="liquid-nav-trigger"
          aria-label={isOpen ? t('nav.close', 'Close') : t('nav.menu', 'Menu')}
          title={isOpen ? t('nav.close', 'Close') : t('nav.menu', 'Menu')}
          aria-expanded={isOpen} aria-controls={isOpen ? 'public-floating-menu' : undefined}
          tabIndex={visible ? 0 : -1} onClick={() => setIsOpen(open => !open)}
          onKeyDown={event => {
            if (event.key === 'ArrowUp' && !isOpen) {
              event.preventDefault(); setIsOpen(true);
              requestAnimationFrame(() => firstLink.current?.focus());
            }
          }}>
          <img src={mark.url} alt="" width={32} height={32} className="liquid-nav-trigger-mark" />
          <span className="liquid-nav-hamburger" aria-hidden="true"><span /><span /></span>
        </Button>
      </div>
    </div>
  );
}
