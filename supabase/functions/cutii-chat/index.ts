import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

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

// Persistent rate limiter using database - 20 requests per minute per user
async function checkRateLimit(
  supabaseClient: any,
  userId: string,
  maxRequests = 20,
  windowMs = 60000
): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  // Try to get existing rate limit record
  const { data: existing } = await supabaseClient
    .from('rate_limits')
    .select('*')
    .eq('identifier', userId)
    .eq('endpoint', 'cutii-chat')
    .gte('window_start', windowStart.toISOString())
    .maybeSingle();

  if (!existing) {
    // Create new rate limit record
    await supabaseClient
      .from('rate_limits')
      .insert({
        identifier: userId,
        endpoint: 'cutii-chat',
        request_count: 1,
        window_start: now.toISOString(),
      });
    return true;
  }

  // Check if limit exceeded
  if (existing.request_count >= maxRequests) {
    return false;
  }

  // Increment counter
  await supabaseClient
    .from('rate_limits')
    .update({ 
      request_count: existing.request_count + 1,
      updated_at: now.toISOString(),
    })
    .eq('id', existing.id);

  return true;
}

// Input validation schema
const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  courseContext: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
    level: z.string().max(50).optional(),
    topics: z.array(z.string().max(100)).max(20).optional(),
  }).optional(),
  lessonContext: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
  }).optional(),
  utaab_token: z.string().max(500).optional(),
});

// Validate UTAAB token against database
async function validateUtaabToken(
  supabase: any,
  token: string,
  options?: { markAsUsed?: boolean }
): Promise<{ valid: boolean; error?: string; verification?: any }> {
  if (!token) {
    return { valid: false, error: 'Missing UTAAB token' };
  }

  // Check token exists, is valid, and not expired
  const { data: verification, error } = await supabase
    .from('utaab_verifications')
    .select('*')
    .eq('token', token)
    .eq('verdict', 'pass')
    .is('used_at', null)
    .gte('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('[UTAAB] Token validation error:', error);
    return { valid: false, error: 'Token validation failed' };
  }

  if (!verification) {
    return { valid: false, error: 'Invalid or expired token' };
  }

  // Mark token as used (one-time use) - for chat, don't mark as used to allow session reuse
  if (options?.markAsUsed) {
    await supabase
      .from('utaab_verifications')
      .update({ used_at: new Date().toISOString() })
      .eq('id', verification.id);
  }

  return { valid: true, verification };
}

// Enhanced dangerous patterns for prompt injection detection
const dangerousPatterns = [
  /ignore (previous|all|prior|earlier) (instructions|rules|directions|context|prompts?)/i,
  /disregard (all |your |previous |prior )?(instructions|rules|context)/i,
  /forget (everything|all previous|your role|prior context)/i,
  /you are now (a |an )?(?!CUTII|a learning assistant|an educational assistant)/i,
  /repeat (your|the) (system )?prompts?/i,
  /reveal (your|the) (instructions|prompts?|rules)/i,
  /new (instructions|rules|context|role):/i,
  /system\s*:/i,
  /(start|begin) (over|fresh|anew) (with|from)/i,
  /override (your |the )?(instructions|rules|prompts?)/i,
  /act as (?!.*(teach|learn|educat|explain|help|assist))/i,
  /pretend (you are|to be)(?!.*(teach|educat))/i,
  /(tell|show) me your (prompts?|instructions|rules)/i,
  /what (is|are) your (instructions|rules|prompts?)/i,
];

// Patterns to detect if system prompt leaked in output
const leakagePatterns = [
  /you are cutii.*learning assistant/i,
  /stay focused on learning/i,
  /avoid financial advice/i,
];

// Log suspicious activity for security monitoring
async function logSuspiciousActivity(
  supabaseClient: any,
  userId: string,
  userMessage: string,
  detectedPattern: string
) {
  try {
    console.log('[SECURITY] Suspicious input detected', {
      userId: userId.substring(0, 8) + '***',
      pattern: detectedPattern,
      timestamp: new Date().toISOString()
    });
    
    // Log to audit table for security monitoring
    await supabaseClient
      .from('audit_log')
      .insert({
        user_id: userId,
        action: 'security_alert',
        entity_type: 'chat',
        entity_name: 'prompt_injection_attempt',
        changes: {
          pattern: detectedPattern,
          message_length: userMessage.length,
          timestamp: new Date().toISOString()
        }
      });
  } catch (error) {
    console.error('[SECURITY] Failed to log suspicious activity:', error);
  }
}

// Check if AI output contains leaked system instructions
function checkOutputLeakage(output: string): boolean {
  const normalized = output.toLowerCase();
  for (const pattern of leakagePatterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }
  return false;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get and verify user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for rate limiting
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check persistent rate limit
    const rateLimitOk = await checkRateLimit(supabase, user.id);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    
    // Validate input structure
    const validated = requestSchema.parse(body);
    const { messages, courseContext, lessonContext, utaab_token } = validated;

    // Validate UTAAB token if provided (for first message verification)
    if (utaab_token) {
      const tokenResult = await validateUtaabToken(supabase, utaab_token, { markAsUsed: false });
      if (!tokenResult.valid) {
        console.log('[UTAAB] Token validation failed:', tokenResult.error);
        return new Response(
          JSON.stringify({ error: 'Bot verification failed. Please refresh and try again.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('[UTAAB] Token validated successfully');
    }

    // Check for prompt injection attempts with logging
    for (const msg of messages) {
      if (msg.role === 'user') {
        for (const pattern of dangerousPatterns) {
          if (pattern.test(msg.content)) {
            // Log suspicious activity
            await logSuspiciousActivity(
              supabase,
              user.id,
              msg.content,
              pattern.source
            );
            
            return new Response(
              JSON.stringify({ 
                error: 'Invalid message content. Please rephrase your question.' 
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Simplified system prompt to reduce attack surface
    let systemPrompt = `You are CUTII, an AI learning assistant for blockchain education.

Your role: Help students understand blockchain concepts. Provide clear educational responses.
Stay focused on learning and avoid financial advice.`;

    // Add course context if available
    if (courseContext) {
      systemPrompt += `\n\nCurrent Course Context:
Title: ${courseContext.title || 'N/A'}
Level: ${courseContext.level || 'N/A'}
Topics: ${courseContext.topics?.join(', ') || 'General blockchain topics'}`;
    }

    // Add lesson context if available
    if (lessonContext) {
      systemPrompt += `\n\nCurrent Lesson: ${lessonContext.title || 'N/A'}
${lessonContext.description ? `Description: ${lessonContext.description}` : ''}`;
    }

    systemPrompt += `\n\nRemember: You are an educational assistant. Stay helpful, clear, and focused on learning.`;

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            type: 'rate_limit' 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI service credits exhausted. Please contact support.',
            type: 'payment_required'
          }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const errorText = await response.text();
      throw new Error('AI service error');
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    // Output filtering: Check if system instructions leaked
    if (checkOutputLeakage(aiMessage)) {
      console.warn('[SECURITY] Potential system prompt leakage detected in output');
      await logSuspiciousActivity(
        supabase,
        user.id,
        'OUTPUT_LEAKAGE',
        'system_prompt_leaked_in_response'
      );
      
      // Return a safe generic response instead
      return new Response(
        JSON.stringify({ 
          message: "I'm CUTII, your blockchain learning assistant. How can I help you with your studies today?" 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    const corsHeaders = getCorsHeaders(req);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        type: 'server_error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
