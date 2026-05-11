
CREATE TABLE public.cert_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  background_color text DEFAULT '#061A3A',
  primary_color text DEFAULT '#FFFFFF',
  secondary_color text DEFAULT '#2D8CFF',
  title_text text DEFAULT 'Certificate of Participation',
  body_text text,
  signature_text text,
  footer_text text,
  show_qr boolean DEFAULT true,
  layout_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cert_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_slug text UNIQUE NOT NULL,
  event_code text NOT NULL,
  event_type text DEFAULT 'Seminar',
  speaker_name text,
  event_date date,
  start_time time,
  end_time time,
  location text,
  description text,
  issued_by text NOT NULL DEFAULT 'UTAAB',
  organizer text DEFAULT 'UTAAB',
  partners text[] DEFAULT '{}',
  certificate_title text DEFAULT 'Certificate of Participation',
  certificate_description text,
  certificate_quantity integer DEFAULT 0,
  serial_prefix text,
  template_id uuid REFERENCES public.cert_templates(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','completed')),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cert_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.cert_events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cert_participants_event ON public.cert_participants(event_id);

CREATE TABLE public.cert_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.cert_events(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES public.cert_participants(id) ON DELETE SET NULL,
  serial_number text UNIQUE NOT NULL,
  serial_hash text UNIQUE NOT NULL,
  event_hash text NOT NULL,
  issued_by_hash text NOT NULL,
  pdf_url text,
  qr_url text,
  blockchain_tx_hash text,
  chain_id integer DEFAULT 11155111,
  contract_address text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','issued','revoked','failed')),
  issued_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cert_records_event ON public.cert_records(event_id);
CREATE INDEX idx_cert_records_status ON public.cert_records(status);
CREATE INDEX idx_cert_records_serial_hash ON public.cert_records(serial_hash);

CREATE TRIGGER trg_cert_templates_updated BEFORE UPDATE ON public.cert_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cert_events_updated BEFORE UPDATE ON public.cert_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cert_participants_updated BEFORE UPDATE ON public.cert_participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_cert_records_updated BEFORE UPDATE ON public.cert_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.cert_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cert_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cert_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates viewable by everyone" ON public.cert_templates FOR SELECT USING (true);
CREATE POLICY "Admins manage templates" ON public.cert_templates FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Public events viewable" ON public.cert_events FOR SELECT USING (status IN ('active','completed'));
CREATE POLICY "Admins view all events" ON public.cert_events FOR SELECT USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins manage events" ON public.cert_events FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Admins manage cert participants" ON public.cert_participants FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Public sees issued/revoked cert records" ON public.cert_records FOR SELECT USING (status IN ('issued','revoked'));
CREATE POLICY "Admins view all cert records" ON public.cert_records FOR SELECT USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins manage cert records" ON public.cert_records FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE OR REPLACE FUNCTION public.verify_certificate_by_hash(_serial_hash text)
RETURNS TABLE (
  serial_number text,
  status text,
  issued_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  blockchain_tx_hash text,
  chain_id integer,
  contract_address text,
  pdf_url text,
  participant_name text,
  event_name text,
  speaker_name text,
  event_date date,
  location text,
  issued_by text,
  organizer text,
  partners text[],
  certificate_title text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.serial_number, c.status, c.issued_at, c.revoked_at, c.revocation_reason,
    c.blockchain_tx_hash, c.chain_id, c.contract_address, c.pdf_url,
    p.full_name AS participant_name,
    e.event_name, e.speaker_name, e.event_date, e.location,
    e.issued_by, e.organizer, e.partners, e.certificate_title
  FROM public.cert_records c
  LEFT JOIN public.cert_participants p ON p.id = c.participant_id
  JOIN public.cert_events e ON e.id = c.event_id
  WHERE lower(c.serial_hash) = lower(_serial_hash)
    AND c.status IN ('issued','revoked')
  LIMIT 1;
$$;

INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Cert bucket public read" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Cert bucket admin insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Cert bucket admin update" ON storage.objects FOR UPDATE USING (bucket_id = 'certificates' AND has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Cert bucket admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND has_role(auth.uid(),'admin'::app_role));

DO $$
DECLARE
  tpl_id uuid;
  ev_id uuid;
  p1_id uuid;
  p2_id uuid;
  p3_id uuid;
BEGIN
  INSERT INTO public.cert_templates (template_name, background_color, primary_color, secondary_color, title_text, body_text, signature_text, footer_text, show_qr)
  VALUES ('UTAAB Premium Navy', '#061A3A', '#FFFFFF', '#2D8CFF',
    'Certificate of Participation',
    'is hereby awarded for active participation and successful engagement in the event.',
    'UTAAB Organizing Committee',
    'Verify the authenticity of this certificate at utaab.org/verify-certificate',
    true)
  RETURNING id INTO tpl_id;

  INSERT INTO public.cert_events (
    event_name, event_slug, event_code, event_type, speaker_name,
    event_date, start_time, location, issued_by, organizer, partners,
    certificate_title, certificate_quantity, serial_prefix, template_id, status
  ) VALUES (
    'Beyond Blockchain', 'beyond-blockchain', 'BB', 'Seminar', 'Veli Uysal',
    '2026-05-20', '14:00', 'On Campus', 'UTAAB', 'UTAAB',
    ARRAY['UTAA','BuilderMare'],
    'Certificate of Participation', 100, 'UTAAB-BB', tpl_id, 'draft'
  ) RETURNING id INTO ev_id;

  INSERT INTO public.cert_participants (event_id, full_name) VALUES (ev_id, 'Ali Mammadov') RETURNING id INTO p1_id;
  INSERT INTO public.cert_participants (event_id, full_name) VALUES (ev_id, 'Aylin Demir') RETURNING id INTO p2_id;
  INSERT INTO public.cert_participants (event_id, full_name) VALUES (ev_id, 'Murad Hasanov') RETURNING id INTO p3_id;

  INSERT INTO public.cert_records (event_id, participant_id, serial_number, serial_hash, event_hash, issued_by_hash, status)
  VALUES
    (ev_id, p1_id, 'UTAAB-BB-2026-0001', encode(extensions.digest('UTAAB-BB-2026-0001','sha256'),'hex'), encode(extensions.digest('Beyond Blockchain|2026-05-20|Veli Uysal','sha256'),'hex'), encode(extensions.digest('UTAAB','sha256'),'hex'), 'draft'),
    (ev_id, p2_id, 'UTAAB-BB-2026-0002', encode(extensions.digest('UTAAB-BB-2026-0002','sha256'),'hex'), encode(extensions.digest('Beyond Blockchain|2026-05-20|Veli Uysal','sha256'),'hex'), encode(extensions.digest('UTAAB','sha256'),'hex'), 'draft'),
    (ev_id, p3_id, 'UTAAB-BB-2026-0003', encode(extensions.digest('UTAAB-BB-2026-0003','sha256'),'hex'), encode(extensions.digest('Beyond Blockchain|2026-05-20|Veli Uysal','sha256'),'hex'), encode(extensions.digest('UTAAB','sha256'),'hex'), 'draft');
END $$;
