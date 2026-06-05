## Plan: Add Steam coin & Titanium ingot to UBpoint page

Two new assets uploaded:
- `UBpoint_STEAM_1.png` — navy/silver Steam logo coin
- `UBpoint_INGOT_TITANIUM.png` — silver titanium 1000g bar

### Steps

1. Upload both images to `src/assets/coins/` via `lovable-assets` → create `steam.png.asset.json` and `titanium-bar.png.asset.json`.

2. Edit `src/pages/projects/UBpointPage.tsx`:
   - Add 2 new imports: `steamAsset`, `titaniumBarAsset`.
   - **Rewards mockup** — swap Steam Gift Card icon from `gamepadAsset` → `steamAsset` (proper brand match for the Steam reward).
   - **Metrics section** — replace the `silverBarAsset` (or add alongside) with `titaniumBarAsset` to introduce a new tier visual; keep the gold bar on the opposite side. Specifically: left = UTAAB silver coin, center-left small = `titaniumBarAsset` (new), right = gold bar.
   - Optionally keep `gamepadAsset` and `silverBarAsset` imports if still used elsewhere; otherwise remove unused imports.

No copy/text or structural changes — only asset swaps.

Confirm to proceed.