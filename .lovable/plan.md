

# Refine Mega Menu to Match Premium Web3 Spec

## Current State
The panel is already centered under the navbar with glass styling, 3-column grid, and bottom CTA row. The architecture is correct — refinements needed are primarily **spacing, typography sizing, and animation tuning** to match the detailed spec.

## Changes — `src/components/Navbar.tsx`

### 1. Panel Padding
- Current: `p-6 sm:p-8 md:p-10 lg:p-12` (24-48px)
- Target: `p-8 sm:p-10 md:py-[60px] md:px-[80px]` to match spec's 60px/80px on desktop

### 2. Column Gap
- Current: `gap-6 sm:gap-10 lg:gap-16` (24-64px)
- Target: `gap-6 sm:gap-12 lg:gap-20` (~80px on desktop)

### 3. Section Labels Typography
- Current: `text-[11px] tracking-[0.2em]`
- Target: `text-xs tracking-[2px]` (12px, 2px letter-spacing per spec)

### 4. Nav Link Typography
- Current: `text-lg font-semibold` with `py-2.5`
- Target: `text-lg font-semibold` stays, add `mb-1` for ~14px row spacing between items

### 5. Hover Effect
- Current: `hover:bg-white/[0.08] px-4 py-2.5 rounded-xl`
- Target: Keep as-is — already matches spec (`rgba(255,255,255,0.08)`, `border-radius: 12px`, `transition: 0.2s`)

### 6. Animation
- Current: `y: -8`, `duration: 0.25`
- Target: `y: -10`, `duration: 0.22` (220ms per spec)

### 7. Bottom CTA Buttons
- Current: `rounded-full min-h-[40px] px-6`
- Target: `rounded-[18px] py-2.5 px-5` to match spec's 18px radius, 10px/20px padding

### 8. Panel Max Width
- Current: `max-w-6xl` (1152px) — within spec's 1100-1300px range. Keep as-is.

All changes are in a single file: `src/components/Navbar.tsx`, lines 229-392.

