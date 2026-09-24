# UTAAB web progress

Current phase: UBpoint GitHub source handoff; live application and Supabase deployment remain pending.

## Done

- [x] Prepared the UBpoint mobile fix for GitHub `0xMasharipov/utaab` main on top of remote commit `ff4a620`, preserving the newer remote planning files and unrelated source.

- [x] Matched UBpoint's mobile story to the desktop side-by-side phone/text composition, with proportional phone framing, readable wrapping, portrait/landscape sizing, and the same four animated stages.
- [x] Stabilized the mobile scroll track, enlarged story navigation touch targets, corrected stage anchors and direct hash loading, and retained the side-by-side layout for reduced motion.
- [x] Verified four-language layouts, RTL, story links, mobile navigation, direct-link reloads, download navigation, and reduced motion in Chromium; targeted lint and production build pass.

- [x] Prepared the session's contributor, certificate, and homepage blog changes on top of GitHub `0xMasharipov/utaab` main, preserving newer remote migrations, assets, and unrelated components. Verified the publication checkout's production build and contributor contract tests.

- [x] Added static, faint drafting grids, corner accents around the white UTAAB icon, and accessible disclosure icons/chevrons to contributor-match.
- [x] Refined the mobile overview, full-width primary action, 16px form inputs, readable step count, 48px choice controls, and full-width final review controls for long translations.
- [x] Verified four-language overview/form layouts, complete mocked assessment journey, mobile review controls at 320/390px, build/lint, and zero steady-animation paints/layouts at 4x CPU throttling.

- [x] Restored the white 3D UTAAB icon and removed generated-object artwork from contributor-match. Archived the generated assets and removed unused illustration/closing components.
- [x] Separated the concise overview and focused assessment using `?view=assessment`; added optional process/role disclosures, a centered form, expandable step navigation, explicit progress, validation focus, and compact results with expandable evidence.
- [x] Verified answer/current-step retention across overview and browser history navigation, reload draft recovery, four locales and both views at 320–1440px, submission failures/success, reduced motion, icon pause, and zero steady-animation paints/layouts at 4x CPU throttling.

- [x] Limited the homepage blog preview to one post on mobile, two on tablet, and three on desktop, with a soft shadow/fade and localized View All Posts link. Homepage query and prefetch now fetch only three posts.
- [x] Verified responsive post counts at five widths, keyboard access, blog navigation, Arabic RTL, empty state, component lint, and production build.

- [x] Generated seven transparent white 3D illustrations and integrated them across contributor-match sections, including six relevant contribution objects, process art, assessment, loading/results, and closing artwork.
- [x] Added cropped composition, layered grids, dark text scrims, and text shadows; retained lightweight offscreen-paused motion and live reduced-motion support. Optimized production artwork to approximately 300 KB total.
- [x] Verified artwork loading, desktop/mobile layouts, all four locales and RTL, mocked assessment flows, production build, and zero steady-animation paints/layouts at 4x CPU throttling.

- [x] Rebuilt `/verify-certificate` in UTAAB navy, white, and blue with an accessible serial form, refined result states, and a recreated local landscape certificate preview.
- [x] Added lightweight 3D certificate tilt/float, thickness, embossed branding, four locales, RTL, offscreen pausing, and live reduced-motion handling.
- [x] Verified registry and blockchain states with mocks, protected against stale responses, and corrected the CSP allowlist for the built-in Base RPC endpoints.

- [x] Added white beveled faces, shaded extrusion, and gentle perspective tilt to the UTAAB icon while preserving the lightweight, pausable animation.

- [x] Simplified the icon to a static SVG with one composited float, pausing offscreen without restarting its animation timeline.

- [x] Replaced the abstract floating sculpture with the existing white UTAAB SVG icon in the hero and analysis loading state, including subtle animation and reduced-motion support.

- [x] Rebuilt `/contributor-match` with a graphite palette, asymmetric typography, geometric animation, responsive grids, and reduced-motion support.
- [x] Added three localized scenario questions, native accessible labels, complete review validation, and draft recovery after failed submissions.
- [x] Added shared report validation, exact source quotations, uncertainty, role evidence, and discussion questions to the existing Edge Function and reviewer page.
- [x] Added focused contract/endpoint tests and a reproducible mocked browser suite under `scripts/contributor/`.
- [x] Verified production build, changed-file lint, 11 contract/endpoint tests, desktop/mobile layouts, four locales, RTL, reduced motion, retries, and successful submission behavior.

## Next

- [ ] Deploy the updated Supabase function and shared modules before publishing the frontend. Deployment was excluded from this task.
- [ ] Verify the live model's language and coaching quality with a consented test application after deployment.
- [ ] Address unrelated repository-wide lint and TypeScript failures in a separate task. Current errors include education navigation icon types, conflicting Three.js types, and existing admin update types.

Decision record: This is a shared coaching profile for human discussion, not a psychological diagnosis or automated admission decision. Existing route, navigation, brand, and database schema are preserved. See `scripts/contributor/README.md` for the request contract, checks, and deployment order.
