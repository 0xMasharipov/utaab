## Goal

Bring the rest of the site up to the editorial quality of the new TonRa page: shared typography rhythm, consistent section spacing, removal of decorative "AI-smell" icon grids, and targeted layout fixes where sections currently feel weak — without touching any admin business logic.

## Design system (applied everywhere)

Define a small set of shared utility constants/classes used by all public pages so future drift stops:

- `EYEBROW` — `text-xs uppercase tracking-[0.2em] text-muted-foreground`
- `SECTION_TITLE` — `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight`
- `SECTION_SUBTITLE` — `text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl`
- `SECTION_PAD` — `py-16 md:py-24`
- Section dividers: `border-t border-white/[0.06]` between major bands
- Hero H1 reserved for top-of-page: `text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight`

These will live in a tiny `src/lib/designTokens.ts` (string constants) so components import the same values rather than re-typing classes. No Tailwind config changes, no new colors. Montserrat + Web3 navy/blue palette preserved per memory.

## Icon policy (strict)

Keep only **functional** icons: nav arrows, send, external-link, social brand marks, close/menu, status badges (check/x in cert flow), play, and admin sidebar icons. Remove decorative Lucide icons used as "feature bullets" (Sparkles, Rocket, Zap, Shield-as-decor, Globe, Layers, Star, Lightbulb, etc.). Replace icon-card grids with numbered editorial lists (matching TonRa's `01–06` pattern) or hairline-divided text blocks.

## Per-page polish (targeted layout)

Each item is a focused pass, not a rewrite.

1. **Home (`Index.tsx` and its sections)** — `Hero`, `AboutBlurb`, `Stats`, `Projects`, `Learn`, `Resources`, `Events`, `Community`, `Team`, `BlogSection`, `Join`, `Footer`:
   - Normalize section padding via `SECTION_PAD`.
   - Standardize eyebrow + title + subtitle headers across all sections.
   - `Projects`, `Resources`, `Learn`: strip decorative icons from cards; switch to clean type-led cards with hairline borders and a single arrow affordance.
   - `Stats`: reduce visual weight; remove icon chrome behind numerals.
   - `Community`: tighten card density on mobile.
2. **About (`About.tsx` + `AboutBlurb.tsx`)** — apply 12-col editorial layout pattern (left rail eyebrow, right body), keep the new UTAA/THK mention.
3. **Projects pages** — `UBpointPage.tsx`: align to the TonRa typography/spacing tokens; remove any remaining icon-grid noise; keep brand visuals.
4. **TeamPage / Team component** — keep grid, refine card chrome (hairline border, subtle hover), remove decorative icons.
5. **FAQ** — editorial accordion: thinner dividers, larger question type, calmer answer body.
6. **Blog + BlogPost** — header eyebrow/title rhythm, tighter meta row, hairline dividers; cards lose decorative icons.
7. **ResourcesPage / Whitepaper / LearnHub / EducationalGuides / Workshops** — apply tokens, kill icon-grids, replace with numbered lists or simple cards.
8. **ContributorMatch + contributor components** — clean hero, restrained archetype cards (no glowing icon badges), keep the assessment flow intact.
9. **VerifyCertificate** — already localized; apply tokens for header and result card spacing only.
10. **Auth / legal: PrivacyPolicy, TermsOfService, KVKKRequest, Unsubscribe, NotFound** — typography + spacing tokens, single-column readable max-width, hairline section breaks.
11. **Education hub (public-facing)** — `EducationHome`, `CourseCatalog`, `CourseDetail`, `CourseLearn`, `BlockchainAndMoney`, `EducationRegister`, `EducationSignIn`, `InstructorProfile`, `UserProfile`: token pass, restrained card chrome, remove decorative icons from feature strips. Keep all data flow, video player, quiz, and certificate logic untouched.
12. **Navbar / Footer** — keep brand sizing per memory; only tighten spacing and align link typography.

## Admin (visual-only)

- `AdminLayout.tsx`: keep sidebar icons (they're functional navigation), align typography to tokens, soften active-state colors, tighten paddings. No changes to auth checks, route list, or sign-out logic.
- Admin page bodies: only `className` adjustments on headings/cards to match tokens. **No** changes to forms, dialogs, queries, mutations, edge function calls, or state.
- Skip entirely: `cert/*` admin tables (functional density is correct as-is) beyond header typography.

## Out of scope

- No backend/edge function changes.
- No i18n key additions (copy unchanged).
- No new dependencies, no new assets, no Tailwind config or `index.css` token changes beyond the constants file.
- No changes to: `src/integrations/supabase/*`, routing, auth, RLS, security components, captcha, video player, quiz, certificate generation/verification logic.

## Technical notes

- Create `src/lib/designTokens.ts` exporting class-name constants.
- Edits are mostly `className` swaps and small JSX restructures (replace icon-card grids with numbered `<ol>` blocks).
- After each batch, spot-check the preview at mobile (375), tablet (768), desktop (1280) breakpoints.
- Work in batches by area (home → about/projects → team/blog → resources/learn → legal → education → admin shell) so a single failure doesn't cascade.

## Deliverable

A single coherent visual pass across all public pages plus a visual-only admin shell refinement, with shared tokens preventing future drift. No feature regressions; admin functionality fully preserved.