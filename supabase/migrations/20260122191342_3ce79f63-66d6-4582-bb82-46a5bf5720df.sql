-- =====================================================
-- SECURITY FIX: Tighten remaining USING(true) INSERT policies
-- =====================================================

-- 1. admin_sessions - Service role INSERT should use JWT validation
DROP POLICY IF EXISTS "Service role can insert sessions" ON public.admin_sessions;

CREATE POLICY "Service role can insert sessions" 
ON public.admin_sessions 
FOR INSERT 
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- 2. admin_sessions - Service role SELECT should use JWT validation  
DROP POLICY IF EXISTS "Service role can read sessions for verification" ON public.admin_sessions;

CREATE POLICY "Service role can read sessions for verification" 
ON public.admin_sessions 
FOR SELECT 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- 3. community_applications - Public INSERT is intentional for form submissions
-- But we should add validation constraints
-- Keep the policy but add proper constraints via the form validation
-- The edge function already validates input, so this is acceptable
-- We'll update the policy name to be clearer about intent
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.community_applications;

CREATE POLICY "Public can submit community applications" 
ON public.community_applications 
FOR INSERT 
WITH CHECK (
  -- Require KVKK consent to be true for submission
  kvkk_consent = true
  -- Ensure required fields are not empty
  AND full_name IS NOT NULL 
  AND email IS NOT NULL
  AND department IS NOT NULL
  AND experience_level IS NOT NULL
);

-- 4. kvkk_requests - Public INSERT is intentional for GDPR/KVKK requests
-- This is a legal requirement - users must be able to submit data requests
-- Keep the policy but add validation
DROP POLICY IF EXISTS "Anyone can submit KVKK requests" ON public.kvkk_requests;

CREATE POLICY "Public can submit KVKK requests" 
ON public.kvkk_requests 
FOR INSERT 
WITH CHECK (
  -- Ensure required fields are present
  full_name IS NOT NULL 
  AND email IS NOT NULL
  AND request_type IS NOT NULL
  AND details IS NOT NULL
  -- Ensure status starts as pending
  AND status = 'pending'
);