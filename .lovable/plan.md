## Plan

The "View Rewards" button is still rendering with the default dark-blue primary variant because twMerge isn't disambiguating the classes the way we need. I'll force it to be a true white button:

- Set `variant="outline"` on the Button.
- Use explicit white background + dark text classes with `!` important modifiers so they win against the variant defaults: `!bg-white !text-slate-900` plus blue border and a subtle hover.

Only the hero "View Rewards" button in `src/pages/projects/UBpointPage.tsx` is touched.