

# Refine Hero Buttons — Aesthetic Upgrade

## Problem
The "Join Us" and "Explore Ecosystem" buttons look flat and lack visual polish. The current styling uses basic glassmorphism with minimal differentiation and no refined typographic treatment.

## Changes

### File: `src/index.css` (lines 323-352)
Upgrade both button styles:

**Primary button ("Join Us")**:
- Use a richer gradient background instead of flat rgba blue
- Add subtle inner glow/highlight on top edge
- Refine border to a soft luminous blue
- Add smooth transition on all properties
- Slightly smaller padding for better proportion (14px 28px)

**Outline button ("Explore Ecosystem")**:
- Use a soft frosted glass with slightly more visible border
- Add a subtle gradient border effect via border-image or layered background
- Text color: lighter white instead of secondary hue
- Match padding to primary button

### File: `src/components/Hero.tsx` (lines 181-195)
- Add `text-sm md:text-base tracking-wide` for better typography
- Add `group` class to outline button so the ArrowRight hover animation works
- Ensure consistent sizing between both buttons

### Updated CSS:
```css
.hero-btn-primary {
  background: linear-gradient(135deg, rgba(47,128,237,0.7) 0%, rgba(11,60,109,0.85) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(127,179,255,0.35);
  padding: 14px 32px;
  font-weight: 600;
  box-shadow: 0 4px 24px rgba(47,111,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  letter-spacing: 0.02em;
}
.hero-btn-primary:hover {
  background: linear-gradient(135deg, rgba(47,128,237,0.85) 0%, rgba(11,60,109,0.95) 100%);
  border-color: rgba(127,179,255,0.55);
  box-shadow: 0 8px 40px rgba(47,128,237,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
}

.hero-btn-outline {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(230,238,248,0.9);
  padding: 14px 32px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.hero-btn-outline:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(127,179,255,0.35);
  box-shadow: 0 4px 20px rgba(47,111,181,0.15);
  color: #fff;
}
```

### Updated Hero buttons (JSX):
- Add `tracking-wide text-[15px]` to both buttons
- Add `group` to outline button for arrow animation
- Reduce ArrowRight to 16px for better proportion

