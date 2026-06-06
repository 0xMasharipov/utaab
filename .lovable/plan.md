Wire the official UBpoint app URL (`https://ubpoint.app/`) into the UBpoint page so users can launch the live app.

### Changes (all in `src/pages/projects/UBpointPage.tsx`)

1. **Add a constant** near the other URL constants (e.g. `WHATSAPP_URL`):
   ```ts
   const UBPOINT_APP_URL = 'https://ubpoint.app/';
   ```

2. **Navbar CTA** — currently the desktop nav shows a WhatsApp button (line 74). Add a primary "Open App" button alongside it (or replace the WhatsApp inline CTA) linking to `UBPOINT_APP_URL` with `target="_blank" rel="noopener noreferrer"`. Same change in mobile menu (~line 101).

3. **Hero primary CTA** — change the first hero button (line 354) from `<a href="#features">Explore UBpoint</a>` to `<a href={UBPOINT_APP_URL} target="_blank" rel="noopener noreferrer">Launch App</a>`. Keep "View Rewards" as the secondary.

4. **Final CTA section** (line 1010) — change the "Join UTAAB" CTA target from `WHATSAPP_URL` to `UBPOINT_APP_URL`, relabel to "Launch UBpoint App". Keep WhatsApp link available elsewhere (footer already has it).

No other structural or copy changes.