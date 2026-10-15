# Desktop-matched motion and the new UTAAB team page

## Menu motion parity
- Make iOS use the same opening/closing duration, easing, shape expansion, icon transformation, staggered links and supported glass effects as desktop. Adapt dimensions to the screen, not the animation style.
- The current stylesheet includes a separate Reduced Motion treatment and pointer-hover-only text effects. Compare desktop and phone using matching motion settings; use touch press/selection and keyboard focus for equivalent interaction feedback where hover is unavailable.
- Keep one shared animation path, stable measured content and clean reversal during rapid taps. Investigate Safari clipping/compositing if differences remain rather than substituting a simpler phone animation.
- Preserve scroll-down hiding, scroll-up reveal, footer closing, safe-area placement, navigation and language controls.
- Keep accessibility behavior consistent across devices: full motion with normal settings and the same gentle alternative on either device when Reduced Motion is requested.

## Team page adaptation
- Replace the current team-page heading and card grid with an adaptation of the supplied drifting portrait roster.
- **Keep photos in their natural colors**, as selected. Do not apply duotone/tritone filters, UTAAB icon overlays, grain or the previously removed photo effects.
- Use UTAAB navy, blue and white semantic styling with Montserrat; omit the sample orange palette, stretched lettering, stock people and invented roles/contact details.
- Present a prominent UTAAB team heading with the existing translated introduction, alongside tall portrait columns drifting gently in alternating directions on desktop.
- On phones, use the supplied horizontal portrait-strip layout while retaining the same entrance, portrait lift and detail-panel transitions. Layout changes should not remove motion effects.
- Hover, keyboard focus or a phone tap lifts the chosen portrait and reveals its name, role and short existing biography; pause drift while details are being read. Keep faces clear and readable.
- Provide explicit profile access to the existing full-profile modal/drawer, with existing social/contact links intact. A first phone tap reveals details rather than immediately navigating away.
- Add an accessible pause/resume icon control on every layout. Pause automatically off-screen, in hidden tabs and during profile interaction; resume without jumping. Use a consistent reduced-motion alternative across devices.

## Content and accessibility
- Reuse `useTeamMembers` and its current published roster, display ordering, translated biographies, photo fallback and social links. Do not change admin management or stored member data.
- Preserve the founder/team hierarchy in the primary roster; any repeated portraits used for seamless motion are decorative duplicates, not additional team members or keyboard stops.
- Keep all members reachable, including with small rosters, long names, missing images or long translated text. Use initials when a photo cannot load.
- Translate new controls in the existing supported languages and maintain right-to-left support.
- Keep public navigation, footer, privacy controls and the home-page team section unchanged except for the shared menu motion repair.

## Technical details
- Introduce a local roster component and dedicated stylesheet, adapting the uploaded source to React/Vite and existing Button components rather than copying its demo defaults.
- Repair malformed multiline string literals in the supplied source; use typed member adapters and semantic CSS tokens, without arbitrary inline color styling or viewport-scaled headline fonts.
- Separate portrait selection from full-profile opening so touch interaction cannot trigger both unintentionally. Keep closed details non-focusable and support Escape/outside dismissal.
- Record the roster architecture and motion convention in `AGENTS.md`; save the selected natural-photo preference during implementation.
- No new backend services, tables or dependencies are planned.

## Verification
- Compare menu opening/closing and intermediate frames at desktop and phone sizes with matching normal/Reduced Motion settings. Verify timing, icon motion, link entrances, rapid taps, scroll visibility and footer closing.
- Verify the team roster on desktop and phone: real photos, continuous drift, portrait selection, pause/resume, complete member access, full profiles and social links.
- Check keyboard navigation, decorative duplicates, translated content, right-to-left layout, missing-photo fallback, short screens and rotation; capture screenshots and check preview errors.
- Test Chromium and WebKit where available. Physical iPhone smoothness cannot be guaranteed by browser emulation; report any emulation limitations and request an iPhone check after implementation.