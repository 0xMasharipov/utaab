## Plan: Coin assets on Economy section + Hero phone backdrop

### 1. "A growing on-chain economy" (Metrics section, ~line 860)
Replace the current 3 floating decorations with the full set of available coin/metal assets arranged around the metrics grid. Use all 10:
USDT, TRY, BTC, TON, ETH, UTAAB, GOLD coin, GOLD bar, SILVER bar, TITANIUM bar, STEAM, GAMEPAD.

Layout: distributed as `absolute`-positioned `motion.img` floats around the perimeter (top-left, top-right, mid-left, mid-right, bottom corners, etc.), each with staggered y/rotate animation, varying sizes (16–48 w), individual drop-shadow tints matching the asset color. On mobile, show a reduced subset (4–5 smaller, opacity-60) so it doesn't crowd.

### 2. Hero — phone backdrop coin cluster
Add a dedicated coin cluster behind the iPhone mockup in `FloatingDevice`. Currently it has UTAAB, TON, BTC only. Add the remaining requested coins as a **back layer** (lower z-index than the phone) so they appear *behind* the device:
- USDT (`ubp-usdt-angle`), TRY (`ubp-try-angle`), ETH, GOLD coin, SILVER bar, STEAM, GAMEPAD — positioned at varying offsets around/behind the phone with `-z-10` (or wrapped in a div placed before the phone img), reduced opacity (0.6–0.85), blur-sm on the furthest ones for depth, with subtle float animations.
- Keep existing UTAAB / TON / BTC as the **front layer** floating coins (unchanged).

Imports to add back: `gamepadAsset`, `silverBarAsset`, plus new: `usdtAngleAsset`, `tryAngleAsset`.

No copy/structural changes — visual asset additions only.