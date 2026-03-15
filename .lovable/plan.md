

# Refine Hero Section to Dark Navy-Blue Atmosphere

## Overview
Replace the white/light hero background with a dark navy-blue atmosphere that seamlessly connects with the lower sections of the site. Only color, overlay, and typography contrast changes -- no layout or structural modifications.

## Changes

### 1. `src/components/Hero.tsx`

**Background**: Change `background: '#fff'` to a dark navy base `#061224`.

**Video overlay**: Replace white gradient overlays with dark navy overlays:
- Desktop: left-to-right from `rgba(6,18,36,0.92)` to `rgba(6,18,36,0)` so text side is dark, video side shows through
- Mobile: top-to-bottom dark overlay with reducing opacity

**Add atmospheric glow layer** (new div, z-index between overlay and content):
- Radial glow center-right: `radial-gradient(ellipse at 65% 50%, rgba(47,111,181,0.15), transparent 70%)`
- Soft left-side mist: `radial-gradient(ellipse at 20% 40%, rgba(28,63,104,0.2), transparent 60%)`

**Bottom fade**: Add a 120px bottom gradient from transparent to `#081624` (matching the next section) for seamless transition.

**Typography color updates**:
- Tagline: `#0B3C6D` → `rgba(127,179,255,0.7)` (muted light blue)
- Headline: `#1A1A1A` → `#F3F7FB` (soft white)
- "Next Generation" gradient: `linear-gradient(135deg, #7FB3FF 0%, #4F8FE8 45%, #A9CFFF 100%)`
- Paragraph: `#6F6F6F` → `rgba(230,238,248,0.72)` (light muted)

**Button updates**:
- Primary: keep blue glass but add soft glow `boxShadow: 0 4px 24px rgba(47,111,181,0.35)`
- Secondary: change border to `rgba(255,255,255,0.2)`, text to `#B4D2EB`, background to `rgba(255,255,255,0.06)`

### 2. `src/components/Navbar.tsx` (minor)

Darken the non-scrolled navbar background tint slightly:
- Change `rgba(10, 20, 50, 0.25)` → `rgba(6, 18, 36, 0.4)` for better harmony with the darker hero

### Files Modified
| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Background, overlays, typography colors, button styles |
| `src/components/Navbar.tsx` | Slightly darker glass tint (~1 line) |

