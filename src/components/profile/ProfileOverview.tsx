import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileOverviewProps {
  profile: any;
  user: any;
}

export default function ProfileOverview({ profile, user }: ProfileOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4">{t('profile.overviewSection.about')}</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{profile?.department || t('profile.overviewSection.notSpecified')}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{t('profile.overviewSection.joined')} {new Date(user?.created_at).toLocaleDateString()}</span>
          </div>
          {profile?.locale && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{t('profile.overviewSection.language')} {profile.locale.toUpperCase()}</span>
            </div>
          )}
        </div>
      </Card>

      {profile?.focus_areas && profile.focus_areas.length > 0 && (
        <Card className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">{t('profile.overviewSection.focusAreas')}</h2>
          <div className="flex flex-wrap gap-2">
            {profile.focus_areas.map((area: string, index: number) => (
              <Badge key={index} variant="secondary">
                {area}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4">{t('profile.overviewSection.recentActivity')}</h2>
        <p className="text-muted-foreground">{t('profile.overviewSection.noRecentActivity')}</p>
      </Card>
    </div>
  );
}
