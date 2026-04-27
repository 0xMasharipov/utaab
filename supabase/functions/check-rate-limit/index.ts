import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getCorsHeaders } from '../_shared/cors.ts';

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

interface RateLimitRequest {
  identifier: string; // IP address or user ID
  endpoint: string;
  limit?: number; // requests per window
  window?: number; // window in seconds
}

// Endpoints where the identifier must be derived server-side (IP) to prevent spoofing
const SERVER_DERIVED_ENDPOINTS = ['admin_login'];

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { identifier: clientIdentifier, endpoint, limit = 20, window = 60 } = await req.json() as RateLimitRequest;
    
    // For sensitive endpoints, always use server-derived IP to prevent identifier spoofing
    let identifier: string;
    if (SERVER_DERIVED_ENDPOINTS.includes(endpoint)) {
      identifier = getClientIP(req);
      if (identifier === 'unknown') {
        // If we can't determine the IP, allow the request (fail open)
        return new Response(
          JSON.stringify({ allowed: true, request_count: 0, limit, window, retry_after: null }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      identifier = clientIdentifier;
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if IP is blacklisted
    const { data: isBlacklisted } = await supabaseClient.rpc('is_ip_blacklisted', {
      _ip: identifier
    });

    if (isBlacklisted) {
      // Log the blocked attempt
      await supabaseClient.rpc('log_security_event', {
        _event_type: 'ip_blacklisted',
        _severity: 'high',
        _ip: identifier,
        _endpoint: endpoint,
        _details: { action: 'blocked' }
      });

      return new Response(
        JSON.stringify({
          allowed: false,
          reason: 'IP blacklisted',
          retry_after: null,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const windowStart = new Date(Date.now() - window * 1000);

    // Get or create rate limit entry
    const { data: rateLimitData, error: selectError } = await supabaseClient
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 is "not found", which is ok
      throw selectError;
    }

    let requestCount = 0;
    let allowed = true;
    let retryAfter: number | null = null;

    if (rateLimitData) {
      requestCount = rateLimitData.request_count + 1;
      allowed = requestCount <= limit;

      if (!allowed) {
        const windowEnd = new Date(new Date(rateLimitData.window_start).getTime() + window * 1000);
        retryAfter = Math.ceil((windowEnd.getTime() - Date.now()) / 1000);

        // Log rate limit event
        await supabaseClient.rpc('log_security_event', {
          _event_type: 'rate_limit',
          _severity: requestCount > limit * 2 ? 'high' : 'medium',
          _ip: identifier,
          _endpoint: endpoint,
          _details: {
            request_count: requestCount,
            limit: limit,
            window: window,
          }
        });
      }

      // Update count
      await supabaseClient
        .from('rate_limits')
        .update({ request_count: requestCount, updated_at: new Date().toISOString() })
        .eq('id', rateLimitData.id);
    } else {
      // Create new rate limit entry
      requestCount = 1;
      await supabaseClient
        .from('rate_limits')
        .insert({
          identifier,
          endpoint,
          request_count: 1,
          window_start: new Date().toISOString(),
        });
    }

    return new Response(
      JSON.stringify({
        allowed,
        request_count: requestCount,
        limit,
        window,
        retry_after: retryAfter,
      }),
      {
        // Always return 200 so client SDKs don't treat planned throttling as
        // a function failure. Throttling decisions are conveyed via `allowed`.
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          ...(retryAfter ? { 'Retry-After': retryAfter.toString() } : {}),
        },
      }
    );
  } catch (error) {
    console.error('Rate limit check error:', error);
    return new Response(
      JSON.stringify({
        allowed: true, // Fail open to avoid blocking legitimate users
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});
