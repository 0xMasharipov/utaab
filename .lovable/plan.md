## Update TonRa logo on the TonRa product page

Replace the hero illustration on `/projects/tonra` with the newly uploaded TonRa brand mark and wrap it in a soft white radial glow so the blue logo pops against the dark background.

### Steps

1. **Add the logo asset**
   - Copy `user-uploads://TonRa_v1.png` into `src/assets/projects/tonra-logo.png` (kept in `src/assets` for proper bundling/optimization).

2. **Update `src/pages/projects/TonRaPage.tsx`**
   - Import the new logo as an ES6 module: `import tonraLogo from '@/assets/projects/tonra-logo.png'`.
   - In the hero's right-side image block, replace the current `AnimatedImage` (which points to `/images/projects/UTAAB_TonRa.webp`) with the new logo source.
   - Wrap the image in a relative container that renders a soft white radial glow behind it:
     - An absolutely-positioned `div` with `radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 35%, transparent 70%)`, blurred (`blur-3xl`), slightly larger than the logo, behind the image (`z-0`), with `pointer-events-none`.
     - The logo sits on top (`relative z-10`) keeping its existing blue brand drop-shadow for depth, plus a subtle white drop-shadow for the rim glow: `drop-shadow-[0_0_24px_rgba(255,255,255,0.25)]`.
   - Keep the existing motion/scale animation and responsive sizing (`max-w-md`, centered on mobile, right-aligned on `lg`).

3. **Leave unchanged**
   - Project card thumbnail in `src/components/Projects.tsx` (still uses `UTAAB_TonRa.webp`) — request only mentioned the description page.
   - Routing, translations, and CTA buttons remain as-is.

### Technical details

- White glow layered behind the logo, not on the section background, so the rest of the page styling is untouched.
- Glow uses both a blurred radial-gradient halo (soft ambient bloom) and a subtle white `drop-shadow` filter (tight rim light) for a polished, premium look consistent with the site's existing blue glow language.
- Asset placed under `src/assets/projects/` to match how other React-imported brand images are handled.

### Files touched

- `src/assets/projects/tonra-logo.png` (new, copied from upload)
- `src/pages/projects/TonRaPage.tsx` (hero image swap + white glow wrapper)
