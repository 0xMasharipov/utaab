-- UTAAB Anti-bot CAPTCHA Tables

-- Table to store UTAAB verification attempts
CREATE TABLE public.utaab_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  fingerprint_hash TEXT,
  risk_score INTEGER DEFAULT 0,
  challenges_passed TEXT[] DEFAULT '{}',
  pow_difficulty INTEGER,
  pow_solution TEXT,
  behavior_data JSONB DEFAULT '{}',
  verdict TEXT NOT NULL CHECK (verdict IN ('pass', 'fail', 'challenge', 'blocked')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for multi-tier rate limiting
CREATE TABLE public.utaab_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('tier1', 'tier2', 'tier3')),
  request_count INTEGER DEFAULT 1,
  violation_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT now(),
  banned_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(identifier, tier)
);

-- Enable RLS
ALTER TABLE public.utaab_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utaab_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for utaab_verifications
CREATE POLICY "Service role can manage verifications"
ON public.utaab_verifications
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can view verifications"
ON public.utaab_verifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for utaab_rate_limits  
CREATE POLICY "Service role can manage rate limits"
ON public.utaab_rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can view rate limits"
ON public.utaab_rate_limits
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for faster lookups
CREATE INDEX idx_utaab_verifications_session ON public.utaab_verifications(session_id);
CREATE INDEX idx_utaab_verifications_ip ON public.utaab_verifications(ip_address);
CREATE INDEX idx_utaab_rate_limits_identifier ON public.utaab_rate_limits(identifier);
CREATE INDEX idx_utaab_rate_limits_banned ON public.utaab_rate_limits(banned_until) WHERE banned_until IS NOT NULL;

-- Cleanup function for old records
CREATE OR REPLACE FUNCTION public.cleanup_old_utaab_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete verifications older than 7 days
  DELETE FROM public.utaab_verifications
  WHERE created_at < now() - INTERVAL '7 days';
  
  -- Delete rate limit records older than 24 hours with no bans
  DELETE FROM public.utaab_rate_limits
  WHERE window_start < now() - INTERVAL '24 hours'
    AND (banned_until IS NULL OR banned_until < now());
END;
$$;