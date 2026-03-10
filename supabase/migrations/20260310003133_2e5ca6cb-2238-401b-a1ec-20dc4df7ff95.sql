
CREATE TABLE public.contributor_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_result jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contributor_assessments ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (public form, no auth)
CREATE POLICY "Anyone can submit assessments"
  ON public.contributor_assessments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view assessments"
  ON public.contributor_assessments
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update assessments"
  ON public.contributor_assessments
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
