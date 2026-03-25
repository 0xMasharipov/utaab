

# Fix: Reviews Table User ID Public Exposure

## Problem
The `reviews` table has two SELECT policies (`Anonymous users can view review stats only` and `Authenticated users can view all reviews with limited data`) both using `USING (true)`, which exposes `user_id` for all reviewers to anyone — including anonymous users.

## Current State
- The app already uses the `public_reviews` view (which masks `user_id` via `CASE WHEN auth.uid() = user_id`) for listing reviews publicly
- Direct `reviews` table reads only happen for the user's own review (filtered by `user_id = auth.uid()`)
- Insert/update/delete policies are already correctly scoped to own rows

## Solution
A single database migration that:

1. **Drops** the two overly-permissive SELECT policies:
   - `Anonymous users can view review stats only`
   - `Authenticated users can view all reviews with limited data`

2. **Creates** one replacement SELECT policy:
   - `Users can view their own reviews` — `USING (auth.uid() = user_id)`
   - This allows authenticated users to read only their own reviews from the `reviews` table
   - All public/anonymous review listing continues to work through the `public_reviews` view (which already has SELECT granted to `anon` and `authenticated`)

## Impact
- No code changes needed — `CourseReviews.tsx` already queries `public_reviews` for listings and `reviews` with `.eq('user_id', user.id)` for the user's own review
- Anonymous users lose direct access to the `reviews` table (they still see reviews via the `public_reviews` view)
- `user_id` is no longer exposed to non-owners

## Files Modified
- Database migration only (drop 2 policies, create 1)

