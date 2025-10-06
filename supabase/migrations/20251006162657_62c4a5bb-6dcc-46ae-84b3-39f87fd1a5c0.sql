-- Security events tracking table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'captcha_fail', 'rate_limit', 'honeypot_trigger', 'suspicious_timing', 'brute_force', 'ddos_spike'
  severity TEXT NOT NULL DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
  ip_address INET,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent TEXT,
  endpoint TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_security_events_type ON public.security_events(event_type);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_ip ON public.security_events(ip_address);
CREATE INDEX idx_security_events_created ON public.security_events(created_at DESC);
CREATE INDEX idx_security_events_user ON public.security_events(user_id) WHERE user_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view security events
CREATE POLICY "Admins can view security events"
ON public.security_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert security events
CREATE POLICY "System can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (true);

-- IP blacklist table
CREATE TABLE IF NOT EXISTS public.ip_blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_ip_blacklist_active ON public.ip_blacklist(ip_address) WHERE is_active = true;
CREATE INDEX idx_ip_blacklist_expires ON public.ip_blacklist(expires_at) WHERE expires_at IS NOT NULL;

ALTER TABLE public.ip_blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage IP blacklist"
ON public.ip_blacklist
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Security settings table (for configurable thresholds)
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage security settings"
ON public.security_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can read security settings"
ON public.security_settings
FOR SELECT
USING (true);

-- Insert default security settings
INSERT INTO public.security_settings (setting_key, setting_value, description) VALUES
  ('rate_limit_per_ip_minute', '{"limit": 20, "window": 60}'::jsonb, 'Max requests per IP per minute'),
  ('rate_limit_per_ip_hour', '{"limit": 300, "window": 3600}'::jsonb, 'Max requests per IP per hour'),
  ('rate_limit_login_attempts', '{"limit": 5, "window": 900, "lockout": 3600}'::jsonb, 'Max login attempts per 15 min, 1hr lockout'),
  ('min_form_completion_time', '{"seconds": 2}'::jsonb, 'Minimum time to complete form (bot detection)'),
  ('captcha_enabled', '{"enabled": true, "threshold_score": 0.5}'::jsonb, 'CAPTCHA configuration'),
  ('ddos_threshold', '{"requests_per_second": 100, "spike_multiplier": 5}'::jsonb, 'DDoS detection thresholds')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to check if IP is blacklisted
CREATE OR REPLACE FUNCTION public.is_ip_blacklisted(_ip INET)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.ip_blacklist
    WHERE ip_address = _ip
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Function to log security event
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type TEXT,
  _severity TEXT,
  _ip INET DEFAULT NULL,
  _user_id UUID DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _endpoint TEXT DEFAULT NULL,
  _details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    event_type,
    severity,
    ip_address,
    user_id,
    user_agent,
    endpoint,
    details
  ) VALUES (
    _event_type,
    _severity,
    _ip,
    _user_id,
    _user_agent,
    _endpoint,
    _details
  )
  RETURNING id INTO _event_id;
  
  RETURN _event_id;
END;
$$;

-- Function to get security metrics
CREATE OR REPLACE FUNCTION public.get_security_metrics(
  _hours INT DEFAULT 24
)
RETURNS TABLE (
  total_events BIGINT,
  events_by_type JSONB,
  events_by_severity JSONB,
  top_ips JSONB,
  recent_spikes JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_events,
    jsonb_object_agg(event_type, type_count) as events_by_type,
    jsonb_object_agg(severity, severity_count) as events_by_severity,
    (
      SELECT jsonb_agg(jsonb_build_object('ip', ip_address, 'count', ip_count))
      FROM (
        SELECT ip_address, COUNT(*) as ip_count
        FROM public.security_events
        WHERE created_at > now() - (_hours || ' hours')::interval
          AND ip_address IS NOT NULL
        GROUP BY ip_address
        ORDER BY ip_count DESC
        LIMIT 10
      ) top_ips_subquery
    ) as top_ips,
    (
      SELECT jsonb_agg(jsonb_build_object('hour', hour_bucket, 'count', hour_count))
      FROM (
        SELECT 
          date_trunc('hour', created_at) as hour_bucket,
          COUNT(*) as hour_count
        FROM public.security_events
        WHERE created_at > now() - (_hours || ' hours')::interval
        GROUP BY hour_bucket
        ORDER BY hour_bucket DESC
        LIMIT 24
      ) spikes_subquery
    ) as recent_spikes
  FROM (
    SELECT
      event_type,
      COUNT(*) as type_count
    FROM public.security_events
    WHERE created_at > now() - (_hours || ' hours')::interval
    GROUP BY event_type
  ) type_counts
  CROSS JOIN (
    SELECT
      severity,
      COUNT(*) as severity_count
    FROM public.security_events
    WHERE created_at > now() - (_hours || ' hours')::interval
    GROUP BY severity
  ) severity_counts;
END;
$$;

-- Cleanup old security events (keep 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.security_events
  WHERE created_at < now() - INTERVAL '90 days';
  
  -- Also cleanup expired blacklist entries
  UPDATE public.ip_blacklist
  SET is_active = false
  WHERE expires_at IS NOT NULL
    AND expires_at < now()
    AND is_active = true;
END;
$$;