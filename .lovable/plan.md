

## Refine UTAAB Edu — match main site aesthetic & icon system

### Goals
1. Bring the Edu pages into visual parity with the main site (AnimatedBlobBackground + BottomGradientOverlay, glass cards, dark navy gradient, accent-blue highlights — no purple, no raw green/yellow).
2. Replace mixed emoji icons (🟢🟡🔴, 📚, ★) with consistent `lucide-react` icons styled in the brand accent.
3. Tighten typography, spacing, and card hierarchy so cards feel like one cohesive system.

### Scope (pages affected)
- `src/pages/education/EducationHome.tsx` — hero, sections, category cards, featured course cards
- `src/pages/education/CourseCatalog.tsx` — header, filter card, course cards, empty state
- `src/components/education/ExternalCourseCard.tsx` — badges, level indicator, footer
- `src/components/education/CutiiAIPanel.tsx` — replace purple radial-gradient with navy/accent-blue identity

Out of scope: routing, auth, data, i18n keys, EducationNavbar (already on-brand).

### Visual changes

**Shared backdrop on every Edu page**
- Add `<AnimatedBlobBackground />` and `<BottomGradientOverlay />` (same as main site) inside a wrapper `<div className="min-h-screen bg-background text-foreground relative">`.
- Replace local `bg-gradient-to-b from-primary/5 to-transparent` hero overlays with the global blob system.

**EducationHome hero**
- Match main `Hero` rhythm: badge pill ("UTAAB EDU · Learn Web3"), large headline (`text-4xl sm:text-5xl md:text-6xl`), muted subtitle, glass search input with a `Search` icon button using `btn-primary`. Add a secondary "Browse Catalog" `outline` button next to the primary CTA — same rounded-full treatment as `LearnHub`.
- Wrap section in `section-container` for consistent padding.

**Section: Open Educational Resources**
- Replace ad-hoc layout with a centered header (`text-3xl md:text-4xl font-bold` + muted subtitle + small `BookMarked` accent icon above the title).
- "MIT Partnership" badge restyled to glass pill with `GraduationCap` icon, accent text.

**Section: Categories**
- Drop `bg-muted/30` background (it creates a horizontal color break — violates the seamless flow rule).
- Replace category emoji icons with a curated `lucide-react` icon resolved from the category slug:
  - `blockchain → Boxes`, `defi → Coins`, `nft → ImageIcon`, `web3 → Globe`, `smart-contracts → FileCode2`, `security → ShieldCheck`, `trading → TrendingUp`, fallback → `BookOpen`.
- Card style: `GlassCard` with `hover` prop, `w-12 h-12` icon tile (`bg-primary/15 border border-accent/20 text-accent`) above title — matches the `LearnHub` "Three paths" pattern exactly.

**Section: Featured courses**
- Replace yellow `★` text with `Star` from lucide (filled, `text-accent`).
- Replace category/level pill colors with the `LearnHub` style: small uppercase `text-xs tracking-wider text-muted-foreground` for level and an accent-tinted pill for category.
- Instructor avatar gets `border border-accent/20 bg-primary/15 text-accent` instead of plain `bg-primary/20`.
- Price: keep accent color but use `text-accent` (not `text-primary`) to match brand accent.

**ExternalCourseCard refinements**
- Remove emoji-based level (`🟢 Beginner` → `<Signal />` icon + label, color via `text-accent` regardless of level to keep palette neutral; hue differentiation via subtle border accent only).
- Replace `bg-blue-500/90` and `bg-green-500/90` raw badges with brand-consistent glass badges:
  - "MIT OCW" → `glass border-accent/30 text-accent` with `GraduationCap` icon.
  - "FREE" → `glass border-accent/30 text-accent` (no green).
- Footer keeps `Info` icon but switches to `text-muted-foreground` on `border-white/10` separator (no `bg-muted/20`).
- Hover scale tightened from `1.05` → `1.02` to match GlassCard's hover physics; image inner zoom kept.

**CourseCatalog**
- Wrap in same blob/gradient backdrop, drop raw `bg-background`.
- Header: add icon+title combo (`Compass` icon in accent tile + heading), keep search.
- Filter button: `Filter` icon (lucide) instead of `SlidersHorizontal` — consistency with main site's filter usage.
- Filters card → `GlassCard` (not raw `Card glass`) for visual consistency.
- Loading spinner restyled to use the blue→accent gradient ring used on main site, sized `w-10 h-10`.
- Empty state: add `SearchX` icon above the message, restyle as a centered `GlassCard` panel.

**CutiiAIPanel identity fix**
- Remove the purple radial-gradient layer (`rgba(147, 51, 234, ...)` violates "no purple" rule).
- New backdrop: `radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(99, 179, 237, 0.06) 0%, transparent 50%), rgba(8, 13, 26, 0.95)` — matches UTAABLoader navy + accent-blue palette.
- Floating button stays glass-strong but icon updated to use `text-accent` for the `Bot` glyph.
- Header `Bot` icon → `text-accent`. User message bubble keeps `bg-primary` (navy) — already on-brand.

### Icon system summary (lucide-react)
| Use | Old | New |
|---|---|---|
| Category fallback | `📚` emoji | `BookOpen` |
| Category per-slug | mixed emoji | `Boxes / Coins / ImageIcon / Globe / FileCode2 / ShieldCheck / TrendingUp / BookOpen` |
| Course rating | `★` text | `Star` (filled, accent) |
| Course level | `🟢🟡🔴` | `Signal` icon + label, accent tint |
| MIT partnership badge | text-only | `GraduationCap` |
| External link badge | `ExternalLink` (kept) | `ExternalLink` (kept, restyled) |
| Catalog filter | `SlidersHorizontal` | `Filter` |
| Catalog header | none | `Compass` in accent tile |
| Empty state | none | `SearchX` |
| Open resources header | none | `BookMarked` |

All icons sized `h-4 w-4` for badges, `h-5 w-5` for headers, `h-6 w-6` for the category tile, all colored `text-accent` or `text-muted-foreground` — no raw Tailwind color classes (`text-blue-500`, `text-green-500`, `text-yellow-500` removed).

### Files modified
1. `src/pages/education/EducationHome.tsx`
2. `src/pages/education/CourseCatalog.tsx`
3. `src/components/education/ExternalCourseCard.tsx`
4. `src/components/education/CutiiAIPanel.tsx`

No new files. No new dependencies (`lucide-react` and `GlassCard` already in use). No translation key additions (icons replace decorative emoji only).

### Risk: low
Pure visual refinement — same DOM structure, same data flow, same routes. All changes are class/style/icon swaps. Reversible at the component level.

