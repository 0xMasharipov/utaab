
-- Drop overly-permissive SELECT policies on reviews table
DROP POLICY IF EXISTS "Anonymous users can view review stats only" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view all reviews with limited data" ON public.reviews;

-- Create restricted SELECT policy: users can only read their own reviews
CREATE POLICY "Users can view their own reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
