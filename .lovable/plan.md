## Add subtle blue shadow glow to main page section images

Add a soft blue drop-shadow glow behind images in the main page sections (What We Build / Projects, About, Learn, Resources, Events) so they feel more premium and lift off the dark navy background — without changing layouts, sizes, or overlays.

### Approach

Use Tailwind's `drop-shadow-[...]` utility (which compiles to CSS `filter: drop-shadow(...)`). Unlike `box-shadow`, `drop-shadow` follows the alpha shape of transparent PNG/WebP product renders, so the glow hugs the image silhouette instead of forming a rectangle. The glow uses the brand accent (`hsl(213 94% 68%)` ≈ `#3B82F6`) at low opacity, with a stronger glow on hover.

Base glow: `drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)]`
Hover glow: `group-hover:drop-shadow-[0_12px_36px_rgba(59,130,246,0.32)]`
Transition: `transition-[filter,transform] duration-500`

### Changes

1. **`src/components/Projects.tsx`** (line 111) — add glow classes to the 3D project image (the main "What We Build" cards).
2. **`src/components/AboutBlurb.tsx`** (line 81) — add glow to the About card image.
3. **`src/components/Learn.tsx`** (line 81) — add glow to the Learn card image.
4. **`src/components/Resources.tsx`** (line 128) — add glow to the foreground resource icon (skip the blurred bg layer at line 107).
5. **`src/components/Events.tsx`** (line 88) — add a softer rectangular glow (`shadow-[0_8px_24px_rgba(59,130,246,0.15)]`) to the event cover image since it's a full rectangular cover photo, not a transparent render.

### Notes

- Hero / HeroCarousel / BlogSection are not touched (Hero uses video; blog cards already have their own treatment).
- No new CSS keyframes needed — pure Tailwind utility classes.
- Respects existing `group-hover:scale-105` transforms by adding `filter` to the same transition.
