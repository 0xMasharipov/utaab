# Switch CUTII AI chat to Grok

## Changes
- Replace the current Gemini request in the CUTII student assistant with xAI’s Grok API, using the saved `GROK_API_KEY` only inside the protected chat service.
- Use the current Grok text model and keep the existing CUTII teaching instructions, course context, sign-in checks, bot protection, prompt-injection checks, and per-user limits.
- Preserve the chat’s current response format so the student interface does not need to change.
- Return safe, useful provider errors without exposing credentials or internal details.

## Verification
- Publish the updated CUTII chat service.
- Send an authenticated test question and confirm Grok returns a usable answer.
- Check service logs and the site health after deployment.

## Technical details
- Call xAI’s OpenAI-compatible API from the existing server-side function with `grok-4.7`.
- Keep the API key out of browser code and avoid changes to unrelated AI features.
