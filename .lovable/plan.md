# Bring the phone version back to the same motion as the computer version

Goal: on phones, every page should move, reveal and animate exactly like it does on a computer — no plain, stripped-down fallbacks.

## What I checked so far

I compared the site side by side at phone width (390px) and computer width (1280px) on the home, about and UBpoint pages. The layouts match, but a few places in the code deliberately serve a quieter version on small screens, and some sections have no reveal motion at all on either size, which reads as "raw" once the screen is narrow and everything stacks.

Confirmed in the code:
- The UBpoint scrolling story has a second, motionless version that takes over whenever a device reports "reduce motion". Since your phone setting is off, this needs a proper check rather than a guess — it is the first thing I will verify on the real page.
- The orbiting background dots are cut down to roughly half as many on small screens.
- There is an unused plain-gradient phone hero left over in the project, plus an unused "performance guard" that treats every touch device as a low-power device. Both are traps waiting to strip motion; I will remove or neutralise them.

## Plan

1. **Audit, page by page** — record a short scroll capture at phone width and at computer width for: home, about, team, UBpoint, TonRa, whitepaper, learn, blog, education home. For each one, note every effect that plays on the computer but not on the phone.
2. **Remove the small-screen downgrades** — anything that renders a still or simplified variant purely because the screen is narrow or the pointer is touch gets removed, so the phone runs the same code path as the computer.
3. **Keep the accessibility exit** — the only thing that still turns motion off is the visitor's own "reduce motion" system setting. Nothing else.
4. **Restore the UBpoint story on phones** — the scroll-driven phone tilt, the step-by-step text swap with blur/fade, the step counter and the progress indicator all play on phones. The phone mockup stays empty, as today.
5. **Add the missing reveals where sections stack** — sections that simply appear on the phone get the same fade-and-rise entrance they have on the computer, staggered per card.
6. **Guard the feel** — motion stays smooth on a phone by animating only transform and opacity, and by keeping the heavier background effects light rather than removing them.
7. **Verify** — re-capture the same pages at phone width, confirm each effect now plays, check for console errors, and run the type check and build.

## Technical notes

- Delete the `reduceMotion ? <StaticStory /> : <AnimatedStory />` split in `src/pages/projects/UBpointPage.tsx` in favour of a single animated path (framer-motion already respects the OS setting internally); drop the now-dead `StaticStory`.
- Remove `src/components/three/MobileHeroBackground.tsx` (unused) and `src/hooks/usePerfGuard.ts` (unused, and its `pointer: coarse && width <= 768` rule would force a "reduced" tier on every phone).
- Restore full node/line counts in `src/components/three/OrbitNodes.tsx`, keeping the mobile device-pixel-ratio cap for framerate.
- For sections found without entrance motion, use the existing `whileInView` + `fadeUp` variant pattern already used on `src/pages/About.tsx` rather than introducing a new animation approach.
- Verification with Playwright at 390x844 and 1280x900, plus `npx tsgo --noEmit -p tsconfig.app.json` and a production build.
