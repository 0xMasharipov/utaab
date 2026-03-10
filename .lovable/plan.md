

# Add 50-Word Minimum to Motivation Field

## Problem
The "Why do you want to join UTAAB?" motivation textarea in the AssessmentForm only checks for non-empty input. The user wants a minimum of 50 words.

## Changes in `src/components/contributor/AssessmentForm.tsx`

### 1. Add word count helper
Add a simple `countWords` utility: `str.trim().split(/\s+/).filter(Boolean).length`

### 2. Update step 4 validation (line 197-202)
After checking `whyJoin.trim()` is non-empty, also check `countWords(whyJoin) >= 50`. Show a toast like "Motivation must be at least 50 words" if too short.

### 3. Add live word count indicator on the textarea (line 273)
Below the "Why do you want to join UTAAB?" textarea, display a small helper text showing current word count vs. required minimum (e.g., "12/50 words"). Style it red when under 50, green/muted when met.

