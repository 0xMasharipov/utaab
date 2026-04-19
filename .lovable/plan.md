

## Refine Privacy & Cookie Popup — Clear Glass, Aesthetic Alignment

### Goal
Remove the colored/dark fill so the popup reads as **pure transparent glass** (no blue/black tint), tighten alignment, and elevate the visual polish — without changing functionality, copy, or behavior.

### Current issues (from `src/components/PrivacyPopup.tsx`)
- Container uses **`bg-[rgba(8,12,20,0.92)]`** — that's a near-opaque dark navy fill. Looks like a colored block, not glass.
- Primary CTA uses a **solid blue** (`bg-[hsl(217,80%,42%)]`) which clashes with the "no color" request.
- Header alignment is slightly off — Shield icon, title and close button don't sit on the same optical baseline.
- Quick-link row, expandable preference cards, and footer note have inconsistent spacing rhythm.
- Backdrop blur is heavy (`backdrop-blur-md` + `bg-black/60`) making the modal feel weighty.

### Changes (all in `src/components/PrivacyPopup.tsx` only)

**1. Container — true frosted glass, no color**
- Replace `bg-[rgba(8,12,20,0.92)] backdrop-blur-2xl border-white/[0.08]` with:
  - `bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-150 border border-white/15`
  - Soft inner highlight: `shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]`
  - Keep `rounded-3xl`, slightly increase padding to `p-7 sm:p-9` for breathing room.

**2. Backdrop — lighter, cleaner**
- `bg-black/40 backdrop-blur-sm` (was `bg-black/60 backdrop-blur-md`) so the popup feels lifted, not buried.

**3. Header alignment**
- Switch outer wrapper to `flex items-center` and align icon vertically with the title (no `mt-0.5` nudge).
- Use a small icon chip: `w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center` containing the Shield (creates a balanced anchor point).
- Close button moves to top-right with consistent padding; same chip treatment (`w-9 h-9 rounded-full`).
- Title and description left-align flush under the chip, consistent line-height.

**4. Buttons — neutral glass, no blue fill**
- **Primary "Accept"**: glass instead of solid blue → `bg-white/10 hover:bg-white/15 border border-white/20 text-white` (still visually dominant via slight brightness + subtle inner highlight).
- **Customize / Reject**: keep glass-ghost but unify height (`h-12`), unify radius (`rounded-xl`), unify font weight.
- Add a faint top-border highlight (`shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`) on Accept for premium feel.

**5. Quick links row**
- Bump separator opacity down (`text-white/15`), align items center, even gap-4 for rhythm.
- Increase the bottom border breathing space (`mb-7 pb-7`).

**6. Preference cards (when expanded)**
- Lighter glass: `bg-white/[0.04] border-white/10 rounded-xl p-4`.
- Switch + text vertically centered (`items-center`).
- Consistent gap-4 instead of gap-3.

**7. Footer note**
- Center-aligned, `text-white/40`, slightly smaller margin-top, single subtle divider.

### What stays untouched
- All translation keys, props, callbacks (`onAccept`, `onCustomize`, save logic, focus trap, ESC handling, RTL).
- Animation timings, framer-motion logic, reduced-motion fallback.
- `PrivacyCenter`, `FloatingPrivacyButton`, consent-version logic.

### Risk
Very low — pure styling changes scoped to one file. No logic, i18n, or accessibility changes.

### Verification
Open `/` → wait 1s → popup appears as transparent frosted glass with no blue/dark tint, perfectly aligned header, neutral glass buttons. Expand "Customize" → preference cards match the same glass language. Test on mobile viewport for stacking.

