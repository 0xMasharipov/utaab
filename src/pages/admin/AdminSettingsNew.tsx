import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Palette, 
  Mail, 
  Shield, 
  Globe, 
  Link as LinkIcon,
  Zap,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TranslationEditor from '@/components/admin/TranslationEditor';

export default function AdminSettingsNew() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      // Convert array to object for easier access
      const settingsObj: any = {};
      data?.forEach((setting) => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      setSettings(settingsObj);
    } catch (error: any) {
      toast.error('Failed to load settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('settings')
        .update({ 
          setting_value: value,
          updated_by: user?.id 
        })
        .eq('setting_key', key);

      if (error) throw error;
    } catch (error: any) {
      throw new Error('Failed to update setting: ' + error.message);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Update all settings
      await Promise.all(
        Object.entries(settings).map(([key, value]) => updateSetting(key, value))
      );

      toast.success('Settings saved successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage platform configuration</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="glass-panel">
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="localization" className="gap-2">
            <Globe className="h-4 w-4" />
            Localization
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Zap className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Branding */}
        <TabsContent value="branding">
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Branding Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.branding?.site_title || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      branding: { ...settings.branding, site_title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.branding?.primary_color || '#3b82f6'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: { ...settings.branding, primary_color: e.target.value },
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={settings.branding?.primary_color || '#3b82f6'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: { ...settings.branding, primary_color: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={settings.branding?.logo_url || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      branding: { ...settings.branding, logo_url: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <div className="space-y-6">
            <Card className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">SMTP Configuration</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      value={settings.email_smtp?.host || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email_smtp: { ...settings.email_smtp, host: e.target.value },
                        })
                      }
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port">Port</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      value={settings.email_smtp?.port || 587}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email_smtp: { ...settings.email_smtp, port: parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtp_user">SMTP User</Label>
                  <Input
                    id="smtp_user"
                    value={settings.email_smtp?.user || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_smtp: { ...settings.email_smtp, user: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={settings.email_smtp?.from_email || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_smtp: { ...settings.email_smtp, from_email: e.target.value },
                      })
                    }
                    placeholder="noreply@utaab.org"
                  />
                </div>
              </div>
            </Card>

            <Card className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="welcome_template">Welcome Email</Label>
                  <Textarea
                    id="welcome_template"
                    value={settings.email_templates?.welcome || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_templates: { ...settings.email_templates, welcome: e.target.value },
                      })
                    }
                    rows={4}
                    placeholder="Welcome email template..."
                  />
                </div>
                <div>
                  <Label htmlFor="password_reset_template">Password Reset Email</Label>
                  <Textarea
                    id="password_reset_template"
                    value={settings.email_templates?.password_reset || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_templates: { ...settings.email_templates, password_reset: e.target.value },
                      })
                    }
                    rows={4}
                    placeholder="Password reset email template..."
                  />
                </div>
                <div>
                  <Label htmlFor="invitation_template">Admin Invitation Email</Label>
                  <Textarea
                    id="invitation_template"
                    value={settings.email_templates?.invitation || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_templates: { ...settings.email_templates, invitation: e.target.value },
                      })
                    }
                    rows={4}
                    placeholder="Admin invitation email template..."
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication & Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require 2FA for Admins</Label>
                  <p className="text-sm text-muted-foreground">
                    Force all admin users to enable two-factor authentication
                  </p>
                </div>
                <Switch
                  checked={settings.authentication?.require_2fa_admins || false}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      authentication: { ...settings.authentication, require_2fa_admins: checked },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
                <Input
                  id="session_timeout"
                  type="number"
                  value={settings.authentication?.session_timeout_hours || 8}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      authentication: { ...settings.authentication, session_timeout_hours: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="min_password">Minimum Password Length</Label>
                <Input
                  id="min_password"
                  type="number"
                  value={settings.authentication?.min_password_length || 8}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      authentication: { ...settings.authentication, min_password_length: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Rate Limiting</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="login_attempts">Max Login Attempts</Label>
                  <Input
                    id="login_attempts"
                    type="number"
                    value={settings.rate_limits?.login_attempts || 5}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rate_limits: { ...settings.rate_limits, login_attempts: parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="login_window">Window (minutes)</Label>
                  <Input
                    id="login_window"
                    type="number"
                    value={settings.rate_limits?.login_window_minutes || 15}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rate_limits: { ...settings.rate_limits, login_window_minutes: parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="api_calls">API Calls Per Minute</Label>
                <Input
                  id="api_calls"
                  type="number"
                  value={settings.rate_limits?.api_calls_per_minute || 60}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      rate_limits: { ...settings.rate_limits, api_calls_per_minute: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Localization */}
        <TabsContent value="localization">
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Language Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="default_locale">Default Language</Label>
                <Select
                  value={settings.localization?.default_locale || 'en'}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      localization: { ...settings.localization, default_locale: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Enabled Languages</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select which languages are available on the platform
                </p>
                <div className="space-y-2">
                  {['en', 'tr', 'ru', 'ar'].map((locale) => (
                    <div key={locale} className="flex items-center gap-2">
                      <Switch
                        checked={(settings.localization?.enabled_locales || []).includes(locale)}
                        onCheckedChange={(checked) => {
                          const enabled = settings.localization?.enabled_locales || [];
                          setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              enabled_locales: checked
                                ? [...enabled, locale]
                                : enabled.filter((l: string) => l !== locale),
                            },
                          });
                        }}
                      />
                      <Label>
                        {locale === 'en' && 'English'}
                        {locale === 'tr' && 'Türkçe'}
                        {locale === 'ru' && 'Русский'}
                        {locale === 'ar' && 'العربية (RTL)'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy Documents</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="privacy_policy">Privacy Policy URL</Label>
                <Input
                  id="privacy_policy"
                  value={settings.privacy_links?.privacy_policy || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy_links: { ...settings.privacy_links, privacy_policy: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="kvkk_text">KVKK Aydınlatma Metni URL</Label>
                <Input
                  id="kvkk_text"
                  value={settings.privacy_links?.kvkk_text || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy_links: { ...settings.privacy_links, kvkk_text: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="cookie_policy">Cookie Policy URL</Label>
                <Input
                  id="cookie_policy"
                  value={settings.privacy_links?.cookie_policy || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy_links: { ...settings.privacy_links, cookie_policy: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">External Integrations</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="whatsapp_community">WhatsApp Community Link</Label>
                <Input
                  id="whatsapp_community"
                  value={settings.integrations?.whatsapp_community || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, whatsapp_community: e.target.value },
                    })
                  }
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
              <div>
                <Label htmlFor="telegram_bot">Telegram Bot Token</Label>
                <Input
                  id="telegram_bot"
                  value={settings.integrations?.telegram_bot || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, telegram_bot: e.target.value },
                    })
                  }
                  placeholder="Bot token..."
                />
              </div>
              <div>
                <Label htmlFor="analytics_id">Analytics Tracking ID</Label>
                <Input
                  id="analytics_id"
                  value={settings.integrations?.analytics_id || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, analytics_id: e.target.value },
                    })
                  }
                  placeholder="GA-XXXXXXXXX"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
