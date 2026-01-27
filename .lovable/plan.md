
## Plan: Add Smooth Language Transition Animations

### Overview
Implement elegant, cinematic language transition animations that provide visual feedback when users switch between languages. The text content will smoothly fade out and fade back in with subtle motion, creating a polished user experience.

---

## Solution Architecture

```text
LANGUAGE TRANSITION FLOW
┌─────────────────────────────────────────────────────────────────────┐
│  User clicks language  →  Trigger fade-out  →  Change language     │
│                        →  Wait for transition  →  Fade-in new text │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Strategy

### Approach: React Context + CSS Transitions

We'll create a language transition system that:
1. Detects when language is changing via i18next events
2. Applies a transitioning state to the app
3. Uses CSS transitions for smooth opacity/transform changes
4. Respects `prefers-reduced-motion` for accessibility

---

## Files to Create/Modify

### Phase 1: Create Language Transition Context

**New File: `src/contexts/LanguageTransitionContext.tsx`**

Create a context provider that:
- Listens to i18next `languageChanged` events
- Manages `isTransitioning` state with configurable duration
- Provides `isTransitioning` boolean to consuming components
- Handles cleanup on unmount

```tsx
// Pseudocode structure
const LanguageTransitionContext = createContext({ isTransitioning: false });

export const LanguageTransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    const handleLanguageChanging = () => {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    };
    
    i18n.on('languageChanged', handleLanguageChanging);
    return () => i18n.off('languageChanged', handleLanguageChanging);
  }, []);
  
  return <Context.Provider value={{ isTransitioning }}>{children}</Context.Provider>;
};
```

### Phase 2: Add CSS Transition Classes

**File: `src/index.css`**

Add utility classes for language transitions:
- `.lang-transition` - Base transition class for text elements
- `.lang-transitioning` - Applied during language change (fade out)
- Support for reduced motion preferences

```css
/* Language transition utilities */
.lang-transition {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.lang-transitioning {
  opacity: 0.3;
  transform: translateY(2px);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .lang-transition {
    transition: none;
  }
  .lang-transitioning {
    opacity: 1;
    transform: none;
  }
}
```

### Phase 3: Create Reusable Hook

**New File: `src/hooks/useLanguageTransition.ts`**

Create a custom hook for consuming the transition state:
- Returns `isTransitioning` boolean
- Returns utility function `getTransitionClass()` for easy class application

### Phase 4: Integrate into App

**File: `src/App.tsx`**

Wrap the app with `LanguageTransitionProvider`:
```tsx
<QueryClientProvider client={queryClient}>
  <LanguageTransitionProvider>
    <TooltipProvider>
      {/* ... existing content */}
    </TooltipProvider>
  </LanguageTransitionProvider>
</QueryClientProvider>
```

### Phase 5: Update Key Components

Apply transitions to main content areas:

**File: `src/components/Navbar.tsx`**
- Add transition classes to navigation items and buttons
- Smooth text updates in mobile menu

**File: `src/components/Hero.tsx`**
- Add transition to title, subtitle, description, and CTA button

**File: `src/components/Community.tsx`**
- Add transition to section titles and feature cards

**File: `src/components/Stats.tsx`**
- Add transition to stat labels

**File: `src/components/Footer.tsx`**
- Add transition to footer links and text

---

## Technical Details

### Transition Timing
- **Fade-out duration**: 150ms
- **Language update**: ~50ms (instant)
- **Fade-in duration**: 150ms
- **Total perceived time**: ~300ms

### CSS Classes Applied
Components will conditionally apply:
```tsx
className={cn(
  "lang-transition",
  isTransitioning && "lang-transitioning",
  // ... other classes
)}
```

### Accessibility Considerations
- Respects `prefers-reduced-motion` media query
- No animations for users who prefer reduced motion
- Transitions are subtle (opacity + slight Y movement)
- No jarring movements or layout shifts

---

## Summary of Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/contexts/LanguageTransitionContext.tsx` | Create | Context provider for transition state |
| `src/hooks/useLanguageTransition.ts` | Create | Custom hook for consuming transition |
| `src/index.css` | Modify | Add CSS transition utilities |
| `src/App.tsx` | Modify | Wrap with LanguageTransitionProvider |
| `src/components/Navbar.tsx` | Modify | Apply transition classes to nav items |
| `src/components/Hero.tsx` | Modify | Apply transition to hero content |
| `src/components/Community.tsx` | Modify | Apply transition to section content |
| `src/components/Stats.tsx` | Modify | Apply transition to stat labels |
| `src/components/Footer.tsx` | Modify | Apply transition to footer content |

---

## Expected Outcome

- When users switch languages, text content smoothly fades out with a subtle downward motion
- New language text fades in with upward motion, creating a "swap" effect
- Transitions are fast (300ms total) to feel responsive
- Users who prefer reduced motion see instant language changes
- No layout shifts or jumpy behavior during transitions
- Consistent animation across all translated content
