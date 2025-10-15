import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut, Linkedin, Send, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const EducationNavbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has admin role using secure server-side endpoint
  useEffect(() => {
    if (!user?.id) {
      setIsAdmin(false);
      return;
    }

    // Use server-side admin check to prevent client-side manipulation
    supabase.functions
      .invoke('check-admin-status')
      .then(({ data }) => {
        setIsAdmin(data?.isAdmin ?? false);
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [user?.id]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 150);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/education');
  };

  const socialLinks = [
    { icon: Linkedin, url: 'https://www.linkedin.com/company/utaab/', label: 'LinkedIn' },
    { icon: Send, url: 'https://t.me/UTAAB', label: 'Telegram' },
    { icon: Instagram, url: 'https://www.instagram.com/utaa.blockchain/', label: 'Instagram' },
  ];

  const navItems = [
    { label: t('education.home.categories'), path: '/education' },
    { label: t('education.catalog.all_courses'), path: '/education/courses' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/education/admin' });
  }

  return (
    <nav
      className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-[240ms] ease-out ${
        isScrolled ? 'w-[96%] sm:w-[95%] max-w-6xl' : 'w-[92%] sm:w-[90%] max-w-5xl'
      }`}
    >
      <div className={`glass-strong rounded-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-200 ${
        isScrolled ? 'shadow-[0_8px_32px_hsl(var(--primary)/0.15)]' : 'shadow-[0_4px_16px_hsl(var(--primary)/0.1)]'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo + Branding */}
          <button
            onClick={() => navigate('/education')}
            className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 group"
            aria-label="UTAA Blockchain Education - Home"
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
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-all duration-180 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full ${
                  location.pathname === item.path
                    ? 'text-foreground after:w-full'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side - Social + Language + User + Main Site */}
          <div className="flex items-center gap-2">
            {/* Social Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="glass hover:bg-white/10 rounded-full p-2 transition-all duration-180 hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

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

            {/* User Menu or Register Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="glass hover:bg-white/10 rounded-full transition-all duration-180 hover:scale-105"
                    aria-label="Account menu"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100] bg-background/95"
                >
                  <DropdownMenuItem 
                    onClick={() => navigate('/education/profile')}
                    className="cursor-pointer transition-all duration-180 hover:bg-white/10"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer transition-all duration-180 hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/education/register')}
                className="btn-primary hidden sm:inline-flex transition-all duration-200 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                size="sm"
              >
                {t('education.register')}
              </Button>
            )}

            {/* Main Site Link */}
            <Button
              onClick={() => (window.location.href = '/')}
              variant="ghost"
              size="sm"
              className="glass hover:bg-white/10 rounded-full px-4 hidden lg:inline-flex transition-all duration-180 hover:scale-105"
            >
              {t('nav.returnToMain')}
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
                      key={item.path}
                      role="menuitem"
                      onClick={() => {
                        navigate(item.path);
                        closeMobileMenu();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(item.path);
                          closeMobileMenu();
                        }
                      }}
                      className={`text-left text-base font-medium transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center ${
                        location.pathname === item.path
                          ? 'text-foreground bg-primary/10'
                          : 'text-foreground hover:text-primary hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  <div className="h-px bg-border my-2" />

                  {/* Register/Sign In or Profile */}
                  {!user && (
                    <Button
                      onClick={() => {
                        navigate('/education/register');
                        closeMobileMenu();
                      }}
                      className="btn-primary w-full mt-2 min-h-[44px]"
                      size="lg"
                    >
                      {t('education.register')}
                    </Button>
                  )}

                  {user && (
                    <>
                      <button
                        role="menuitem"
                        onClick={() => {
                          navigate('/education/profile');
                          closeMobileMenu();
                        }}
                        className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                      >
                        <User className="h-5 w-5 mr-2" />
                        Profile
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                        className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                      </button>
                    </>
                  )}

                  {/* Main Site Link */}
                  <button
                    role="menuitem"
                    onClick={() => (window.location.href = '/')}
                    className="text-left text-base font-medium text-foreground hover:text-primary hover:bg-white/10 transition-all duration-180 py-3 px-4 rounded-xl min-h-[44px] flex items-center"
                  >
                    {t('nav.returnToMain')}
                  </button>

                  {/* Social Links */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3 px-4">{t('nav.social')}</p>
                    <div className="flex items-center justify-center gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="glass hover:bg-white/10 rounded-full p-3 min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-180 hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                        >
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>

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
