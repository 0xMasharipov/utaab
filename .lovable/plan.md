# Polish UBpoint Icons — Editorial Refinement

Goal: Replace the generic "AI / vibecoded" lucide icons (Sparkles, Rocket, Flame, etc.) with a calmer, more professional set. Keep all layout, grids, gradients, colors, sizes, and animations exactly as they are. Only `lucide-react` import names and JSX icon component names change.

## Icon swap map (UBpointPage.tsx only)

| Location | Current | New | Rationale |
|---|---|---|---|
| Toast header badge (line 303) | `Sparkles` | `BadgeCheck` | Reads as verified transaction, not magic |
| Verify pill on phone (line 325, 436, 535, 938) | `ShieldCheck` | keep | Already professional |
| Hero kicker pill (line 400) | `Sparkles` | `CircleDot` | Quiet live-status dot, matches "Now live" |
| Toast row entries (line 675) | `Sparkles` | `ArrowDownLeft` / `ArrowUpRight` | Directional transaction marks |
| Features grid — Earn UBP (455) | `Coins` | `Wallet` | Cleaner finance metaphor |
| Features grid — Unlock Rewards (456) | `Gift` | `Tag` | Editorial commerce icon |
| Features grid — Student Identity (458) | `GraduationCap` | keep | Contextually correct |
| Features grid — Leaderboards (459) | `Trophy` | `Medal` | Less arcade, more credential |
| Features grid — Campus Engagement (460) | `Sparkles` | `Compass` | Direction / participation, not "AI" |
| Rewards heading (line 685) | `Flame` | `TrendingUp` | Already used elsewhere, more neutral |
| Quick actions row (line 654) | `Coins`, `Gift` | `Wallet`, `Tag` | Match features set |
| CTA list (line 854) — Try the app | `Rocket` | `Send` | Same paper-plane motion, no rocket cliché |
| CTA list (line 854) — Join Discord | `MessageCircle` | `MessageSquare` | Squared, more editorial |
| `+50 this week` (line 649) | `TrendingUp` | keep | Fine |

## Implementation

Single file edit: `src/pages/projects/UBpointPage.tsx`.

1. Update the `lucide-react` import block: remove `Sparkles, Trophy, Flame, Rocket, MessageCircle, Coins, Gift`; add `BadgeCheck, CircleDot, Medal, Compass, Wallet, Tag, Send, MessageSquare, ArrowDownLeft`.
2. Find/replace each icon component name at the lines above. Preserve every `className`, parent wrapper, color, and size.
3. Leave the back-layer floating coin **images** (btc/eth/ton/gold/etc.) untouched — those are product assets, not icons.
4. Leave splash intro, grids, gradients, glass cards, and the navbar visuals unchanged.

## Out of scope
- No color, spacing, typography, or layout changes.
- No new components, no copy changes.
- No other pages touched.
