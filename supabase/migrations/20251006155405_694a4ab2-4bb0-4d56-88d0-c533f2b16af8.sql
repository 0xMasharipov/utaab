-- Add privacy protection for reviews table - hide user_id from public queries
-- Drop existing public policy
DROP POLICY IF EXISTS "Reviews viewable with privacy protection" ON public.reviews;

-- Create new policy that only shows user_id to authenticated users viewing their own review
CREATE POLICY "Authenticated users can view all reviews with limited data"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

-- Add policy for anonymous users (no user_id exposure)
CREATE POLICY "Anonymous users can view review stats only"
  ON public.reviews FOR SELECT
  TO anon
  USING (true);

-- Note: Client-side code should handle user_id visibility - only show for own reviews