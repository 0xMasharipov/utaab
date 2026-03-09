import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo-new.png';
import { BrandText } from '@/components/common/BrandText';
import { useLanguageTransition } from '@/hooks/useLanguageTransition';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isScrolled = false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [panelTop, setPanelTop] = useState(68);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { getTransitionClasses } = useLanguageTransition();


  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 150);
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  // Measure navbar bottom for panel positioning
  useEffect(() => {
    const updatePanelTop = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setPanelTop(rect.bottom + 4);
      }
    };
    updatePanelTop();
    window.addEventListener('resize', updatePanelTop);
    return () => window.removeEventListener('resize', updatePanelTop);
  }, []);

  // Escape key
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  const scrollToSection = (id: string) => {
    closeMenu();
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

  const navItems = [
    { key: 'community', id: 'community' },
    { key: 'learn', id: 'learn' },
    { key: 'events', id: 'events' },
    { key: 'projects', id: 'projects' },
    { key: 'resources', id: 'resources' },
  ];

  const pageNavItems = [
    { key: 'blog', path: '/blog' },
    { key: 'team', path: '/team' },
  ];

  const handleNavigate = (path: string) => {
    closeMenu();
    setTimeout(() => navigate(path), prefersReducedMotion ? 0 : 200);
  };

  return (
    <>
      <nav ref={navRef} className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[95%] max-w-6xl transition-[transform,opacity] duration-300">
        <div
          className={`rounded-full px-4 sm:px-5 md:px-8 py-3 sm:py-4 border transition-all duration-300 ${
            isScrolled
              ? 'border-white/20 shadow-xl shadow-primary/15'
              : 'border-white/10 shadow-lg shadow-primary/5'
          }`}
          style={{
            background: isScrolled
              ? 'linear-gradient(135deg, rgba(10, 10, 20, 0.9) 0%, rgba(20, 30, 60, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(10, 20, 50, 0.25) 0%, rgba(20, 40, 80, 0.2) 50%, rgba(10, 20, 50, 0.25) 100%)',
            backdropFilter: 'blur(24px) saturate(200%) brightness(0.95)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(0.95)',
            boxShadow: isScrolled
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => {
                if (window.location.pathname === '/') scrollToSection('hero');
                else navigate('/');
              }}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
              aria-label="UTAAB - Home"
            >
              <div className="relative h-8 sm:h-10 w-8 sm:w-10 flex-shrink-0">
                {!logoLoaded && <div className="absolute inset-0 rounded-lg bg-muted animate-pulse" />}
                <img
                  src={logo}
                  alt="UTAA Blockchain"
                  className={`h-8 sm:h-10 w-auto mix-blend-lighten brightness-110 transition-opacity duration-500 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  width="40" height="40"
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
              <BrandText variant="navbar-mobile" className={`sm:hidden transition-opacity duration-500 delay-100 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`} />
              <BrandText variant="navbar-tablet" className={`hidden sm:block md:hidden transition-opacity duration-500 delay-100 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`} />
              <BrandText variant="navbar-desktop" className={`hidden md:block transition-opacity duration-500 delay-100 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            {/* Right side: Globe + Account + Hamburger */}
            <div className={cn("flex items-center gap-2 flex-shrink-0", isRTL && "flex-row-reverse")} style={{ transform: 'translateZ(0)' }}>
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="glass hover:bg-white/10 rounded-full px-3 min-w-[52px] justify-center" aria-label="Select language">
                    <Globe className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{currentLanguage.flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"} className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl min-w-[180px] z-[100]">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`cursor-pointer px-4 py-2 rounded-xl ${i18n.language === lang.code ? 'bg-accent/20 text-accent-foreground' : 'hover:bg-white/10'}`}
                    >
                      <span className={isRTL ? "ml-2" : "mr-2"}>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="glass hover:bg-white/10 rounded-full px-3 hidden sm:inline-flex" aria-label="Account menu">
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"} className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl min-w-[200px] z-[100]">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Student</div>
                  <DropdownMenuItem onClick={() => navigate('/education/sign-in')} className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10">
                    {t('nav.studentAuthOptions')}
                  </DropdownMenuItem>
                  <div className="h-px bg-white/20 my-1" />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Admin</div>
                  <DropdownMenuItem onClick={() => navigate('/admin/login')} className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10">
                    {t('nav.adminSignIn')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hamburger — always visible */}
              <button
                ref={hamburgerRef}
                className="text-foreground p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? t('nav.close') : t('nav.menu')}
                aria-expanded={isMenuOpen}
                aria-controls="nav-overlay"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium frosted glass mega menu panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="nav-overlay"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.22, ease: 'easeOut' }}
            className="fixed z-[80] w-[96%] sm:w-[95%] max-w-6xl left-1/2 -translate-x-1/2 overflow-hidden"
            style={{
              top: `${panelTop}px`,
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.25)',
              borderRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.16)',
            }}
          >
            <div className="p-8 sm:p-10 md:py-[60px] md:px-[80px]">
              {/* 3-Column Navigation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 lg:gap-20">
                {/* Column 1 — Ecosystem */}
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[2px] text-white/40 font-semibold mb-4 px-4">
                    {t('nav.ecosystem', 'Ecosystem')}
                  </span>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'community', id: 'community' },
                      { key: 'learn', id: 'learn' },
                      { key: 'events', id: 'events' },
                      { key: 'projects', id: 'projects' },
                    ].map((item, i) => (
                      <motion.button
                        key={item.key}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.2 }}
                        onClick={() => scrollToSection(item.id)}
                        className={getTransitionClasses(
                          "text-left text-lg font-semibold tracking-wide text-white/90 hover:text-white hover:bg-white/[0.08] transition-all duration-200 px-4 py-2.5 rounded-xl"
                        )}
                      >
                        {t(`nav.${item.key}`)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Column 2 — Explore */}
                <div className="flex flex-col sm:border-0 border-t border-white/[0.08] pt-4 sm:pt-0">
                  <span className="text-xs uppercase tracking-[2px] text-white/40 font-semibold mb-4 px-4">
                    {t('nav.explore', 'Explore')}
                  </span>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'resources', type: 'scroll', id: 'resources' },
                      { key: 'blog', type: 'page', path: '/blog' },
                      { key: 'education', type: 'page', path: '/education', label: 'education.title' },
                    ].map((item, i) => (
                      <motion.button
                        key={item.key}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * (i + 4), duration: 0.2 }}
                        onClick={() => item.type === 'scroll' ? scrollToSection(item.id!) : handleNavigate(item.path!)}
                        className={getTransitionClasses(
                          "text-left text-lg font-semibold tracking-wide text-white/90 hover:text-white hover:bg-white/[0.08] transition-all duration-200 px-4 py-2.5 rounded-xl"
                        )}
                      >
                        {t(item.label || `nav.${item.key}`)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Column 3 — Organization */}
                <div className="flex flex-col sm:border-0 border-t border-white/[0.08] pt-4 sm:pt-0">
                  <span className="text-xs uppercase tracking-[2px] text-white/40 font-semibold mb-4 px-4">
                    {t('nav.organization', 'Organization')}
                  </span>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'team', type: 'page', path: '/team' },
                      { key: 'join', type: 'scroll', id: 'join' },
                    ].map((item, i) => (
                      <motion.button
                        key={item.key}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * (i + 7), duration: 0.2 }}
                        onClick={() => item.type === 'scroll' ? scrollToSection(item.id!) : handleNavigate(item.path!)}
                        className={getTransitionClasses(
                          "text-left text-lg font-semibold tracking-wide text-white/90 hover:text-white hover:bg-white/[0.08] transition-all duration-200 px-4 py-2.5 rounded-xl"
                        )}
                      >
                        {t(`nav.${item.key}`)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/[0.10] my-6 sm:my-8" />

              {/* Bottom CTA Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Action buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => handleNavigate('/education')}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600/90 to-blue-500/90 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-full min-h-[40px] px-6 shadow-sm text-sm"
                    size="sm"
                  >
                    {t('education.title')}
                  </Button>
                  <Button
                    onClick={() => scrollToSection('join')}
                    variant="outline"
                    className="flex-1 sm:flex-none bg-white/[0.06] border-white/20 hover:bg-white/[0.12] text-white font-semibold rounded-full min-h-[40px] px-6 text-sm"
                    size="sm"
                  >
                    {t('nav.join')}
                  </Button>
                </div>

                {/* Center: Auth */}
                <button
                  onClick={() => handleNavigate('/education/sign-in')}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-white/70 border border-white/[0.12] hover:bg-white/[0.08] transition-all duration-200 py-2 px-5 rounded-full bg-transparent"
                >
                  <User className="h-3.5 w-3.5 text-white/50" />
                  {t('nav.studentAuthOptions')}
                </button>

                {/* Right: Language selector */}
                <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all duration-200 text-xs ${
                        i18n.language === lang.code
                          ? 'bg-white/[0.12] text-white font-medium'
                          : 'hover:bg-white/[0.06] text-white/50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="hidden md:inline">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
