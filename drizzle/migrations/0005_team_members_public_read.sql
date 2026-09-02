-- Allow anonymous and authenticated visitors to read only published team members
CREATE POLICY "Anyone can view published team members"
ON public.team_members
FOR SELECT
TO anon, authenticated
USING (is_published = true);

GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT ALL ON public.team_members TO service_role;
GRANT SELECT ON public.team_members_public TO anon, authenticated;
GRANT SELECT ON public.team_members_public TO service_role;