import { useState, useEffect, useRef } from 'react';
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
import logo from '@/assets/logo.png';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Focus first item
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [isMobileMenuOpen]);

  // Focus trap
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }

      if (e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 150);
  };

  const scrollToSection = (id: string) => {
    closeMobileMenu();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
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

  const handleEducationClick = () => {
    closeMobileMenu();
    setTimeout(() => {
      navigate('/education');
    }, prefersReducedMotion ? 0 : 200);
  };


  return (
    <nav
      className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-[240ms] ease-out ${
        isScrolled ? 'w-[96%] sm:w-[95%] max-w-6xl' : 'w-[92%] sm:w-[90%] max-w-5xl'
      }`}
    >
      <div 
        className={`glass-strong rounded-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-200 ${
          isScrolled ? 'shadow-[0_8px_32px_hsl(var(--primary)/0.15)]' : 'shadow-[0_4px_16px_hsl(var(--primary)/0.1)]'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo + Branding */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 group"
            aria-label="UTAA Blockchain - Home"
          >
            <img src={logo} alt="UTAA Blockchain" className="h-8 sm:h-10 w-auto transition-transform duration-200 group-hover:scale-105" />
            <span className="text-lg sm:text-xl font-bold tracking-tight hidden xs:inline">
              UTAA<span className="text-primary">B</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-180 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}
          </div>

          {/* Right side - Education + Language + Account + Join Button */}
          <div className="flex items-center gap-2">
            {/* Education Button */}
            <Button
              onClick={handleEducationClick}
              variant="ghost"
              size="sm"
              className="glass hover:bg-white/10 rounded-full px-4 hidden lg:inline-flex transition-all duration-180 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
            >
              {t('education.title')}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass hover:bg-white/10 rounded-full px-3 transition-all duration-180 hover:scale-105"
                  aria-label="Select language"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{currentLanguage.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl min-w-[180px] z-[100] bg-background/95"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-180 ${
                      i18n.language === lang.code
                        ? 'bg-primary/20 text-foreground font-medium'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass hover:bg-white/10 rounded-full px-3 hidden lg:inline-flex transition-all duration-180 hover:scale-105"
                  aria-label="Account menu"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">{t('nav.account')}</span>
                  <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-180 ${isRTL ? 'rotate-90' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl min-w-[200px] z-[100] bg-background/95"
              >
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Student
                </div>
                <DropdownMenuItem
                  onClick={() => { closeMobileMenu(); navigate('/education/signin'); }}
                  className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-180"
                >
                  {t('nav.studentSignIn')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { closeMobileMenu(); navigate('/education/register'); }}
                  className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-180"
                >
                  {t('nav.studentRegister')}
                </DropdownMenuItem>
                <div className="h-px bg-white/20 my-1" />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Admin
                </div>
                <DropdownMenuItem
                  onClick={() => { closeMobileMenu(); navigate('/admin/login'); }}
                  className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-180"
                >
                  {t('nav.adminSignIn')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Join Button */}
            <Button
              onClick={() => scrollToSection('join')}
              className="btn-primary hidden sm:inline-flex transition-all duration-200 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
              size="sm"
            >
              {t('nav.join')}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              ref={hamburgerRef}
              className="lg:hidden text-foreground p-2 hover:bg-white/10 rounded-full transition-all duration-180"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('nav.close') : t('nav.menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop - Fully Frosted */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                className="fixed inset-0 z-[60] lg:hidden"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(16px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                  pointerEvents: 'auto',
                }}
                onClick={closeMobileMenu}
                aria-hidden="true"
              />
              
              {/* Menu Panel - Rounded Rectangle Glass */}
              <motion.div
                id="mobile-menu"
                ref={menuRef}
                role="menu"
                aria-modal="true"
                aria-label={t('nav.menu')}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.4, 0, 0.2, 1] }}
                className={`fixed top-20 ${isRTL ? 'right-4' : 'left-4'} ${isRTL ? 'left-4' : 'right-4'} max-h-[calc(100vh-6rem)] overflow-y-auto z-[70] lg:hidden rounded-3xl border border-white/20`}
                style={{
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                  paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
                  background: 'hsl(var(--background) / 0.95)',
                  backdropFilter: 'blur(32px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                  boxShadow: '0 8px 32px hsl(var(--primary) / 0.2)',
                }}
              >
                {/* Close Button */}
                <div className="flex justify-end pt-4 pb-2">
                  <button
                    ref={closeButtonRef}
                    onClick={closeMobileMenu}
                    className="text-foreground hover:text-primary transition-all duration-180 p-2 rounded-full hover:bg-white/10"
                    aria-label={t('nav.close')}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col gap-1 pb-6">
                  {navItems.map((item) => (
                    <button
                      key={item.key}
                      role="menuitem"
                      onClick={() => scrollToSection(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          scrollToSection(item.id);
                        }
                      }}
                      className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                    >
                      {t(`nav.${item.key}`)}
                    </button>
                  ))}
                  
                  <div className="h-px bg-border my-2" />
                  
                  <button
                    role="menuitem"
                    onClick={handleEducationClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEducationClick();
                      }
                    }}
                    className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('education.title')}
                  </button>

                  <div className="h-px bg-border my-2" />

                  {/* Account Section */}
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                    {t('nav.account')}
                  </div>

                  <button
                    role="menuitem"
                    onClick={() => { closeMobileMenu(); setTimeout(() => navigate('/education/signin'), 200); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        closeMobileMenu();
                        setTimeout(() => navigate('/education/signin'), 200);
                      }
                    }}
                    className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('nav.studentSignIn')}
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => { closeMobileMenu(); setTimeout(() => navigate('/education/register'), 200); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        closeMobileMenu();
                        setTimeout(() => navigate('/education/register'), 200);
                      }
                    }}
                    className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('nav.studentRegister')}
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => { closeMobileMenu(); setTimeout(() => navigate('/admin/login'), 200); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        closeMobileMenu();
                        setTimeout(() => navigate('/admin/login'), 200);
                      }
                    }}
                    className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('nav.adminSignIn')}
                  </button>

                  <div className="h-px bg-border my-2" />

                  {/* CTA Button */}
                  <Button
                    onClick={() => scrollToSection('join')}
                    className="btn-primary w-full mt-2 min-h-[44px]"
                    size="lg"
                  >
                    {t('nav.join')}
                  </Button>

                  {/* Language Switcher in Menu */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3 px-4">{t('nav.language')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                          }}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl min-h-[44px] transition-all duration-180 ${
                            i18n.language === lang.code
                              ? 'bg-primary/20 text-foreground font-medium'
                              : 'hover:bg-white/10 text-foreground'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-sm">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
