
# Fix Team Page Card Design: Overlap, Contrast, and Readability

## Problems
1. Info card covers too much of the portrait (face area)
2. Light glass background (`bg-white/0.08`) makes text unreadable
3. Too much content crammed into info card
4. Stacked blur effects create muddy visuals
5. Image gradient overlay not strong enough at bottom

## Changes

### 1. `src/components/team/TeamOverlapCard.tsx` (major rework)

**Image gradient overlay** -- replace the current weak gradient with a stronger bottom-focused one:
```
linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 70%)
```
This darkens only the lower portion, keeping faces clear.

**Info card positioning** -- constrain to lower 30-35% of the image card:
- Remove `pb-4 pr-4` / `pb-5 pr-5` / `pb-6 pr-6` padding hack from the outer wrapper (currently used to create overflow space)
- Instead, position the info card inside the image card bounds, anchored to the bottom-right with small margin
- Use `bottom-3 right-3` (desktop: `bottom-4 right-4`) so it sits in the darkened gradient zone

**Info card styling** -- switch from light glass to dark glass:
- Background: `rgba(10, 18, 40, 0.62)` instead of `rgba(255,255,255,0.08)`
- Backdrop blur: `blur(12px)` instead of `blur(14px)`
- Border: `rgba(148, 163, 184, 0.20)`
- Box shadow: `0 10px 30px rgba(0,0,0,0.35)`
- Max height: `max-h-[140px]` desktop, `max-h-[120px]` mobile
- Width: `w-[65%] sm:w-[52%] lg:w-[48%]`

**Text colors** -- enforce high-contrast values:
- Name: `#F8FAFC` (near-white), 16-20px, weight 700
- Role: `#93C5FD` (light blue), 12-13px, weight 600
- Bio: `rgba(226,232,240,0.78)`, 12px, `line-clamp-2`

**Remove LinkedIn button** from card (keep it only in the modal/drawer to reduce clutter).

**Hover state**:
- Info card background strengthens to `rgba(10,18,40,0.72)`
- Image gets `scale(1.02)` zoom
- Border brightens

**Image card** -- remove `overflow-hidden` on the outer wrapper since the info card no longer overflows. The image card div itself keeps `overflow-hidden`.

### 2. `src/pages/TeamPage.tsx` (minor)

Increase grid gap: `gap-6 sm:gap-7 lg:gap-8` (from `gap-4 sm:gap-5 lg:gap-7`).

### 3. `src/components/team/TeamProfileModal.tsx` (minor polish)

- Update modal content background to match dark glass: `rgba(10, 18, 40, 0.85)` with `blur(20px)`
- Text colors: name `#F8FAFC`, role `#93C5FD`, bio `rgba(226,232,240,0.78)`

## Technical Details

### TeamOverlapCard structure (after fix)

```text
<motion.div>                          (no extra padding for overflow)
  <div class="relative aspect-[4/5]  (image card, overflow-hidden, rounded-[28px])
    <AnimatedImage />                 (portrait photo)
    <div />                           (bottom gradient overlay, z-10)
    <div class="info-card             (z-20, absolute bottom-3 right-3)
              max-h-[140px]           (constrained height)
              w-[48%]                 (narrower width)
              bg-[rgba(10,18,40,0.62)](dark glass)
              backdrop-blur-[12px]    (reduced blur)
      <span>Tag</span>
      <h3>Name</h3>                   (color: #F8FAFC)
      <p>Role</p>                     (color: #93C5FD)
      <p>Bio (2 lines)</p>            (color: rgba(226,232,240,0.78))
    </div>
  </div>
</motion.div>
```

### Key CSS values

| Property | Value |
|----------|-------|
| Info card bg | `rgba(10, 18, 40, 0.62)` |
| Info card blur | `blur(12px)` |
| Info card border | `1px solid rgba(148, 163, 184, 0.20)` |
| Info card shadow | `0 10px 30px rgba(0,0,0,0.35)` |
| Info card max-height | 140px desktop / 120px mobile |
| Info card width | 65% mobile / 52% tablet / 48% desktop |
| Image gradient | `linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 70%)` |
| Name color | `#F8FAFC` |
| Role color | `#93C5FD` |
| Bio color | `rgba(226,232,240,0.78)` |
| Hover bg | `rgba(10,18,40,0.72)` |
| Hover image | `scale(1.02)` |

### Files Modified

| File | Change |
|------|--------|
| `src/components/team/TeamOverlapCard.tsx` | Rework info card position, dark glass bg, text colors, remove LinkedIn button, hover states |
| `src/pages/TeamPage.tsx` | Increase grid gap |
| `src/components/team/TeamProfileModal.tsx` | Match dark glass styling, fix text colors |
