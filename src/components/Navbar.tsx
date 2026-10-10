import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/common/BrandLogo';
import { LanguageGrid } from '@/components/common/LanguageSelector';
import { LiquidMorphFloatingMenu } from '@/components/ui/liquid-morph-floating-menu';


export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = false;
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setTimeout(() => document.querySelector<HTMLElement>('.utaab-menu-trigger')?.focus(), 150);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => menuRef.current?.querySelector<HTMLElement>('button')?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [isMenuOpen, closeMenu]);

  const scrollToSection = (id: string) => {
    closeMenu();
    if (window.location.pathname !== '/') {
      setTimeout(() => navigate('/', { state: { scrollTo: id } }), prefersReducedMotion ? 0 : 200);
      return;
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - navbarHeight,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    }, prefersReducedMotion ? 0 : 200);
  };

  const handleNavigate = (path: string) => {
    closeMenu();
    setTimeout(() => navigate(path), prefersReducedMotion ? 0 : 200);
  };

  return (
    <>
      <nav className="utaab-nav-cluster" aria-label={t('nav.menu')}>
        <Button asChild variant="ghost" className="utaab-nav-logo" aria-label="UTAAB - Home">
          <a href="/" onClick={(event) => { event.preventDefault(); location.pathname === '/' ? scrollToSection('hero') : navigate('/'); }}>
            <BrandLogo className="w-[138px] sm:w-[168px] h-auto" />
          </a>
        </Button>
        <LiquidMorphFloatingMenu
          ref={menuRef}
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((open) => !open)}
          triggerLabel={t('nav.menu', 'MENU')}
          closeLabel={t('nav.close')}
          panelLabel={t('nav.menu')}
        >
          <div className="utaab-liquid-panel__header">
            <BrandLogo className="w-[148px] h-auto" />
            <span className="utaab-liquid-panel__eyebrow">UTAAB / NAV</span>
          </div>
          <div className="utaab-liquid-panel__scroll">
            <div className="utaab-liquid-panel__sections">
              <section>
                <h2 className="utaab-liquid-panel__label">{t('nav.ecosystem', 'Ecosystem')}</h2>
                <div className="utaab-liquid-panel__links">
                  {[
                    { key: 'community', id: 'community' },
                    { key: 'learn', id: 'learn' },
                    { key: 'events', id: 'events' },
                    { key: 'projects', id: 'projects' },
                  ].map((item, index) => (
                    <Button key={item.key} variant="ghost" className="utaab-liquid-link" onClick={() => scrollToSection(item.id)} style={{ animationDelay: `${0.05 * index}s` }}>
                      <span>{t(`nav.${item.key}`)}</span><span aria-hidden="true">{t(`nav.${item.key}`)}</span>
                    </Button>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="utaab-liquid-panel__label">{t('nav.explore', 'Explore')}</h2>
                <div className="utaab-liquid-panel__links">
                  {[
                    { key: 'resources', path: '/resources' },
                    { key: 'blog', path: '/blog' },
                    { key: 'education', path: '/education', label: 'education.title' },
                    { key: 'verifyCertificate', path: '/verify-certificate' },
                  ].map((item, index) => (
                    <Button key={item.key} variant="ghost" className="utaab-liquid-link" onClick={() => handleNavigate(item.path)} style={{ animationDelay: `${0.05 * (index + 4)}s` }}>
                      <span>{t(item.label ?? `nav.${item.key}`)}</span><span aria-hidden="true">{t(item.label ?? `nav.${item.key}`)}</span>
                    </Button>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="utaab-liquid-panel__label">{t('nav.organization', 'Organization')}</h2>
                <div className="utaab-liquid-panel__links">
                  {[
                    { key: 'about', path: '/about' },
                    { key: 'team', path: '/team' },
                    { key: 'contributorMatch', path: '/contributor-match' },
                  ].map((item, index) => (
                    <Button key={item.key} variant="ghost" className="utaab-liquid-link" onClick={() => handleNavigate(item.path)} style={{ animationDelay: `${0.05 * (index + 8)}s` }}>
                      <span>{t(`nav.${item.key}`)}</span><span aria-hidden="true">{t(`nav.${item.key}`)}</span>
                    </Button>
                  ))}
                  <Button variant="ghost" className="utaab-liquid-link" onClick={() => scrollToSection('join')}>
                    <span>{t('nav.join')}</span><span aria-hidden="true">{t('nav.join')}</span>
                  </Button>
                </div>
              </section>
            </div>
            <div className="utaab-liquid-panel__footer">
              <div className="flex gap-2 w-full">
                <Button onClick={() => handleNavigate('/education')} className="flex-1">{t('education.title')}</Button>
                <Button onClick={() => scrollToSection('join')} variant="outline" className="flex-1 bg-card/50">{t('nav.join')}</Button>
              </div>
              <Button variant="ghost" onClick={() => handleNavigate('/education/sign-in')} className="w-full text-muted-foreground">
                <User className="h-4 w-4" strokeWidth={1.5} />{t('nav.studentAuthOptions')}
              </Button>
              <div className={cn('w-full', isRTL && 'text-right')}><LanguageGrid /></div>
            </div>
          </div>
        </LiquidMorphFloatingMenu>
      </nav>

      {isMenuOpen && <button className="utaab-liquid-backdrop" type="button" onClick={closeMenu} aria-label={t('nav.close')} tabIndex={-1} />}
    </>
  );
};
