

# Move Logo Inside White Card — Welcome Email

## Summary
Move the logo and tagline from above the white card to inside it, so they appear as the first elements within the card container.

## Changes to `supabase/functions/_shared/transactional-email-templates/welcome-email.tsx`

### Structure update
- Remove the logo `<Section>` and tagline `<Text>` from outside the card
- Place them as the first elements inside the `<Section style={card}>` block
- Add bottom margin to tagline inside the card (`margin: '0 0 32px'`) for spacing before the heading
- Adjust card top padding from `48px` to `40px` since the logo now provides visual padding

### Redeploy
- Deploy `send-transactional-email` and `preview-transactional-email` Edge Functions

## Files Modified
- `supabase/functions/_shared/transactional-email-templates/welcome-email.tsx`

