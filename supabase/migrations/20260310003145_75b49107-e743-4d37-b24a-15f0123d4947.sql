
-- Tighten the public insert policy with field validation
DROP POLICY "Anyone can submit assessments" ON public.contributor_assessments;

CREATE POLICY "Anyone can submit validated assessments"
  ON public.contributor_assessments
  FOR INSERT
  TO public
  WITH CHECK (
    full_name IS NOT NULL AND length(full_name) > 0 AND length(full_name) <= 200
    AND email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND form_data IS NOT NULL
  );
