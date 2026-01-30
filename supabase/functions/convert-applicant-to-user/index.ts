import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// CORS configuration
function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = [
    "https://utaab.org",
    "https://www.utaab.org",
    Deno.env.get("SITE_URL"),
  ].filter(Boolean);

  const lovablePreviewRegex = /^https:\/\/[a-z0-9-]+-preview--[a-f0-9-]+\.lovable\.app$/;
  const localhostRegex = /^http:\/\/localhost(:\d+)?$/;

  let allowOrigin = allowedOrigins[0] || "*";
  if (origin) {
    if (allowedOrigins.includes(origin) || lovablePreviewRegex.test(origin) || localhostRegex.test(origin)) {
      allowOrigin = origin;
    }
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

interface ConvertRequest {
  applicationId: string;
  action: "invite" | "create";
  role?: "student" | "user";
  sendEmail?: boolean;
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token for auth validation
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;

    // Create admin client for privileged operations
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify caller has admin role
    const { data: hasAdminRole, error: roleError } = await adminClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (roleError || !hasAdminRole) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin role required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: ConvertRequest = await req.json();
    const { applicationId, action, role = "student", sendEmail = true } = body;

    if (!applicationId || !action) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: applicationId, action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["invite", "create"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Must be 'invite' or 'create'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the application
    const { data: application, error: appError } = await adminClient
      .from("community_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (application.status === "converted") {
      return new Response(
        JSON.stringify({ error: "Application already converted to user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: { success: boolean; message: string; userId?: string; inviteToken?: string };

    if (action === "invite") {
      // Check if an invitation already exists for this email
      const { data: existingInvite, error: checkError } = await adminClient
        .from("admin_invitations")
        .select("id, expires_at, accepted_at")
        .eq("email", application.email)
        .maybeSingle();

      if (checkError) {
        console.error("Failed to check existing invitation:", checkError);
        return new Response(
          JSON.stringify({ error: "Failed to check existing invitation" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (existingInvite) {
        const isExpired = new Date(existingInvite.expires_at) < new Date();
        const isAccepted = existingInvite.accepted_at !== null;

        if (isAccepted) {
          return new Response(
            JSON.stringify({ error: "This user has already accepted an invitation" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!isExpired) {
          return new Response(
            JSON.stringify({ error: "An active invitation already exists for this email" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Delete expired invitation before creating new one
        const { error: deleteError } = await adminClient
          .from("admin_invitations")
          .delete()
          .eq("id", existingInvite.id);

        if (deleteError) {
          console.error("Failed to delete expired invitation:", deleteError);
          return new Response(
            JSON.stringify({ error: "Failed to replace expired invitation" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Generate secure invite token
      const inviteToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours

      // Insert into admin_invitations
      const { error: inviteError } = await adminClient.from("admin_invitations").insert({
        email: application.email,
        role: role as "student" | "user",
        token: inviteToken,
        expires_at: expiresAt,
        invited_by: userId,
      });

      if (inviteError) {
        console.error("Failed to create invitation:", inviteError);
        return new Response(
          JSON.stringify({ error: "Failed to create invitation" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update application status
      await adminClient
        .from("community_applications")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: userId,
          invite_token: inviteToken,
          invite_expires_at: expiresAt,
        })
        .eq("id", applicationId);

      result = {
        success: true,
        message: `Invitation sent to ${application.email}`,
        inviteToken,
      };

    } else {
      // Auto-create account
      // Generate temporary password
      const tempPassword = crypto.randomUUID().slice(0, 16) + "Aa1!";

      // Create auth user
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: application.email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: application.full_name,
          converted_from_application: applicationId,
        },
      });

      if (createError) {
        console.error("Failed to create user:", createError);
        return new Response(
          JSON.stringify({ error: `Failed to create user: ${createError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const newUserId = newUser.user.id;

      // Create education profile
      const { error: profileError } = await adminClient.from("education_profiles").insert({
        user_id: newUserId,
        full_name: application.full_name,
        department: application.department,
        preferred_language: application.locale || "en",
        locale: application.locale || "en",
        focus_areas: application.interests || [],
        role: role,
        kvkk_consent: application.kvkk_consent,
        kvkk_consent_version: application.kvkk_consent_version || "1.0",
        kvkk_consent_timestamp: application.kvkk_consent_timestamp || new Date().toISOString(),
      });

      if (profileError) {
        console.error("Failed to create education profile:", profileError);
        // Rollback: delete the created user
        await adminClient.auth.admin.deleteUser(newUserId);
        return new Response(
          JSON.stringify({ error: "Failed to create education profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Assign role to user
      const { error: roleAssignError } = await adminClient.from("user_roles").insert({
        user_id: newUserId,
        role: role as "student" | "user",
      });

      if (roleAssignError) {
        console.error("Failed to assign role:", roleAssignError);
        // Continue anyway, admin can fix later
      }

      // Update application status
      await adminClient
        .from("community_applications")
        .update({
          status: "converted",
          approved_at: new Date().toISOString(),
          approved_by: userId,
          converted_user_id: newUserId,
        })
        .eq("id", applicationId);

      // Generate password reset link for user
      if (sendEmail) {
        await adminClient.auth.admin.generateLink({
          type: "recovery",
          email: application.email,
        });
      }

      result = {
        success: true,
        message: `Account created for ${application.email}`,
        userId: newUserId,
      };
    }

    // Log audit event
    await adminClient.from("audit_log").insert({
      action: action === "invite" ? "applicant_invited" : "applicant_converted",
      entity_type: "community_applications",
      entity_id: applicationId,
      entity_name: application.full_name,
      user_id: userId,
      user_email: userEmail,
      changes: {
        action,
        role,
        applicant_email: application.email,
        new_user_id: result.userId || null,
      },
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in convert-applicant-to-user:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
