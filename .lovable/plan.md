## Plan

1. **Stop using WebGL on the certificate verifier hero**
   - Replace the `Certificate3D` Canvas-based preview with the existing non-3D certificate image fallback as the default render.
   - Keep a subtle CSS tilt/glow effect only, so the page does not depend on WebGL, GPU drivers, or React Three Fiber.

2. **Make the fallback visually correct and stable**
   - Ensure the certificate image renders in the correct portrait orientation and uses `object-contain` instead of a cropped/warped WebGL texture.
   - Keep fixed responsive dimensions so it does not overflow or shift during loading.

3. **Reduce crash surface on `/verify-certificate`**
   - Remove the lazy WebGL-heavy component usage from this page path.
   - Leave no Canvas mount, no WebGL detection, and no texture Suspense path on the public verifier page.

4. **Verify in preview**
   - Open `/verify-certificate` and confirm the loader completes, the page does not crash, and the certificate preview is visible as a static non-3D certificate.