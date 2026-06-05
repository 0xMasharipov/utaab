## Goal

Integrate the 7 newly uploaded renders into `src/pages/projects/UBpointPage.tsx` in places where their symbolism fits, replacing some of the earlier coin placements where the new assets are stronger matches.

## New assets

- `UBpoint_Gamepad.png` — white console controller → gaming reward
- `UBpoint_TON_2.png` — blue TON coin (3/4 view) → ecosystem / hero brand match
- `UBpoint_ETH.png` — silver Ethereum coin → ecosystem
- `UBpoint_BTC_1.png` — gold Bitcoin coin → ecosystem
- `UBpoint_COIN_1.png` — gold $ coin → generic gold reward / cashback
- `UBpoint_INGOT_GOLD_1.png` — gold bar → Gold tier reward
- `UBpoint_INGOT_SILVER_2.png` — silver bar → Silver tier reward

## Steps

1. **Upload all 7 to `src/assets/coins/`** as `.asset.json` pointers via `lovable-assets`. Use short names: `gamepad.png`, `ton.png`, `eth.png`, `btc.png`, `gold-coin.png`, `gold-bar.png`, `silver-bar.png`.

2. **Hero (`FloatingDevice`, ~line 212)** — swap the current TRY-angle decorative float for the new **TON coin** (blue matches the UBpoint palette better). Keep UTAAB silver coin float as is. Add a small BTC coin floating opposite.

3. **Rewards mockup (`MockScreen`, `kind === 'rewards'`, ~line 522)** — re-map the 4 reward items to the strongest visual matches:
   - Steam Gift Card → **Gamepad**
   - Silver Token → **Silver ingot** (replaces utaab coin here)
   - Partner Discount → **Gold $ coin** (replaces USDT)
   - Gold Token → **Gold ingot** (replaces TRY coin)

4. **Add a small "Ecosystem" strip** below the features section (or inside sponsors backdrop) — a row of 4 floating crypto coins (TON, BTC, ETH, UTAAB) as decorative ecosystem signal, with subtle float/rotate animations. No new copy; pure visual.

5. **Metrics section** — keep UTAAB silver coin (left) + add **gold bar** (right, replaces TRY-angle) for a stronger "real-world value" cue. Drop the third USDT decoration.

6. **Sponsors section** — add a faint **gold $ coin** in a bottom corner as decorative polish.

No text/copy or structural changes — visual asset swaps and additions only.
