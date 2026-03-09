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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { getTransitionClasses } = useLanguageTransition();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isMenuOpen]);

  // Escape key
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 150);
  }, []);

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
      <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[95%] max-w-6xl transition-[transform,opacity] duration-300">
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

      {/* Full-screen blurred navigation overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="nav-overlay"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[80] flex flex-col"
            style={{
              background: 'rgba(8, 16, 36, 0.75)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {/* Close button */}
            <div className="flex justify-end p-6 sm:p-8">
              <button
                onClick={closeMenu}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label={t('nav.close')}
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 -mt-16">
              {/* Section nav links */}
              {navItems.map((item, i) => (
                <motion.button
                  key={item.key}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  onClick={() => scrollToSection(item.id)}
                  className={getTransitionClasses("text-2xl sm:text-3xl font-medium text-white/80 hover:text-white transition-colors")}
                >
                  {t(`nav.${item.key}`)}
                </motion.button>
              ))}

              {/* Page nav links */}
              {pageNavItems.map((item, i) => (
                <motion.button
                  key={item.key}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (navItems.length + i), duration: 0.3 }}
                  onClick={() => handleNavigate(item.path)}
                  className={getTransitionClasses("text-2xl sm:text-3xl font-medium text-white/80 hover:text-white transition-colors")}
                >
                  {t(`nav.${item.key}`)}
                </motion.button>
              ))}

              {/* Divider */}
              <div className="w-16 h-px bg-white/20 my-2" />

              {/* Action buttons */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex flex-col items-center gap-3 w-full max-w-xs"
              >
                <Button
                  onClick={() => handleNavigate('/education')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl min-h-[48px]"
                  size="lg"
                >
                  {t('education.title')}
                </Button>

                <Button
                  onClick={() => scrollToSection('join')}
                  className="btn-primary w-full min-h-[48px]"
                  size="lg"
                >
                  {t('nav.join')}
                </Button>

                {/* Auth links (mobile — visible on sm:hidden since account dropdown handles desktop) */}
                <div className="flex flex-col items-center gap-2 w-full sm:hidden mt-2">
                  <button
                    onClick={() => handleNavigate('/education/sign-in')}
                    className="flex items-center justify-center gap-2 w-full text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all py-3 px-4 rounded-xl min-h-[44px]"
                  >
                    <User className="h-5 w-5" />
                    {t('nav.studentAuthOptions')}
                  </button>
                  <button
                    onClick={() => handleNavigate('/admin/login')}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors py-2"
                  >
                    {t('nav.adminSignIn')}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Bottom: Language switcher */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="px-6 pb-8 sm:pb-10"
              style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
                      i18n.language === lang.code
                        ? 'bg-white/15 text-white font-medium'
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
