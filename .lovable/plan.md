

# Refine Hero Section Spacing and Button Aesthetics

## Problems
1. Excessive vertical gaps between title ("Build your blockchain future"), subtitle ("Join our community"), description, and CTA button — margins stack to ~120px+ total whitespace
2. The "Get Started" button uses a basic `btn-primary` pill style with no visual flair

## Changes

### File: `src/components/Hero.tsx`

**Tighten spacing between elements:**

| Element | Current margin | New margin |
|---------|---------------|------------|
| H1 (title) | `mb-4 sm:mb-6` | `mb-2 sm:mb-3` |
| Subtitle div | `mb-6 sm:mb-8` | `mb-4 sm:mb-5` |
| Description p | `mb-8 sm:mb-12` | `mb-6 sm:mb-8` |
| Content wrapper | `py-24 sm:py-28 md:py-32` | `py-20 sm:py-24 md:py-28` |

This reduces total internal spacing by ~40%, keeping the hero compact and cohesive.

**Modernize the CTA button:**
- Replace `btn-primary` with a custom styled button using:
  - Gradient background: `bg-gradient-to-r from-primary via-blue-500 to-accent`
  - Larger rounded corners: `rounded-full`
  - Subtle glow ring on hover: `shadow-[0_0_30px_hsl(213_94%_68%/0.4)]`
  - Slight scale-up on hover: `hover:scale-105`
  - Smooth border: `border border-white/20`
  - Increased padding for a bolder feel: `px-8 sm:px-10 py-4 sm:py-5`
  - Text size bump: `text-base sm:text-lg font-semibold`
  - Keep the animated chevron arrow

### File: `src/index.css` (optional, minor)
No changes needed — the button will use inline Tailwind classes rather than a new CSS component.

## Technical Details

The key change in `Hero.tsx` content section:

```
mb-4 sm:mb-6  -->  mb-2 sm:mb-3   (title to subtitle gap)
mb-6 sm:mb-8  -->  mb-4 sm:mb-5   (subtitle to description gap)  
mb-8 sm:mb-12 -->  mb-6 sm:mb-8   (description to button gap)
py-24 sm:py-28 md:py-32  -->  py-20 sm:py-24 md:py-28  (overall section padding)
```

Button classes change from:
```
btn-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group min-h-[44px]
```
To:
```
bg-gradient-to-r from-primary via-blue-500 to-accent text-white font-semibold
text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full
border border-white/20 
hover:scale-105 hover:shadow-[0_0_35px_hsl(213_94%_68%/0.45)]
transition-all duration-300 group min-h-[44px]
```

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Reduce margins between hero text elements; restyle CTA button with gradient + glow |

