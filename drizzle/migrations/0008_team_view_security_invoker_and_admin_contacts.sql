-- 1. The public team view no longer bypasses RLS.
ALTER VIEW public.team_members_public SET (security_invoker = true);

-- 2. Base-table reads are column-scoped: contact details stay unreadable
--    for anon/authenticated; only the safe, public-facing columns are granted.
REVOKE SELECT ON public.team_members FROM anon, authenticated;

GRANT SELECT (
  id, full_name, role_title, department,
  bio_en, bio_tr, bio_ru, bio_ar,
  image_url, linkedin_url, twitter_url, instagram_url, telegram_url, website_url,
  display_order, is_featured, is_published, created_at, updated_at
) ON public.team_members TO anon, authenticated;

GRANT ALL ON public.team_members TO service_role;

-- 3. Row access: published members are visible to everyone; admins keep full
--    row access through the existing "Admins can manage team members" policy.
DROP POLICY IF EXISTS "Public can view published team members" ON public.team_members;
CREATE POLICY "Public can view published team members"
  ON public.team_members
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- 4. Admin-only access to contact details, with an in-function role check.
CREATE OR REPLACE FUNCTION public.get_team_member_contacts()
RETURNS TABLE (id uuid, email text, phone text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT t.id, t.email, t.phone
  FROM public.team_members t;
END;
$$;

REVOKE ALL ON FUNCTION public.get_team_member_contacts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_team_member_contacts() TO authenticated, service_role;