Fix overflow on phone mock screens and rebuild the Dashboard mock from scratch to match the other screens' style.

### 1. Overflow fix
The screen container has `overflow-hidden`, but several mock kinds (wallet, leaderboard, events, analytics) place padded content tall enough to push past the rounded screen. Add `overflow-hidden` to each `h-full flex flex-col` wrapper so content visually clips inside the rounded screen edges.

### 2. Rebuild `kind === 'real'` (Dashboard)
Currently just renders the raw `mockupAsset` PNG which doesn't match the cohesive in-frame style. Rebuild as a designed dashboard:

- `Header` (logo + UBP balance — same as others)
- "Good morning" greeting + name row
- Big balance card: gradient blue, "Total UBP", "200.00", small "+50 this week" delta with up-arrow
- Quick action row: 3 small pill buttons (Earn / Redeem / Send) with icons
- "Recent activity" list: 3 rows with icon + label + amount (e.g. +50 Hackathon, +25 Workshop, -100 Reward)
- "Daily streak" mini-card: small flame icon + "5 day streak"

Same compact `text-[10px]`/`text-[11px]` typography, `bg-blue-50/60` accents, `rounded-xl`, matching the other kinds. Wrap in `h-full flex flex-col overflow-hidden`.

No other changes.