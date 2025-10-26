-- Remove overly permissive INSERT policy on notifications table
-- Only service role (used by edge functions) should create notifications
-- Service role bypasses RLS, so no INSERT policy is needed

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;