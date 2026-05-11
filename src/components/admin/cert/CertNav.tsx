import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CalendarDays, Users, Award, FileImage, Settings } from 'lucide-react';

const items = [
  { label: 'Overview', path: ADMIN_ROUTES.CERT_DASHBOARD, icon: LayoutDashboard },
  { label: 'Events', path: ADMIN_ROUTES.CERT_EVENTS, icon: CalendarDays },
  { label: 'Participants', path: ADMIN_ROUTES.CERT_PARTICIPANTS, icon: Users },
  { label: 'Certificates', path: ADMIN_ROUTES.CERT_RECORDS, icon: Award },
  { label: 'Templates', path: ADMIN_ROUTES.CERT_TEMPLATES, icon: FileImage },
  { label: 'Settings', path: ADMIN_ROUTES.CERT_SETTINGS, icon: Settings },
];

export function CertNav() {
  const nav = useNavigate();
  const loc = useLocation();
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-2xl glass-section border border-white/10">
      {items.map((it) => {
        const active = loc.pathname === it.path;
        const Icon = it.icon;
        return (
          <button
            key={it.path}
            onClick={() => nav(it.path)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
