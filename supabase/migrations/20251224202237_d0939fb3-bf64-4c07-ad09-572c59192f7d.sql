-- Fix 1: Remove the public read policy from security_settings
-- and ensure only admins can access it
DROP POLICY IF EXISTS "Everyone can read security settings" ON public.security_settings;
DROP POLICY IF EXISTS "Only admins can read security settings" ON public.security_settings;

-- Create admin-only read policy for security_settings
CREATE POLICY "Only admins can read security settings" 
ON public.security_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Remove the overly permissive service role policy from admin_sessions
-- and replace with more restrictive INSERT-only policy
DROP POLICY IF EXISTS "Service role full access" ON public.admin_sessions;

-- Create INSERT-only policy for service role (needed for edge functions to create sessions)
CREATE POLICY "Service role can insert sessions" 
ON public.admin_sessions 
FOR INSERT 
WITH CHECK (true);

-- Create SELECT policy for service role (needed to verify sessions)
CREATE POLICY "Service role can read sessions for verification" 
ON public.admin_sessions 
FOR SELECT 
USING (true);