

# Learn & Grow Content Pages Implementation

## Overview
Build destination pages and click behavior for the 3 existing Learn & Grow cards on the homepage. No navbar changes.

## Changes

### 1. Update Learn Component — Add Click Navigation
**File:** `src/components/Learn.tsx`

Add `useNavigate` and make each card clickable:
- **Educational Guides** → `/learn/guides`
- **Video Tutorials** → `/education` (direct navigation, no new page)
- **Workshops & Bootcamps** → `/learn/workshops`

Wrap each card in a clickable element with navigation on click.

### 2. Create Educational Guides Page
**File:** `src/pages/learn/EducationalGuides.tsx`

Premium Web3 education hub page at `/learn/guides` with:

- **Hero**: "Learn & Grow" title, subtitle about structured blockchain education, animated blob background, Navbar + Footer
- **Section A — Start Here**: Beginner cards (What Is Blockchain?, How Does a Blockchain Work?, What Is Web3?, Wallets/Tokens/Transactions, Public vs Private Keys, Common Terms). Each card has title, description, "Beginner" badge, reading time, "Read Guide" CTA
- **Section B — Ethereum Fundamentals**: Cards for Ethereum-specific content (What Is Ethereum?, Smart Contracts, Gas Fees, etc.) with "Intermediate" badges
- **Section C — Build & Explore**: More advanced cards (Intro to dApps, DAOs, Web2 vs Web3, Testnets, Dev Tooling, Security Basics)
- **Section D — Ecosystem Learning Resources**: 3 branded resource panels for Ethereum, Binance Academy, Solana — presented as recommended external learning sources curated by UTAAB
- **Section E — Learning Journey**: Visual step-flow (6 steps from basics to workshops) using a vertical/horizontal progress tracker

Style: Dark background, glassmorphism cards, Montserrat, UTAAB blue accents, framer-motion animations, fully responsive.

### 3. Create Workshops & Bootcamps Page
**File:** `src/pages/learn/Workshops.tsx`

Coming Soon page at `/learn/workshops` with:
- Navbar + AnimatedBlobBackground + Footer
- Premium hero: "Workshops & Bootcamps" title
- Centered glass card with "Coming Soon" heading, supporting message about upcoming workshops, and a subtle animation
- Minimal but polished — not an empty page

### 4. Add Routes
**File:** `src/App.tsx`

Add two lazy-loaded routes:
```
/learn/guides → EducationalGuides
/learn/workshops → Workshops
```

### Files Modified

| File | Change |
|------|--------|
| `src/components/Learn.tsx` | Add click navigation to 3 cards |
| `src/pages/learn/EducationalGuides.tsx` | New comprehensive guides page |
| `src/pages/learn/Workshops.tsx` | New coming soon page |
| `src/App.tsx` | Add 2 new routes |

