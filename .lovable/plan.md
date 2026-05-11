## Admin Panel for Certificate Verification System

Build the full admin UI for managing events, participants, certificates, and templates, plus on-chain issuance/revocation via wallet.

### Routes (under existing obfuscated admin base)
- `/admin/certificates` — Dashboard (stats + recent activity)
- `/admin/certificates/events` — Events list + create/edit
- `/admin/certificates/events/:id` — Event detail (participants + certificates for that event)
- `/admin/certificates/participants` — Global participant list + CSV import
- `/admin/certificates/records` — All certificates table (filter by status/event)
- `/admin/certificates/templates` — Template editor (title, body text, signature lines, partners)
- `/admin/certificates/settings` — Contract address, RPC URL, chain info, owner wallet check
- `/admin/certificates/help` — Workflow guide

All gated by `has_role(user.id, 'admin')` using existing pattern.

### Pages & components to add
- `src/pages/admin/cert/CertDashboard.tsx` — StatCards: total events, participants, drafts, issued, revoked + recent issuances table
- `src/pages/admin/cert/EventsList.tsx` + `EventForm.tsx` (drawer/dialog)
- `src/pages/admin/cert/EventDetail.tsx` — tabs: Participants | Certificates | Template
- `src/pages/admin/cert/ParticipantsList.tsx` + `ParticipantForm.tsx` + `CSVImporter.tsx` (parses name/email/wallet, dedupes)
- `src/pages/admin/cert/CertificatesList.tsx` — table with bulk-select, actions: Generate PDF, Issue On-chain, Revoke, Download, View
- `src/pages/admin/cert/TemplatesList.tsx` + `TemplateForm.tsx`
- `src/pages/admin/cert/CertSettings.tsx` — shows env vars, contract status, network indicator, owner check
- `src/components/admin/cert/IssueCertificateDialog.tsx` — wallet connect → preview hashes → call `issueBatchCertificates` → save tx hash + status
- `src/components/admin/cert/RevokeCertificateDialog.tsx` — reason input → call `revokeCertificate`
- `src/components/admin/cert/BulkPdfGenerator.tsx` — generates PDFs client-side, uploads to `certificates` bucket, updates `pdf_url`
- `src/components/admin/cert/NetworkGuard.tsx` — warns if not on Sepolia

### Workflow
1. Admin creates Event → assigns Template
2. Admin adds Participants (manual or CSV) → certificates auto-created as `draft` with serial `UTAAB-{CODE}-{YEAR}-{NNNN}`
3. Admin generates PDFs (client-side, uploaded to bucket)
4. Admin connects wallet (RainbowKit) → selects drafts → batch issue on Sepolia → tx confirmation → status `issued`, save `blockchain_tx_hash`, `contract_address`, `chain_id`, `issued_at`
5. Admin can revoke → on-chain call → status `revoked`, save `revoked_at`, `revocation_reason`
6. Public verifies at `/verify-certificate?serial=...`

### Hooks (TanStack Query)
- `useCertEvents`, `useCertParticipants`, `useCertRecords`, `useCertTemplates` — CRUD
- `useIssueCertificates` — wagmi `useWriteContract` + `useWaitForTransactionReceipt` → DB update
- `useRevokeCertificate` — same pattern
- `useGeneratePdfs` — pdf-lib + qrcode + storage upload

### Edge cases
- Wallet not connected, wrong network, non-owner → clear inline messages
- Tx rejected/failed → keep status `draft`, surface error
- Duplicate serials prevented at DB unique constraint
- CSV: skip rows with missing name, dedupe by email
- PDF generation failure on individual rows → continue batch, report failures
- Network guard prevents writes when `VITE_CERTIFICATE_CONTRACT_ADDRESS` is placeholder

### Navigation
Add "Certificates" entry to existing `AdminLayout` sidebar with sub-nav for Events / Participants / Records / Templates / Settings.

### Out of scope (this step)
- Public hero CTA on homepage (already linked via `/verify-certificate`)
- Email notifications to participants (next iteration)
- Multi-language admin UI (English only)
