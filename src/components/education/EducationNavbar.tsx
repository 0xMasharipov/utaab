import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

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
  // SECURITY NOTE: This client-side isAdmin check is for UX only (showing/hiding UI elements).
  // All actual admin operations MUST be validated server-side in edge functions.
  const [isAdmin, setIsAdmin] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has admin role
  // SECURITY NOTE: This client-side check is for UX only (showing/hiding admin menu items).
  // All actual admin operations MUST be validated server-side in edge functions.
  useEffect(() => {
    if (!user?.id) {
      setIsAdmin(false);
      return;
    }

    supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data);
      });
  }, [user?.id]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/education');
  };

  const navItems = [
    { label: t('education.home.categories'), path: '/education' },
    { label: t('education.catalog.all_courses'), path: '/education/courses' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/education/admin' });
  }

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'w-[95%] max-w-6xl' : 'w-[90%] max-w-5xl'
      }`}
    >
      <div className={`glass-strong rounded-full px-6 py-4 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/education')}
            className="text-xl font-bold text-foreground hover:text-accent transition-colors"
          >
            UTAAB Edu
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side - Language + User */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass hover:bg-white/10 rounded-full px-3"
                  aria-label="Select language"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{currentLanguage.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
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
                    className="glass hover:bg-white/10 rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-strong border-white/20 backdrop-blur-2xl rounded-2xl z-[100]"
                >
                  <DropdownMenuItem onClick={() => navigate('/education/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/education/register')}
                className="btn-primary hidden sm:inline-flex"
                size="sm"
              >
                {t('education.register')}
              </Button>
            )}

            {/* Main Site Link */}
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              size="sm"
              className="glass hidden md:inline-flex"
            >
              Main Site
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Main Site
              </Button>
              {!user && (
                <Button
                  onClick={() => navigate('/education/register')}
                  className="btn-primary w-full"
                  size="sm"
                >
                  {t('education.register')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
