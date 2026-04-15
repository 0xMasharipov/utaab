

# Update Hero Section + First Section Below It

## Summary
Rewrite the hero text content and transform the AboutBlurb into a "What We Build" section with 4 visual cards. Only i18n keys and two components change — no layout, backend, or other section modifications.

## Changes

### 1. `src/i18n/locales/en.json` — Update hero + about keys

**Hero keys:**
```json
"hero": {
  "tagline": "LEARN · BUILD · IMPACT",
  "headline": "From Learning to Building in",
  "headlineHighlight": "Web3",
  "description": "UTAAB is an ecosystem where students become builders through real-world projects, education, and collaboration.",
  "supportingLine": "Not just a community — a platform for real-world impact.",
  "joinUs": "Join the Movement",
  "explore": "Explore Projects"
}
```

**About keys (for the "What We Build" section):**
```json
"about": {
  "title": "What We Build",
  "blurb": "We don't just teach — we build, launch, and create real impact.",
  "learnMore": "Learn More About UTAAB",
  "cards": {
    "education": { "title": "Education", "description": "Workshops, mentorship, and structured learning for Web3 development." },
    "projects": { "title": "Real Projects", "description": "Building blockchain-based solutions with real-world applications." },
    "ecosystem": { "title": "Ecosystem", "description": "Connecting students, developers, and innovators into an active network." },
    "support": { "title": "Support", "description": "Enabling financial, mental, and professional growth." }
  }
}
```

### 2. `src/i18n/locales/tr.json`, `ar.json`, `ru.json` — Add equivalent translations for all new/changed keys

### 3. `src/components/Hero.tsx` — Update content structure

- Add a new `supportingLine` below the description (small, muted text)
- Swap button order: "Explore Projects" first (primary), "Join the Movement" second (outline)
- Keep all existing video logic, overlays, animations, and scroll functions intact

### 4. `src/components/AboutBlurb.tsx` — Rewrite to 4-card grid

- Replace the 3-card `values` array with 4 cards: Education (`GraduationCap`), Real Projects (`Rocket`), Ecosystem (`Globe`), Support (`Heart`)
- Use i18n keys `about.cards.education.*`, etc.
- Change grid from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4`
- Keep existing GlassCard, motion animations, Link to `/about`, and `id="about"`

### Not modified
- `Index.tsx`, `HeroCarousel`, `Community`, `Navbar`, `Footer`, backend, admin — all untouched

## Files Modified
- `src/components/Hero.tsx`
- `src/components/AboutBlurb.tsx`
- `src/i18n/locales/en.json`
- `src/i18n/locales/tr.json`
- `src/i18n/locales/ar.json`
- `src/i18n/locales/ru.json`

