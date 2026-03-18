import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ProfileSettingsProps {
  profile: any;
  userId: string;
  onUpdate: () => void;
}

export default function ProfileSettings({ profile, userId, onUpdate }: ProfileSettingsProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    department: profile?.department || '',
    email_course_updates: profile?.email_course_updates || false,
    email_newsletters: profile?.email_newsletters || false,
    email_marketing: profile?.email_marketing || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('education_profiles')
        .update(formData)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(t('profile.settingsPage.savedSuccess'));
      onUpdate();
    } catch (error: any) {
      toast.error(t('profile.settingsPage.saveFailed') + ': ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('profile.settingsPage.title')}</h2>
        <p className="text-muted-foreground">{t('profile.settingsPage.subtitle')}</p>
      </div>

      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">{t('profile.settingsPage.profileInfo')}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">{t('profile.settingsPage.fullName')}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="department">{t('profile.settingsPage.department')}</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">{t('profile.settingsPage.emailPreferences')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="course_updates">{t('profile.settingsPage.courseUpdates')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.settingsPage.courseUpdatesDesc')}
              </p>
            </div>
            <Switch
              id="course_updates"
              checked={formData.email_course_updates}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, email_course_updates: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newsletters">{t('profile.settingsPage.newsletters')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.settingsPage.newslettersDesc')}
              </p>
            </div>
            <Switch
              id="newsletters"
              checked={formData.email_newsletters}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, email_newsletters: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing">{t('profile.settingsPage.marketing')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.settingsPage.marketingDesc')}
              </p>
            </div>
            <Switch
              id="marketing"
              checked={formData.email_marketing}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, email_marketing: checked })
              }
            />
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
        {saving ? t('profile.settingsPage.saving') : t('profile.settingsPage.saveChanges')}
      </Button>
    </div>
  );
}
