import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getCorsHeaders } from '../_shared/cors.ts';

interface TurnstileVerifyRequest {
  token: string;
  ip?: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, ip } = await req.json() as TurnstileVerifyRequest;
    const TURNSTILE_SECRET = Deno.env.get('TURNSTILE_SECRET_KEY');

    if (!TURNSTILE_SECRET) {
      throw new Error('TURNSTILE_SECRET_KEY not configured');
    }

    // Verify with Cloudflare Turnstile
    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const outcome = await verifyResponse.json();

    // Log security event if verification failed
    if (!outcome.success) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabaseClient.rpc('log_security_event', {
        _event_type: 'captcha_fail',
        _severity: 'medium',
        _ip: ip || null,
        _endpoint: 'verify-turnstile',
        _details: { error_codes: outcome['error-codes'] || [] }
      });
    }

    return new Response(
      JSON.stringify({
        success: outcome.success,
        challenge_ts: outcome.challenge_ts,
        hostname: outcome.hostname,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});
