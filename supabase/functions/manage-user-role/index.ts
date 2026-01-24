import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Allowed origins for CORS
const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  'https://utaab.org',
  'https://www.utaab.org',
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

// Valid roles from app_role enum
const VALID_ROLES = ['admin', 'instructor', 'student', 'community_admin', 'moderator', 'user'] as const;
type AppRole = typeof VALID_ROLES[number];

interface ManageRoleRequest {
  targetUserId: string;
  role: AppRole;
  action: 'add' | 'remove';
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized: No auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's auth
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized: Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify caller is admin using has_role RPC
    const { data: isAdmin, error: roleCheckError } = await supabaseUser.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ success: false, message: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: ManageRoleRequest = await req.json();
    const { targetUserId, role, action } = body;

    // Validate input
    if (!targetUserId || !role || !action) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields: targetUserId, role, action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return new Response(
        JSON.stringify({ success: false, message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate action
    if (!['add', 'remove'].includes(action)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid action. Must be "add" or "remove"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent self-demotion for admin role
    if (targetUserId === user.id && role === 'admin' && action === 'remove') {
      return new Response(
        JSON.stringify({ success: false, message: 'Cannot remove your own admin role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get target user's email for audit log
    const { data: targetUserData } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
    const targetEmail = targetUserData?.user?.email || 'unknown';

    let result;
    
    if (action === 'add') {
      // Add role (upsert to handle duplicates gracefully)
      const { error: insertError } = await supabaseAdmin
        .from('user_roles')
        .upsert(
          { user_id: targetUserId, role: role },
          { onConflict: 'user_id,role' }
        );

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(
          JSON.stringify({ success: false, message: `Failed to add role: ${insertError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      result = { success: true, message: `Role "${role}" added successfully` };
    } else {
      // Remove role
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', role);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        return new Response(
          JSON.stringify({ success: false, message: `Failed to remove role: ${deleteError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      result = { success: true, message: `Role "${role}" removed successfully` };
    }

    // Log action to audit_log
    await supabaseAdmin.from('audit_log').insert({
      action: action === 'add' ? 'role_granted' : 'role_revoked',
      entity_type: 'user_roles',
      entity_id: targetUserId,
      user_id: user.id,
      user_email: user.email,
      details: {
        target_user_id: targetUserId,
        target_email: targetEmail,
        role: role,
        action: action,
        performed_by: user.email
      }
    });

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in manage-user-role:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
