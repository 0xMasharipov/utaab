// Shared CORS helper for all browser-callable edge functions.
// Echoes back the matched origin so credentialed requests work correctly.

const STATIC_ALLOWED_ORIGINS = [
  'https://utaab.org',
  'https://www.utaab.org',
  'https://utaab.lovable.app',
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
];

const ORIGIN_PATTERNS: RegExp[] = [
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i,
  /^https:\/\/[a-z0-9-]+\.preview\.lovableproject\.com$/i,
  /^https:\/\/id-[a-z0-9-]+\.lovable\.app$/i,
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/i,
  /^http:\/\/localhost:\d+$/i,
  /^http:\/\/127\.0\.0\.1:\d+$/i,
];

const ALLOWED_HEADERS =
  'authorization, x-client-info, apikey, content-type, ' +
  'x-supabase-client-platform, x-supabase-client-platform-version, ' +
  'x-supabase-client-runtime, x-supabase-client-runtime-version';

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';

function isOriginAllowed(origin: string): boolean {
  if (!origin) return false;
  if (STATIC_ALLOWED_ORIGINS.includes(origin)) return true;
  const siteUrl = (Deno.env.get('SITE_URL') || '').trim();
  if (siteUrl && origin === siteUrl) return true;
  return ORIGIN_PATTERNS.some((re) => re.test(origin));
}

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowed = isOriginAllowed(origin);
  // When origin is not allowed, fall back to the canonical production domain
  // (avoids exposing wildcard while still returning a valid header).
  const allowOrigin = allowed ? origin : 'https://utaab.org';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': ALLOWED_HEADERS,
    'Access-Control-Allow-Methods': ALLOWED_METHODS,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

// Convenience for simple OPTIONS responses
export function corsPreflightResponse(req: Request): Response {
  return new Response(null, { status: 204, headers: getCorsHeaders(req) });
}
