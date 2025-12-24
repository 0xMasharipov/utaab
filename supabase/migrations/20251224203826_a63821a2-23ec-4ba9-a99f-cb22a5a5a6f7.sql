-- Add SELECT policy to restrict community_applications access to admins only
CREATE POLICY "Only admins can view applications"
ON public.community_applications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));