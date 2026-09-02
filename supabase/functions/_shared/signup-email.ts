import { sendTemplateEmail } from './transactional-email-templates/send-email.ts';

export const SITE_NAME = 'utaab';
export const SITE_URL = 'https://utaab.org';
export const SENDER_DOMAIN = 'notify.utaab.org';
export const FROM_DOMAIN = 'utaab.org';

// deno-lint-ignore no-explicit-any
type Admin = any;

async function logSend(
  admin: Admin,
  row: {
    message_id: string | null;
    recipient_email: string;
    status: 'sent' | 'suppressed' | 'failed';
    error_message?: string;
  },
): Promise<void> {
  const { error } = await admin.from('email_send_log').insert({
    template_name: 'signup',
    ...row,
  });
  if (error) {
    console.error('signup email log write failed', {
      code: error.code,
      message: error.message,
    });
  }
}

/**
 * Renders and sends the branded signup confirmation email through Lovable's
 * managed email delivery. When `otpCode` is provided, the email includes a
 * 6-digit verification code in addition to the confirmation button.
 */
export async function sendSignupEmail(
  admin: Admin,
  email: string,
  confirmationUrl: string,
  otpCode?: string | null,
): Promise<boolean> {
  const messageId = crypto.randomUUID();

  try {
    const result = await sendTemplateEmail('signup-confirmation', email, {
      templateData: {
        siteName: SITE_NAME,
        siteUrl: SITE_URL,
        recipient: email,
        confirmationUrl,
        token: otpCode ?? undefined,
      },
      idempotencyKey: `education-signup-${messageId}`,
    });

    if (!result.sent) {
      await logSend(admin, {
        message_id: messageId,
        recipient_email: email,
        status: 'suppressed',
      });
      return false;
    }

    await logSend(admin, {
      message_id: messageId,
      recipient_email: email,
      status: 'sent',
    });
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('signup email send failed', message);
    await logSend(admin, {
      message_id: messageId,
      recipient_email: email,
      status: 'failed',
      error_message: message.slice(0, 1000),
    });
    return false;
  }
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
