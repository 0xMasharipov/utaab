-- Fix rate_limits RLS policy to only allow service role access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

-- The rate_limits table should only be accessed by edge functions using service role
-- No RLS policies needed since service role bypasses RLS
-- This ensures regular authenticated users cannot access rate limit data