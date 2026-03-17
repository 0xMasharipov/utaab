

# Fix: Error Toast Appearing After Successful UTAAB Verification

## Root Cause

In `UtaabCaptcha.tsx` (lines 60-63), the `onVerdictChange` callback immediately calls `onError` whenever the verdict transitions to `'fail'` or `'blocked'`:

```typescript
onVerdictChange: (v) => {
  if (v === 'blocked' || v === 'fail') {
    onError?.(error || 'Verification failed');
  }
}
```

In `AdminLogin.tsx` (lines 482-487), `onError` shows a destructive toast. This fires even during transient/intermediate states before the user completes verification, so the error toast appears alongside the green "Verified" checkmark.

## Fix

**File:** `src/components/security/UtaabCaptcha.tsx`

Remove the `onError` call from `onVerdictChange`. The component already renders inline error UI (the red "Verification Failed" block at lines 214-246) with a retry button. The `onError` prop should only be called when the error is truly final and unrecoverable — not on every verdict transition.

Instead, only call `onError` when the user is in a `'blocked'` state (which is permanent and has no retry). For `'fail'`, the inline UI with the retry button is sufficient — no toast needed.

**Change in `onVerdictChange`:**
```typescript
onVerdictChange: (v) => {
  if (v === 'blocked') {
    onError?.(error || 'Verification blocked');
  }
}
```

This ensures:
- Transient `'fail'` states during the flow don't trigger error toasts
- The inline error UI still shows with retry option for `'fail'`
- Only permanent `'blocked'` verdicts notify the parent via `onError`

## Files Modified

| File | Change |
|------|--------|
| `src/components/security/UtaabCaptcha.tsx` | Only fire `onError` for `'blocked'` verdict, not `'fail'` |

