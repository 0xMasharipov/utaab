-- Fix admin_sessions RLS policies
-- Drop existing policies that are incomplete
DROP POLICY IF EXISTS "Users can create own admin sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admins can view own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admins can delete own sessions" ON public.admin_sessions;

-- 1) Service role can fully manage sessions (needed for edge functions)
CREATE POLICY "Service role full access"
ON public.admin_sessions FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- 2) Admins can create their own sessions
CREATE POLICY "Admins can insert own sessions"
ON public.admin_sessions FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 3) Admins can view their own sessions
CREATE POLICY "Admins can view own sessions"
ON public.admin_sessions FOR SELECT TO authenticated
USING (
  auth.uid() = user_id 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 4) Admins can update their own sessions (for last_activity)
CREATE POLICY "Admins can update own sessions"
ON public.admin_sessions FOR UPDATE TO authenticated
USING (
  auth.uid() = user_id 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() = user_id 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 5) Admins can delete their own sessions
CREATE POLICY "Admins can delete own sessions"
ON public.admin_sessions FOR DELETE TO authenticated
USING (
  auth.uid() = user_id 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create function to provision root admin
-- This ensures 0xz2n@gmail.com always has admin role
CREATE OR REPLACE FUNCTION public.provision_root_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  root_user_id UUID;
BEGIN
  -- Find the root user by email
  SELECT id INTO root_user_id
  FROM auth.users
  WHERE email = '0xz2n@gmail.com';
  
  -- If user exists, ensure they have admin role
  IF root_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (root_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Log the provisioning
    INSERT INTO public.audit_log (
      action,
      entity_type,
      entity_id,
      user_id,
      user_email
    ) VALUES (
      'provision_root_admin',
      'user_roles',
      root_user_id,
      root_user_id,
      '0xz2n@gmail.com'
    );
  END IF;
END;
$$;

-- Execute provisioning now if the user exists
SELECT public.provision_root_admin();