// Public edge function: generates a short-lived signed URL for a certificate PDF
// only after re-verifying the certificate via the secure RPC.
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

    // Re-verify via secure RPC (only returns issued/revoked rows)
    const { data, error } = await supabase.rpc("verify_certificate_by_hash", {
      _serial_hash: serialHash,
    });
    if (error) {
      console.error("verify rpc failed");
      return new Response(JSON.stringify({ error: "server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const row = Array.isArray(data) && data.length ? data[0] : null;
    if (!row?.pdf_url) {
      return new Response(JSON.stringify({ url: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // pdf_url may be a public URL (legacy) or a storage path. Extract path after the bucket name.
    let path = row.pdf_url as string;
    const marker = "/certificates/";
    const idx = path.indexOf(marker);
    if (idx !== -1) path = path.substring(idx + marker.length);

    const { data: signed, error: sErr } = await supabase.storage
      .from("certificates")
      .createSignedUrl(path, 60 * 10); // 10 minutes
    if (sErr || !signed?.signedUrl) {
      return new Response(JSON.stringify({ url: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: signed.signedUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
