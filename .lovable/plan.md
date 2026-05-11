## Goal

Make the existing certificate verification page discoverable by adding a link to it from the navbar's mega-menu ("MENU") dropdown.

## Findings

- A full verification page already exists at `src/pages/VerifyCertificate.tsx`, mounted at the route `/verify-certificate` in `src/App.tsx`. It includes serial input, on-chain check, signed PDF retrieval, and a result card.
- The navbar's "MENU" panel (`src/components/Navbar.tsx`) is organized into three columns: Ecosystem, Explore, Organization. There is currently no entry pointing to certificate verification.
- i18n strings are sourced from `src/i18n/locales/{en,ru,tr,ar}.json` under the `nav.*` namespace.

## Plan

1. **Reuse the existing page** at `/verify-certificate` — no new route or page component needed (the existing implementation is complete and secure).
2. **Add a menu entry** in `src/components/Navbar.tsx`, in the "Explore" column (most natural fit alongside Resources / Blog / Education), pointing to `/verify-certificate`. Key: `verifyCertificate`.
3. **Add translations** for `nav.verifyCertificate` in all four locale files:
   - en: "Verify Certificate"
   - ru: "Проверить сертификат"
   - tr: "Sertifika Doğrula"
   - ar: "التحقق من الشهادة"
4. **No backend or business-logic changes** — UI/navigation only.

## Out of scope

- No changes to `VerifyCertificate.tsx` itself.
- No changes to admin certificate routes.
- No changes to the language dropdown (the small Globe dropdown stays language-only).
