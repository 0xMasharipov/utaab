-- =====================================================
-- FIX: Change view to SECURITY INVOKER to avoid security definer issue
-- =====================================================

-- Drop the old view
DROP VIEW IF EXISTS public.public_reviews;

-- Recreate with explicit SECURITY INVOKER
CREATE VIEW public.public_reviews 
WITH (security_invoker = true) AS
SELECT 
  id,
  course_id,
  rating,
  comment,
  created_at,
  updated_at,
  CASE 
    WHEN auth.uid() = user_id THEN user_id 
    ELSE NULL 
  END as user_id
FROM public.reviews;

-- Grant access to the view
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.public_reviews IS 'Privacy-preserving view of reviews (SECURITY INVOKER) that only exposes user_id to the review owner';