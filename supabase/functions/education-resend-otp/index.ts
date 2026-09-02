import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { getCorsHeaders } from '../_shared/cors.ts';
import { enqueueSignupEmail, resolveRedirect } from '../_shared/signup-email.ts';

const BodySchema = z.object({
  email: z.string().trim().email().max(254),
  email_redirect_to: z.string().url().optional(),
});

function jsonResponse(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return jsonResponse(req, { error: 'Method not allowed' }, 405);
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonResponse(req, { error: 'Invalid request' }, 400);
    }

    const email = parsed.data.email.trim().toLowerCase();
    const redirectTo = resolveRedirect(parsed.data.email_redirect_to);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } },
    );

    // Audit trail for resend attempts.
    const { error: logErr } = await admin.rpc('log_security_event', {
      _event_type: 'education_otp_resend',
      _severity: 'low',
      _endpoint: 'education-resend-otp',
      _details: { email },
    });
    if (logErr) console.error('resend logging failed', logErr);

    // A magic link for an unconfirmed user both confirms the address and signs in.
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo },
    });

    const actionLink = link?.properties?.action_link;
    if (!actionLink) {
      console.error('resend generateLink failed', linkErr);
      // Do not disclose whether the account exists.
      return jsonResponse(req, { success: true, email_sent: false });
    }

    const otp = link?.properties?.email_otp ?? null;
    const emailSent = await enqueueSignupEmail(admin, email, actionLink, otp);

    return jsonResponse(req, {
      success: true,
      email_sent: emailSent,
      confirmation_mode: otp ? 'code' : 'link',
    });
  } catch (err) {
    console.error('education-resend-otp error', err);
    return jsonResponse(req, { error: 'Resend failed' }, 500);
  }
});
