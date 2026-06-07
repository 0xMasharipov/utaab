# Retry-safe voucher issue flow + validation + debug logging

## Context

`IssueBatchCertificates` is no longer used — the active admin path is the voucher flow (`cert-issue-voucher` edge function → `ClaimOnBase`). All requirements will be applied there.

## Changes

### 1. Client validation (`src/pages/admin/cert/CertRecords.tsx`)
Zod schema gate before any network call:
- `serial_hash`: `^0x[0-9a-f]{64}$` (lowercased)
- `holder`: viem `isAddress` + `getAddress` checksum normalization
- `row.chain_id === CHAIN_ID` (skip mismatched rows)
- `status === 'draft'`
- batch size ≤ 50
Failures surface in the results panel; never hit the server.

### 2. Retry-safe issuance with re-sign
Per-row loop, up to **3 attempts**, exponential backoff (300 / 900 / 2700 ms). Each retry re-invokes `cert-issue-voucher` so a fresh `issuedAt` + new signature are produced. Retry only on network / 5xx / "voucher failed". Terminal on 400 and 409. Results panel shows attempt count.

### 3. Retry on student claim (`src/components/cert/ClaimOnBase.tsx`)
Wrap `claim()` with the same 3-attempt + re-fetch-voucher pattern (wagmi handles gas estimation each send). Terminal on user-rejection.

### 4. Backend hardening (`supabase/functions/cert-issue-voucher/index.ts`)
- Lowercase `serial_hash` before lookup
- `getAddress(holder)` (400 on bad checksum)
- 409 if `row.status === 'issued'` (in addition to existing 'revoked')
- Require `https://` on `token_uri`
- Verify `row.chain_id ?? CHAIN_ID === CHAIN_ID`
- Keep generic 4xx/500 bodies (no error leakage)

### 5. Debug logging
Client: `console.debug('[cert-issue]', { attempt, serial, holder, chainId, batchSize })` and per-result entries.
Edge function: structured `console.log('[voucher]', { attempt_id, serial_hash, holder, chain_id, contract, row_status })` and `[voucher:signed]` / `[voucher:error]` with stage codes only.

### 6. ABI markers (`src/lib/web3/abi.ts`)
JSDoc `@deprecated` on `issueBatchCertificates` / `issueCertificate` / `revokeCertificate` to prevent accidental reuse.

## Out of scope
Contract, DB schema, PDF generation, list/filter UI.

## Files touched
- `src/pages/admin/cert/CertRecords.tsx`
- `src/components/cert/ClaimOnBase.tsx`
- `supabase/functions/cert-issue-voucher/index.ts`
- `src/lib/web3/abi.ts`
