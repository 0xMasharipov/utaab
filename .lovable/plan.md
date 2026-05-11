
# UTAAB Certificate Verification System

A full system to issue, hash-anchor on Sepolia, and publicly verify UTAAB seminar/event certificates.

## 1. Database (Supabase migration)

New tables (with RLS):

- **events** — event_name, event_slug (unique), event_code, event_type, speaker_name, event_date, start_time, end_time, location, description, issued_by, organizer, partners[], certificate_title, certificate_description, certificate_quantity, serial_prefix, template_id, status, timestamps.
- **participants** — event_id, full_name, email, phone, notes.
- **certificate_templates** — template_name, colors, title/body/signature/footer text, show_qr, layout_json.
- **certificates** — event_id, participant_id, serial_number (unique), serial_hash (unique), event_hash, issued_by_hash, pdf_url, qr_url, blockchain_tx_hash, chain_id (default 11155111), contract_address, status (draft/issued/revoked/failed), issued_at, revoked_at, revocation_reason.

**RLS** (reusing existing `has_role(auth.uid(),'admin')`):

- Admins: full CRUD on all 4 tables.
- Public: SELECT on `events` (status='active'/'completed'), `certificate_templates`, and `certificates` where status IN ('issued','revoked').
- Public SELECT on `participants` is **denied**. Verification will use a SECURITY DEFINER function `public.verify_certificate(serial_hash text)` that returns only safe fields (participant full_name, event info, cert status, tx hash) — never email/phone.

Storage bucket: `certificates` (public read) for generated PDFs and QR PNGs.

Seed: one event "Beyond Blockchain" + 3 sample participants + 3 draft certificates.

## 2. Smart contract

Add `/contracts/UTAABCertificateRegistry.sol` (exact source from request) as reference. Contract address comes from env — I will set `VITE_CERTIFICATE_CONTRACT_ADDRESS` (placeholder until you deploy and provide the real one) plus `VITE_SEPOLIA_RPC_URL`, `VITE_CHAIN_ID=11155111`, `VITE_BLOCK_EXPLORER_URL`.

UI shows a clear "Contract not configured" banner when the address is the placeholder, so the rest of the app remains usable.

## 3. Web3 stack

- **viem + wagmi + RainbowKit** for wallet connection and writes.
- Public RPC client (viem `createPublicClient`) for read-only verification — no wallet required.
- Network guard: if connected wallet ≠ Sepolia (11155111), show "Please switch to Sepolia testnet" with a switch-network button.
- Owner-only writes: `issueCertificate`, `issueBatchCertificates`, `revokeCertificate`. After tx confirmation, save tx hash + update status in Supabase.

## 4. PDF & QR

- **pdf-lib** + **qrcode** (both pure-JS, work in browser and edge functions).
- Client-side bulk generation in admin (Web Worker friendly), upload PDF + QR PNG to `certificates` bucket, store `pdf_url`/`qr_url`.
- QR encodes `https://utaab.org/verify-certificate?serial={SERIAL}`.

## 5. Hashing utilities (`src/lib/certHash.ts`)

Used identically on admin generation, verification page, and contract calls:

```
normalize(s) = s.trim().toUpperCase()
serialHash    = keccak256(toBytes(normalize(serial)))
eventHash     = keccak256(toBytes(`${event_name}|${event_date}|${speaker_name}`))
issuedByHash  = keccak256(toBytes(issued_by))
```

Serial format: `UTAAB-{EVENTCODE}-{YEAR}-{0001}`. EVENTCODE auto-derived from event_name initials with conflict suffix.

## 6. Public pages

- **Hero block on homepage** — "Verify UTAAB Certificate" with serial input + button → `/verify-certificate`.
- **`/verify-certificate`** — accepts `?serial=...` or manual input. Flow:
  1. Normalize + hash serial.
  2. Read on-chain `verifyCertificate(serialHash)` via public RPC.
  3. Read DB metadata via `verify_certificate` RPC (no PII leak).
  4. Render `VerificationResultCard` with one of 4 states: valid / revoked / not found / network error. Shows participant, event, speaker, date, location, issued-by, serial, issued date, network=Sepolia, tx hash + contract address with explorer links, and PDF download.

## 7. Admin panel

Mounted under existing obfuscated admin routes (`ADMIN_ROUTES`), guarded by `has_role(...,'admin')`. New sidebar entries:

- **Dashboard** (`/admin/.../certs`) — StatCards: events, certificates, issued, revoked, pending on-chain. Recent events + recent certs.
- **Events** — list/search/filter, create/edit (drafts deletable), event detail page with action buttons (Edit, Add Participant, Import CSV, Generate Certificates, Issue on Sepolia, Download CSV, View Certificates).
- **Participants** — manual add + CSV import (`full_name,email,phone`), dedupe per event, edit/delete only while no cert issued.
- **Certificates** — table with search/filter; preview, download PDF, single issue, batch issue, revoke (with reason).
- **Templates** — CRUD with live preview; default premium navy/white UTAAB template seeded.
- **Settings** — org name, default issued_by, contract address (display), chain id, RPC URL, explorer URL, default prefix, verification base URL, logo uploads.
- **Help / Deployment** — `/admin/.../help/blockchain-deployment` with the contract deployment walkthrough.

## 8. Reusable components

`AdminLayout` (existing), `PublicLayout` (existing), `StatCard`, `EventForm`, `ParticipantForm`, `CSVImporter`, `CertificateTable`, `CertificateStatusBadge`, `VerificationResultCard`, `QRCodeBlock`, `WalletConnectButton`, `BlockchainTxLink`, `EmptyState`, `LoadingState`, `ErrorState`.

## 9. Error handling

Covers: missing serial, DB-only / chain-only mismatches, RPC failure, wallet not connected, wrong network, non-owner wallet, batch tx failure (mark cert `failed` + retry), duplicate serial, invalid CSV columns, missing participant name.

## 10. Security

- Only hashes on-chain.
- Frontend never holds private keys; all writes via connected wallet.
- Admin SQL operations behind RLS + `has_role`.
- `participants` table fully blocked from anon; verification RPC returns only public-safe fields.
- Edge function (if added for bulk PDF) follows existing edge-hardening standard.

## 11. Design

- Web3 navy/blue palette via existing tokens (no purple, Montserrat headings 800 / body 400, semantic Tailwind classes only).
- Glass cards, rounded-2xl, premium spacing, fully responsive.

## 12. Files to add (high level)

```
contracts/UTAABCertificateRegistry.sol
supabase/migrations/<ts>_certificates_system.sql
src/lib/web3/{wagmi.ts, abi.ts, publicClient.ts}
src/lib/certHash.ts
src/lib/pdf/{generateCertificatePdf.ts, qr.ts}
src/lib/serial.ts
src/pages/VerifyCertificate.tsx
src/components/verify/VerificationResultCard.tsx
src/components/cert/{StatCard,CertificateStatusBadge,BlockchainTxLink,WalletConnectButton,CSVImporter,...}.tsx
src/pages/admin/cert/{CertDashboard,Events,EventDetail,Participants,Certificates,Templates,Settings,Help}.tsx
```

Edits: `src/App.tsx` (routes + wagmi/RainbowKit providers), `src/components/admin/AdminLayout.tsx` (sidebar items), `src/config/routes.ts` (new obfuscated admin sub-paths), `src/components/Hero.tsx` or homepage section (verify CTA), homepage adds verify block.

## 13. Env vars

Set placeholders now; you provide real values when contract is deployed:

```
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_CERTIFICATE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_CHAIN_ID=11155111
VITE_BLOCK_EXPLORER_URL=https://sepolia.etherscan.io
```

## 14. Out of scope for this iteration

- Multi-language translations of the new admin pages (English only first; can be added later via existing i18n system).
- Contract auto-deployment (you deploy manually; help page documents the steps).
