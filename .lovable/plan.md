## Remove the "Or paste this link into your browser" fallback from auth emails

The raw confirmation URL points to the Supabase project domain (`*.supabase.co`), which leaks backend infrastructure to recipients. The CTA button already carries the same link, so the fallback block is removable without losing functionality.

### Change

In each of the 5 auth email templates under `supabase/functions/_shared/email-templates/`:

- `signup.tsx`
- `magic-link.tsx`
- `recovery.tsx`
- `invite.tsx`
- `email-change.tsx`

Remove the block:

```tsx
<Text style={fallbackText}>Or paste this link into your browser:</Text>
<Text style={fallbackLink}>
  <Link href={confirmationUrl} style={fallbackLinkAnchor}>
    {confirmationUrl}
  </Link>
</Text>
```

Also drop the now-unused `fallbackText`, `fallbackLink`, `fallbackLinkAnchor` style constants and unused `Link` import where applicable.

### Deploy

Redeploy `auth-email-hook` so the new templates take effect.

### Out of scope

- No copy or branding changes elsewhere.
- Transactional templates are untouched.
