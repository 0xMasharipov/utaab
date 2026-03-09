

# Refine Navbar Dropdown to Premium Frosted Glass Panel

## Problem
The current dropdown uses a heavy dark blue opaque background (`rgba(8, 16, 36, 0.82)`) that feels like a solid block. It needs to become a light, transparent, frosted glass panel with better spacing, typography hierarchy, and premium hover states.

## Changes — `src/components/Navbar.tsx`

### 1. Dropdown background & visual style
Replace the current dark opaque panel with a premium glassmorphism panel:
- Background: `rgba(255, 255, 255, 0.08)` — light transparent, not dark blue
- Backdrop filter: `blur(20px) saturate(140%)`
- Border: `1px solid rgba(255, 255, 255, 0.16)`
- Shadow: `0 20px 60px rgba(15, 23, 42, 0.18)` — soft, not heavy
- Border radius: `28px`
- Remove the inset highlight shadow

### 2. Dropdown positioning
- Tighten the gap: change `top-[70px]` to `top-[60px] sm:top-[68px]` so it sits snugly under the navbar
- On desktop, constrain width to `max-w-md` (right-aligned) instead of spanning full `max-w-6xl`
- Align to right side of navbar container instead of center: remove `left-1/2 -translate-x-1/2`, use `right-[2%] sm:right-[2.5%]`
- On mobile, keep full-width centered behavior

### 3. Nav link styling
- Left-align links instead of centering
- Font: `text-base font-semibold` with `tracking-wide`
- Text color: `rgba(255,255,255,0.90)` primary
- Each link gets a rounded hover pill: `hover:bg-white/[0.08]` with `rounded-[14px]` and `px-5 py-3`
- Stagger animation stays but with cleaner timing
- Add subtle text brightening on hover: `hover:text-white`

### 4. Divider refinement
- Change from centered 48px line to full-width subtle separator: `w-full h-px bg-white/[0.10]`

### 5. CTA section
- Education button: keep blue gradient but make it pill-shaped (`rounded-full`), slightly translucent
- Join button: glass-style outline button (`border border-white/20 bg-white/[0.06]`), pill-shaped
- Both buttons side-by-side on all sizes

### 6. Auth row
- Student Sign In: thin bordered pill, transparent bg, centered with icon
- Admin Sign In: subtle text link below, smaller and lighter

### 7. Language row
- Keep compact pill buttons but reduce visual weight
- Active state: `bg-white/[0.12]`
- Inactive: `text-white/50 hover:bg-white/[0.06]`

### 8. Animation
- Duration: `0.25s` ease-out
- Initial: `opacity: 0, y: -8`
- No scale effect

### 9. Responsive behavior
- Desktop: right-aligned panel, `max-w-md`, compact
- Mobile (`< sm`): full-width centered, `w-[96%]`, same glass style

## Files to modify

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Restyle dropdown panel: glass bg, positioning, link layout, CTA refinement, hover states |

