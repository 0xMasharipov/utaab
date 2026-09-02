DROP POLICY IF EXISTS "Instructors can view their courses" ON public.courses;
DROP POLICY IF EXISTS "Instructors can update their courses" ON public.courses;

CREATE POLICY "Instructors can view their courses"
ON public.courses FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.instructors i
  WHERE i.id = courses.instructor_id AND i.user_id = auth.uid()
));

CREATE POLICY "Instructors can update their courses"
ON public.courses FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.instructors i
  WHERE i.id = courses.instructor_id AND i.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.instructors i
  WHERE i.id = courses.instructor_id AND i.user_id = auth.uid()
));