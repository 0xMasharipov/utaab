import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_type, email, provider, session_token } = await req.json();

    if (!event_type || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || null;

    // Authenticate caller
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader) {
      const anonClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await anonClient.auth.getUser();
      userId = user?.id || null;
    }

    // Use service_role for privileged inserts
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Determine severity - escalate for repeated failures
    let severity = event_type === 'admin_login_success' ? 'low' : 'medium';
    
    if (event_type === 'admin_login_failed' && clientIP !== 'unknown') {
      // Count recent failures from this IP
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await serviceClient
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'admin_login_failed')
        .eq('ip_address', clientIP)
        .gte('created_at', oneHourAgo);

      if (count && count >= 3) {
        severity = 'high';
      }
    }

    // Log to security_events
    await serviceClient.from('security_events').insert({
      event_type,
      severity,
      ip_address: clientIP !== 'unknown' ? clientIP : null,
      user_id: userId,
      user_agent: userAgent,
      endpoint: '/admin/login',
      details: { email, provider: provider || 'email' },
    });

    // Log to audit_log
    await serviceClient.from('audit_log').insert({
      action: event_type === 'admin_login_success' ? 'login' : 'login_failed',
      entity_type: 'session',
      entity_name: email,
      user_id: userId,
      user_email: email,
      ip_address: clientIP !== 'unknown' ? clientIP : null,
      user_agent: userAgent,
      changes: { provider: provider || 'email', event_type },
    });

    // Update admin_sessions with IP + user agent if successful login
    if (event_type === 'admin_login_success' && userId && session_token) {
      // Check for concurrent sessions (warning)
      const { data: existingSessions } = await serviceClient
        .from('admin_sessions')
        .select('id')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .neq('session_token', session_token);

      if (existingSessions && existingSessions.length > 0) {
        await serviceClient.from('security_events').insert({
          event_type: 'concurrent_admin_session',
          severity: 'medium',
          ip_address: clientIP !== 'unknown' ? clientIP : null,
          user_id: userId,
          user_agent: userAgent,
          endpoint: '/admin/login',
          details: { email, existing_sessions: existingSessions.length },
        });
      }

      // Update session with IP and user agent
      await serviceClient
        .from('admin_sessions')
        .update({
          ip_address: clientIP !== 'unknown' ? clientIP : null,
          user_agent: userAgent,
        })
        .eq('session_token', session_token)
        .eq('user_id', userId);
    }

    return new Response(
      JSON.stringify({ success: true, ip: clientIP }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('admin-login-log error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
