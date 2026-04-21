

## Hide Lovable badge globally via CSS

### Change
Append a global rule to `src/index.css` to hide any element with `id="lovable-badge"`:

```css
#lovable-badge {
  display: none !important;
}
```

Placed at the end of the file (after the existing `@layer` blocks and keyframes) so it has top-level specificity and isn't scoped to a Tailwind layer.

### Files touched
- **Modified:** `src/index.css` (4-line addition at end of file)

### Untouched
Everything else — no component changes, no config changes.

### Risk: trivial
Single CSS rule, scoped to a specific ID that doesn't exist elsewhere in the codebase.

