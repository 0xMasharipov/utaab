

# Smooth Language Change Animation

## Current State
The infrastructure exists: `LanguageTransitionProvider` sets `isTransitioning` for 300ms on language change, and `getTransitionClasses` adds `lang-transitioning` CSS class. However, the current CSS only does a subtle `opacity: 0.3` dip — not a proper fade-out/fade-in effect.

## Plan

### 1. Enhance the CSS transition in `src/index.css`
Replace the current `lang-transition` / `lang-transitioning` styles with a proper fade-out → fade-in animation:
- Fade out to `opacity: 0` with slight `translateY(4px)` over ~150ms
- Fade back in over ~150ms  
- Use CSS `@keyframes` for a smooth two-phase animation (out then in)

```css
.lang-transition {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.lang-transitioning {
  animation: lang-fade 0.3s ease-in-out;
}

@keyframes lang-fade {
  0%   { opacity: 1; transform: translateY(0); }
  40%  { opacity: 0; transform: translateY(4px); }
  60%  { opacity: 0; transform: translateY(-4px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### 2. Add a global page-level fade wrapper in `LanguageTransitionProvider`
Wrap children with a `div` that applies the animation on language change so **all** page content animates — not just elements with `getTransitionClasses`. This ensures buttons, images, and other non-annotated elements also transition smoothly.

```tsx
<div className={isTransitioning ? 'lang-page-transitioning' : 'lang-page-idle'}>
  {children}
</div>
```

With corresponding CSS:
```css
.lang-page-idle {
  transition: opacity 0.15s ease-out;
  opacity: 1;
}
.lang-page-transitioning {
  opacity: 0;
}
```

### Files Modified
- `src/index.css` — enhanced transition keyframes + page-level transition classes
- `src/contexts/LanguageTransitionContext.tsx` — wrap children in animated div

