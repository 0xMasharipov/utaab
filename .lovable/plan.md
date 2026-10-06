# Fix email codes (admin, student sign-in and register) and MIT course playback

## What I found
- The email domain `notify.utaab.org` is verified, and branded auth emails are switched on.
- No emails at all have been delivered in the last 14 days. The email sender and the student signup service show no activity, so nothing is reaching them.
- The services do respond. The likely cause is that the live versions are outdated or never received sign-in requests. I haven't confirmed this yet.
- The MIT lecture video files still load from their source. So the playback problem is probably on the site itself (player or browser security rules), not missing videos. Also not confirmed yet.

## Steps
1. **Emails**
   - Redeploy the auth email sender, the student signup service and the resend-code service, so the live versions match the code.
   - Trigger a test code for the admin sign-in and for a throwaway student signup. Then check the delivery history and service logs to confirm the email went out.
   - If nothing is sent, check the sign-in email settings and the sending limit, and fix whatever blocks it. If the student form calls the wrong service or hides an error, fix that too.
2. **MIT courses**
   - Open the course page in a test browser, press play, and record any player or security errors.
   - Fix the cause. The likely candidates are:
     - Security rules blocking the video's redirect host.
     - A player bug in the custom video player.
     - Switching the video links to the stable `archive.org/download/...` addresses instead of one fixed server.
3. Check again that:
   - an admin code arrives,
   - a student can register and receive a code, and
   - lecture 1 plays.

## Technical notes
- Functions: `auth-email-hook`, `education-signup`, `education-resend-otp`. The sending library is already pinned at `@lovable.dev/email-js@0.1.0`, so update it to the current version if the send fails.
- Videos: `src/data/mitOcwLectures.ts` uses 23 links to `dn720003.ca.archive.org`. The player is `VideoPlayer.tsx` / `AppleStyleVideoPlayer.tsx`. The browser security rules are set in `index.html`.
