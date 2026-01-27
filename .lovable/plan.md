

## Plan: Remove New Year/Holiday Effects

### Overview
Remove all holiday-related visual effects (snowfall animation and Christmas lights) from the application.

---

### Changes Required

#### 1. Delete Holiday Component Files
Remove the entire holiday components directory:

| File | Action |
|------|--------|
| `src/components/holiday/Snowfall.tsx` | Delete |
| `src/components/holiday/ChristmasLights.tsx` | Delete |
| `src/components/holiday/HolidayEffects.tsx` | Delete |

---

#### 2. Update Index Page
**File:** `src/pages/Index.tsx`

- Remove the import of `HolidayEffects` (line 15)
- Remove the `<HolidayEffects />` component from the JSX (line 22)

---

#### 3. Update Navbar
**File:** `src/components/Navbar.tsx`

- Remove the import of `ChristmasLights` (line 15)
- Remove the Christmas lights wrapper div from the JSX (lines 143-146):
  ```tsx
  {/* Christmas LED Lights */}
  <div className="absolute inset-x-4 -top-1 pointer-events-none z-10">
    <ChristmasLights />
  </div>
  ```

---

#### 4. Clean Up CSS Animations
**File:** `src/index.css`

Remove the holiday-specific CSS (lines 245-290):
- `@keyframes snowfall` animation
- `@keyframes led-pulse` animation
- `.snowflake` and `.led-bulb` reduced motion overrides

---

### Summary of Files to Modify

| File | Action |
|------|--------|
| `src/components/holiday/Snowfall.tsx` | **Delete** |
| `src/components/holiday/ChristmasLights.tsx` | **Delete** |
| `src/components/holiday/HolidayEffects.tsx` | **Delete** |
| `src/pages/Index.tsx` | Remove import and component usage |
| `src/components/Navbar.tsx` | Remove import and component usage |
| `src/index.css` | Remove snowfall and LED pulse animations |

---

### Result
After these changes, the application will no longer display:
- Falling snowflakes on the main page
- Christmas LED lights on the navbar

The application will return to its standard appearance without any seasonal decorations.

