## Goal

Use the 5 uploaded coin renders meaningfully throughout `src/pages/projects/UBpointPage.tsx`. Each asset is matched to a section where its symbolism fits.

## Asset mapping

- **UTAAB_COIN.png** (silver coin with UTAAB 4-square mark) → the UBP token itself.
- **UBpoint_USDT_1.png / _2.png** (green Tether coin, front & angled) → "tokenized assets / partner perks" in rewards.
- **UBpoint_TRY_1.png / TRY.png** (gold Turkish Lira coin, angled & front) → "real-world value / Turkish student economy" in rewards & metrics.

## Steps

1. **Upload the 5 images as Lovable assets** under `src/assets/coins/` (so binaries stay off the repo):
   - `utaab-coin.png`
   - `ubp-usdt.png` (front view)
   - `ubp-usdt-angle.png` (3/4 view)
   - `ubp-try.png` (front view)
   - `ubp-try-angle.png` (3/4 view)

2. **Hero (`FloatingDevice`)** — Add a small UTAAB silver coin floating behind/beside the phone for extra brand presence (subtle, animated, decorative).

3. **Rewards mock screen (`MockScreen`, `kind === 'rewards'`)** — Replace the four generic blue square icons with real coin renders:
   - Steam Gift Card → keep existing UBpoint coin OR USDT-angle (small)
   - Silver Token → **UTAAB silver coin**
   - Partner Discount → **USDT front**
   - Gold Token → **TRY front (gold)**

4. **Metrics section** — Replace the two duplicate `coinAsset` floating decorations with a richer trio:
   - Left side: **UTAAB silver coin** (large, slow rotate)
   - Right side: **TRY gold coin angled** (medium)
   - Add a third small **USDT angled** coin floating top-right or bottom-left for balance.

5. **Sponsors section (optional polish)** — Add a faint decorative USDT/TRY coin in the background corner to reinforce the "real value" message.

No copy or structural changes — only visual asset placements.
