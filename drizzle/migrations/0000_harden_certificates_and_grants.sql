-- 1. Remove the client-side self-issue hole on certificates.
DROP POLICY IF EXISTS "System can create certificates" ON public.certificates;

-- Issuance now happens only through the service-role edge function
-- (issue-course-certificate), which verifies enrollment + full completion.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.certificates FROM anon, authenticated;
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

-- Deduplicate redundant SELECT policy.
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.certificates;

-- 2. Reduce blanket privileges on personal-data tables. RLS already blocks
-- access; this removes the second line of failure so a future policy mistake
-- cannot expose or mutate data through the Data API.
REVOKE ALL ON public.education_profiles FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.education_profiles TO authenticated;
GRANT ALL ON public.education_profiles TO service_role;

REVOKE ALL ON public.community_applications FROM anon;
GRANT SELECT, UPDATE ON public.community_applications TO authenticated;
GRANT ALL ON public.community_applications TO service_role;

REVOKE ALL ON public.contributor_assessments FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.contributor_assessments TO authenticated;
GRANT ALL ON public.contributor_assessments TO service_role;

REVOKE ALL ON public.kvkk_requests FROM anon;
GRANT SELECT, UPDATE ON public.kvkk_requests TO authenticated;
GRANT ALL ON public.kvkk_requests TO service_role;

REVOKE ALL ON public.login_history FROM anon, authenticated;
GRANT SELECT ON public.login_history TO authenticated;
GRANT ALL ON public.login_history TO service_role;

REVOKE ALL ON public.email_send_log FROM anon, authenticated;
GRANT ALL ON public.email_send_log TO service_role;

REVOKE ALL ON public.email_unsubscribe_tokens FROM anon, authenticated;
GRANT ALL ON public.email_unsubscribe_tokens TO service_role;

REVOKE ALL ON public.suppressed_emails FROM anon, authenticated;
GRANT SELECT ON public.suppressed_emails TO authenticated;
GRANT ALL ON public.suppressed_emails TO service_role;

REVOKE ALL ON public.admin_sessions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_sessions TO authenticated;
GRANT ALL ON public.admin_sessions TO service_role;

REVOKE ALL ON public.admin_invitations FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_invitations TO authenticated;
GRANT ALL ON public.admin_invitations TO service_role;

REVOKE ALL ON public.cert_participants FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cert_participants TO authenticated;
GRANT ALL ON public.cert_participants TO service_role;

REVOKE ALL ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

REVOKE ALL ON public.audit_log FROM anon, authenticated;
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

REVOKE ALL ON public.chat_messages FROM anon;
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

REVOKE ALL ON public.notifications FROM anon;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;