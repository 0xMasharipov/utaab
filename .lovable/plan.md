

# Replace Hero Section with Web3 Video Background Layout

## Overview
Replace the current 3D Three.js hero with a two-column layout featuring the uploaded metallic cube video as background, a left-to-right white gradient overlay for text readability, and hardcoded English text (not i18n keys) matching the spec exactly.

## Files to Change

### 1. Copy video asset
- Copy `user-uploads://hf_20260304_042253_561d7c06-70f9-414f-a887-2d38c562a010.mp4` → `public/videos/hero-cube.mp4`

### 2. Rewrite `src/components/Hero.tsx`
Remove the 3D scene, letter-by-letter animation, and dark theme. Replace with:

**Structure:**
```
<section id="hero" relative, overflow-hidden, white background>
  <video autoPlay muted loop playsInline, absolute cover, z-0>
  <div gradient overlay (white L→R fade), absolute, z-1>
  <div container max-w-[1400px] mx-auto, pt-[120px] pb-[120px], z-10>
    <div grid grid-cols-1 lg:grid-cols-2>
      <div left column — text content>
        pill tags: "Academic Infrastructure", "Blockchain", "Research Innovation"
        h1: "Academic Blockchain Infrastructure for the Next Generation"
          — "Next Generation" in gradient text
        p: description text
        buttons: "Join Us" (gradient) + "Explore Ecosystem" (outline)
      </div>
      <div right column — empty spacer (video shows through)>
    </div>
  </div>
</section>
```

**Key specs:**
- Video: `public/videos/hero-cube.mp4`, absolute positioned, object-cover
- Overlay: `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.45) 65%, rgba(255,255,255,0) 100%)`
- Font: Montserrat (already global), headline weight 800 (64px desktop / 36px mobile), paragraph weight 400 (18px)
- Colors: `#0B3C6D` primary, `#1A1A1A` text, `#6F6F6F` secondary text
- "Next Generation" gradient: `linear-gradient(90deg, #4A90E2, #6C63FF)` with `bg-clip-text text-transparent`
- "Join Us" button: gradient bg `#4A90E2→#6C63FF`, white text, rounded-full, hover scale+glow, scrolls to `#join`
- "Explore Ecosystem" button: outline, border `2px solid #0B3C6D`, hover fills `#0B3C6D` with white text
- Pill tags: `rgba(11,60,109,0.08)` bg, `#0B3C6D` text, 14px, rounded-full
- Animations: framer-motion fade-in on text elements (subtle, staggered)
- Mobile: single column, text centered, buttons stacked, 80px top/bottom padding, 36px headline
- Remove lazy import of `HeroScene` — no more Three.js in hero
- Keep `scrollToJoin` function for the "Join Us" button
- Remove `useLanguageTransition`, letter-by-letter animation, subtitle splitting

### Files untouched
- Navbar, Footer, all other sections — no changes
- `HeroScene.tsx`, `Logo3D.tsx`, `OrbitNodes.tsx` — left in place (not deleted, just no longer imported by Hero)

| File | Action |
|------|--------|
| `public/videos/hero-cube.mp4` | Copy uploaded video |
| `src/components/Hero.tsx` | Full rewrite — video bg + two-column text layout |

