## Why `UTAAB-BB-2026-0001` fails to verify

Three problems stacked:

1. **`service_role` lacks `USAGE` on the `private` schema.**
   `cert-pdf-url` calls `private.verify_certificate_by_hash(...)` via service role and gets a permission-denied error, which the function logs as `verify rpc failed` and returns HTTP 500. Network logs confirm: `POST /functions/v1/cert-pdf-url → 500`.

2. **Hash format mismatch.**
   - Client/edge pass `0x7c1d00cd…` (with `0x` prefix, per `hashSerial` in `src/lib/certHash.ts`).
   - DB column `cert_records.serial_hash` is stored without the `0x` prefix (current row: `7c1d00cd…`).
   - The RPC compares `lower(c.serial_hash) = lower(_serial_hash)` → never matches.

3. **Record status is `draft`.**
   The RPC filters `status IN ('issued','revoked')`. Even after fixes 1 & 2, this serial won't return until it's issued (voucher signed + claimed, or admin marks it issued). That's a data step, not a bug.

## Changes

### Migration

```sql
-- 1) Allow service_role to enter the private schema
GRANT USAGE ON SCHEMA private TO service_role;
GRANT EXECUTE ON FUNCTION private.verify_certificate_by_hash(text) TO service_role;

-- 2) Make the RPC tolerant of the 0x prefix on input
CREATE OR REPLACE FUNCTION private.verify_certificate_by_hash(_serial_hash text)
RETURNS TABLE (...same columns...)
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
  JOIN public.cert_events e ON e.id = c.event_id, h
  WHERE lower(replace(c.serial_hash,'0x','')) = h.needle
    AND c.status IN ('issued','revoked')
  LIMIT 1;
$$;
```

No edge function or frontend code changes are needed — both already pass the `0x`-prefixed hash, which the updated RPC now normalizes.

### After deploy

Test in two steps:
1. Re-run verification for an *issued* serial → should return the record + signed PDF URL.
2. `UTAAB-BB-2026-0001` is still `draft`; either issue it from the admin Certificates panel (cert-issue-voucher → claim) or change its status, then re-verify.

## Out of scope

- No UI changes.
- No change to on-chain logic — chain read path was never reached because the DB error wasn't the blocker for this specific serial (it has no on-chain claim yet).
