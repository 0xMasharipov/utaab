
-- Drop the split policies since we'll use the view to protect video_url
DROP POLICY IF EXISTS "Free published lessons viewable by everyone" ON public.lessons;
DROP POLICY IF EXISTS "Enrolled users can view all published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Non-free published lesson metadata viewable by everyone" ON public.lessons;

-- Restore a single policy allowing all published lessons to be read
-- The safe_lessons view will handle stripping video_url for non-enrolled paid lessons
CREATE POLICY "Published lessons are viewable by everyone"
ON public.lessons
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = lessons.course_id
    AND courses.is_published = true
  )
);
