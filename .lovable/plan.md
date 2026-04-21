

## Verify Lovable badge is hidden

### Current state
The CSS rule was added to `src/index.css`:

```css
#lovable-badge {
  display: none !important;
}
```

This is a global, top-level selector with `!important`, so it applies on every route regardless of when the badge is injected into the DOM.

### Verification approach

Use the browser tool to:
1. `navigate_to_sandbox` → load `/` (homepage)
2. `extract` to query `document.getElementById('lovable-badge')` and check its computed `display` style
3. Navigate to a couple of representative routes (`/team`, `/about`) and repeat the same DOM check

### Pass criteria
- Either `#lovable-badge` is absent from the DOM, or
- It exists but `getComputedStyle(el).display === 'none'`

If both conditions fail on any route, report it and propose a fallback (e.g., higher-specificity selector or attribute-based hide).

### Note
This switches to default mode only to run browser checks — no code edits planned unless verification fails.

