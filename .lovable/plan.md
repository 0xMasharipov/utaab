

# Timing-Based Bot Detection: Consistent Request Interval Analysis

## Problem
Bots often send requests at perfectly consistent intervals (e.g., exactly every 30 seconds). Real humans have natural variation in their timing. The current system does not analyze request timing patterns -- it only counts requests within windows.

## How It Works

The system will query the last N requests from the same IP + User-Agent combination, calculate the time intervals between them, and check if those intervals are suspiciously consistent (low standard deviation). If detected, the IP + User-Agent pair gets auto-banned.

### Detection Logic

1. On each UTAAB verification request, query the **last 10 timestamps** from `utaab_verifications` for the same `ip_address` AND `user_agent`
2. Calculate the time intervals between consecutive requests
3. Compute the **coefficient of variation** (standard deviation / mean) of those intervals
4. If coefficient of variation is below a threshold (e.g., < 0.05, meaning intervals vary less than 5%), flag as bot
5. Auto-ban by inserting the IP into `ip_blacklist` with reason `"timing_pattern_bot"` and a 24-hour expiry
6. Log a security event with type `"timing_pattern_bot_detected"`

### Example
- 10 requests at intervals: 30.0s, 30.0s, 30.1s, 29.9s, 30.0s, 30.0s, 30.1s, 29.9s, 30.0s
- Mean: 30.0s, StdDev: ~0.07s, Coefficient of variation: 0.002 (way below 0.05)
- Result: **Banned**

A real human might have intervals like: 12s, 45s, 3s, 67s, 22s -- coefficient of variation would be very high.

## Configuration

```text
TIMING_ANALYSIS = {
  minRequests: 8,        -- need at least 8 requests to analyze
  lookbackMs: 600000,    -- look at last 10 minutes of requests
  cvThreshold: 0.05,     -- coefficient of variation below 5% = bot
  banDurationMs: 86400000 -- 24-hour ban
}
```

## Database Changes

No new tables needed. The system uses:
- `utaab_verifications` (already logs every request with `ip_address`, `user_agent`, `created_at`)
- `ip_blacklist` (already exists for banning IPs)
- `security_events` (already exists for logging)

One index will be added for performance:

```sql
CREATE INDEX idx_utaab_verifications_ip_ua_time 
  ON public.utaab_verifications(ip_address, user_agent, created_at DESC);
```

## Edge Function Changes

**File:** `supabase/functions/utaab-verify/index.ts`

### New function: `checkTimingPattern()`
- Queries `utaab_verifications` for the last 10 records matching `ip_address` + `user_agent` within the last 10 minutes
- Extracts timestamps and computes intervals
- Calculates coefficient of variation
- If below threshold and has enough samples:
  - Inserts into `ip_blacklist` (IP, reason: `"timing_pattern_bot: UA=<user_agent>"`, 24h expiry)
  - Logs `"timing_pattern_bot_detected"` security event with details (intervals, CV, user_agent)
  - Returns `{ botDetected: true }`

### Integration point
Called right after the IP blacklist check (line ~298) and before rate limiting. If `botDetected === true`, immediately return a 403 blocked response.

### New risk weight
- `consistentTimingPattern`: +50 risk (as a fallback if the pattern is borderline and doesn't trigger an outright ban)

## Technical Details

### Coefficient of Variation Formula
```text
intervals = [t2-t1, t3-t2, t4-t3, ...]
mean = sum(intervals) / count
variance = sum((interval - mean)^2) / count
stdDev = sqrt(variance)
cv = stdDev / mean

if cv < 0.05 AND count >= 8: BOT DETECTED
```

### Why CV and not just StdDev?
Standard deviation alone doesn't work because 1s intervals with 0.05s deviation is different from 60s intervals with 0.05s deviation. CV normalizes this, making it work regardless of the actual interval length.

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/utaab-verify/index.ts` | Add `checkTimingPattern()` function, integrate into main flow |
| Database migration | Add composite index on `utaab_verifications(ip_address, user_agent, created_at)` |

