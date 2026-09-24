# Certificate page verification

The `/verify-certificate` redesign is frontend-only. The landscape certificate is local HTML/CSS using existing UTAAB vector marks, explicitly labeled as an illustrative sample. Generated PDFs, stored certificates, contracts, and backend functions are unchanged.

The existing `cert-pdf-url` function and configured Base RPC remain the verification sources. The UI preserves serial normalization and query links, prevents duplicate pending submits, ignores stale responses, and distinguishes unavailable services from missing records. Network labels use the configured network. Results no longer claim blockchain confirmation when only registry verification is available.

## Browser checks

Start the local Vite server, then run the optional Playwright suite:

```sh
CERTIFICATE_URL=http://127.0.0.1:8081 node scripts/cert/browser-check.mjs
```

If Playwright is installed outside the project, set `PLAYWRIGHT_MODULE` to its `index.mjs` path. The script uses `/usr/bin/chromium`; no new runtime dependency is required by the page.

The suite mocks certificate lookup, Supabase REST/functions, and JSON-RPC responses. It intercepts the Vite configuration module to exercise the configured-contract path without changing environment variables or connecting to a live contract. It checks:

- English, Turkish, Russian, and Arabic at 320, 390, 768, 1024, and 1440 pixels; RTL, sample labels, unclipped certificate, and reduced motion.
- Required serial input, duplicate submission prevention, loading, result focus, valid/revoked/not-found/error states, PDF actions, missing PDF, long names/serials, and invalid dates.
- Automatic query verification, clearing the query, and stale-request protection.
- Registry-only, configured blockchain, and chain-only results with unavailable metadata.
- Bounded pointer tilt, hover pause, offscreen suspension, live reduced-motion changes, and a CPU-throttled performance trace.

Screenshots are written to `/tmp/certificate-*.png`. These are mock results, not issued credentials.

## Configuration and validation notes

The existing Content Security Policy prevented requests to the default Base RPCs. `index.html` and the policy example in `SECURITY.md` now allow only `https://mainnet.base.org` and `https://sepolia.base.org` in addition to the existing connection sources. A custom RPC origin must be explicitly configured in the policy as well.

Production build and changed-file lint pass. Repository-wide TypeScript checking still reports 25 pre-existing diagnostics in unrelated education, Three.js, and admin code; none reference the changed certificate components. Browser verification uses mocks. No live certificate verification, PDF regeneration, database migration, or deployment was performed.
