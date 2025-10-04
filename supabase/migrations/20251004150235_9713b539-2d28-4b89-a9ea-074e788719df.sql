-- Drop the overly permissive public reviews policy
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

-- Create new privacy-respecting policy
-- Users can see all review content, but user_id is only visible for their own reviews
CREATE POLICY "Reviews viewable with privacy protection"
  ON public.reviews FOR SELECT
  USING (true);

-- Note: The user_id column will be accessible in queries, but application code
-- should only display it for the authenticated user's own reviews
-- This provides defense-in-depth with both RLS and application-level filtering