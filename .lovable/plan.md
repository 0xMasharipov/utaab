

# Refine Privacy Popup — Premium Minimal Design

## Summary
Visual-only refinement of the Privacy & Data Protection popup. Neutralize colors, soften borders, improve typography hierarchy, and refine button styling to match the premium UTAAB design system. Zero functionality changes.

## Changes (`src/components/PrivacyPopup.tsx`)

### Container
- Replace `glass-strong` with inline styling: `bg-[rgba(8,12,20,0.92)]` + `backdrop-blur-2xl`
- Soften border from `border-white/20` to `border-white/[0.08]`
- Replace `shadow-2xl` with custom soft shadow `shadow-[0_8px_40px_rgba(0,0,0,0.4)]`
- Keep `rounded-2xl sm:rounded-3xl` and padding

### Backdrop
- Reduce from `bg-black/70` to `bg-black/60`
- Keep `backdrop-blur-md`

### Header
- Shield icon: change from `text-accent` to `text-white/40` for monochrome subtlety, reduce to `h-6 w-6`
- Title: bump to `text-2xl sm:text-[1.65rem]`, add `tracking-tight`
- Description: add `leading-[1.7]`, use `text-white/50` instead of `text-muted-foreground`
- Close button: reduce icon to `h-4 w-4`, smaller padding `p-1.5`, add `rounded-full`

### Dividers & Links
- Border dividers: reduce from `border-white/20` to `border-white/[0.06]`
- Link text: change from `text-accent` to `text-white/60 hover:text-white/90`, remove permanent underline (keep `hover:underline` only)
- Dot separators: use `text-white/20`

### Preference Categories
- Category cards: `bg-white/[0.03]` and `border-white/[0.06]` (softer than current `bg-white/5` and `border-white/10`)

### Buttons
- **Accept All (Primary)**: replace `btn-primary` with `bg-[hsl(217,80%,42%)] hover:bg-[hsl(217,80%,48%)] text-white rounded-xl transition-all hover:-translate-y-px`
- **Customize (Secondary)**: replace `glass` with `bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] rounded-xl transition-all`
- **Reject (Tertiary)**: keep `variant="ghost"`, add `text-white/40 hover:text-white/60 rounded-xl`
- Increase gap between buttons from `gap-3` to `gap-3.5`

### Footer
- Border: `border-white/[0.06]`
- Text: `text-white/30` instead of `text-muted-foreground`

### Animation
- Already has `scale: 0.95 → 1` and `opacity: 0 → 1` with 250ms ease — keep as-is (matches requirements)

## What does NOT change
- All text content, i18n keys, legal links
- Cookie consent logic, localStorage, version tracking
- Focus trap, keyboard handling, accessibility
- Animation timing and reduced-motion support
- Component props and callbacks

## Files Modified
- `src/components/PrivacyPopup.tsx` — styling classes only

