

# Move Language Selector & Menu Button to Right Edge on Mobile

## Problem
The navbar uses three equal `flex-1` columns. On mobile, the right group (language + menu) sits at the end of its flex-1 share (roughly the right third), not at the far right edge of the navbar.

## Solution
Remove the center spacer on mobile and adjust the left column so the right controls naturally align to the far right edge.

### Change in `src/components/Navbar.tsx`

**Line 175 — Center spacer**: Hide on mobile, show on larger screens:
```tsx
<div className="hidden sm:block flex-1" />
```

**Line 147 — Left logo column**: Remove `flex-1` on mobile so the logo only takes its natural width, pushing the right group to the edge:
```tsx
<div className="sm:flex-1 flex justify-start">
```

**Line 178 — Right controls**: Remove `flex-1` on mobile so it doesn't take extra space, just sits at the end:
```tsx
<div className={cn("sm:flex-1 flex justify-end items-center gap-3 sm:gap-4", isRTL && "flex-row-reverse")}>
```

This gives mobile a simple two-element layout (logo left, controls right) while preserving the three-column balanced layout on desktop.

