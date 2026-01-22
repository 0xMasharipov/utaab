-- =====================================================
-- SECURITY FIX: Remove public access to security infrastructure tables
-- =====================================================

-- 1. utaab_rate_limits - Remove any public read access
-- The table should only be accessible by service role and admins
-- Currently has: 'Service role can manage rate limits' (ALL) and 'Admins can view rate limits' (SELECT)
-- These are correct - no changes needed as there's no public SELECT policy

-- 2. utaab_verifications - Ensure no public access
-- Currently has: 'Admins can view verifications' (SELECT) and 'Service role can manage verifications' (ALL)
-- These are correct - no changes needed

-- 3. For the RLS policies with USING(true) for INSERT/UPDATE/DELETE,
-- these are service role policies required for edge functions.
-- The service role key is server-side only, so this is acceptable.

-- However, let's tighten the service role policies to use JWT role validation
-- instead of USING(true) where possible

-- Update rate_limits service role policy to use JWT validation
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

CREATE POLICY "Service role can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Update utaab_rate_limits service role policy to use JWT validation
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.utaab_rate_limits;

CREATE POLICY "Service role can manage rate limits" 
ON public.utaab_rate_limits 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Update utaab_verifications service role policy to use JWT validation
DROP POLICY IF EXISTS "Service role can manage verifications" ON public.utaab_verifications;

CREATE POLICY "Service role can manage verifications" 
ON public.utaab_verifications 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);