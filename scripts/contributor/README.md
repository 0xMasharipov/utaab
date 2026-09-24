# Contributor discovery checks

The contributor page uses the existing React, Tailwind, Iconoir, and Framer Motion dependencies. The request still uses `{ formData }` and the response uses `{ result }`.

The overview is the default view. `?view=assessment` opens the focused seven-step form. Switching views uses browser history and keeps the form mounted, preserving answers, the current step, and reached steps during this visit. Reloading restores saved answers and starts at the first step. Successful reports are held in memory; they are not persisted to browser storage. The overview's process and role explanations, the step list, and report details are native disclosures. The white UTAAB icon is the only animated illustration, and the generated object artwork is archived but unused.

Version 2 adds `assessmentVersion: 2`, `locale` (`en`, `tr`, `ru`, `ar`), and `scenarioAnswers` with `deadline`, `evidence`, and `priorities` keys. Each scenario requires 80–2,000 characters after trimming. The report adds five observations with source quotations and uncertainty, role evidence, and discussion questions. The shared contract validates quotations against the submitted answers. Existing unversioned requests and legacy reports remain supported.

Run the eleven contract and mocked Edge Function tests with Node 22.6 or newer:

```sh
npm run test:contributor
```

The tests invoke the actual Edge Function using in-memory database and model stubs. They cover required stages, exact evidence, invalid results, legacy compatibility, untrusted prompt data, rate limits, gateway errors, and storage failure. They do not call a live model or prove semantic adherence to the coaching prompt.

The optional browser suite requires Playwright and Chromium. With a local Vite server running:

```sh
CONTRIBUTOR_URL=http://127.0.0.1:8081 node scripts/contributor/browser-check.mjs
```

If Playwright is installed elsewhere, set `PLAYWRIGHT_MODULE` to its `index.mjs` path. The browser suite uses `/usr/bin/chromium`, mocks Supabase REST requests and assessment submissions, and writes screenshots to `/tmp/contributor-*.png`. It covers four locales, overview and assessment widths from 320 to 1440 pixels, reduced motion, offscreen animation suspension, accessible labels, validation focus, draft recovery, overview/browser history navigation, current-step retention, review validation, retries, duplicate submissions, collapsed report details, report layout, and result focus.

## Deployment handoff

No deployment or database migration is included. Deploy `supabase/functions/contributor-match` with its `_shared/contributor-contract.ts` and `_shared/contributor-prompt.ts` dependencies before publishing the new frontend. The existing `LOVABLE_API_KEY`, Supabase configuration, and JSON database columns remain in use. The v2 frontend rejects incomplete legacy responses, so publishing it against the old function would show a recoverable submission error.

Applicants and authorized reviewers see the same coaching report through the existing reviewer page. This change adds no admission automation, diagnosis, private personality scoring, or new access permissions. Reports describe tentative work-related observations supported by answers.

After deployment, verify a consented test submission against the live gateway, including output language, quality of uncertainty statements, and adherence to the non-diagnostic instructions. Automated tests use mocks only.
