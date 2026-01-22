-- =====================================================
-- SECURITY FIX: Anonymize reviews table user_id exposure
-- =====================================================

-- Create a view that conditionally exposes user_id
-- Users can only see their own user_id, others see NULL
CREATE OR REPLACE VIEW public.public_reviews AS
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
COMMENT ON VIEW public.public_reviews IS 'Privacy-preserving view of reviews that only exposes user_id to the review owner';