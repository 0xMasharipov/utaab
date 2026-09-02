// Issues a course completion certificate ONLY after verifying, server-side,
// that the caller is enrolled and has completed every lesson of the course.
// Clients can no longer insert into public.certificates directly.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return json({ error: "unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const courseId = typeof body?.course_id === "string" ? body.course_id.trim() : "";
    if (!UUID_RE.test(courseId)) return json({ error: "invalid request" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Identify the caller from their JWT — never trust a user_id from the body.
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userErr || !user) return json({ error: "unauthorized" }, 401);

    // Already issued? Return it, idempotently.
    const { data: existing } = await admin
      .from("certificates")
      .select("id, certificate_number, issued_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    if (existing) return json({ issued: true, certificate: existing });

    // 1. Must be enrolled.
    const { data: enrollment } = await admin
      .from("enrollments")
      .select("id, progress")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    if (!enrollment) return json({ issued: false, reason: "not_enrolled" }, 403);

    // 2. Every lesson of the course must be completed by this user.
    const { data: lessons, error: lessonsErr } = await admin
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);
    if (lessonsErr) {
      console.error("lesson lookup failed");
      return json({ error: "server error" }, 500);
    }
    const lessonIds = (lessons ?? []).map((l) => l.id);
    if (lessonIds.length === 0) return json({ issued: false, reason: "course_has_no_lessons" }, 400);

    const { count: completedCount, error: progErr } = await admin
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", true)
      .in("lesson_id", lessonIds);
    if (progErr) {
      console.error("progress lookup failed");
      return json({ error: "server error" }, 500);
    }
    if ((completedCount ?? 0) < lessonIds.length) {
      return json({ issued: false, reason: "course_not_completed" }, 403);
    }

    // 3. Issue.
    const { data: numberData, error: numberErr } = await admin.rpc("generate_certificate_number");
    if (numberErr || !numberData) {
      console.error("certificate number generation failed");
      return json({ error: "server error" }, 500);
    }

    const { data: inserted, error: insertErr } = await admin
      .from("certificates")
      .insert({ user_id: user.id, course_id: courseId, certificate_number: numberData })
      .select("id, certificate_number, issued_at")
      .single();
    if (insertErr) {
      console.error("certificate insert failed");
      return json({ error: "server error" }, 500);
    }

    await admin
      .from("enrollments")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", enrollment.id);

    return json({ issued: true, certificate: inserted });
  } catch (_e) {
    console.error("issue-course-certificate unexpected failure");
    return json({ error: "server error" }, 500);
  }
});
