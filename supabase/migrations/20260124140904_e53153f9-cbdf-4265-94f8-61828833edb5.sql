-- =====================================================
-- Allow admins to view all user roles in admin panel
-- =====================================================

-- Add policy allowing admins to SELECT all user roles
-- This is needed for the admin panel to display roles for all users
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));