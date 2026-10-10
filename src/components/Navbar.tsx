import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Xmark, User } from 'iconoir-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';
import { LanguageSelector, LanguageGrid } from '@/components/common/LanguageSelector';


export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = false;
  const { getTransitionClasses } = useLanguageTransition();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 150);
  }, []);

  // Keep panel mounted during exit animation for smooth close
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuMounted(true);
      return;
    }
    if (!isMenuMounted) return;
    const timer = setTimeout(() => setIsMenuMounted(false), prefersReducedMotion ? 0 : 240);
    return () => clearTimeout(timer);
  }, [isMenuOpen, isMenuMounted, prefersReducedMotion]);

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
        <Button
          ref={hamburgerRef}
          type="button"
          variant="ghost"
          className="utaab-menu-trigger"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? t('nav.close') : t('nav.menu')}
          aria-expanded={isMenuOpen}
          aria-controls="nav-overlay"
        >
          <span className="utaab-menu-grid" aria-hidden="true" />
          <span>{t('nav.menu', 'MENU').toUpperCase()}</span>
        </Button>
      </nav>

      {isMenuMounted && (
        <div className="utaab-drawer-layer" data-state={isMenuOpen ? 'open' : 'closed'}>
          <button className="utaab-drawer-backdrop" type="button" onClick={closeMenu} aria-label={t('nav.close')} tabIndex={-1} />
          <aside
            id="nav-overlay"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            data-state={isMenuOpen ? 'open' : 'closed'}
            className="utaab-drawer"
          >
            <div className="utaab-drawer__header">
              <BrandLogo className="w-[150px] h-auto" />
              <Button
                onClick={closeMenu}
                variant="ghost"
                size="icon"
                className="utaab-drawer__close"
                aria-label={t('nav.close')}
              >
                <Xmark className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </div>
            <div className="utaab-drawer__body">
              <div className="utaab-drawer__sections">
                <section>
                  <h2 className="utaab-drawer__label">
                    {t('nav.ecosystem', 'Ecosystem')}
                  </h2>
                  <div className="utaab-drawer__links">
                    {[
                      { key: 'community', id: 'community' },
                      { key: 'learn', id: 'learn' },
                      { key: 'events', id: 'events' },
                      { key: 'projects', id: 'projects' },
                    ].map((item, i) => (
                      <button
                        key={item.key}
                        onClick={() => scrollToSection(item.id)}
                        className={getTransitionClasses(
                          "utaab-drawer__link nav-menu-item"
                        )}
                        style={{ animationDelay: `${0.03 * i}s` }}
                      >
                        {t(`nav.${item.key}`)}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="utaab-drawer__label">
                    {t('nav.explore', 'Explore')}
                  </h2>
                  <div className="utaab-drawer__links">
                    {[
                      { key: 'resources', type: 'page', path: '/resources' },
                      { key: 'blog', type: 'page', path: '/blog' },
                      { key: 'education', type: 'page', path: '/education', label: 'education.title' },
                      { key: 'verifyCertificate', type: 'page', path: '/verify-certificate' },
                    ].map((item, i) => (
                  <button
                        key={item.key}
                        onClick={() => handleNavigate(item.path)}
                        className={getTransitionClasses(
                          "utaab-drawer__link nav-menu-item"
                        )}
                        style={{ animationDelay: `${0.03 * (i + 4)}s` }}
                      >
                        {t('label' in item ? item.label : `nav.${item.key}`)}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="utaab-drawer__label">
                    {t('nav.organization', 'Organization')}
                  </h2>
                  <div className="utaab-drawer__links">
                    {[
                      { key: 'about', type: 'page', path: '/about', label: 'nav.about' },
                      { key: 'team', type: 'page', path: '/team' },
                      { key: 'contributorMatch', type: 'page', path: '/contributor-match' },
                      { key: 'join', type: 'scroll', id: 'join' },
                    ].map((item, i) => (
                      <button
                        key={item.key}
                        onClick={() => item.type === 'scroll' && item.id ? scrollToSection(item.id) : item.path ? handleNavigate(item.path) : undefined}
                        className={getTransitionClasses(
                          "utaab-drawer__link nav-menu-item"
                        )}
                        style={{ animationDelay: `${0.03 * (i + 7)}s` }}
                      >
                        {t(`nav.${item.key}`)}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <div className="utaab-drawer__footer">
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => handleNavigate('/education')}
                    className="flex-1"
                  >
                    {t('education.title')}
                  </Button>
                  <Button
                    onClick={() => scrollToSection('join')}
                    variant="outline"
                    className="flex-1 bg-card/50"
                  >
                    {t('nav.join')}
                  </Button>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => handleNavigate('/education/sign-in')}
                    className="w-full text-muted-foreground"
                  >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                    {t('nav.studentAuthOptions')}
                </Button>
                <div className={cn('w-full', isRTL && 'text-right')}>
                  <LanguageGrid />
                </div>

              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
