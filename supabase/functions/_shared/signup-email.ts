import * as React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { SignupEmail } from './email-templates/signup.tsx';

export const SITE_NAME = 'utaab';
export const SITE_URL = 'https://utaab.org';
export const SENDER_DOMAIN = 'notify.utaab.org';
export const FROM_DOMAIN = 'utaab.org';

// deno-lint-ignore no-explicit-any
type Admin = any;

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getOrCreateUnsubscribeToken(
  admin: Admin,
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

/**
 * Renders and enqueues the branded signup confirmation email.
 * When `otpCode` is provided, the email includes a 6-digit verification code
 * in addition to the confirmation button.
 */
export async function enqueueSignupEmail(
  admin: Admin,
  email: string,
  confirmationUrl: string,
  otpCode?: string | null,
): Promise<boolean> {
  const templateProps = {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    recipient: email,
    confirmationUrl,
    token: otpCode ?? undefined,
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

export const ALLOWED_REDIRECT_ORIGINS = new Set([
  'https://utaab.org',
  'https://www.utaab.org',
  'https://utaab.lovable.app',
]);

export function resolveRedirect(candidate?: string): string {
  const fallback = 'https://utaab.org/education';
  if (!candidate) return fallback;
  try {
    const parsedUrl = new URL(candidate);
    if (ALLOWED_REDIRECT_ORIGINS.has(parsedUrl.origin)) return candidate;
  } catch {
    // ignore
  }
  return fallback;
}
