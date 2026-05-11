DROP POLICY IF EXISTS "Templates viewable by everyone" ON public.cert_templates;

CREATE POLICY "Block public visit inserts"
  ON public.site_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Block public update of security events"
  ON public.security_events
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Block public delete of security events"
  ON public.security_events
  FOR DELETE
  TO anon, authenticated
  USING (false);

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated, service_role;