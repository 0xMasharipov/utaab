

# Seamless Full-Site Visual Flow Overhaul

## Problem
The site has hard color breaks between the white hero and dark sections below. Sections feel like isolated blocks rather than a continuous visual experience.

## Strategy
Replace the current animated blob background with a **full-page vertical gradient system** (white → blue → navy) plus soft radial atmospheric glows. Make all sections transparent so the underlying gradient shows through. Add fade masks between the hero and the gradient world.

## Files to Change

### 1. `src/components/AnimatedBlobBackground.tsx`
Replace animated blobs with a two-layer system:
- **Layer 1**: Full-height vertical gradient (`#ffffff` → `#f5f8fc` → `#ebf2f9` → `#dbe8f5` → `#bdd5ef` → `#7fb2e8` → `#2f80ed` → `#10263d` → `#081624`)
- **Layer 2**: Three soft radial blue glows positioned at strategic points (top-right, mid-left, lower-center) with slow 15s floating animation
- **Layer 3**: Subtle grain overlay (keep existing)

### 2. `src/components/Hero.tsx`
- Keep the white background and video overlay as-is (hero sits on top of the gradient)
- Add a **220px bottom fade div** that transitions from transparent → blue-tinted → dark, bridging into the gradient background below
- The fade uses: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(197,221,244,0.35) 35%, rgba(74,132,210,0.38) 62%, rgba(8,22,36,0.72) 100%)`

### 3. `src/components/Stats.tsx`
- Replace `.glass` card with a premium dark glass card: `rgba(9, 20, 34, 0.72)`, `backdrop-blur(16px)`, `border: 1px solid rgba(255,255,255,0.08)`
- Add glowing text-shadow to stat numbers: `0 0 18px rgba(126,179,234,0.35), 0 0 38px rgba(47,128,237,0.22)`
- Keep section background transparent (gradient shows through)

### 4. `src/index.css`
- Add `.hero-bottom-fade` utility class for the bottom overlay
- Add `.stat-glow` class for number glow effect
- Add `.section-glass-card` utility for the premium dark card style used across sections
- Update `.glass` class to use slightly blue-tinted backgrounds for visual cohesion

### 5. `src/components/Community.tsx`, `Learn.tsx`, `Events.tsx`, `Projects.tsx`, `Resources.tsx`, `Join.tsx`
- All sections: set `background: transparent` (inherited from page gradient)
- Glass cards already work well against the gradient — no major changes needed, just ensure they use the existing `.glass` class consistently
- These sections naturally darken as the user scrolls because the underlying gradient deepens

### 6. `src/components/Footer.tsx`
- Add a **top fade overlay** (120px) transitioning from transparent to `#081624`
- Set footer background to `#081624` with subtle blue radial glow
- Remove the hard `border-t` line, replace with the fade

### 7. `src/pages/Index.tsx`
- Remove `bg-background` from the wrapper div (let the gradient background show)
- The `AnimatedBlobBackground` component now provides the full visual foundation

## Visual Flow Result
```text
┌─────────────────────────┐
│  HERO (white bg + video)│
│  ───── bottom fade ─────│ ← 220px gradient mask
│                         │
│  STATS (transparent)    │ ← gradient is now light blue here
│                         │
│  COMMUNITY (transparent)│ ← gradient deepening
│                         │
│  LEARN (transparent)    │ ← mid blue
│                         │
│  EVENTS (transparent)   │ ← richer blue
│                         │
│  PROJECTS (transparent) │ ← deep blue
│                         │
│  RESOURCES (transparent)│ ← navy
│                         │
│  JOIN (transparent)     │ ← dark navy
│  ───── top fade ────────│
│  FOOTER (#081624)       │ ← darkest
└─────────────────────────┘
```

## Key Principles
- No section has its own opaque background — they all float on the gradient
- Hero is the only exception (white + video), bridged via bottom fade
- Footer is the darkest anchor, bridged via top fade
- Radial glows add depth without flashiness
- Existing glass cards work naturally against the gradient

