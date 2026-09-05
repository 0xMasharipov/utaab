import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpLeft,
  Book,
  HomeSimple,
  LogOut,
  User,
} from 'iconoir-react';
import { useTranslation } from 'react-i18next';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import logo from '@/assets/logo-new.webp';
import { BrandText } from '@/components/common/BrandText';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/education.css';

type DockIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

interface DockItem {
  label: string;
  path: string;
  icon: DockIcon;
  active: boolean;
}

const dockScale = (hovered: number | null, index: number, reduceMotion: boolean | null) => {
  if (reduceMotion || hovered === null) return 1;
  const distance = Math.abs(hovered - index);
  if (distance === 0) return 1.2;
  if (distance === 1) return 1.08;
  return 1;
};

export const EducationNavbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.body.classList.add('education-mode');
    return () => document.body.classList.remove('education-mode');
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const items = useMemo<DockItem[]>(() => [
    {
      label: t('educationNav.home', { defaultValue: 'Education home' }),
      path: '/education',
      icon: HomeSimple,
      active: location.pathname === '/education',
    },
    {
      label: t('education.catalog.all_courses'),
      path: '/education/courses',
      icon: Book,
      active: location.pathname.includes('/education/course') ||
        location.pathname.includes('/education/learn') ||
        location.pathname === '/education/courses' ||
        location.pathname === '/education/blockchain-and-money',
    },
    {
      label: user ? t('educationNav.profile') : t('educationNav.studentSignIn'),
      path: user ? '/education/profile' : '/education/sign-in',
      icon: User,
      active: location.pathname.includes('/education/profile') ||
        location.pathname.includes('/education/instructor') ||
        location.pathname.includes('/education/sign-in') ||
        location.pathname.includes('/education/register'),
    },
    {
      label: t('educationNav.mainSite'),
      path: '/',
      icon: ArrowUpLeft,
      active: false,
    },
  ], [location.pathname, t, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/education');
  };

  const dock = (mobile = false) => (
    <nav
      aria-label={t('educationNav.mobileMenu', { defaultValue: 'Education navigation' })}
      className={mobile ? 'edu-mobile-dock' : `edu-side-dock ${isRTL ? 'edu-side-dock--rtl' : ''}`}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.path}
            animate={{ scale: mobile ? 1 : dockScale(hovered, index, reduceMotion) }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 24 }}
            className="edu-dock-item"
            onMouseEnter={() => setHovered(index)}
          >
            <Link
              to={item.path}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              className={`edu-dock-link ${item.active ? 'is-active' : ''}`}
            >
              <Icon className="h-[19px] w-[19px]" strokeWidth={1.7} />
              {mobile && <span>{item.label}</span>}
            </Link>
            {!mobile && (
              <span role="tooltip" className={`edu-dock-tooltip ${isRTL ? 'edu-dock-tooltip--rtl' : ''}`}>
                {item.label}
              </span>
            )}
          </motion.div>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="edu-topbar">
        <div className="edu-topbar__inner">
          <Link to="/education" className="edu-brand" aria-label="UTAAB Edu">
            <img src={logo} alt="" className="h-8 w-8 object-contain" width="32" height="32" />
            <BrandText variant="navbar-mobile" />
            <span className="edu-brand__division">EDU</span>
          </Link>

          <div className="edu-topbar__actions">
            <LanguageSelector sideOffset={12} />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="edu-account-button" aria-label={t('educationNav.profile')}>
                    <User className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="edu-menu-content">
                  <DropdownMenuItem onClick={() => navigate('/education/profile')}>
                    <User className="me-2 h-4 w-4" strokeWidth={1.7} />
                    {t('educationNav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="me-2 h-4 w-4" strokeWidth={1.7} />
                    {t('educationNav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/education/register" className="edu-register-link">
                {t('education.register')}
              </Link>
            )}
          </div>
        </div>
      </header>
      {dock(false)}
      {dock(true)}
    </>
  );
};
