import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { getCorsHeaders } from '../_shared/cors.ts';
import { sendSignupEmail, resolveRedirect } from '../_shared/signup-email.ts';

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

async function generateConfirmation(
  admin: ReturnType<typeof createClient>,
  email: string,
  password: string,
  redirectTo: string,
): Promise<{ url: string; otp: string | null } | null> {
  const { data: signupLink, error: signupLinkErr } = await admin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: { redirectTo },
  });

  const actionLink = signupLink?.properties?.action_link;
  if (actionLink) {
    return { url: actionLink, otp: signupLink?.properties?.email_otp ?? null };
  }

  console.error('generateLink signup failed', signupLinkErr);

  const { data: magicLink, error: magicLinkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  });

  const fallbackLink = magicLink?.properties?.action_link;
  if (fallbackLink) {
    return { url: fallbackLink, otp: magicLink?.properties?.email_otp ?? null };
  }

  console.error('generateLink fallback failed', magicLinkErr);
  return null;
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
    const redirectTo = resolveRedirect(data.email_redirect_to);

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
    let hasCode = false;

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
      const confirmation = await generateConfirmation(admin, email, data.password, redirectTo);
      if (confirmation) {
        hasCode = !!confirmation.otp;
        emailSent = await sendSignupEmail(admin, email, confirmation.url, confirmation.otp);
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
      confirmation_mode: hasCode ? 'code' : 'link',
    });
  } catch (err) {
    console.error('education-signup error', err);
    return jsonResponse(req, { error: 'Signup failed' }, 500);
  }
});
