# Data exposure audit and hardening

## What I already checked

I ran a live check on the database before writing this plan. Facts confirmed right now:

- Row Level Security is **enabled on every table** in the public schema. Nothing is openly readable just because the API key is public.
- Student data (`education_profiles`) is readable only by the owning user or an admin. Applications, KVKK requests, contributor assessments and certificate participants are **admin-only**.
- Email logs, unsubscribe tokens and admin sessions are restricted to server-side (service role) access.
- The security scan returned **one real issue**: any signed-in user can insert a row into `certificates` for themselves for any course — certificate forgery, not a data leak.

So there is no open door in the database that would hand out names and emails. That does not prove nothing happened — it means if data left, it left through a different path (an admin account, a leaked key, or a scraped public page). That's what the audit below is for.

## Step 1 — Forensic audit (no changes to the app)

Look for evidence of actual access:

1. Auth logs: sign-ins, failed sign-ins, password resets and token refreshes over the retained window, grouped by IP and account. Flag any admin sign-in from an unfamiliar IP or country.
2. `login_history` and `admin_sessions`: who signed in, from where, and whether any admin session is still open.
3. `audit_log`: every admin action recorded, looking for bulk reads/exports or role changes.
4. `security_events` and `site_visits`: request spikes, scraping patterns, repeated hits on data endpoints.
5. API logs: unusual volumes of requests against the profile/application endpoints, and any request pattern consistent with an enumeration/scrape.
6. `user_roles`: confirm nobody has been silently granted `admin`.

Output: a short written finding — either "no evidence of unauthorized access" or a concrete list of what was accessed, by whom, and when.

## Step 2 — Fix the confirmed weakness

- Remove the client-side self-insert policy on `certificates` and move issuance to a server-side path that verifies course completion first. This is a real forgery hole regardless of the breach question.

## Step 3 — Hardening (recommended regardless of audit outcome)

- Tighten table privileges so `anon` and `authenticated` only hold the specific privileges their policies actually need, instead of the current blanket grants. RLS already blocks access, but this removes the second line of failure.
- Confirm every edge function that touches personal data verifies `has_role(auth.uid(), 'admin')` before returning rows, and never returns raw errors.
- Verify admin 2FA is enforced on every admin entry point, and that admin sessions expire.
- Confirm no personal data is reachable through any public page, sitemap, or unauthenticated endpoint.

## Step 4 — Only if the audit finds real unauthorized access

Executed as a separate, explicitly approved step:

- Rotate API keys and the email/service secrets.
- Invalidate all sessions (everyone signs in again) and force admin password resets.
- Notify affected users. Under KVKK, a personal-data breach must be reported to the KVKK authority "as soon as possible" (72 hours) and affected people informed — the app already has a KVKK request flow, so this is a communication step, not a code one.

## Technical notes

- Steps 1 is read-only: log queries and table reads, no schema or data changes.
- Step 2 is one migration replacing the `certificates` INSERT policy, plus routing issuance through the existing admin certificate edge function.
- Step 3's grant tightening is one migration; it changes no application behaviour if the policies are correct, so it needs a pass over admin pages afterwards to confirm nothing broke.
- No key rotation, session invalidation or password resets happen without a separate go-ahead — those log everyone out.
