## Problem

In `src/pages/projects/UBpointPage.tsx` (`FloatingDevice`), the two glass chips ("Earned · UBP 50" and "On-chain · Verified on Base") animate their **inner** flex row vertically (`y: [0, -8, 0]` and `y: [0, 10, 0]`). Because the chips only have `py-2` (~8px) of vertical padding, the text/icon visibly drift past the rounded white box during the loop — looking like the label "escapes" the pill.

## Fix

Move the floating loop from the inner content onto the chip wrapper so the entire pill drifts as one unit, keeping the text perfectly centered in the box.

### Files
- `src/pages/projects/UBpointPage.tsx` — lines ~342–382

### Changes
For both chips:
1. Merge the inner `motion.div` (with the `y` loop) into the outer chip wrapper — remove the nested wrapper, keep only one `motion.div` per chip.
2. Apply the looping `y` animation alongside the entrance animation on that single wrapper using variants/`animate` objects, e.g.:
   - entrance: `opacity`, `scale`, `filter` (unchanged)
   - idle loop (after `ready`): `y: [0, -8, 0]` (top chip) / `y: [0, 10, 0]` (bottom chip), `duration: 5/6`, `repeat: Infinity`, `ease: 'easeInOut'`
3. Preserve current positioning classes (`absolute left-0 sm:-left-4 …`, `right-0 sm:-right-2 …`), padding, border, shadow, and icon markup. No copy, color, font, or layout changes elsewhere.

### Out of scope
- No changes to other sections, splash timing, i18n strings, or device mockup coins.
- No new dependencies.

### Acceptance
- On desktop, tablet, and mobile, the "Earned UBP 50" and "Verified on Base" chips bob gently up/down without the text ever clipping past the rounded white box edge.
- Entrance animation (blur/scale/opacity) still plays once on load.
