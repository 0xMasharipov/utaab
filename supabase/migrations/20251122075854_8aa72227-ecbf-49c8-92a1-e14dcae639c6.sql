-- Update provision_root_admin() function with correct email
CREATE OR REPLACE FUNCTION public.provision_root_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  root_user_id UUID;
BEGIN
  -- Find the root user by email (corrected email with 7)
  SELECT id INTO root_user_id
  FROM auth.users
  WHERE email = '0xz2n7@gmail.com';
  
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
      '0xz2n7@gmail.com'
    );
  END IF;
END;
$$;

-- Execute the provisioning function to grant admin access
SELECT public.provision_root_admin();