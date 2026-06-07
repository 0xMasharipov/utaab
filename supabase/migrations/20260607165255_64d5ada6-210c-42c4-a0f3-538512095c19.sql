GRANT USAGE ON SCHEMA private TO service_role;
GRANT EXECUTE ON FUNCTION private.verify_certificate_by_hash(text) TO service_role;

CREATE OR REPLACE FUNCTION private.verify_certificate_by_hash(_serial_hash text)
RETURNS TABLE(
  serial_number text, status text, issued_at timestamptz, revoked_at timestamptz,
  revocation_reason text, blockchain_tx_hash text, chain_id integer,
  contract_address text, pdf_url text, participant_name text, event_name text,
  speaker_name text, event_date date, location text, issued_by text,
  organizer text, partners text[], certificate_title text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH h AS (
    SELECT lower(regexp_replace(_serial_hash, '^0x', '')) AS needle
  )
  SELECT c.serial_number, c.status, c.issued_at, c.revoked_at, c.revocation_reason,
         c.blockchain_tx_hash, c.chain_id, c.contract_address, c.pdf_url,
         p.full_name, e.event_name, e.speaker_name, e.event_date, e.location,
         e.issued_by, e.organizer, e.partners, e.certificate_title
  FROM public.cert_records c
  LEFT JOIN public.cert_participants p ON p.id = c.participant_id
  JOIN public.cert_events e ON e.id = c.event_id
  CROSS JOIN h
  WHERE lower(replace(c.serial_hash,'0x','')) = h.needle
    AND c.status IN ('issued','revoked')
  LIMIT 1;
$$;