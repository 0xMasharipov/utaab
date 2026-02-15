import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  Megaphone,
  MessageSquare,
  ImageIcon,
  Users,
  Settings,
  FileText,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users & Roles', path: '/admin/users' },
  { icon: Users, label: 'Communities', path: '/admin/communities' },
  { icon: Calendar, label: 'Events', path: '/admin/events' },
  { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
  { icon: FileText, label: 'Blog', path: '/admin/blog' },
  { icon: FileText, label: 'Site Content', path: '/admin/site-content' },
  { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
  { icon: ImageIcon, label: 'Media Library', path: '/admin/media' },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
  { icon: FileText, label: 'Audit Log', path: '/admin/audit' },
];

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/admin/login');
          return;
        }

        setUser(session.user);

        // Server-side admin verification
        const { data, error } = await supabase.functions.invoke('check-admin-status');
        
        if (error || !data?.isAdmin) {
          await supabase.auth.signOut();
          navigate('/admin/login');
          return;
        }

        setIsVerifying(false);
      } catch (error) {
        console.error('Admin verification failed:', error);
        await supabase.auth.signOut();
        navigate('/admin/login');
      }
    };

    verifyAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/education');
  };

  const isRTL = i18n.language === 'ar';

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
          <h1 className="text-lg font-bold">UTAAB Edu Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 z-40 transition-all duration-300 glass-strong border-r border-white/10',
          isRTL ? 'right-0' : 'left-0',
          isSidebarOpen ? 'w-64' : 'w-20',
          'hidden lg:block'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {isSidebarOpen && (
                <h1 className="text-xl font-bold">
                  UTAAB <span className="text-primary">Admin</span>
                </h1>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={cn(!isSidebarOpen && 'mx-auto')}
              >
                <ChevronLeft className={cn('h-4 w-4 transition-transform', !isSidebarOpen && 'rotate-180')} />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            {isSidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-lg">
          {/* Scrollable container with safe area */}
          <div className="pt-20 pb-safe h-full overflow-y-auto">
            <div className="p-4 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3.5 min-h-[44px] rounded-xl transition-all',
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-white/5 text-muted-foreground hover:text-foreground',
                      'active:bg-white/10'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300 min-h-screen',
          isRTL
            ? isSidebarOpen
              ? 'lg:mr-64'
              : 'lg:mr-20'
            : isSidebarOpen
            ? 'lg:ml-64'
            : 'lg:ml-20',
          'pt-20 lg:pt-0'
        )}
      >
        <div className="p-6 lg:p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
