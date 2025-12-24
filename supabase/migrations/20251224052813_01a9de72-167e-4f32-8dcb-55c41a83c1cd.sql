-- Fix: Audit and Security Logs Allow User Manipulation
-- Restrict INSERT to service role only to prevent audit trail poisoning

-- Drop permissive INSERT policies
DROP POLICY IF EXISTS "System can insert audit log" ON audit_log;
DROP POLICY IF EXISTS "System can insert security events" ON security_events;

-- Create service-role-only INSERT policies
CREATE POLICY "Service role can insert audit log"
ON audit_log FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can insert security events"
ON security_events FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');