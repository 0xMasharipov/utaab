import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  profile: any;
  userId: string;
  onUpdate: () => void;
}

export default function ProfileSettings({ profile, userId, onUpdate }: ProfileSettingsProps) {
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

      toast.success('Settings saved successfully');
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Information */}
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Email Preferences */}
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="course_updates">Course Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about course updates
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
              <Label htmlFor="newsletters">Newsletters</Label>
              <p className="text-sm text-muted-foreground">
                Receive our monthly newsletter
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
              <Label htmlFor="marketing">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional content and offers
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
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
