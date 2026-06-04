## Goal

Make the `/projects/ubpoint` page fully light-themed (currently the imported global `Navbar` and `Footer` are dark and clash with the white aesthetic), feature a prominent UBpoint logo lockup, and lighten the remaining dark buttons.

Scope: only `src/pages/projects/UBpointPage.tsx` — no changes to global Navbar/Footer (used by every other dark-themed page).

## Changes

### 1. Page-local light Navbar
- Build a small inline `LightNavbar` component (sticky, `bg-white/80 backdrop-blur-xl border-b border-blue-100`, slate text).
- Left: UBpoint logo image (`h-9 w-auto`) + wordmark "UBpoint".
- Right: links (`Features`, `Inside the app`, `Sponsors`, `Rewards`) in `text-slate-700 hover:text-blue-600`, plus a primary blue gradient "Join UTAAB" pill.
- Mobile: hamburger that toggles a light dropdown sheet (same tokens).
- Replace `<Navbar />` in `UBpointPage` with `<LightNavbar />`.

### 2. Page-local light Footer
- Build inline `LightFooter` (`bg-blue-50/60 border-t border-blue-100`).
- Logo lockup + tagline, three small link columns (Product / Resources / Community), social icons in blue, copyright in `text-slate-500`.
- Replace `<Footer onPrivacyClick={...} />` with `<LightFooter />`.

### 3. UBpoint logo — added & resized
- Hero: replace the tiny `w-4 h-4` logo inside the badge with a real lockup above the H1 — `<img src={logoAsset.url} className="h-14 md:h-16 w-auto mb-6 drop-shadow-[0_8px_24px_rgba(37,99,235,0.25)]" />`.
- Keep the small badge below it for the "UTAAB · Blockchain Engagement Platform" chip (no logo inside).
- Reuse the same logo in the new LightNavbar (`h-9`) and LightFooter (`h-8`).

### 4. Lighten dark buttons
- Sponsors section "Become a Sponsor" button: swap `bg-slate-900 hover:bg-slate-800 text-white` → `bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]` to match the hero CTA.
- PhoneFrame device chassis (`bg-slate-900`) stays dark — that's a realistic phone bezel, not a UI button. Leave as-is.
- MockScreen header logo dot stays blue (already light).
- FinalCTA gradient stays deep blue (intentional contrast for the final hero); white button on it is already light.

### 5. Verify
- Read the edited file back, then load `/projects/ubpoint` in the preview to confirm light navbar/footer, larger logo, and no dark button remnants.

## Out of scope
- No changes to the global `Navbar.tsx` / `Footer.tsx` (other pages keep their dark theme).
- No new routes, assets, translations, or backend changes.
- No design-system token changes.
