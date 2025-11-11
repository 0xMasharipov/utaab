-- Phase 4: Settings Table and Configuration
-- Create settings table for global configuration
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can read settings"
ON public.settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage settings"
ON public.settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (setting_key, setting_value, category, description) VALUES
('branding', '{"site_title": "UTAA Blockchain", "primary_color": "#3b82f6", "logo_url": ""}', 'branding', 'Site branding configuration'),
('email_smtp', '{"host": "", "port": 587, "user": "", "from_email": "noreply@utaab.org"}', 'email', 'SMTP server configuration'),
('email_templates', '{"welcome": "", "password_reset": "", "invitation": ""}', 'email', 'Email templates'),
('authentication', '{"require_2fa_admins": false, "session_timeout_hours": 8, "min_password_length": 8}', 'security', 'Authentication settings'),
('rate_limits', '{"login_attempts": 5, "login_window_minutes": 15, "api_calls_per_minute": 60}', 'security', 'Rate limiting configuration'),
('privacy_links', '{"privacy_policy": "", "kvkk_text": "", "cookie_policy": ""}', 'privacy', 'Privacy document links'),
('localization', '{"enabled_locales": ["en", "tr", "ru", "ar"], "default_locale": "en", "rtl_locales": ["ar"]}', 'localization', 'Language settings'),
('integrations', '{"whatsapp_community": "https://chat.whatsapp.com/CK7HCwZWS8b0A9mNQIT700", "telegram_bot": "", "analytics_id": ""}', 'integrations', 'External integrations')
ON CONFLICT (setting_key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX idx_settings_category ON public.settings(category);
CREATE INDEX idx_settings_key ON public.settings(setting_key);