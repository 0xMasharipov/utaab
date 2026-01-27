

## Plan: Convert Approved Applicants to Education Platform Users

### Overview
Implement a secure feature that allows admins to approve community applicants and convert them into education platform users. This includes two options:
1. **Send Invite** - Create an invitation that applicants can use to register with pre-filled data
2. **Auto-Create Account** - Automatically create an account with a temporary password and send credentials

---

## Database Changes

### Add Status Tracking to community_applications Table

```sql
-- Add approval workflow columns
ALTER TABLE public.community_applications 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_at timestamptz,
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS converted_user_id uuid,
ADD COLUMN IF NOT EXISTS invite_token text,
ADD COLUMN IF NOT EXISTS invite_expires_at timestamptz;

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_community_applications_status 
ON public.community_applications(status);

-- Add constraint for valid statuses
ALTER TABLE public.community_applications 
ADD CONSTRAINT valid_application_status 
CHECK (status IN ('pending', 'approved', 'rejected', 'converted'));
```

---

## Architecture

```text
APPLICANT CONVERSION FLOW
┌─────────────────────────────────────────────────────────────────────────────┐
│  Admin Views Applicant  →  Clicks "Approve & Invite" or "Auto-Create"      │
│                                      ↓                                       │
│  Edge Function: convert-applicant-to-user                                   │
│    ├─ Validates admin role                                                  │
│    ├─ Option A: Creates invite token, sends email                           │
│    └─ Option B: Creates auth user + education_profile, sends welcome email │
│                                      ↓                                       │
│  Updates community_applications status to 'approved' or 'converted'         │
│  Logs action to audit_log                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### 1. Edge Function: `convert-applicant-to-user`

**File: `supabase/functions/convert-applicant-to-user/index.ts`**

Creates a new edge function that:
- Accepts `applicationId`, `action` (invite/create), and optional `role` (student/user)
- Validates caller has admin role using `has_role()` RPC
- For **invite** action:
  - Generates secure invite token
  - Updates application with invite details
  - Inserts into `admin_invitations` table with pre-filled data reference
  - (Optional) Sends invite email via Resend
- For **auto-create** action:
  - Creates auth user with temporary password using `supabase.auth.admin.createUser()`
  - Creates education_profile with applicant data (name, department, interests → focus_areas)
  - Updates application status to 'converted' with converted_user_id
  - Sends welcome email with password reset link
- Logs all actions to audit_log

### 2. Update AdminUsers.tsx

**File: `src/pages/admin/AdminUsers.tsx`**

Enhance the Applicants tab with:

- **Status Badge Column** - Shows pending/approved/rejected/converted status
- **Action Buttons in Preview Dialog**:
  - "Approve & Send Invite" button
  - "Create Account" button (auto-create with temp password)
  - "Reject" button with confirmation
- **Conversion Dialog** - Modal for selecting:
  - Account role (student or user)
  - Whether to send welcome email
  - Confirmation of action
- **Status Filter** - Dropdown to filter by pending/approved/rejected/converted
- **Update Table Display** - Show status badge and converted indicator

### 3. Create Conversion Dialog Component

**File: `src/components/admin/ApplicantConversionDialog.tsx`**

New component with:
- Radio buttons for action type (invite vs auto-create)
- Role selector (student, user)
- Email notification checkbox
- Security warnings for auto-create action
- Loading state during conversion
- Success/error feedback

### 4. Add RLS Policies for New Columns

```sql
-- Admins can update application status
CREATE POLICY "Admins can update application status"
ON public.community_applications FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

---

## Security Considerations

1. **Admin-Only Access** - All conversion operations require verified admin role
2. **Server-Side Validation** - Edge function validates all inputs and permissions
3. **Audit Logging** - Every conversion action is logged with full details
4. **Secure Tokens** - Invite tokens are cryptographically secure (32 bytes hex)
5. **Token Expiration** - Invite tokens expire after 48 hours
6. **No PII Logging** - Passwords are never logged
7. **Email Verification** - Auto-created accounts require password reset

---

## Data Mapping: Applicant → Education Profile

| community_applications | education_profiles |
|-----------------------|-------------------|
| full_name | full_name |
| email | (auth.users) |
| department | department |
| locale | preferred_language, locale |
| interests | focus_areas |
| kvkk_consent | kvkk_consent |
| kvkk_consent_version | kvkk_consent_version |
| - | role (default: 'student') |

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/convert-applicant-to-user/index.ts` | Create | Edge function for conversion logic |
| `src/components/admin/ApplicantConversionDialog.tsx` | Create | Conversion action dialog |
| `src/pages/admin/AdminUsers.tsx` | Modify | Add conversion actions, status display |
| Database Migration | Create | Add status columns to community_applications |

---

## User Interface Changes

### Applicants Tab Enhancements

1. **Table Columns**:
   - Name | Email | Department | Experience | Status | Applied | Actions

2. **Status Badges**:
   - 🟡 Pending (yellow outline)
   - 🟢 Approved (green)
   - 🔴 Rejected (red/destructive)
   - ✅ Converted (primary)

3. **Preview Dialog Actions**:
   - Current: View button only
   - New: View + Approve/Reject/Convert buttons

4. **Conversion Dialog**:
   - Action selection (Invite / Auto-Create)
   - Role assignment
   - Email notification toggle
   - Confirm button with security notice

---

## Technical Notes

- Uses existing CORS headers pattern from other edge functions
- Leverages `supabase.auth.admin.createUser()` for auto-creation
- Reuses existing `admin_invitations` table for invite workflow
- Follows established patterns from `manage-user-role` edge function
- Integrates with existing audit logging system

