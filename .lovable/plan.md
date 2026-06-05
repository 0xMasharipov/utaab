Update all blockchain network references on the UBpoint landing page from Sepolia to Base, and add the project's Base identity details.

### Changes to `src/pages/projects/UBpointPage.tsx`

1. **Network label replacements** — Change every visible "Sepolia" mention to "Base":
   - Footer: "Built on Sepolia" → "Built on Base"
   - Hero status: "Live on Sepolia" → "Live on Base"
   - Floating badge: "Verified · Sepolia" → "Verified · Base"
   - Feature description: "Sepolia blockchain network" → "Base blockchain network"
   - Wallet showcase hint: "Sepolia-anchored token wallet" → "Base-anchored token wallet"
   - Mock wallet screen: "0xA1...e3f9 · Sepolia" → "0x4fF...43A9 · Base"
   - Mock leaderboard entry: "sepolia.kai" → "base.kai"
   - Mock event: "Sepolia Meetup" → "Base Meetup"
   - Sponsors section (2 occurrences): "recorded on Sepolia" → "recorded on Base"

2. **Add Base identity** — Display the ENS name and contract address in a visible location (e.g., hero status row or wallet showcase area):
   - `utaablockchain.base.eth`
   - `0x4fF797906D7B56F9Bd2Db382BcB36C97d69A43A9`

### Out of scope
- No changes to certificate admin pages, wagmi config, or other Sepolia-dependent infrastructure outside this page.
- No visual style or layout changes beyond the text updates above.