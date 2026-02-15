CREATE INDEX idx_utaab_verifications_ip_ua_time 
  ON public.utaab_verifications(ip_address, user_agent, created_at DESC);