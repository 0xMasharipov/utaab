Reposition and resize the Steam and Gamepad floats (plus a few siblings) in both the Metrics section and the Hero phone backdrop.

### Metrics section (`A growing on-chain economy`, ~line 846-860)
- **Steam** — move from top-center to top-right corner so it stops crowding the headline. New cls: `hidden md:block right-8 top-8 w-24` (slightly bigger, w-20 → w-24).
- **Gamepad** — bigger and reposition to mid-left. New cls: `absolute left-2 md:left-1/4 bottom-2 md:bottom-10 w-20 md:w-32` (was w-12/w-20).
- **Titanium bar** — bump w-20 → w-24.
- **Silver bar** — bump w-20 → w-24.
- **USDT / TRY angles** — bump w-20 → w-24 each.

### Hero phone backdrop (`FloatingDevice`, lines 226-235)
- **Steam** — relocate from `top-24 right-2` to upper-left area, and grow: `top-4 -left-8 md:-left-16 w-16 md:w-24` (was w-12/w-16).
- **Gamepad** — significantly bigger and move to lower-right: `bottom-8 -right-10 md:-right-20 w-20 md:w-28` (was w-12/w-16, bottom-24 -left-...).
- **Silver bar** — bump w-12/w-16 → w-16/w-20 for visual balance.

No structural/copy changes; only `cls` (position + width) tweaks on those float entries.