import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface ProfileOverviewProps {
  profile: any;
  user: any;
}

export default function ProfileOverview({ profile, user }: ProfileOverviewProps) {
  return (
    <div className="space-y-6">
      {/* About */}
      <Card className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{profile?.department || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(user?.created_at).toLocaleDateString()}</span>
          </div>
          {profile?.locale && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Language: {profile.locale.toUpperCase()}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Focus Areas */}
      {profile?.focus_areas && profile.focus_areas.length > 0 && (
        <Card className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">Focus Areas</h2>
          <div className="flex flex-wrap gap-2">
            {profile.focus_areas.map((area: string, index: number) => (
              <Badge key={index} variant="secondary">
                {area}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">No recent activity</p>
      </Card>
    </div>
  );
}
