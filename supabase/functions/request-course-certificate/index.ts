// Records a pending certificate request after verifying, server-side, that the
// caller is enrolled and has completed every lesson of the course.
// No certificate is minted here — admins issue it manually.
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
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return json({ error: "unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const courseId = typeof body?.course_id === "string" ? body.course_id.trim() : "";
    if (!UUID_RE.test(courseId)) return json({ error: "invalid request" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userErr || !user) return json({ error: "unauthorized" }, 401);

    // Already requested? idempotent.
    const { data: existing } = await admin
      .from("certificate_requests")
      .select("id, status, requested_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    if (existing) return json({ requested: true, request: existing });

    // 1. Must be enrolled.
    const { data: enrollment } = await admin
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    if (!enrollment) return json({ requested: false, reason: "not_enrolled" }, 403);

    // 2. Every lesson completed.
    const { data: lessons, error: lessonsErr } = await admin
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);
    if (lessonsErr) {
      console.error("lesson lookup failed");
      return json({ error: "server error" }, 500);
    }
    const lessonIds = (lessons ?? []).map((l) => l.id);
    if (lessonIds.length === 0) return json({ requested: false, reason: "course_has_no_lessons" }, 400);

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
      return json({ requested: false, reason: "course_not_completed" }, 403);
    }

    // 3. Record the pending request.
    const { data: inserted, error: insertErr } = await admin
      .from("certificate_requests")
      .insert({
        user_id: user.id,
        course_id: courseId,
        user_email: user.email ?? null,
        status: "pending",
      })
      .select("id, status, requested_at")
      .single();
    if (insertErr) {
      console.error("certificate request insert failed");
      return json({ error: "server error" }, 500);
    }

    const { data: course } = await admin
      .from("courses")
      .select("title_en")
      .eq("id", courseId)
      .maybeSingle();

    await admin.from("notifications").insert({
      user_id: user.id,
      type: "certificate",
      title: "Your certificate is on the way",
      message: `You completed ${course?.title_en ?? "the course"}. Your certificate is being prepared — we are working on it to improve our services.`,
      link: "/education/profile",
      read: false,
    });

    await admin
      .from("enrollments")
      .update({ completed: true, completed_at: new Date().toISOString(), progress: 100 })
      .eq("id", enrollment.id);

    return json({ requested: true, request: inserted });
  } catch (_e) {
    console.error("request-course-certificate unexpected failure");
    return json({ error: "server error" }, 500);
  }
});
