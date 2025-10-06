import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

export const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" defaultValue="UTAAB Education" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" defaultValue="support@utaab.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Europe/Istanbul" />
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Localization</CardTitle>
            <CardDescription>Language and regional settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>English</Label>
                <p className="text-sm text-muted-foreground">Enable English language</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Turkish</Label>
                <p className="text-sm text-muted-foreground">Enable Turkish language</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Russian</Label>
                <p className="text-sm text-muted-foreground">Enable Russian language</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Arabic</Label>
                <p className="text-sm text-muted-foreground">Enable Arabic language (RTL)</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>KVKK compliance and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kvkk-version">KVKK Consent Version</Label>
              <Input id="kvkk-version" defaultValue="1.0" />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify email to access courses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Allow 2FA for admin accounts</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Course Updates</Label>
                <p className="text-sm text-muted-foreground">Send emails for new lessons and updates</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Announcements</Label>
                <p className="text-sm text-muted-foreground">Send announcement emails</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Send promotional content (users can opt-out)</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
