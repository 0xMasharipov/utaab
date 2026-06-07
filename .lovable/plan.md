## Goal
Remove redundant status badges from the UBpoint hero and Verified On-Chain section, and reposition the section heading icon.

## Changes

### Hero section (`Hero` component)
1. **Remove the kicker pill** — Delete the entire inline-flex div (lines 473–476) that displays "UTAAB · Blockchain Engagement Platform" above the title.
2. **Remove the status badges below CTA buttons** — Delete the entire `mt-10 flex flex-wrap` div (lines 503–512) that shows the green-pulse "Live on Base" and "On-chain verified" items under the launch-app button.

### Verified On-Chain section (`VerifiedOnChain` component)
3. **Remove the eyebrow badge** — Delete the `inline-flex` div (lines 608–611) containing the green pulse dot and "Live on Base" eyebrow text.
4. **Change heading icon and move it to the end** — In the `<h2>` (lines 612–614):
   - Replace `<ShieldCheck ... />` with `<CheckCircle2 ... />`.
   - Move the icon after the title text so the order becomes: text → icon.
   - Keep the same styling classes (`w-8 h-8 md:w-10 md:h-10 text-blue-600`).

## Files
- `src/pages/projects/UBpointPage.tsx` — component markup only.
- No translation keys will be removed in this pass (cleanup can happen separately).
- No new dependencies.