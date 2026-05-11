// Public edge function: verifies a certificate by serial_hash and returns
// metadata + (optionally) a short-lived signed URL for the PDF.
// The verification RPC lives in the private schema and is callable only via
// service_role from this function — clients can no longer reach it directly.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const serialHash = typeof body?.serial_hash === "string" ? body.serial_hash.trim() : "";
    if (!serialHash || !/^0x[0-9a-fA-F]{64}$/.test(serialHash)) {
      return new Response(JSON.stringify({ error: "invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Call the private-schema verification RPC via service role.
    const { data, error } = await supabase
      .schema("private" as any)
      .rpc("verify_certificate_by_hash", { _serial_hash: serialHash });

    if (error) {
      console.error("verify rpc failed");
      return new Response(JSON.stringify({ error: "server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = Array.isArray(data) && data.length ? data[0] : null;
    if (!row) {
      return new Response(JSON.stringify({ found: false, url: null, record: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve signed URL if a pdf_url is present
    let signedUrl: string | null = null;
    if (row.pdf_url) {
      let path = row.pdf_url as string;
      const marker = "/certificates/";
      const idx = path.indexOf(marker);
      if (idx !== -1) path = path.substring(idx + marker.length);

      const { data: signed } = await supabase.storage
        .from("certificates")
        .createSignedUrl(path, 60 * 10); // 10 minutes
      signedUrl = signed?.signedUrl ?? null;
    }

    // Strip raw pdf_url from the response — clients only get the signed URL.
    const { pdf_url: _omit, ...record } = row;

    return new Response(
      JSON.stringify({ found: true, url: signedUrl, record }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (_e) {
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
