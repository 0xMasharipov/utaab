-- Fix chat_messages DELETE policy to verify enrollment context
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;

CREATE POLICY "Users can delete own messages in enrolled courses"
  ON public.chat_messages FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (course_id IS NULL OR EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE enrollments.user_id = auth.uid() 
      AND enrollments.course_id = chat_messages.course_id
    ))
  );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_course ON public.chat_messages(user_id, course_id);

-- Update has_role function to ensure search_path is immutable (fix Supabase linter warning)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Explicit validation: only allow defined roles
  IF _role NOT IN ('admin', 'moderator', 'user') THEN
    RETURN false;
  END IF;
  
  -- Check if user has the role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;