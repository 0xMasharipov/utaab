import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize clients
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify caller is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify caller has admin role using has_role function
    const { data: hasAdminRole, error: roleError } = await supabaseClient
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      console.error('Admin role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin verified, fetching all users...');

    // Use service role to get all auth users
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Failed to list users:', listError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also fetch education_profiles for additional user data
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('education_profiles')
      .select('user_id, full_name, department, role, created_at');

    if (profilesError) {
      console.error('Failed to fetch profiles:', profilesError);
    }

    // Fetch user roles
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Failed to fetch user roles:', rolesError);
    }

    // Create a map for quick lookup
    const profileMap = new Map(
      (profiles || []).map(p => [p.user_id, p])
    );

    const rolesMap = new Map<string, string[]>();
    (userRoles || []).forEach(r => {
      const existing = rolesMap.get(r.user_id) || [];
      existing.push(r.role);
      rolesMap.set(r.user_id, existing);
    });

    // Combine auth users with profile data
    const combinedUsers = (users || []).map((authUser: any) => {
      const profile = profileMap.get(authUser.id);
      const roles = rolesMap.get(authUser.id) || [];
      
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        email_confirmed_at: authUser.email_confirmed_at,
        last_sign_in_at: authUser.last_sign_in_at,
        full_name: profile?.full_name || null,
        department: profile?.department || null,
        profile_role: profile?.role || null,
        user_roles: roles,
        has_profile: !!profile,
      };
    });

    // Log the action for audit
    await supabaseAdmin.rpc('log_security_event', {
      _event_type: 'admin_users_list',
      _severity: 'info',
      _ip: null,
      _user_id: user.id,
      _user_agent: null,
      _endpoint: 'get-admin-users',
      _details: { total_users: combinedUsers.length }
    });

    console.log(`Returning ${combinedUsers.length} users`);

    return new Response(
      JSON.stringify({ users: combinedUsers }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
