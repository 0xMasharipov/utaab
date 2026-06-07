## Problem

Issuing a cert fails with `bad serial_hash`. Root cause: `cert_records.serial_hash` is stored in the DB as 64 hex chars **without** the `0x` prefix (confirmed: `7c1d00cd…` length 64). But both the client validator in `CertRecords.tsx` and the Zod schema in the `cert-issue-voucher` edge function require the `0x` prefix (`/^0x[0-9a-f]{64}$/`). So every row trips client-side validation as "bad serial_hash" before the request is even sent.

## Fix (single-file, frontend-only)

Edit `src/pages/admin/cert/CertRecords.tsx`:

1. Replace
   ```ts
   const serialLower = (r.serial_hash || '').toLowerCase();
   ```
   with a normalization step that adds `0x` if the DB value is the bare 64-char form:
   ```ts
   const raw = (r.serial_hash || '').toLowerCase();
   const serialLower = raw.startsWith('0x') ? raw : raw ? `0x${raw}` : '';
   ```
   (Equivalent to using the existing `fromDbHex` helper — already imported.)

2. No schema change. No edge function change. The edge function already accepts `0x`-prefixed hashes and the DB lookup uses `.eq('serial_hash', serial_hash)` against the lowercased prefixed value — but the row stores it un-prefixed, so we also need the edge function to match. **Check:** the edge function does `.eq('serial_hash', serial_hash)` with the `0x`-prefixed value — that won't match the un-prefixed DB value either.

## Edge function fix (`supabase/functions/cert-issue-voucher/index.ts`)

After Zod parse, strip the prefix for the DB lookup, but keep the prefixed form for the EIP-712 voucher:

```ts
const serialHashDb = serial_hash.slice(2); // for .eq() against cert_records.serial_hash
// ...
.eq('serial_hash', serialHashDb)
```

Keep `voucher.serialHash = serial_hash as Hex` (prefixed) unchanged — the on-chain contract expects `bytes32` with `0x`.

## Why this is the right fix

- `src/lib/certHash.ts` already documents the convention: "we store hex without 0x", with `toDbHex` / `fromDbHex` helpers. The admin page and edge function simply weren't following it.
- Keeps the contract call correct (needs `0x`) and the DB row matchable (no `0x`).

## Out of scope

- Migrating existing rows to add `0x` (not needed; the helpers already encode the convention).
- Any changes to the contract, ABI, claim flow, or PDF generation.
