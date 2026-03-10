
-- Allow everyone to see non-free lesson metadata from published courses
-- (the safe_lessons view will strip video_url for non-enrolled users)
CREATE POLICY "Non-free published lesson metadata viewable by everyone"
ON public.lessons
FOR SELECT
TO public
USING (
  is_free = false
  AND EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = lessons.course_id
    AND courses.is_published = true
  )
);
