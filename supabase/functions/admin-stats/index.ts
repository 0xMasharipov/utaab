import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.warn('Non-admin user attempted to access stats:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User is admin - fetch stats
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get stats in parallel
    const [applicationsResult, profilesResult, kvkkRequestsResult, pendingKvkkResult] = await Promise.all([
      supabaseAdmin.from('community_applications').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('education_profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('kvkk_requests').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('kvkk_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const stats = {
      totalApplications: applicationsResult.count || 0,
      totalProfiles: profilesResult.count || 0,
      totalKvkkRequests: kvkkRequestsResult.count || 0,
      pendingKvkkRequests: pendingKvkkResult.count || 0,
    };

    console.log('Admin stats fetched for user:', user.id);

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
