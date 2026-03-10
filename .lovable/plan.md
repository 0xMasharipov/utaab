

# Center the MENU Button and Language Selector in the Navbar

## Change

Switch the navbar layout from `justify-between` (logo left, controls right) to a 3-part layout: logo left, language selector + MENU button centered, and an empty right spacer for balance.

## File: `src/components/Navbar.tsx`

### Line 138: Change flex layout
Replace `justify-between` with `justify-between` kept but restructure into 3 equal sections:
- Left: Logo (with `flex-1 justify-start`)
- Center: Language selector + MENU button group (centered)
- Right: Empty spacer (with `flex-1 justify-end`) to balance the logo

### Specific changes:
1. **Line 138**: Change the inner flex container to use 3 children with `flex-1` on left and right
2. **Line 145**: Add `flex-1` to logo wrapper
3. **Line 166**: Remove `flex-shrink-0`, keep the control group but center it (no `flex-1`, just centered naturally)
4. Add an empty `<div className="flex-1" />` spacer after the controls group

This creates: `[Logo — flex-1] [Lang + MENU — auto] [spacer — flex-1]`

