# UBpoint page — full editorial-fintech redesign

Refines the entire `src/pages/projects/UBpointPage.tsx` (~1170 lines) into a polished, Stripe/Linear-style surface: restrained color, hairline borders, generous whitespace, sharper typography hierarchy. Swaps every `lucide-react` icon for the matching `iconoir-react` thin-stroke (1.5px) glyph so the page reads as bespoke editorial product, not generic AI-template.

## What changes

### 1. Icon system (full swap)
Drop the entire `lucide-react` import. Use `iconoir-react` 1.5px-stroke set already used elsewhere in the project (Hero, ContributorCTA). Mapping:

| lucide → | iconoir |
|---|---|
| ArrowRight | NavArrowRight |
| ArrowUpRight | ArrowUpRight |
| Gift | Gift |
| ShieldCheck | ShieldCheck (or VerifiedBadge) |
| Trophy | Trophy |
| GraduationCap | GraduationCap |
| Sparkles | Sparks |
| Coins | Coins |
| CheckCircle2 | CheckCircle |
| Twitter | XmarkSquare → use custom X glyph (or `TwitterX` if available) |
| MessageCircle | ChatBubbleQuestion → `ChatBubble` |
| Rocket | SendDiagonal |
| Building2 | Building |
| Flame | Fire |
| TrendingUp | GraphUp |
| Menu | Menu |
| X | Xmark |
| Linkedin | Linkedin |
| Send | Send (Telegram paper-plane) |
| Mail | Mail |
| Copy | Copy |
| ExternalLink | OpenNewWindow |

All icons rendered with `strokeWidth={1.5}` and explicit `width/height` to avoid the chunky default look. Decorative icons inside circle badges keep `text-white`/`text-blue-600` token, but circles get hairline borders + soft inner shadow instead of saturated gradients.

### 2. Visual language reset
Across the page, replace the current "blue gradient blob + heavy shadow + glassy white card" pattern with a Stripe/Linear vocabulary:

- **Surfaces:** `bg-white` with `border border-slate-200/70`; remove `backdrop-blur-xl` on stationary cards.
- **Shadows:** swap `shadow-[0_20px_50px_-20px_rgba(37,99,235,...)]` for restrained `shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]`.
- **Borders:** hairline `border-slate-200` for neutral; `border-blue-100` only on accent chips.
- **Type:** keep Montserrat (project mandate). Headings drop from `font-extrabold` to `font-bold` with tighter `tracking-[-0.02em]`; supporting text uses `text-slate-500` (not 600) for editorial calm.
- **Color:** pull back gradient text; keep blue as accent only (chips, links, single CTA). Replace `bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text` headline highlight with solid `text-blue-600`. Keep one signature gradient: the primary CTA button.
- **Dividers:** add hairline `border-t border-slate-100` between sections instead of color-band hand-offs.
- **Eyebrows:** small uppercase `text-[11px] tracking-[0.18em] text-slate-500 font-semibold` labels replace pill chips on section heads.

### 3. Section-by-section restructure

**LightNavbar**
- Remove gradient button. Single primary "Open app" as solid `bg-slate-900 text-white` pill (Stripe-style) with `NavArrowRight` on hover.
- Add hairline bottom border only when scrolled (use `useScroll`).
- Mobile menu: full-width sheet with hairline rows.

**Hero**
- Two-column kept. Left column tightened: eyebrow ("UTAAB · Blockchain Engagement") above logo, headline `text-5xl md:text-7xl font-bold tracking-[-0.03em]`, single-line description, simpler trust row (status dot + on-chain + Base logo text only).
- Remove animated particle field and the three large blur orbs from `HeroBackground`. Replace with: faint dot-grid (`radial-gradient`) + one soft blue glow behind the device, plus a subtle top→bottom white→slate-50 wash. Keeps splash intro intact (no logic change to `SplashContext`).
- Toast/verify chips: redesign as flat white cards with hairline borders, icon in 28px soft-blue square (no gradient).

**FeatureGrid → Feature index**
- Replace the 3-column glass card grid with an editorial 2-column **numbered list** (Linear-style): `01 — Earn UBP`, `02 — Unlock Rewards`, etc. Each row: number in serif/mono, title bold, one-line description, icon at far right in 36px outlined circle. Hairline dividers between rows. No card chrome.

**VerifiedOnChain**
- Keep two cards but reskin: white surface, hairline border, monospace value displayed inside a `bg-slate-50` inset block with copy button inline (Stripe API-doc style). Add a third small card: "Network · Base" with logo mark. Section title goes from icon-prefixed h2 → eyebrow "Trust" + clean h2 (no icon next to text).

**Showcase (Inside the app)**
- Keep horizontal scroll. Refine `PhoneFrame`: thinner bezel, monochrome `bg-slate-950` body, softer floor shadow (single 8% black blur, not blue). Caption layout: title + thin underline + hint, left-aligned for editorial cadence.
- `MockScreen` chrome: keep functionality, but harmonize all internal chips to neutral slate palette + single blue accent.

**Sponsors**
- Left column unchanged structurally. Replace gradient CTA inside `Become a Sponsor` with same solid `bg-slate-900` button + `NavArrowRight`.
- Right column "Live sponsored tasks": flatten cards (white + hairline), icon badge becomes 40px soft-blue square not gradient, reward number uses tabular numerals and small "UBP" label below.
- Remove the floating decorative gold coin on this section (too vibecoded).

**Metrics**
- Reduce decorative coin field from 12 floating images → 3 static, low-opacity coins anchored to corners (no infinite motion). Cards: flat white, hairline border, number in solid `text-slate-900` (drop blue gradient text). Add small `text-slate-500` caption row.

**FinalCTA**
- Swap saturated blue gradient background for `bg-slate-950` editorial dark band with single blue accent stripe at the top. Headline white, supporting text `text-slate-400`. Button: solid white pill with `text-slate-900`. Removes the "fun gradient" feel.

**LightFooter**
- Already restrained. Minor: hairline `border-slate-200` (not blue-100), social buttons become 36px square hairline tiles (matches Stripe footer). Add small "Built on Base" badge with Base logo dot.

### 4. Motion polish
- Cut `HeroBackground` particle loop (perf + visual noise).
- Reduce Metrics floating-coin set (12 → 3 static).
- Keep splash intro logic intact (no changes to `SplashContext`, `splashTransition`, `FloatingDevice` mount animations) — only restyle the splash overlay copy to "UBpoint" wordmark + thin progress dot row.
- Section reveals: keep `whileInView` fade-up but shorten duration `0.6 → 0.45` and remove the per-card `delay: i * 0.06` cascade on the feature list (single reveal feels more editorial).

## Out of scope
- No copy/translation changes beyond the eyebrow labels and section titles noted.
- No backend, no routing, no asset replacement (coins/mockup PNGs stay).
- No edits to other pages or shared components.
- Splash sequence behavior unchanged.

## Files touched
- `src/pages/projects/UBpointPage.tsx` (single file, full rewrite of presentational JSX + icon imports)
