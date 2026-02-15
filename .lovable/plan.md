
# Add Organic Morphing Animation to Background Blobs

## What Changes
Add `border-radius` morphing to each blob's keyframes so they organically shift between different rounded shapes instead of staying perfectly circular. This creates a liquid, living feel.

## How

### Update `tailwind.config.ts` - Modify blob keyframes
Add `borderRadius` values at each keyframe step for all 4 blob animations:

```
"blob-1": {
  "0%, 100%": { transform: "translate(0, 0) scale(1)", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" },
  "25%":      { transform: "translate(30px, -50px) scale(1.05)", borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%" },
  "50%":      { transform: "translate(-20px, 20px) scale(0.95)", borderRadius: "50% 60% 30% 60% / 60% 40% 70% 30%" },
  "75%":      { transform: "translate(50px, 30px) scale(1.02)", borderRadius: "30% 50% 60% 40% / 50% 70% 30% 60%" },
}
```

Each blob gets a unique set of organic radius values so they don't all morph in sync.

### Update `src/components/AnimatedBlobBackground.tsx`
Remove the `rounded-full` class from each blob div (since `border-radius` is now driven by the keyframes).

## Files Changed

| File | Change |
|------|--------|
| `tailwind.config.ts` | Add `borderRadius` values to all 4 blob keyframe definitions |
| `src/components/AnimatedBlobBackground.tsx` | Remove `rounded-full` from blob divs |

## Visual Result
Blobs will smoothly morph between organic, amoeba-like shapes while continuing their existing translate/scale movement. The heavy blur (80-110px) ensures the morphing looks soft and fluid rather than jagged.
