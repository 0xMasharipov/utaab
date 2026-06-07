## Goal

Activate certificates using the deployed Base Sepolia contract `0x4fF797906D7B56F9Bd2Db382BcB36C97d69A43A9`.

## Changes

1. **`.env`** — add frontend vars (public, safe to commit; chain address is on-chain data):
   ```
   VITE_CERTIFICATE_CONTRACT_ADDRESS=0x4fF797906D7B56F9Bd2Db382BcB36C97d69A43A9
   VITE_CHAIN_ID=84532
   VITE_BASE_RPC_URL=https://sepolia.base.org
   VITE_BLOCK_EXPLORER_URL=https://sepolia.basescan.org
   ```
   This flips `isContractConfigured` to true in `src/lib/web3/wagmi.ts` (no code change needed).

2. **Edge function secrets** (server-only, never exposed to browser) — add via secrets tool:
   - `CERT_CONTRACT_ADDRESS=0x4fF797906D7B56F9Bd2Db382BcB36C97d69A43A9`
   - `CERT_CHAIN_ID=84532`
   
   Used by `supabase/functions/cert-issue-voucher/index.ts` when signing EIP-712 vouchers.

## Private key safety (your concern)

The issuer key `UTAAB_ISSUER_PRIVATE_KEY` is already stored as a Lovable Cloud secret. That means:
- It lives only in the edge function runtime — never bundled into the frontend, never sent to browsers, never logged.
- Only edge functions can read it via `Deno.env.get(...)`.
- The frontend never needs it: students sign the on-chain `claim()` tx with their own wallet using the voucher signature the edge function returns.
- `cert-issue-voucher` is gated by `has_role(user, 'admin')` so only authenticated admins can request a signed voucher.

I will **not** put any private key into `.env` or any committed file. Only the public contract address goes into `.env`.

## After apply

- Smoke test: open the certificates admin → confirm `CertSettings` shows the contract address (not "Not set") and reads `owner()` successfully → issue one test voucher → claim from a student wallet → confirm tx on https://sepolia.basescan.org.
