# Fix admin "Issue selected" certificate flow

## Root cause

The deployed contract on Base is the new `UtaabCertificate` (soulbound, voucher-based). It does **not** expose `issueBatchCertificates` / `issueCertificate` / `revokeCertificate`. Those legacy entries still sit in the ABI only to keep old admin pages compiling — calling them on the live contract reverts with the generic "Unexpected error" you see.

The admin **Certificates → Issue selected** button in `src/pages/admin/cert/CertRecords.tsx` still calls `writeContractAsync({ functionName: 'issueBatchCertificates' })`, which is why every attempt reverts. The same applies to **Revoke** which calls `revokeCertificate` instead of the new `revoke(serialHash, reason)`.

In the new model, the admin doesn't pay gas or mint anything. The admin just signs an EIP-712 voucher (via the existing `cert-issue-voucher` edge function), which:
- marks the DB row as `status='issued'`
- stores the voucher + signature on the row
- lets the holder later `claim()` from their own wallet on Base (handled by `ClaimOnBase`)

## What I'll change

Only the admin UI under `src/pages/admin/cert/CertRecords.tsx`. No contract, no schema, no edge-function changes.

1. **Issue flow** — replace the on-chain batch write with a per-row call to the `cert-issue-voucher` edge function:
   - For each selected draft, require `holder_address` (either already on the row, or pulled from the participant record). If a row has no holder, skip it and surface a clear toast listing the missing names.
   - `await supabase.functions.invoke('cert-issue-voucher', { body: { serial_hash, holder, token_uri? } })` per row.
   - On success, the edge function already updates `cert_records` (status=issued, voucher, signature, chain_id, contract_address, holder_address, issued_at), so the UI just invalidates queries.
   - Drop wallet / network / `writeContractAsync` requirements from this dialog — issuance is now a signed-server action, no admin wallet needed.

2. **Revoke flow** — switch from the old `revokeCertificate(serialHash)` to the new `revoke(serialHash, reason)` ABI call (still admin-wallet on-chain because revoke is `onlyRole(ADMIN_ROLE)`). Keep the existing DB update.
   - Use `ACTIVE_CHAIN` + `CHAIN_ID` from `src/lib/web3/wagmi.ts` instead of hard-coded `sepolia`, so it works against Base / Base Sepolia.

3. **Issue dialog UX** — remove "submit a transaction on Sepolia" copy; explain that the admin is signing a voucher and the recipient will claim on Base. Show a per-row result list (issued / skipped-missing-holder / failed).

4. Keep all PDF generation and selection logic untouched.

## Out of scope

- ABI cleanup of the legacy `issueCertificate` / `issueBatchCertificates` / `revokeCertificate` entries — leaving them avoids churn elsewhere this turn. Can be removed later.
- No changes to `cert-issue-voucher`, `ClaimOnBase`, contracts, or DB schema.
- No copy/branding changes outside the issue & revoke dialogs.

## Technical notes

- `cert-issue-voucher` returns 503 if `UTAAB_ISSUER_PRIVATE_KEY` / `CERT_CONTRACT_ADDRESS` aren't configured; the new UI will surface that as an actionable error toast.
- Holder lookup priority: `cert_records.holder_address` → `participants.wallet_address` (if present in `partsById`) → skip with reason "no wallet on file".
- Revoke uses `useWriteContract` against `ACTIVE_CHAIN` (Base / Base Sepolia depending on `CERT_CHAIN_ID`); it requires the connected wallet to hold `ADMIN_ROLE` on the contract.
