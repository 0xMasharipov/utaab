-- Fix: Add DELETE policy for chat_messages so users can delete their chat history
CREATE POLICY "Users can delete their own chat messages"
  ON public.chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);