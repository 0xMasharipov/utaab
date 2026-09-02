-- Switch public settings reads from a denylist to an allowlist so any new
-- category is private by default.
DROP POLICY IF EXISTS "Public can read non-sensitive settings" ON public.settings;

CREATE POLICY "Public can read allowlisted settings"
ON public.settings
FOR SELECT
USING (
  category = ANY (ARRAY['branding'::text, 'localization'::text, 'privacy'::text])
  OR has_role(auth.uid(), 'admin'::app_role)
);