-- Keep contact columns (email, phone) unreadable by the public:
-- expose published members only through the view, not the base table.
DROP POLICY IF EXISTS "Anyone can view published team members" ON public.team_members;
REVOKE SELECT ON public.team_members FROM anon, authenticated;

ALTER VIEW public.team_members_public SET (security_invoker = false);