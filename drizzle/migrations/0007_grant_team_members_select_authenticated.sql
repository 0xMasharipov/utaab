-- Admin team page reads the base table; RLS restricts rows to admins.
GRANT SELECT ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;