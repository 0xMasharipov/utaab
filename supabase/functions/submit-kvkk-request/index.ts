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

const requestSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  request_type: z.enum(['access', 'correction', 'deletion', 'portability', 'objection']),
  details: z.string().trim().min(10).max(2000),
  locale: z.string().max(10),
});

// Persistent rate limiting using database
async function checkRateLimit(
  supabase: any,
  identifier: string,
  endpoint: string,
  maxRequests = 5,
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
    console.error('Rate limit check failed');
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
    const validated = requestSchema.parse(body);
    
    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Rate limiting by email (5 requests per hour) - persistent
    const allowed = await checkRateLimit(supabase, validated.email, 'kvkk-request', 5, 3600000);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert the request
    const { data, error } = await supabase
      .from('kvkk_requests')
      .insert([{
        full_name: validated.full_name,
        email: validated.email,
        request_type: validated.request_type,
        details: validated.details,
        locale: validated.locale,
        status: 'pending',
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
    
    return new Response(
      JSON.stringify({ error: 'Failed to submit request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
