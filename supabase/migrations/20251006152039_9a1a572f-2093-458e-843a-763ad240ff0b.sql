-- Create rate limiting table for persistent rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system (service role) can manage rate limits
CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limits
  FOR ALL
  USING (true);

-- Add index for faster lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(identifier, endpoint, window_start);

-- Create cleanup function to remove old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < now() - INTERVAL '24 hours';
END;
$$;

-- Improve has_role function with explicit validation
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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

-- Tighten certificate RLS policy - remove overly permissive public access
DROP POLICY IF EXISTS "Certificates are viewable by certificate number" ON public.certificates;

-- Create more restrictive policy: users can only view their own certificates
CREATE POLICY "Users view own certificates"
  ON public.certificates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all certificates
CREATE POLICY "Admins view all certificates"
  ON public.certificates
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));