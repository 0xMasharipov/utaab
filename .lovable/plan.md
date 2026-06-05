## Add "Verified On-Chain" section to UBpoint page

Insert a new standalone section in `src/pages/projects/UBpointPage.tsx` **right after the features grid**, surfacing the Base name and wallet with a short trust-focused description.

### Section content
- **Heading:** "Verified On-Chain"
- **Description:** "Stay safu. Always verify before you interact. UBpoint is officially registered on Base — these are our only verified identifiers. Do not trust any other address claiming to be UBpoint."
- **Base Name card:**
  - Label: "Base Name"
  - Value: `utaablockchain.base.eth` (copy + external link to Basescan)
- **Wallet card:**
  - Label: "Official Wallet"
  - Value: `0x4fF7…43A9` (copy + external link to Basescan)
- Small "Live on Base" badge at the top of the section.

### Styling
- White background section with rounded cards, subtle blue border, matching existing page tokens (no new colors).
- Two-column grid on desktop, stacked on mobile.
- Reuse existing icons (ShieldCheck for heading, Copy/ExternalLink for actions) already imported in the file.

### Cleanup
- Remove the duplicate Base name + wallet block currently in the hero (lines ~305–329) so the info lives in one place.
- Keep the "On-Chain Verification" feature card in the grid but trim its body to point users down to the new section (avoid repeating the full address).

### Technical notes
- Single-file change: `src/pages/projects/UBpointPage.tsx`.
- No new dependencies, no business logic changes, no backend work.
