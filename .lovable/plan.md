

# Replace Page Fade with Text-Only Animation on Language Change

## Problem
Currently the entire page fades to `opacity: 0` and back when switching languages. This feels heavy — backgrounds, images, and layout all disappear briefly. A better approach: only animate the **text content** so the page structure stays stable while words smoothly transition.

## Approach
Remove the page-level opacity wrapper and instead use a CSS animation that targets text elements inline. The `lang-transitioning` class already gets applied via `getTransitionClasses()` — we just need to make it do a nice text animation (blur + fade + slight slide) instead of hiding the whole page.

### Changes

**1. `src/contexts/LanguageTransitionContext.tsx`** — Remove the wrapper div. Just pass children through directly:
```tsx
<LanguageTransitionContext.Provider value={{ isTransitioning }}>
  {children}
</LanguageTransitionContext.Provider>
```

**2. `src/index.css`** — Remove `.lang-page-idle` and `.lang-page-transitioning`. Update `.lang-transitioning` to use a blur+fade+slide animation on individual text elements:
```css
.lang-transition {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out, filter 0.2s ease-out;
}

.lang-transitioning {
  animation: lang-text-swap 0.35s ease-in-out;
}

@keyframes lang-text-swap {
  0%   { opacity: 1; transform: translateY(0); filter: blur(0); }
  35%  { opacity: 0; transform: translateY(-6px); filter: blur(4px); }
  65%  { opacity: 0; transform: translateY(6px); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
```

Remove the old `lang-page-idle`, `lang-page-transitioning`, and the old `lang-fade` keyframe. Update reduced-motion to disable `lang-text-swap` too.

**3. `src/hooks/useLanguageTransition.ts`** — No changes needed. Components already use `getTransitionClasses()` to apply the animation to individual text elements.

### Result
- Page background, images, navbar structure stay perfectly still
- Only text elements using `getTransitionClasses()` animate with a blur-slide effect
- Feels more polished and less jarring than a full-page fade

### Files Modified
- `src/contexts/LanguageTransitionContext.tsx`
- `src/index.css`

