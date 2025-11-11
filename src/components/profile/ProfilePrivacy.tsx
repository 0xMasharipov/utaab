import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfilePrivacyProps {
  profile: any;
  userId: string;
}

export default function ProfilePrivacy({ profile, userId }: ProfilePrivacyProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Privacy & Data</h2>
        <p className="text-muted-foreground">Manage your data and privacy settings</p>
      </div>

      {/* KVKK Consent */}
      <Card className="glass-panel p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">KVKK Consent Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={profile?.kvkk_consent ? 'default' : 'secondary'}>
                {profile?.kvkk_consent ? 'Granted' : 'Not Granted'}
              </Badge>
              {profile?.kvkk_consent_version && (
                <span className="text-sm text-muted-foreground">
                  Version {profile.kvkk_consent_version}
                </span>
              )}
            </div>
            {profile?.kvkk_consent_timestamp && (
              <p className="text-sm text-muted-foreground">
                Granted on: {new Date(profile.kvkk_consent_timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Download className="h-4 w-4" />
            Download My Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => navigate('/kvkk-request')}
          >
            <FileText className="h-4 w-4" />
            Submit KVKK Request
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete My Account
          </Button>
        </div>
      </Card>

      {/* Privacy Documents */}
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Privacy Documents</h3>
        <div className="space-y-2">
          <Button variant="link" className="p-0 h-auto text-primary">
            Privacy Policy
          </Button>
          <Button variant="link" className="p-0 h-auto text-primary">
            KVKK Aydınlatma Metni
          </Button>
          <Button variant="link" className="p-0 h-auto text-primary">
            Cookie Policy
          </Button>
        </div>
      </Card>
    </div>
  );
}
