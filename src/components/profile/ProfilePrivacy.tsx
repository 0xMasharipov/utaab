import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProfilePrivacyProps {
  profile: any;
  userId: string;
}

export default function ProfilePrivacy({ profile, userId }: ProfilePrivacyProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('profile.privacyPage.title')}</h2>
        <p className="text-muted-foreground">{t('profile.privacyPage.subtitle')}</p>
      </div>

      <Card className="glass-panel p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{t('profile.privacyPage.kvkkStatus')}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={profile?.kvkk_consent ? 'default' : 'secondary'}>
                {profile?.kvkk_consent ? t('profile.privacyPage.granted') : t('profile.privacyPage.notGranted')}
              </Badge>
              {profile?.kvkk_consent_version && (
                <span className="text-sm text-muted-foreground">
                  {t('profile.privacyPage.version')} {profile.kvkk_consent_version}
                </span>
              )}
            </div>
            {profile?.kvkk_consent_timestamp && (
              <p className="text-sm text-muted-foreground">
                {t('profile.privacyPage.grantedOn')} {new Date(profile.kvkk_consent_timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">{t('profile.privacyPage.dataManagement')}</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Download className="h-4 w-4" />
            {t('profile.privacyPage.downloadData')}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => navigate('/kvkk-request')}
          >
            <FileText className="h-4 w-4" />
            {t('profile.privacyPage.submitKvkk')}
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            {t('profile.privacyPage.deleteAccount')}
          </Button>
        </div>
      </Card>

      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">{t('profile.privacyPage.privacyDocuments')}</h3>
        <div className="space-y-2">
          <Button variant="link" className="p-0 h-auto text-primary">
            {t('profile.privacyPage.privacyPolicy')}
          </Button>
          <Button variant="link" className="p-0 h-auto text-primary">
            {t('profile.privacyPage.kvkkText')}
          </Button>
          <Button variant="link" className="p-0 h-auto text-primary">
            {t('profile.privacyPage.cookiePolicy')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
