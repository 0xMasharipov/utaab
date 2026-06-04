## UBpoint Landing Page

A new premium product page at `/projects/ubpoint` showcasing the UBPoint platform with an Apple/Stripe/Linear-grade Web3 SaaS aesthetic.

### Route & navigation
- New route: `/projects/ubpoint` registered in `src/App.tsx` (lazy-loaded, mirroring TonRa pattern).
- Update the `Projects` grid card so the UBpoint entry links to `/projects/ubpoint`.
- Standard `<Navbar />` and `<Footer />`, with `<SEO />` (title <60 chars, description <160) and a single H1.

### Assets to prepare
- **Brand mark** (`UBpoint.png`) → uploaded via `lovable-assets` as `src/assets/ubpoint-logo.png.asset.json`. Used in navbar-style chip inside the hero and floating phone bezel.
- **Silver coin** (`UB-Point(1).png`) → uploaded via `lovable-assets` as `ubpoint-coin.png.asset.json`. Used as a floating decorative element near the metrics section.
- **iPhone mockup** (`ChatGPT Image…png`) → background removed with `imagegen--edit_image` (transparent PNG), uploaded as `ubpoint-mockup.png.asset.json`. Used as the single real device in the hero carousel.

### Page composition (`src/pages/projects/UBpointPage.tsx`)

1. **Hero — "Turn Participation Into Opportunity"**
   - Two-column on `md+`, stacked on mobile.
   - Left: eyebrow chip ("UTAAB · Blockchain Engagement"), H1, subtitle, two CTAs (primary `Explore UBPoint` → scrolls to features; secondary `View Rewards` → scrolls to rewards/metrics).
   - Right: a floating iPhone (transparent PNG) with subtle 6s `y` float + `rotate` Framer Motion loop, blue radial glow behind it, plus 2 smaller abstract glass UI cards orbiting (one shows a "+50 UBP earned" toast, the other a circular progress ring) to imply a multi-screen experience without fabricating fake screenshots.
   - Background: soft white→`#EFF6FF` gradient, faint grid (SVG pattern), 3 blurred blue orbs, a few animated particle dots (CSS keyframes, no heavy lib).

2. **Feature grid (6 cards)**
   - Glassmorphism cards (`bg-white/60 backdrop-blur border border-blue-100 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]`), Lucide icons in blue gradient circles, staggered fade-in on scroll via Framer Motion `whileInView`.
   - Cards: Earn UBP, Unlock Rewards, On-Chain Verification, Student Identity, Leaderboards, Campus Engagement.

3. **Horizontal scroll showcase**
   - Section heading "Inside the app".
   - Horizontal flex row, snap-x, with 6 large glass cards (Home Dashboard, Rewards Marketplace, Student Wallet, Leaderboard, Events, Profile Analytics). The "Home Dashboard" card embeds the real iPhone mockup; the other five are stylized glass UI compositions (header + token chip + progress bar / list rows / chart bars) built from divs — no fake screenshot images. Each card animates with `whileInView` opacity/translate + a subtle parallax on `useScroll`.

4. **For Brands / Sponsors (B2B)** — new section per request
   - Headline: "Real students. Real engagement. On-chain proof."
   - Copy: explains how sponsor companies fund task bounties (Follow, Join Discord, Try app, Attend webinar) and receive verifiable user acquisition + retention data, while students get UBP. Emphasizes verified university audience and Sepolia-anchored proof of completion.
   - Three sample task cards: "Follow on X — 10 UBP", "Join Discord — 25 UBP", "Try the app — 50 UBP" with sponsor placeholder logo chip and verified badge.
   - CTA: `Become a Sponsor` → `mailto:` UTAAB official address or `/contact`.

5. **Metrics strip**
   - 4 stats: `200+ UBP Distributed`, `1+ Campus Events`, `100% On-Chain Recorded`, `∞ Future Ecosystem Potential`.
   - Numbers animate with a count-up on `whileInView` (simple `requestAnimationFrame`, no extra dep); `∞` and `%` rendered as-is.
   - Decorative silver coin asset floats to the side with a slow rotate.

6. **Final CTA**
   - "The Future Student Economy Starts Here" headline on a deep blue gradient panel with floating orbs, supporting copy, single `Join UTAAB` button → existing community/WhatsApp join link already used elsewhere in the project.

### Visual system
- Tailwind semantic tokens only; no raw hex in JSX. Add (or reuse) helpers in `index.css`:
  - `--gradient-ubpoint` (`135deg, #2563EB → #3B82F6`) and `--glow-blue` shadow token.
  - A `.glass-card` utility (`bg-white/60 backdrop-blur-xl border border-white/60`).
- Existing Montserrat headings / body font respected (per project memory).
- Strict palette: white, slate-900 text, blue-50/100/500/600/700. No purple, no holiday effects (per memory).

### Animations
- `framer-motion` (already in project — will verify on implementation) for: hero float, card stagger, scroll-triggered reveals, horizontal-scroll parallax via `useScroll` + `useTransform`.
- CSS keyframes for orb drift and particle twinkle (already available `animate-fade-in`, plus new keyframes in `tailwind.config.ts` if needed).

### Accessibility & SEO
- Single H1 ("Turn Participation Into Opportunity").
- All decorative images marked `aria-hidden`; meaningful images have alt text.
- Buttons are real `<Button>` components with focus rings.
- `<SEO>` title: "UBpoint — Blockchain Student Engagement | UTAAB", description under 160 chars.

### Files touched
- **Create:** `src/pages/projects/UBpointPage.tsx`, `src/components/ubpoint/UBpointHero.tsx`, `…/FeatureGrid.tsx`, `…/ScrollShowcase.tsx`, `…/SponsorSection.tsx`, `…/MetricsStrip.tsx`, `…/FinalCTA.tsx`, `…/FloatingDevice.tsx`.
- **Create asset pointers:** `src/assets/ubpoint-logo.png.asset.json`, `ubpoint-coin.png.asset.json`, `ubpoint-mockup.png.asset.json` (after background removal).
- **Edit:** `src/App.tsx` (route), `src/components/Projects.tsx` (link UBpoint card to new route), `src/index.css` (add gradient + glow tokens + glass utility).

### Out of scope
- No backend changes, no new tables, no edge functions.
- No new translation keys beyond what's needed for the page title (English copy as provided; can be i18n'd in a follow-up if requested).
