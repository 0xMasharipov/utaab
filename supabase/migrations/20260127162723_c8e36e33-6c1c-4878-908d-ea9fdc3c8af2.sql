-- Fix: Quiz Attempts Missing Enrollment Verification
-- Drop existing policies (if they still exist)
DROP POLICY IF EXISTS "Users can view their own enrolled quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can create attempts for enrolled courses" ON public.quiz_attempts;

-- Create new policies with enrollment verification
CREATE POLICY "Users can view their own enrolled quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.quizzes q ON q.id = quiz_attempts.quiz_id
      JOIN public.lessons l ON l.id = q.lesson_id
      WHERE e.user_id = auth.uid() 
        AND e.course_id = l.course_id
    )
  );

CREATE POLICY "Users can create attempts for enrolled courses"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.quizzes q ON q.id = quiz_attempts.quiz_id
      JOIN public.lessons l ON l.id = q.lesson_id
      WHERE e.user_id = auth.uid() 
        AND e.course_id = l.course_id
    )
  );