import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { z } from 'https://esm.sh/zod@3.23.8';
import { getCorsHeaders } from '../_shared/cors.ts';
import { SignupEmail } from '../_shared/email-templates/signup.tsx';

const SITE_NAME = 'utaab';
const SITE_URL = 'https://utaab.org';
const SENDER_DOMAIN = 'notify.utaab.org';
const FROM_DOMAIN = 'utaab.org';

const FocusArea = z.string().min(1).max(80);

const BodySchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(200),
  full_name: z.string().trim().min(1).max(200),
  preferred_language: z.string().trim().min(2).max(8),
  department: z.string().trim().min(1).max(200),
  role: z.enum(['student', 'instructor']),
  focus_areas: z.array(FocusArea).min(1).max(40),
  kvkk_consent: z.literal(true),
  email_course_updates: z.boolean().optional().default(false),
  email_newsletters: z.boolean().optional().default(false),
  email_marketing: z.boolean().optional().default(false),
  locale: z.string().trim().min(2).max(8).optional(),
  email_redirect_to: z.string().url().optional(),
});

function jsonResponse(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
  });
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getOrCreateUnsubscribeToken(
  admin: ReturnType<typeof createClient>,
  email: string,
): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  const { data: existingToken, error: lookupErr } = await admin
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (lookupErr) {
    console.error('unsubscribe token lookup failed', lookupErr);
    return null;
  }

  if (existingToken && !existingToken.used_at) return existingToken.token;

  const token = generateToken();
  const { error: insertErr } = await admin
    .from('email_unsubscribe_tokens')
    .upsert(
      { token, email: normalizedEmail },
      { onConflict: 'email', ignoreDuplicates: true },
    );

  if (insertErr) {
    console.error('unsubscribe token insert failed', insertErr);
    return null;
  }

  const { data: storedToken, error: rereadErr } = await admin
    .from('email_unsubscribe_tokens')
    .select('token')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (rereadErr || !storedToken?.token) {
    console.error('unsubscribe token reread failed', rereadErr);
    return null;
  }

  return storedToken.token;
}

async function generateConfirmationLink(
  admin: ReturnType<typeof createClient>,
  email: string,
  password: string,
  redirectTo: string,
): Promise<string | null> {
  const { data: signupLink, error: signupLinkErr } = await admin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: { redirectTo },
  });

  const actionLink = signupLink?.properties?.action_link;
  if (actionLink) return actionLink;

  console.error('generateLink signup failed', signupLinkErr);

  const { data: magicLink, error: magicLinkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  });

  const fallbackLink = magicLink?.properties?.action_link;
  if (fallbackLink) return fallbackLink;

  console.error('generateLink fallback failed', magicLinkErr);
  return null;
}

async function enqueueSignupEmail(
  admin: ReturnType<typeof createClient>,
  email: string,
  confirmationUrl: string,
): Promise<boolean> {
  const templateProps = {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    recipient: email,
    confirmationUrl,
  };

  const html = await renderAsync(React.createElement(SignupEmail, templateProps));
  const text = await renderAsync(React.createElement(SignupEmail, templateProps), {
    plainText: true,
  });
  const messageId = crypto.randomUUID();
  const unsubscribeToken = await getOrCreateUnsubscribeToken(admin, email);

  if (!unsubscribeToken) return false;

  const { error: logErr } = await admin.from('email_send_log').insert({
    message_id: messageId,
    template_name: 'signup',
    recipient_email: email,
    status: 'pending',
  });

  if (logErr) {
    console.error('signup email log failed', logErr);
    return false;
  }

  const { error: enqueueErr } = await admin.rpc('enqueue_email', {
    queue_name: 'auth_emails',
    payload: {
      message_id: messageId,
      to: email,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: 'Confirm your email',
      html,
      text,
      purpose: 'transactional',
      label: 'signup',
      idempotency_key: `education-signup-${messageId}`,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueErr) {
    console.error('signup email enqueue failed', enqueueErr);
    return false;
  }

  return true;
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

    const data = parsed.data;
    const email = data.email.trim().toLowerCase();
    const redirectTo = data.email_redirect_to ?? 'https://utaab.org/education';

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Look up existing user by email (paginated; capped to keep cost bounded).
    let existingUser: { id: string; email_confirmed_at?: string | null } | null = null;
    for (let page = 1; page <= 10; page++) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (listErr) {
        console.error('listUsers failed', listErr);
        return jsonResponse(req, { error: 'Signup failed' }, 500);
      }
      const found = list.users.find(
        (u) => (u.email ?? '').toLowerCase() === email
      );
      if (found) {
        existingUser = {
          id: found.id,
          email_confirmed_at: (found as any).email_confirmed_at ?? null,
        };
        break;
      }
      if (list.users.length < 1000) break;
    }

    let userId: string;
    let alreadyExisted = false;
    let needsEmailConfirmation = true;
    let emailSent = false;

    if (existingUser) {
      alreadyExisted = true;
      userId = existingUser.id;
      needsEmailConfirmation = !existingUser.email_confirmed_at;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: data.password,
        email_confirm: false,
        user_metadata: { full_name: data.full_name },
      });
      if (createErr || !created.user) {
        console.error('createUser failed', createErr);
        return jsonResponse(req, { error: 'Signup failed' }, 500);
      }
      userId = created.user.id;
    }

    if (needsEmailConfirmation) {
      const confirmationUrl = await generateConfirmationLink(admin, email, data.password, redirectTo);
      if (confirmationUrl) {
        emailSent = await enqueueSignupEmail(admin, email, confirmationUrl);
      }
    }

    // Ensure the education profile exists. Service-role bypasses RLS safely.
    const { data: profileRow } = await admin
      .from('education_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profileRow) {
      const { error: profileErr } = await admin.from('education_profiles').insert({
        user_id: userId,
        full_name: data.full_name,
        preferred_language: data.preferred_language,
        department: data.department,
        role: data.role,
        focus_areas: data.focus_areas,
        kvkk_consent: true,
        kvkk_consent_version: '1.0',
        email_course_updates: !!data.email_course_updates,
        email_newsletters: !!data.email_newsletters,
        email_marketing: !!data.email_marketing,
        locale: data.locale ?? data.preferred_language,
      });
      if (profileErr) {
        console.error('profile insert failed', profileErr);
        // Don't fail the whole signup — auth user already exists.
      }
    }

    return jsonResponse(req, {
      success: true,
      already_existed: alreadyExisted,
      needs_email_confirmation: needsEmailConfirmation,
      email_sent: emailSent,
    });
  } catch (err) {
    console.error('education-signup error', err);
    return jsonResponse(req, { error: 'Signup failed' }, 500);
  }
});
