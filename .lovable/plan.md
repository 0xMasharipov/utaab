# CUTII white Thinking Orb and animated reply reveal

## Goal
Use the provided Thinking Orbs design in CUTII, make it white, give the waiting label a soft glow animation, and add a polished reply-entry effect that behaves consistently on desktop and iPhone.

## Plan

1. **Adopt the provided Thinking Orb**
   - Replace CUTII’s current three-dot custom orb with the official Thinking Orbs React source, kept locally so its animation behavior can be controlled reliably.
   - Use the `reasoning` state while CUTII prepares an answer and the `base` state in the header when idle.
   - Render both sizes in white with a restrained white halo, while preserving accessible labels.

2. **Animate the thinking state**
   - Give “CUTİİ is thinking” a subtle breathing glow synchronized with the active orb.
   - Keep the effect readable and contained inside the existing assistant message bubble.

3. **Refine how replies appear**
   - Upgrade the existing typewriter effect to a smooth luminous reveal: new text enters with a short opacity/blur/glow transition, then settles into normal readable text.
   - Keep a white animated cursor while the reply is appearing and remove it cleanly when complete.
   - Ensure previous messages do not replay their animation when new messages arrive.

4. **Match animation behavior on iPhone**
   - Remove the provided orb’s default reduced-motion freeze from CUTII’s local copy, matching the project’s existing requirement that CUTII motion remains active on iOS.
   - Use transform, opacity, and SVG animation techniques supported by mobile Safari, with stable dimensions to prevent message layout shifts.

5. **Verify CUTII end to end**
   - Test idle, thinking, reply-start, reply-complete, and repeated-message states in desktop and iPhone-sized views.
   - Confirm the white orb and text effects remain visible, smooth, correctly positioned, and free of runtime or build errors.

## Technical details
- Scope is limited to CUTII presentation and animation; Grok, authentication, chat storage, window behavior, translations, and message submission remain unchanged.
- The official orb source is preferred over the package runtime because the supplied library intentionally freezes under iOS Reduce Motion, which conflicts with the requested desktop/mobile parity.
