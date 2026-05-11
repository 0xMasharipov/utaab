-- 1. Remove overlapping permissive INSERT policy on quiz_attempts
DROP POLICY IF EXISTS "Users can create their own attempts" ON public.quiz_attempts;

-- 2. Move verify_certificate_by_hash to a private schema (out of PostgREST API surface)
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.verify_certificate_by_hash(_serial_hash text)
RETURNS TABLE(
  serial_number text, status text, issued_at timestamp with time zone,
  revoked_at timestamp with time zone, revocation_reason text,
  blockchain_tx_hash text, chain_id integer, contract_address text, pdf_url text,
  participant_name text, event_name text, speaker_name text,
  event_date date, location text, issued_by text, organizer text,
  partners text[], certificate_title text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    c.serial_number, c.status, c.issued_at, c.revoked_at, c.revocation_reason,
    c.blockchain_tx_hash, c.chain_id, c.contract_address, c.pdf_url,
    p.full_name, e.event_name, e.speaker_name, e.event_date, e.location,
    e.issued_by, e.organizer, e.partners, e.certificate_title
  FROM public.cert_records c
  LEFT JOIN public.cert_participants p ON p.id = c.participant_id
  JOIN public.cert_events e ON e.id = c.event_id
  WHERE lower(c.serial_hash) = lower(_serial_hash)
    AND c.status IN ('issued','revoked')
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION private.verify_certificate_by_hash(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.verify_certificate_by_hash(text) TO service_role;

-- Drop the public version - clients must now use the verify-certificate edge function
DROP FUNCTION IF EXISTS public.verify_certificate_by_hash(text);

-- 3. has_role stays in public + executable by anon/authenticated. This is REQUIRED:
--    76 RLS policies call has_role() during evaluation; PostgreSQL requires the
--    calling role to have EXECUTE on the function even inside SECURITY DEFINER.
--    The function returns boolean only and has zero PII surface.
COMMENT ON FUNCTION public.has_role(uuid, app_role) IS
  'Intentionally executable by anon/authenticated. Required by 76+ RLS policies. Returns boolean only; no data exposure. Do not move out of public schema.';

-- 4. Storage: certificates bucket is private. Add an admin-only SELECT policy so
--    admins can audit-download via the dashboard. End users still go through the
--    cert-pdf-url edge function which uses signed URLs (service role).
DROP POLICY IF EXISTS "Admins can read certificate objects" ON storage.objects;
CREATE POLICY "Admins can read certificate objects"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));