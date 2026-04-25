## Add live site visit metrics + countries panel & swap admin login icon to UTAAB logo

### Goals
1. Track every public site visit (page view) and surface a live "Site Traffic" panel on the admin dashboard at `/v8k2m9x4/p3` showing total visits, today, last 24h, unique visitors, plus a top-countries list with flags and a 7-day visits chart.
2. Replace the round Shield icon on the admin sign-in card (`/j3r7x1w9`) with the provided UTAAB diamond logo (`UTAAB_LOGO.png`), resized and fitted cleanly inside the same circular badge.

---

### Part 1 — Site visit tracking

**New table `public.site_visits`** (created via migration):
- `id uuid pk default gen_random_uuid()`
- `created_at timestamptz default now()`
- `path text` — page path (e.g. `/`, `/blog/...`)
- `referrer text` — document.referrer
- `country_code text` — 2-letter ISO from edge geo (e.g. `TR`, `US`)
- `country_name text`
- `city text` (nullable)
- `visitor_hash text` — SHA-256(IP + UA + day-salt) so we can count uniques without storing PII
- `user_agent text` — truncated to 256 chars
- `is_bot boolean default false`

**RLS**: enable; only admins (via `has_role(auth.uid(), 'admin')`) can `SELECT`. No client-side INSERT — all writes go through an edge function with the service role.

**Indexes**: `created_at desc`, `country_code`, `(visitor_hash, created_at)` for unique counting.

**New edge function `track-visit`** (public, no JWT required, `verify_jwt = false`):
- Reads `cf-connecting-ip` / `x-forwarded-for` and Cloudflare/Deno geo headers (`cf-ipcountry`, `x-vercel-ip-country`, falling back to a free IP geo lookup `https://ipapi.co/{ip}/json/` with a 1.5s timeout and graceful failure).
- Computes `visitor_hash = sha256(ip + ua + YYYY-MM-DD + SALT)` (salt from env `VISIT_TRACK_SALT`).
- Filters obvious bots via UA regex (`bot|crawler|spider|crawling|preview|lighthouse|headless`), still inserts but flagged with `is_bot=true` so they can be excluded from charts.
- Inserts one row using service-role client.
- Strict CORS allowlist matching existing functions (`utaab.org`, `www.utaab.org`, `*.lovableproject.com`).
- Returns `{ ok: true }`; never blocks the page (called fire-and-forget).

**New client hook `src/hooks/usePageViewTracker.ts`**:
- Uses `useLocation()`; on every route change calls `supabase.functions.invoke('track-visit', { body: { path, referrer } })`.
- Skips tracking for `/v8k2m9x4/*`, `/j3r7x1w9`, `/profile/admin` and any path starting with admin-route patterns from `src/config/routes.ts`.
- Debounces duplicate fires within 1s for the same path (StrictMode safety).
- Wrapped at the top of `src/App.tsx` inside the router so it runs once globally.

**Extend `admin-stats` edge function** with a `traffic` block:
- `totalVisits` (all-time, excludes bots)
- `visitsToday` (since local-day start UTC)
- `visitsLast24h`
- `uniqueVisitors24h` (distinct `visitor_hash` in last 24h)
- `topCountries`: `[{ country_code, country_name, visits }]` top 10 from last 30 days
- `dailyVisits`: 7-day series `[{ date, visits, unique_visitors }]`

Done in parallel with the existing `Promise.all` and added to the returned `stats` object.

**Dashboard UI (`AdminDashboard.tsx`)** — new section "Site Traffic" inserted between "System Health" and "Content Metrics":
- 4 stat cards (lucide icons): `Globe` Total Visits, `Eye` Visits Today, `Activity` Last 24h, `Users` Unique Visitors 24h — uses existing `AnimatedStat` + `glass-panel` styling.
- "Top Countries" card: ranked list with flag emoji (derived from country_code) + country name + visit count + thin progress bar relative to the top entry.
- 7-day visits area chart styled identically to the existing System Metrics chart (recharts, `hsl(var(--primary))` for visits, secondary color for unique visitors).
- Realtime: subscribe to `INSERT` on `site_visits` and increment `traffic.totalVisits`, `visitsToday`, `visitsLast24h` so the panel ticks up live (matches the existing real-time pattern for other tables).

**Performance / privacy**:
- Salt rotates daily so `visitor_hash` cannot link visits across days → GDPR/KVKK-friendly, no raw IP stored.
- IP never persisted; only hashed.
- Tracking call is async fire-and-forget — no impact on page load.
- A single index on `created_at desc` keeps queries fast; old rows can later be pruned via cron if needed.

---

### Part 2 — Admin sign-in icon swap

1. Copy `user-uploads://UTAAB_LOGO.png` → `src/assets/utaab-logo-diamond.png`.
2. In `src/pages/admin/AdminLogin.tsx`:
   - Import the asset: `import utaabLogo from "@/assets/utaab-logo-diamond.png"`.
   - Replace the `<Shield className="w-8 h-8 text-primary" />` element (inside the `mx-auto w-16 h-16 rounded-full bg-primary/10 …` wrapper) with an `<img src={utaabLogo} alt="UTAAB" className="w-10 h-10 object-contain" />`. The diamond is already cropped close, so `w-10 h-10` fits cleanly inside the 16×16 (64px) circle with breathing room.
   - Remove the now-unused `Shield` import.
3. Leave the OTP screen's `Mail` icon unchanged (only the initial sign-in card uses Shield).

---

### Files

**New**
- `src/hooks/usePageViewTracker.ts`
- `src/assets/utaab-logo-diamond.png` (copied from upload)
- `supabase/functions/track-visit/index.ts`

**Modified**
- `src/App.tsx` — mount the page view tracker
- `src/pages/admin/AdminLogin.tsx` — swap icon for logo image
- `src/pages/admin/AdminDashboard.tsx` — add Site Traffic section + countries + chart, extend realtime subscription
- `supabase/functions/admin-stats/index.ts` — add traffic aggregations

**Database migration**
- Create `site_visits` table + RLS policies + indexes
- Add `site_visits` to `supabase_realtime` publication

**Secret**
- `VISIT_TRACK_SALT` — random string for visitor hashing (will be requested via `add_secret` during implementation).

### Risk: low
- Tracker is opt-in-style: skipped on admin routes, fire-and-forget, can't block UI.
- All schema additions are additive; existing dashboard sections are untouched.
- Icon swap is purely cosmetic.