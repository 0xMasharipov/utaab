-- Fix: Security Configuration Publicly Readable
-- Drop the insecure public read policy
DROP POLICY IF EXISTS "Everyone can read security settings" ON security_settings;

-- Create new policy that restricts read access to admins only
CREATE POLICY "Only admins can read security settings"
ON security_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));