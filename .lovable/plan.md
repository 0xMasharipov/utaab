

# DDoS Protection: Fingerprint + Global Rate Limiting

## Problem
Current rate limiting is IP-only. Attackers using rotating proxies bypass all limits since each IP stays under the threshold.

## Solution: Two New Defense Layers

### 1. Fingerprint-Based Rate Limiting
Rate-limit by `fingerprint_hash` in addition to IP. Same browser fingerprint (canvas, WebGL, screen, etc.) hitting the endpoint from different IPs gets caught.

- Reuse existing `utaab_rate_limits` table -- insert rows with `identifier` = fingerprint hash (currently only stores IP)
- Apply the same tiered escalation (10/min, 30/5min, 100/hr) to fingerprint identifiers
- If fingerprint is missing entirely, add +30 risk score (already done) and skip fingerprint rate limiting

### 2. Global Endpoint Rate Limiting
Cap total requests per endpoint across ALL IPs/fingerprints to detect distributed floods.

- New table `utaab_global_rate_limits` with columns: `id`, `endpoint`, `request_count`, `window_start`, `created_at`
- Config: 500 requests/minute globally per endpoint
- When exceeded: increase PoW difficulty for all new requests (adaptive), don't outright block
- Log a security event when global threshold is breached

### 3. Adaptive PoW Escalation
When global rate is elevated (>80% of limit), force PoW on ALL requests regardless of risk score -- makes flooding computationally expensive.

## Database Migration

```sql
CREATE TABLE public.utaab_global_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.utaab_global_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage global rate limits"
  ON public.utaab_global_rate_limits FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view global rate limits"
  ON public.utaab_global_rate_limits FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
```

## Edge Function Changes

**File:** `supabase/functions/utaab-verify/index.ts`

### New config constants:
```text
GLOBAL_RATE_LIMIT = { limit: 500, windowMs: 60000 }
FINGERPRINT_RATE_LIMIT uses same tiers as IP
```

### Logic additions (after IP rate limiting, before risk calculation):

1. **Fingerprint rate limiting** -- duplicate the IP rate-limit loop but with `identifier = fingerprint.hash` (skip if no fingerprint)
2. **Global endpoint rate limiting** -- query `utaab_global_rate_limits` for the endpoint within the window; increment or insert; if >80% of limit, set `globalPressure = true`
3. **Adaptive PoW** -- if `globalPressure`, force minimum PoW difficulty of 3 on all requests regardless of risk score
4. **Security event logging** -- when global limit is breached, call `log_security_event` with type `'ddos_global_limit'`

### Risk score addition:
- `fingerprintRateLimitViolation`: +25 risk
- `globalPressure`: +15 risk

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/utaab-verify/index.ts` | Add fingerprint rate limiting, global rate limiting, adaptive PoW |
| Database migration | Create `utaab_global_rate_limits` table with RLS |

