
# Fix Duplicate Admin Invitation Error

## Problem

When trying to invite an admin user, you get the error:
```
Failed to send invitation: duplicate key value violates unique constraint "admin_invitations_email_key"
```

This happens because the `admin_invitations` table has a unique constraint on the `email` column. If an invitation already exists for that email (even if it's expired), a new invitation cannot be inserted.

## Current Data

The database shows existing invitations:
- `hamzaliabdulla@gmail.com` - pending invitation (expires Feb 1, 2026)
- `dotrue03@gmail.com` - pending invitation (expired Dec 27, 2025)

## Solution

Add a pre-check before inserting a new invitation that:
1. Checks if an invitation already exists for the email
2. If it exists and is expired, delete it and create a new one
3. If it exists and is still pending (not expired), show a user-friendly error message

## Changes Required

### File: `src/pages/admin/AdminUsers.tsx`

Update the `handleSendInvite` function to:

```typescript
const handleSendInvite = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if an invitation already exists for this email
    const { data: existingInvite, error: checkError } = await supabase
      .from('admin_invitations')
      .select('id, expires_at, accepted_at')
      .eq('email', newInvite.email)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingInvite) {
      const isExpired = new Date(existingInvite.expires_at) < new Date();
      const isAccepted = existingInvite.accepted_at !== null;

      if (isAccepted) {
        toast.error('This user has already accepted an invitation');
        return;
      }

      if (!isExpired) {
        toast.error('An active invitation already exists for this email');
        return;
      }

      // Delete expired invitation before creating new one
      const { error: deleteError } = await supabase
        .from('admin_invitations')
        .delete()
        .eq('id', existingInvite.id);

      if (deleteError) throw deleteError;
    }

    // Insert new invitation
    const { error } = await supabase.from('admin_invitations').insert([{
      email: newInvite.email,
      role: newInvite.role as any,
      invited_by: user.id,
    }]);

    if (error) throw error;

    toast.success('Invitation sent successfully');
    setInviteDialogOpen(false);
    setNewInvite({ email: '', role: 'moderator' });
  } catch (error: any) {
    toast.error('Failed to send invitation: ' + error.message);
  }
};
```

### File: `supabase/functions/convert-applicant-to-user/index.ts`

Apply the same logic to the edge function that creates invitations when converting applicants:

- Before inserting into `admin_invitations`, check for existing invitations
- Delete expired ones, block if active/accepted

## Summary

| File | Change |
|------|--------|
| `src/pages/admin/AdminUsers.tsx` | Add duplicate check before inserting invitation |
| `supabase/functions/convert-applicant-to-user/index.ts` | Add duplicate check before inserting invitation |

## Result

After this fix:
- Expired invitations will be automatically replaced
- Active invitations will show a clear error message
- Accepted invitations will be blocked from re-inviting
