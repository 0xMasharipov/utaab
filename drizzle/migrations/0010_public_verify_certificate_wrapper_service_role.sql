CREATE OR REPLACE FUNCTION public.verify_certificate_by_hash(_serial_hash text)
RETURNS TABLE(
  serial_number text, status text, issued_at timestamptz, revoked_at timestamptz,
  revocation_reason text, blockchain_tx_hash text, chain_id integer,
  contract_address text, pdf_url text, participant_name text, event_name text,
  speaker_name text, event_date date, location text, issued_by text,
  organizer text, partners text[], certificate_title text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM private.verify_certificate_by_hash(_serial_hash);
$$;

REVOKE ALL ON FUNCTION public.verify_certificate_by_hash(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_certificate_by_hash(text) TO service_role;