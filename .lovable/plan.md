## Goal
Replace remaining static `<img>` tags on the UBpoint page and the Certificate 3D display with a fade-in-on-load behavior so newly added images don't pop in abruptly.

## Scope
Frontend / presentation only. No business logic, no asset changes.

### 1. UBpoint page (`src/pages/projects/UBpointPage.tsx`)
The file already defines a local `FadeImg` component (line ~98) that wraps `<img>` and fades it in once `onLoad` fires. Several images still use raw `<img>` and load statically.

Convert these raw `<img>` usages to `FadeImg` (keeping all existing props/classNames/sizes intact):
- L349 mockup image (`mockupAsset.url`)
- L413 `utaabCoinAsset`
- L428 `tonCoinAsset`
- L443 `btcCoinAsset`
- L469 logo image
- L938 `goldCoinAsset`
- L1090 generic `src` image in inner component
- L1142 carousel `c.src`
- L1246 footer-area logo
- L1540 final logo

(Lines already using `FadeImg` at 141, 200, 681, 765 are left untouched.)

### 2. Certificate 3D (`src/components/cert/Certificate3D.tsx`)
Add a lightweight fade-in to the certificate template `<img>` (L67): start at `opacity-0`, transition to `opacity-100` on `onLoad`. This matches the UBpoint fade style without introducing a new dependency.

## Technical notes
- Use the existing `FadeImg` component in UBpoint — no new component file.
- For Certificate3D, inline the same pattern (local `useState` for `loaded`, `transition-opacity duration-500`) to avoid coupling cert components to UBpoint internals.
- No changes to `AnimatedImage` component or other pages.

## Out of scope
- Admin upload preview, blog gallery, team cards (not mentioned).
- Any PDF/contract/voucher logic.
- New animations beyond opacity fade (no scale/blur) to stay consistent with the page's existing `FadeImg`.