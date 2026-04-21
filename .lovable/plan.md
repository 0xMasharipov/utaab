

## Hide Lovable badge — platform setting + confirm CSS

### Current state
- `src/index.css` already contains `#lovable-badge { display: none !important; }` (global, applies to all routes including `/team`).
- Browser verification confirmed the badge is absent/hidden on `/`, `/resources`, `/blog`, `/education`, `/about`, `/team`, `/contributor-match`.

### Additional change
Use the platform's badge visibility setting to hide the "Edit with Lovable" badge on published deployments at the source:

- Call `publish_settings--set_badge_visibility` with `hide_badge: true`.

This removes the badge from published builds entirely, rather than relying solely on CSS to hide it after injection. (Requires Pro plan or higher — if your plan doesn't support it, the CSS fallback already in place keeps it hidden.)

### Files touched
- None. CSS rule already present; this is a platform setting toggle only.

### Untouched
All components, routes, styles.

### Risk: none
Toggle-only change with CSS safety net already in place.

