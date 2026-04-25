-- Site visits tracking table
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  path text,
  referrer text,
  country_code text,
  country_name text,
  city text,
  visitor_hash text,
  user_agent text,
  is_bot boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_site_visits_created_at ON public.site_visits (created_at DESC);
CREATE INDEX idx_site_visits_country ON public.site_visits (country_code);
CREATE INDEX idx_site_visits_visitor_day ON public.site_visits (visitor_hash, created_at);
CREATE INDEX idx_site_visits_isbot_created ON public.site_visits (is_bot, created_at DESC);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Only admins may read; writes go through service role edge function only
CREATE POLICY "Admins can read site visits"
  ON public.site_visits
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add to realtime publication for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;