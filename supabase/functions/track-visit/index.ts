import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Allowed origins for CORS
const allowedOrigins = [
  'https://utaab.org',
  'https://www.utaab.org',
  'https://utaab.lovable.app',
  Deno.env.get('SITE_URL') || '',
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed =
    allowedOrigins.some((allowed) => origin === allowed) ||
    origin.endsWith('.lovableproject.com') ||
    origin.endsWith('.lovable.app') ||
    origin.includes('localhost');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

const BOT_RE = /(bot|crawler|spider|crawling|preview|lighthouse|headless|fetch|monitor|pingdom|axios|wget|curl|python-requests|node-fetch)/i;

// Country code -> name map (most common). Falls back to code for unknowns.
const COUNTRY_NAMES: Record<string, string> = {
  TR: 'Turkey', US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
  RU: 'Russia', UA: 'Ukraine', NL: 'Netherlands', IT: 'Italy', ES: 'Spain', PL: 'Poland',
  AZ: 'Azerbaijan', KZ: 'Kazakhstan', UZ: 'Uzbekistan', KG: 'Kyrgyzstan', TJ: 'Tajikistan',
  TM: 'Turkmenistan', SA: 'Saudi Arabia', AE: 'United Arab Emirates', QA: 'Qatar',
  KW: 'Kuwait', BH: 'Bahrain', OM: 'Oman', EG: 'Egypt', MA: 'Morocco', DZ: 'Algeria',
  TN: 'Tunisia', JO: 'Jordan', LB: 'Lebanon', SY: 'Syria', IQ: 'Iraq', IR: 'Iran',
  IN: 'India', PK: 'Pakistan', BD: 'Bangladesh', CN: 'China', JP: 'Japan', KR: 'South Korea',
  SG: 'Singapore', MY: 'Malaysia', ID: 'Indonesia', TH: 'Thailand', VN: 'Vietnam',
  PH: 'Philippines', AU: 'Australia', NZ: 'New Zealand', CA: 'Canada', MX: 'Mexico',
  BR: 'Brazil', AR: 'Argentina', CL: 'Chile', CO: 'Colombia', PE: 'Peru',
  ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya', GH: 'Ghana', ET: 'Ethiopia',
  CH: 'Switzerland', AT: 'Austria', BE: 'Belgium', SE: 'Sweden', NO: 'Norway',
  DK: 'Denmark', FI: 'Finland', IE: 'Ireland', PT: 'Portugal', GR: 'Greece',
  CZ: 'Czechia', RO: 'Romania', HU: 'Hungary', BG: 'Bulgaria', RS: 'Serbia',
  HR: 'Croatia', SI: 'Slovenia', SK: 'Slovakia', LT: 'Lithuania', LV: 'Latvia',
  EE: 'Estonia', BY: 'Belarus', MD: 'Moldova', GE: 'Georgia', AM: 'Armenia',
  IL: 'Israel', CY: 'Cyprus', MT: 'Malta', LU: 'Luxembourg', IS: 'Iceland',
};

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function ipGeoLookup(ip: string): Promise<{ country_code?: string; country_name?: string; city?: string }> {
  if (!ip || ip === 'unknown') return {};
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return {};
    const j = await res.json();
    const code = (j.country_code || j.country || '').toString().toUpperCase().slice(0, 2);
    return {
      country_code: code || undefined,
      country_name: j.country_name || COUNTRY_NAMES[code] || code || undefined,
      city: j.city || undefined,
    };
  } catch {
    return {};
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === 'string' ? body.path.slice(0, 512) : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 512) : '';

    // Skip admin paths defensively (also filtered client-side)
    if (
      path.startsWith('/v8k2m9x4') ||
      path.startsWith('/j3r7x1w9') ||
      path.startsWith('/profile/admin')
    ) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ua = (req.headers.get('user-agent') || '').slice(0, 256);
    const ip =
      req.headers.get('cf-connecting-ip') ||
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const isBot = BOT_RE.test(ua);

    // Country: prefer edge-provided headers, then IP lookup
    let country_code =
      (req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || '')
        .toString()
        .toUpperCase()
        .slice(0, 2) || undefined;
    let country_name: string | undefined =
      country_code ? (COUNTRY_NAMES[country_code] || country_code) : undefined;
    let city: string | undefined =
      req.headers.get('cf-ipcity') ||
      req.headers.get('x-vercel-ip-city') ||
      undefined;

    if (!country_code && ip !== 'unknown') {
      const geo = await ipGeoLookup(ip);
      country_code = geo.country_code;
      country_name = geo.country_name;
      city = city || geo.city;
    }

    // Visitor hash with daily-rotating salt
    const salt = Deno.env.get('VISIT_TRACK_SALT') || 'utaab-default-salt';
    const day = new Date().toISOString().slice(0, 10);
    const visitor_hash = await sha256Hex(`${ip}|${ua}|${day}|${salt}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await (supabase.from('site_visits') as any).insert({
      path,
      referrer: referrer || null,
      country_code: country_code || null,
      country_name: country_name || null,
      city: city || null,
      visitor_hash,
      user_agent: ua || null,
      is_bot: isBot,
    });

    if (error) {
      console.error('site_visits insert failed:', error);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('track-visit error:', e);
    return new Response(JSON.stringify({ ok: false }), {
      status: 200, // never block client
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
