# Repair CUTII and simplify team photos

## What will change

### 1. Make the CUTII thinking animation reliable
- Replace the current third-party orb rendering in CUTII with a small self-contained animated orb that uses the app’s existing blue design tokens.
- Animate both the status orb beside “Course assistant” and the larger “CUTİİ is thinking” indicator whenever a reply is being generated.
- Keep stable dimensions and accessible status text so the chat does not shift while loading.
- Verify the animation on desktop and an iPhone-sized viewport, including while a real signed-in message is pending.

### 2. Teach CUTII about UTAA Blockchain and UTAAB
- Expand CUTII’s server-side knowledge with the organization facts already published in the site: UTAAB’s full name, student-led identity, UTAA university community, mission, vision, education focus, collaboration model, and current projects such as UBpoint and TonRa.
- Instruct CUTII to distinguish UTAA (the university) from UTAAB (the blockchain ecosystem/community), answer organization questions directly, and avoid inventing unsupported details.
- Preserve the existing course and lesson context, Grok integration, authentication, safety checks, and rate limits.
- Deploy the updated chat function and test a signed-in question about UTAA Blockchain.

### 3. Remove branding and unusual effects from team images
- Remove the UTAAB diamond icon layered over each team photo.
- Remove the pointer-following holographic sheen, glare, grain, glow, and 3D tilt from the team cards.
- Keep the original member photos, normal crop, readable name/role details, contact action, and profile modal/drawer.
- Check the team page on desktop and mobile to confirm photos appear clean and unaffected.

## Technical notes
- The current orb package explicitly freezes animation when the device reports reduced motion, which can make the indicator appear static.
- CUTII’s current server prompt contains general blockchain teaching instructions and course/lesson context, but no UTAAB organization knowledge.
- The UTAAB icon and photo effects are all applied by the live team card component, so they can be removed without changing team data or uploaded images.

## Validation
- Confirm the project builds without errors.
- Use browser checks for CUTII’s pending-response animation and clean team photos at desktop and mobile sizes.
- Confirm a signed-in CUTII response accurately explains UTAA Blockchain/UTAAB using only approved site facts.
