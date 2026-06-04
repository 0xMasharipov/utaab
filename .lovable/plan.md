## Goal

Replace the generic "blue-gradient rounded-square + lucide icon" pattern across the UBpoint page with custom **duotone SVG glyph tiles** — a more crafted, editorial visual language that ties into the UBpoint silver/blue identity.

## Visual language

Each glyph is a hand-tuned 2-layer SVG:
- **Back shape** — soft `fill-blue-200/70` silhouette, slightly offset
- **Front shape** — `fill-blue-700` (or `stroke-blue-700` 1.5) primary mark
- No gradient tile background. Instead: frosted square `bg-white/60 backdrop-blur` with a hairline `border-blue-200/70` and a soft inner glow `shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_24px_-12px_rgba(37,99,235,0.35)]`
- Rounded `rounded-2xl`, size 56×56 in feature cards, 48×48 in sponsor tasks
- Subtle hover: back-shape drifts 2px, no color change

Six custom glyphs to author (24×24 viewBox, inline SVGs in a new file):
1. `GlyphCoin` — front coin disc + back coin disc offset (Earn UBP)
2. `GlyphGift` — wrapped box + ribbon as back shape (Unlock Rewards)
3. `GlyphChain` — two interlocking chain links, back link lighter (On-Chain Verification)
4. `GlyphScroll` — diploma scroll + seal (Student Identity)
5. `GlyphLaurel` — laurel wreath + star center (Leaderboards)
6. `GlyphSpark` — 4-point sparkle + soft halo back (Campus Engagement)

Sponsor task glyphs (smaller, same duotone style):
- `GlyphX` — minimal X mark
- `GlyphChat` — speech bubble + back bubble
- `GlyphRocket` — rocket silhouette + flame back

## Small inline icons

Replace lucide usage in chips/lists with thinner, custom matching marks:
- Hero `Sparkles` badge → `GlyphSpark` (12px)
- `ShieldCheck` chips (hero + verified pill) → `GlyphChain` mini (no tile)
- `CheckCircle2` (sponsor benefit list) → custom 14px duotone check (light disc back + thin check front)
- `Building2` pill ("For Brands & Sponsors") → `GlyphScroll` mini

Footer/nav social icons (Linkedin, Send, Twitter, Mail) — **leave untouched** (universally recognizable brand marks; replacing harms clarity).

## Implementation

1. Create `src/pages/projects/ubpoint/glyphs.tsx` exporting the 9 custom glyph components + a `GlyphTile` wrapper component (frosted square with hover animation).
2. Edit `src/pages/projects/UBpointPage.tsx`:
   - Replace `features` array `icon` refs with new Glyph components.
   - Replace `FeatureGrid` icon tile (lines 390–392) with `<GlyphTile><f.icon /></GlyphTile>`.
   - Replace `sponsorTasks` icons + their tile (lines 656–658) with smaller `GlyphTile` variant.
   - Swap inline lucide uses noted above for custom mini-glyphs.
   - Remove now-unused lucide imports (`Coins, Gift, ShieldCheck, GraduationCap, Trophy, Sparkles, CheckCircle2, Building2, Rocket, MessageCircle, Twitter`) — keep `ArrowRight`, `ArrowUpRight`, `Menu`, `X`, `Linkedin`, `Send`, `Mail`, `Twitter` (footer).

## Out of scope

- Coin imagery / mockup / layout / typography / copy
- Navbar, Footer, routing
- Any page other than `/projects/ubpoint`
