Change the status badges for UBpoint and TonRa project cards from "Under Development" to "Beta".

Technical details:
- Update `ProjectStatus` type in `src/components/Projects.tsx` to include `'beta'` alongside `'underDevelopment'` and `'planning'`.
- Set UBpoint and TonRa `status` values to `'beta'`.
- Add badge styling for `'beta'` (green/accent theme indicating live but early).
- Add `projects.status.beta` translation keys in `en.json`, `tr.json`, `ar.json`, and `ru.json`.
- Update the eyebrow status label on `TonRaPage.tsx` to use the same new status text instead of the hardcoded `underDevelopment` translation.