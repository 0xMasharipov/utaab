CREATE TABLE public.certificate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_email text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  UNIQUE (user_id, course_id)
);

GRANT SELECT ON public.certificate_requests TO authenticated;
GRANT ALL ON public.certificate_requests TO service_role;

ALTER TABLE public.certificate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificate requests"
ON public.certificate_requests FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificate requests"
ON public.certificate_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update certificate requests"
ON public.certificate_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_certificate_requests_status ON public.certificate_requests (status, requested_at DESC);