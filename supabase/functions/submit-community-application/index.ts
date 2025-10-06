import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const applicationSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  telegram: z.string().trim().max(100).optional().nullable(),
  department: z.string().trim().min(1).max(100),
  country: z.string().trim().max(100).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string()).min(1).max(10),
  github_url: z.string().trim().url().max(255).optional().nullable(),
  portfolio_url: z.string().trim().url().max(255).optional().nullable(),
  linkedin_url: z.string().trim().url().max(255).optional().nullable(),
  availability_hours: z.number().int().min(1).max(168),
  preferred_tracks: z.array(z.string()).min(1).max(5),
  motivation: z.string().trim().min(300).max(500),
  kvkk_consent: z.boolean().refine(val => val === true),
  kvkk_consent_version: z.string(),
  locale: z.string().max(10),
  honeypot: z.string().max(0),
  utm_source: z.string().trim().max(255).optional().nullable(),
  utm_medium: z.string().trim().max(255).optional().nullable(),
  utm_campaign: z.string().trim().max(255).optional().nullable(),
  referrer: z.string().trim().max(500).optional().nullable(),
  ip_address: z.string().max(45).optional().nullable(),
  user_agent: z.string().max(500).optional().nullable(),
});

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
    
    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
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
        ip_address: validated.ip_address,
        user_agent: validated.user_agent,
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
