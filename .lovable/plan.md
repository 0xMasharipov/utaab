# Dropdown Menu Animation Upgrade

## Goal
Make every dropdown menu (language switcher, admin row actions, etc.) open with a smooth, noticeable animation on laptops, tablets, and mobile — instead of the current near-instant Radix default.

## Current State
- `src/components/ui/dropdown-menu.tsx` already uses Radix `data-[state=open]` / `data-[state=closed]` hooks with `tailwindcss-animate` utilities (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-top-2`).
- These animations work, but use the plugin defaults (~150ms, very subtle zoom from 95%) so they feel instant — especially on touch devices where users expect a clear reveal.
- All 9 usage sites (Navbar language switcher, EducationNavbar, AdminEvents, AdminUsers, AdminAnnouncements, AdminMessages, AdminCourses, AdminMedia) consume the same `DropdownMenuContent` / `DropdownMenuSubContent` primitives, so a single fix propagates everywhere.

## Approach
Enhance the shared primitives in `src/components/ui/dropdown-menu.tsx` so the animation is:
- More visible (larger scale + slight slide based on side)
- Properly eased (custom cubic-bezier for an "Apple-like" feel)
- Origin-aware (uses Radix `--radix-dropdown-menu-content-transform-origin` so it grows from the trigger)
- Tuned per breakpoint (slightly longer + larger slide on mobile/tablet for clarity)
- Respects `prefers-reduced-motion` (falls back to a plain fade)

## Changes

### 1. `src/index.css` — add reusable keyframes + utility class
Define a dedicated dropdown animation that doesn't conflict with the existing `tailwindcss-animate` utilities:

```css
@keyframes dropdown-open {
  0%   { opacity: 0; transform: scale(0.92) translateY(-6px); }
  100% { opacity: 1; transform: scale(1)    translateY(0); }
}
@keyframes dropdown-close {
  0%   { opacity: 1; transform: scale(1)    translateY(0); }
  100% { opacity: 0; transform: scale(0.96) translateY(-4px); }
}

.dropdown-animated {
  transform-origin: var(--radix-dropdown-menu-content-transform-origin,
                    var(--radix-popper-transform-origin, center));
  will-change: transform, opacity;
}
.dropdown-animated[data-state="open"]   { animation: dropdown-open  220ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.dropdown-animated[data-state="closed"] { animation: dropdown-close 160ms cubic-bezier(0.4, 0, 1, 1)      both; }

/* Tablet/mobile: slightly longer + a touch more travel for clarity */
@media (max-width: 1023px) {
  .dropdown-animated[data-state="open"]   { animation-duration: 260ms; }
}
@media (prefers-reduced-motion: reduce) {
  .dropdown-animated[data-state="open"],
  .dropdown-animated[data-state="closed"] {
    animation: none;
    transition: opacity 120ms ease-out;
  }
}
```

### 2. `src/components/ui/dropdown-menu.tsx` — apply the class
- Add `dropdown-animated` to the `className` of `DropdownMenuContent` and `DropdownMenuSubContent`.
- Remove the now-redundant `data-[state=...]:zoom-*` / `slide-*` utilities from those two components (keep `fade-*` as a graceful fallback for any future side variants). The new keyframes own the motion.

### 3. No changes needed at usage sites
Because every dropdown in the project goes through the shared primitives, Navbar, EducationNavbar, and all admin tables get the new animation automatically. No component-level edits required.

## Acceptance Criteria
- Opening any dropdown (language menu in Navbar, row "Actions" menus in admin pages) shows a clear ~220ms scale + fade originating from the trigger.
- On viewports < 1024px the animation runs ~260ms so it reads clearly on touch.
- Closing animates back out (~160ms) instead of disappearing instantly.
- Users with "Reduce Motion" enabled get a plain fade only.
- No layout shift, no regression in dropdown positioning, RTL still works.

## Files Touched
- `src/index.css` (add keyframes + utility)
- `src/components/ui/dropdown-menu.tsx` (apply class to Content + SubContent)