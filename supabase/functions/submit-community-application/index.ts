import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Allowed origins for CORS
const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  'https://id.preview.lovableproject.com',
  Deno.env.get('SITE_URL') || '',
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.some(allowed => 
    origin === allowed || origin.endsWith('.lovableproject.com') || origin.includes('localhost')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

const applicationSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  telegram: z.string().trim().max(100).optional(),
  department: z.enum(['development', 'design', 'marketing', 'education', 'research', 'community', 'other']),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  interests: z.array(z.string().max(50)).min(1).max(10),
  github_url: z.string().url().max(500).optional().or(z.literal('')),
  portfolio_url: z.string().url().max(500).optional().or(z.literal('')),
  linkedin_url: z.string().url().max(500).optional().or(z.literal('')),
  preferred_tracks: z.array(z.string().max(50)).min(1).max(5),
  motivation: z.string().trim().min(50).max(2000),
  availability_hours: z.number().min(1).max(40),
  kvkk_consent: z.literal(true),
  kvkk_consent_version: z.string().max(10),
  locale: z.string().max(10),
  honeypot: z.string().max(0).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
  submission_time: z.number().optional(),
  form_start_time: z.number().optional(),
  utaab_token: z.string().optional(),
});

// Validate UTAAB token against database
async function validateUtaabToken(
  supabase: any,
  token: string,
  options?: { markAsUsed?: boolean }
): Promise<{ valid: boolean; error?: string; verification?: any }> {
  if (!token) {
    return { valid: false, error: 'Missing UTAAB token' };
  }

  // Check token exists, is valid, and not expired
  const { data: verification, error } = await supabase
    .from('utaab_verifications')
    .select('*')
    .eq('token', token)
    .eq('verdict', 'pass')
    .is('used_at', null)
    .gte('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('[UTAAB] Token validation error:', error);
    return { valid: false, error: 'Token validation failed' };
  }

  if (!verification) {
    return { valid: false, error: 'Invalid or expired token' };
  }

  // Mark token as used (one-time use)
  if (options?.markAsUsed) {
    await supabase
      .from('utaab_verifications')
      .update({ used_at: new Date().toISOString() })
      .eq('id', verification.id);
  }

  return { valid: true, verification };
}

// Persistent rate limiting using database
async function checkRateLimit(
  supabase: any,
  identifier: string,
  endpoint: string,
  maxRequests = 3,
  windowMs = 3600000
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);

  // Get current count for this identifier in the time window
  const { data, error } = await supabase
    .from('rate_limits')
    .select('request_count')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    return false;
  }

  if (!data) {
    // First request in window
    await supabase.from('rate_limits').insert({
      identifier,
      endpoint,
      request_count: 1,
      window_start: new Date().toISOString(),
    });
    return true;
  }

  if (data.request_count >= maxRequests) {
    return false;
  }

  // Increment count
  await supabase
    .from('rate_limits')
    .update({ 
      request_count: data.request_count + 1,
      updated_at: new Date().toISOString()
    })
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString());

  return true;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input server-side
    const validated = applicationSchema.parse(body);
    
    // Check honeypot
    if (validated.honeypot) {
      return new Response(
        JSON.stringify({ error: 'Invalid submission' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Bot detection: Check if submission was too fast (less than 10 seconds)
    if (validated.form_start_time) {
      const timeTaken = Date.now() - validated.form_start_time;
      if (timeTaken < 10000) { // Less than 10 seconds
        return new Response(
          JSON.stringify({ error: 'Submission too fast. Please take your time to fill the form.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Validate UTAAB token if provided
    if (validated.utaab_token) {
      const tokenResult = await validateUtaabToken(supabase, validated.utaab_token, { markAsUsed: true });
      if (!tokenResult.valid) {
        console.log('[UTAAB] Token validation failed:', tokenResult.error);
        return new Response(
          JSON.stringify({ error: 'Bot verification failed. Please try again.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('[UTAAB] Token validated successfully');
    }
    
    // Rate limiting by email (3 submissions per hour) - persistent
    const allowed = await checkRateLimit(supabase, validated.email, 'community-application', 3, 3600000);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert the application
    const { data, error } = await supabase
      .from('community_applications')
      .insert([{
        full_name: validated.full_name,
        email: validated.email,
        telegram: validated.telegram,
        department: validated.department,
        country: validated.country,
        city: validated.city,
        experience_level: validated.experience_level,
        interests: validated.interests,
        github_url: validated.github_url,
        portfolio_url: validated.portfolio_url,
        linkedin_url: validated.linkedin_url,
        availability_hours: validated.availability_hours,
        preferred_tracks: validated.preferred_tracks,
        motivation: validated.motivation,
        kvkk_consent: validated.kvkk_consent,
        kvkk_consent_version: validated.kvkk_consent_version,
        kvkk_consent_timestamp: new Date().toISOString(),
        locale: validated.locale,
        utm_source: validated.utm_source,
        utm_medium: validated.utm_medium,
        utm_campaign: validated.utm_campaign,
        referrer: validated.referrer,
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    const corsHeaders = getCorsHeaders(req);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Return generic error to avoid information leakage
    return new Response(
      JSON.stringify({ error: 'Failed to submit application' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
