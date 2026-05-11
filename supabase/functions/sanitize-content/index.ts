import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getCorsHeaders } from '../_shared/cors.ts';

// Simple HTML sanitization using regex-based approach
// Note: For production, consider using a proper HTML parser library
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link\b[^>]*>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
  /<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi, // Event handlers like onclick, onerror
  /on\w+\s*=\s*[^\s>]*/gi, // Event handlers without quotes
  /javascript:/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
];

const ALLOWED_TAGS = ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'h1', 'h2', 'h3', 'br'];

function sanitizeHTML(html: string): string {
  if (!html) return '';
  
  let sanitized = html;
  
  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  // Remove non-HTTPS URLs in href and src attributes (except data:image/ for images)
  sanitized = sanitized.replace(/href=["'](?!https:\/\/)(?!#)(?!\/)([^"']+)["']/gi, '');
  sanitized = sanitized.replace(/src=["'](?!https:\/\/)(?!data:image\/)([^"']+)["']/gi, '');
  
  // Add rel="noopener noreferrer" to all links
  sanitized = sanitized.replace(/<a\b/gi, '<a rel="noopener noreferrer"');
  
  return sanitized;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Require authenticated caller (any signed-in user) to prevent unauth probing/abuse
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { content, fieldType } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ sanitized: '', stripped: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const originalLength = content.length;
    const sanitized = sanitizeHTML(content);
    const stripped = sanitized.length !== originalLength;

    // Log if dangerous content was stripped
    if (stripped) {
      console.warn('[SECURITY] Stripped dangerous content from field:', fieldType, {
        originalLength,
        sanitizedLength: sanitized.length,
        removed: originalLength - sanitized.length,
      });
    }

    return new Response(
      JSON.stringify({ sanitized, stripped }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sanitizing content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
