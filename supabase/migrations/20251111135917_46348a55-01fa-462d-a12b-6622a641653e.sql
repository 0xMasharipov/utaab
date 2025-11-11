-- Add RLS policies for rate_limits table
-- This table is primarily accessed by edge functions using service role
-- for rate limiting and abuse prevention

-- Allow service role (edge functions) full access to manage rate limits
-- Service role bypasses RLS, but we define policies for clarity and future flexibility
CREATE POLICY "Service role can manage rate limits"
  ON rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow admins to view rate limits for monitoring purposes
CREATE POLICY "Admins can view rate limits"
  ON rate_limits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );