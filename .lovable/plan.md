

# Update Team Page with Real Photos and Refined Design

## Photo Mapping
Based on the uploaded images and your description:
- **UTAAB_Profile_Z.png** --> Zinurbek Masharipov (Founder)
- **UTAAB_Profile_Umut.png** --> Umut Tekbas (HR Manager)
- **UTAAB_Profile_Abdulla.png** --> Abdulla Hamzali (Head of Engineering)
- **UTAAB_Profile_Emre.png** --> Yunus Emre Ercin (CTO)

Note: Abdulbaki (CFO) does not have a photo -- will keep the icon placeholder for him.

## Changes

### 1. Copy Photos to Project
Save all 4 uploaded images to `src/assets/team/` for proper bundling:
- `src/assets/team/zinurbek.png`
- `src/assets/team/umut.png`
- `src/assets/team/abdulla.png`
- `src/assets/team/yunus.png`

### 2. Redesign TeamPage (`src/pages/TeamPage.tsx`)
Aesthetic refinements:
- **Founder featured card**: Zinurbek gets a larger, hero-style card at the top spanning full width with a horizontal layout (photo left, info right) and an accent border glow
- **Leadership grid below**: Remaining 4 members in a 2x2 grid (or 4-column on large screens) with circular photos that have a subtle gradient ring border
- **Photo styling**: `object-cover` with a glassmorphic ring border, hover scale effect
- **Card polish**: Slightly larger padding, refined typography hierarchy, subtle gradient overlay on hover
- **Remove the generic User icon** for members who have photos; keep it only for Abdulbaki

### 3. Update Team Component (`src/components/Team.tsx`)
- Add the same photo data to the homepage team section cards
- Replace the User icon placeholder with actual photos where available
- Keep the compact card style but swap icons for circular profile images

### 4. Update teamMembers Data
Add an `image` field to each member object pointing to the imported asset, so both `Team.tsx` and `TeamPage.tsx` can use it.

## Technical Details

### File changes:
| File | Change |
|------|--------|
| `src/assets/team/zinurbek.png` | Copy from uploaded image |
| `src/assets/team/umut.png` | Copy from uploaded image |
| `src/assets/team/abdulla.png` | Copy from uploaded image |
| `src/assets/team/yunus.png` | Copy from uploaded image |
| `src/pages/TeamPage.tsx` | Redesign with featured founder card, real photos, refined glassmorphism styling |
| `src/components/Team.tsx` | Add real photos to homepage team cards |

### Design Details
- Photos use `rounded-full` with a 2px gradient border ring (`border-accent/30`)
- Founder card: horizontal layout with `lg:flex-row`, larger photo (160x160), accent glow shadow
- Other cards: centered vertical layout, 112x112 photos
- Hover effects: photo scales slightly (`group-hover:scale-105`), border brightens
- Fallback: Members without photos show the existing User icon in the glass circle

