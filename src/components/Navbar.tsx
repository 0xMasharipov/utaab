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
import { cn } from '@/lib/utils';
import logo from '@/assets/logo-small.webp';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { getTransitionClasses } = useLanguageTransition();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
      className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[95%] max-w-6xl transition-[transform,opacity] duration-300"
    >
      
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
        {/* Grid layout: Logo | Center Nav | Right Actions */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo - Left column (fixed) */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="UTAAB - Home"
          >
            <img 
              src={logo} 
              alt="UTAA Blockchain" 
              className="h-8 sm:h-10 w-auto bg-transparent mix-blend-lighten brightness-110 object-contain" 
              width="40" 
              height="40"
              fetchPriority="high"
              decoding="async"
            />
            <BrandText 
              variant="navbar-mobile" 
              className="sm:hidden"
            />
            <BrandText 
              variant="navbar-tablet" 
              className="hidden sm:block md:hidden"
            />
            <BrandText 
              variant="navbar-desktop" 
              className="hidden md:block"
            />
          </button>

          {/* Desktop Navigation - Center column (independent space) */}
          <div className="hidden md:flex items-center justify-center overflow-hidden">
            <div 
              className={`flex items-center gap-4 lg:gap-6 max-w-full overflow-hidden transition-all duration-300 ${
                isScrolled 
                  ? 'opacity-100 pointer-events-auto translate-y-0' 
                  : 'opacity-0 pointer-events-none -translate-y-1'
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.id)}
                  className={getTransitionClasses("text-sm font-medium text-muted-foreground hover:text-foreground transition-colors navbar-text-truncate")}
                >
                  {t(`nav.${item.key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer for mobile (when nav is hidden) */}
          <div className="md:hidden" />

          {/* Right side - Actions + Join Button (fixed column) */}
          <div className={cn(
            "flex items-center gap-2 flex-shrink-0",
            isRTL && "flex-row-reverse"
          )} style={{ transform: 'translateZ(0)' }}>
            {/* Education Button */}
            <Button
              onClick={handleEducationClick}
              variant="ghost"
              size="sm"
              className={getTransitionClasses("glass hover:bg-white/10 rounded-full px-3 hidden md:inline-flex max-w-[140px] justify-center truncate")}
            >
              {t('nav.educationShort')}
            </Button>
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass hover:bg-white/10 rounded-full px-3 min-w-[52px] justify-center"
                  aria-label="Select language"
                >
                  <Globe className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{currentLanguage.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl min-w-[180px] z-[100]"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`cursor-pointer px-4 py-2 rounded-xl ${
                      i18n.language === lang.code
                        ? 'bg-accent/20 text-accent-foreground'
                        : 'hover:bg-white/10'
                    }`}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass hover:bg-white/10 rounded-full px-3 hidden lg:inline-flex"
                  aria-label="Account menu"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden xl:inline mx-1 max-w-[80px] truncate">{t('nav.account')}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl min-w-[200px] z-[100]"
              >
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Student
                </div>
                <DropdownMenuItem
                  onClick={() => { closeMobileMenu(); navigate('/education/sign-in'); }}
                  className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10"
                >
                  {t('nav.studentAuthOptions')}
                </DropdownMenuItem>
                <div className="h-px bg-white/20 my-1" />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Admin
                </div>
                <DropdownMenuItem
                  onClick={() => { closeMobileMenu(); navigate('/admin/login'); }}
                  className="cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10"
                >
                  {t('nav.adminSignIn')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Join Button */}
            <Button
              onClick={() => scrollToSection('join')}
              className={getTransitionClasses("btn-navbar-cta hidden sm:inline-flex max-w-[130px] justify-center truncate")}
            >
              {t('nav.joinShort')}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              ref={hamburgerRef}
              className="md:hidden text-foreground"
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
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                className="fixed inset-0 z-[60] md:hidden"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  pointerEvents: 'auto',
                }}
                onClick={closeMobileMenu}
                aria-hidden="true"
              />
              
              {/* Menu Panel */}
              <motion.div
                id="mobile-menu"
                ref={menuRef}
                role="menu"
                aria-modal="true"
                aria-label={t('nav.menu')}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                className={`fixed top-20 ${isRTL ? 'right-2' : 'left-2'} ${isRTL ? 'left-2' : 'right-2'} max-h-[85vh] overflow-y-auto z-[70] md:hidden rounded-3xl shadow-2xl border border-white/30`}
                style={{
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                  paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(32px) saturate(200%) brightness(0.95)',
                  WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(0.95)',
                }}
              >
                {/* Close Button */}
                <div className="flex justify-end pt-4 pb-2">
                  <button
                    ref={closeButtonRef}
                    onClick={closeMobileMenu}
                    className="text-white hover:text-accent transition-colors p-2 rounded-full hover:bg-white/20"
                    aria-label={t('nav.close')}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col gap-1 pb-6">
                  {navItems.map((item, index) => (
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
                      className="text-left text-base font-medium text-white hover:text-accent hover:bg-white/15 transition-all py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                    >
                      {t(`nav.${item.key}`)}
                    </button>
                  ))}
                  
                  <div className="h-px bg-white/20 my-2" />
                  
                  <button
                    role="menuitem"
                    onClick={handleEducationClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEducationClick();
                      }
                    }}
                    className="text-left text-base font-medium text-white hover:text-accent hover:bg-white/15 transition-all py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('education.title')}
                  </button>

                  <div className="h-px bg-white/20 my-2" />

                  {/* Account Section */}
                  <div className="px-4 py-2 text-xs font-semibold text-white/70">
                    {t('nav.account')}
                  </div>

                  <button
                    role="menuitem"
                    onClick={() => { closeMobileMenu(); setTimeout(() => navigate('/education/sign-in'), 200); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        closeMobileMenu();
                        setTimeout(() => navigate('/education/sign-in'), 200);
                      }
                    }}
                    className="text-left text-base font-medium text-white hover:text-accent hover:bg-white/15 transition-all py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('nav.studentAuthOptions')}
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
                    className="text-left text-base font-medium text-white hover:text-accent hover:bg-white/15 transition-all py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('nav.adminSignIn')}
                  </button>

                  <div className="h-px bg-white/20 my-2" />

                  {/* CTA Button */}
                  <Button
                    onClick={() => scrollToSection('join')}
                    className="btn-primary w-full mt-2 min-h-[44px]"
                    size="lg"
                  >
                    {t('nav.join')}
                  </Button>

                  {/* Language Switcher in Menu */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs text-white/70 mb-3 px-4">{t('nav.language')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                          }}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl min-h-[44px] transition-all ${
                            i18n.language === lang.code
                              ? 'bg-accent/30 text-white font-medium'
                              : 'hover:bg-white/15 text-white'
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
