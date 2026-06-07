## Refine the TonRa page

Goal: make `src/pages/projects/TonRaPage.tsx` feel like the rest of the site — editorial, restrained, web3-blue/navy, Montserrat — instead of an icon-heavy "vibe coded" landing. No new dependencies, no copy changes (i18n keys stay the same), no business logic touched.

### What changes

**1. Hero — calmer, more editorial**
- Tighter vertical rhythm; numbered/lettered eyebrow ("01 — Security · TON") instead of the pill badge alone, using thin uppercase tracking.
- Wordmark-style "TonRa" with refined gradient on a single accent word, slightly tighter `tracking-tight`, paired with a thin hairline divider above the tagline.
- Keep the existing `tryBeta` and `backToProjects` actions, but:
  - Primary button restyled to match the site's existing rounded primary buttons (same shadow tokens as TonRa currently has, just toned down — no oversized glow).
  - Secondary "back" becomes a quiet ghost button with hairline border, matching `UBpointPage`/other pages.
- Remove the heavy white radial glow behind the logo; replace with a soft, single low-opacity blue radial + a faint conic ring (CSS only) so the logo sits in a quiet pocket of light rather than a "stage spotlight".
- Add a small meta row under the CTAs: "Beta · Telegram · TON" as three quiet hairline chips (no icons), matching the project's existing chip style.

**2. "What is TonRa" — editorial long-form block**
- Replace the centered narrow column with a 12-col grid: left rail shows a small sticky label ("About") in uppercase tracking, right column holds the paragraphs.
- First paragraph rendered as a larger drop-intro (`text-xl text-foreground/90`), remaining paragraphs in muted body. This matches the editorial feel of other UTAAB pages.

**3. "What is TonRa used for" — kill the 6-icon-card grid**
- Current 6 colored icon tiles read as AI-generated. Replace with a numbered feature list (01–06), two columns on desktop, single column on mobile. Each row:
  - Large faded numeral (`text-5xl font-extralight text-foreground/15`)
  - Title in Montserrat bold
  - One-line description in muted
  - Thin top hairline (`border-t border-white/10`) between rows
- No Lucide icons at all in this section. The numerals + typography carry the rhythm. Keeps it aesthetic and professional.

**4. "Why TonRa matters" — quote-style block**
- Replace the GlassCard with a centered editorial pull-quote: oversized opening quote glyph (typographic, not an icon), body text at `text-2xl md:text-3xl font-light leading-snug`, attribution line "— TonRa, UTAAB project" underneath in muted small caps.
- Thin top + bottom hairlines, no card chrome.

**5. CTA section — restrained**
- Smaller heading, single Telegram button (keep the `Send` icon since it's a real platform action, not decorative), centered, with a single faint blue radial behind it.
- Remove the secondary trailing `ExternalLink` next to the Send icon (double-icon noise).
- Note line below stays.

**6. Section dividers + background**
- Add subtle full-width hairline dividers (`border-t border-white/[0.06]`) between sections instead of relying purely on padding.
- Keep `BackgroundGrid`, but reduce per-section padding slightly (`py-20 md:py-28` → `py-16 md:py-24`) so the page reads tighter.

**7. Icon hygiene (the "AI smell" fix)**
- Remove all decorative Lucide icons from "What is TonRa used for" (6 removed).
- Remove the `ExternalLink` next to "Try the beta bot" in the hero CTA (keep `Send`, drop the trailing arrow — one icon per button max).
- Keep functional icons only: `ArrowLeft` (back), `Send` (Telegram CTA). That's it.

### Files touched
- `src/pages/projects/TonRaPage.tsx` — single-file refactor.
- No i18n changes, no new components, no asset changes, no dependency changes.

### Out of scope
- Translation copy stays as-is (en/tr/ru/ar).
- No changes to `Navbar`, `Footer`, `BackgroundGrid`, `GlassCard`, or any shared component.
- No backend / Supabase / edge function changes.
