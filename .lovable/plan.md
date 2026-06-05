Refine the "Inside the app" Showcase section: upgrade phone mockups to iPhone 16-style, remove the wrapping card "boxes", and use the UBpoint logo inside each mock screen header.

### 1. `PhoneFrame` → iPhone 16 style (line ~540)
- Thinner bezels: outer padding `p-2` → `p-[3px]`, inner radius `rounded-[32px]` → `rounded-[44px]`, outer radius `rounded-[40px]` → `rounded-[48px]`.
- Titanium-like frame: replace `bg-slate-900` with a subtle metallic gradient (`bg-gradient-to-b from-slate-800 via-slate-900 to-black`) plus an inner ring (`ring-1 ring-white/10`).
- Replace the rectangular notch with a true **Dynamic Island**: small pill `w-[60px] h-[18px] rounded-full bg-black` centered at `top-2`, sitting above the screen content with `z-20`.
- Add a soft outer drop shadow + reflection highlight (thin top gradient strip inside the frame).
- Side buttons (optional polish): two tiny `before:`/`after:` slivers on the left/right edges via small absolute spans (action button, volume, power) — kept subtle.

### 2. Remove the card "boxes" around each phone (Showcase map, lines 699-708)
- Delete the wrapping `<div class="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-blue-100 shadow-...">` and its `-z-10 blur` sibling.
- Render just the `PhoneFrame` directly, with the title/hint underneath, centered. Add a soft floor-glow under each phone using a radial-gradient pseudo background (e.g. `after:` div with `bg-blue-400/30 blur-3xl` positioned beneath).
- Slightly widen card slot `w-[300px]/w-[340px]` → keep, but remove backdrop/border.

### 3. UBpoint logo in the mock screen header (lines 550-557)
- Replace the placeholder `<div class="w-5 h-5 rounded bg-blue-600" />` with `<img src={logoAsset.url} alt="UBpoint" class="h-4 w-auto" />`.
- Keep the "UBpoint." wordmark beside it, or drop the wordmark if the logo already contains it (keep the wordmark for now — clearer at small size). Import `logoAsset` is already present at top of file.

### 4. General polish
- `Showcase` section: keep horizontal scroll, but tighten gap `gap-8` → `gap-12` so phones breathe.
- Add a subtle `hover:-translate-y-1 transition-transform duration-500` on each phone wrapper.
- The "real" kind currently renders the raw mockup image edge-to-edge inside the frame — keep, it now sits in a cleaner iPhone 16 body.

No copy/structural changes outside the Showcase section and `PhoneFrame`/`MockScreen` header.