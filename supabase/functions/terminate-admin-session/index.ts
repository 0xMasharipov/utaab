import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Verify caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }
    const callerId = claimsData.claims.sub

    // Verify caller is admin
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: isAdmin } = await serviceClient.rpc('has_role', { _user_id: callerId, _role: 'admin' })
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
    }

    const { session_id, target_user_id } = await req.json()
    if (!session_id || !target_user_id) {
      return new Response(JSON.stringify({ error: 'session_id and target_user_id required' }), { status: 400, headers: corsHeaders })
    }

    // Revoke auth sessions via Admin API
    const logoutRes = await fetch(`${supabaseUrl}/auth/v1/logout?scope=global`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
      },
    })

    // Use admin API to sign out specific user
    const { error: signOutError } = await serviceClient.auth.admin.signOut(target_user_id, 'global')

    // Delete admin_sessions record
    await serviceClient.from('admin_sessions').delete().eq('id', session_id)

    // Extract IP for logging
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const userAgent = req.headers.get('user-agent') || null

    // Log to security_events
    await serviceClient.rpc('log_security_event', {
      _event_type: 'session_terminated',
      _severity: 'high',
      _ip: ip,
      _user_id: callerId,
      _user_agent: userAgent,
      _endpoint: '/terminate-admin-session',
      _details: JSON.stringify({ target_user_id, session_id, sign_out_error: signOutError?.message || null }),
    })

    // Log to audit_log
    await serviceClient.from('audit_log').insert({
      action: 'session_terminated',
      entity_type: 'admin_session',
      entity_id: session_id,
      user_id: callerId,
      ip_address: ip,
      user_agent: userAgent,
      changes: { target_user_id, forced_logout: !signOutError },
    })

    return new Response(JSON.stringify({ 
      success: true, 
      auth_revoked: !signOutError,
      message: signOutError ? 'Session deleted but auth revocation failed' : 'Session terminated and auth revoked'
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('terminate-admin-session error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: corsHeaders })
  }
})
