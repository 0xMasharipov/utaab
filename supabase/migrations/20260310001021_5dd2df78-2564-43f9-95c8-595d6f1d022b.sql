
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Published lessons are viewable by everyone" ON public.lessons;

-- Policy 1: Free lessons from published courses are viewable by everyone (metadata only, video_url included since they're free)
CREATE POLICY "Free published lessons viewable by everyone"
ON public.lessons
FOR SELECT
TO public
USING (
  is_free = true
  AND EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = lessons.course_id
    AND courses.is_published = true
  )
);

-- Policy 2: All lessons from published courses viewable by enrolled users
CREATE POLICY "Enrolled users can view all published lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = lessons.course_id
    AND courses.is_published = true
  )
  AND EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE enrollments.user_id = auth.uid()
    AND enrollments.course_id = lessons.course_id
  )
);

-- Policy 3: Non-free lesson metadata (without video_url) - handled via a view instead
-- We need a view that strips video_url for non-enrolled, non-free lessons

-- Create a secure view for lesson listing that hides video_url for non-free lessons when not enrolled
CREATE OR REPLACE VIEW public.safe_lessons
WITH (security_invoker = true)
AS
SELECT
  id,
  course_id,
  title_en,
  title_tr,
  title_ru,
  title_ar,
  description_en,
  description_tr,
  description_ru,
  description_ar,
  duration_minutes,
  order_index,
  is_free,
  created_at,
  updated_at,
  CASE
    WHEN is_free = true THEN video_url
    WHEN auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.user_id = auth.uid()
      AND enrollments.course_id = lessons.course_id
    ) THEN video_url
    ELSE NULL
  END AS video_url
FROM public.lessons;
