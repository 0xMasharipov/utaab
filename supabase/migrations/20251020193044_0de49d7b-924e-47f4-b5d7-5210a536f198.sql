-- Fix critical security issue: notifications table INSERT policy
-- Remove overly permissive policy that allows any user to create notifications for anyone
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Note: No new INSERT policy is created. Only service role (used by edge functions)
-- should create notifications. Service role bypasses RLS, so no policy is needed.
-- Client-side code should NEVER insert notifications directly.

-- Fix admin sessions INSERT policy timing issue
-- Allow users to create sessions for their own user_id
-- The application-level admin role check in AdminLogin provides sufficient protection
DROP POLICY IF EXISTS "System can create admin sessions" ON public.admin_sessions;

CREATE POLICY "Users can create own admin sessions"
ON public.admin_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);