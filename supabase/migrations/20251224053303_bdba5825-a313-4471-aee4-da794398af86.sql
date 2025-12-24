-- Fix: Email Server Credentials Exposed to All Users
-- The settings table allows public read access to sensitive SMTP configuration

-- Drop the permissive public read policy
DROP POLICY IF EXISTS "Everyone can read settings" ON settings;

-- Create policy that restricts sensitive categories to admins only
-- Non-sensitive categories (like 'general', 'display', 'feature_flags') remain publicly readable
CREATE POLICY "Public can read non-sensitive settings"
ON settings FOR SELECT
USING (
  category NOT IN ('email', 'security', 'integrations', 'smtp', 'api_keys', 'credentials')
  OR has_role(auth.uid(), 'admin'::app_role)
);