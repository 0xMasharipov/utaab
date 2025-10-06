import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    title: z.string().optional(),
    description: z.string().optional(),
    level: z.string().optional(),
    topics: z.array(z.string()).optional(),
  }).optional(),
  lessonContext: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

// Dangerous patterns that indicate prompt injection
const dangerousPatterns = [
  /ignore (previous|all|prior) (instructions|rules|directions)/i,
  /you are now (a |an )?(?!CUTII|a learning assistant|an educational assistant)/i,
  /repeat (your|the) system prompt/i,
  /disregard (all |your )?rules/i,
  /new instructions:/i,
  /system:/i,
  /forget (everything|all previous|your role)/i,
  /reveal (your|the) (instructions|prompt|rules)/i,
];

serve(async (req) => {
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
    const { messages, courseContext, lessonContext } = validated;

    // Check for prompt injection attempts
    for (const msg of messages) {
      if (msg.role === 'user') {
        for (const pattern of dangerousPatterns) {
          if (pattern.test(msg.content)) {
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

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
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
