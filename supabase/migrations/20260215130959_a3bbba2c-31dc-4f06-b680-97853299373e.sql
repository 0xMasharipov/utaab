
CREATE TABLE public.utaab_global_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.utaab_global_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage global rate limits"
  ON public.utaab_global_rate_limits FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view global rate limits"
  ON public.utaab_global_rate_limits FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
