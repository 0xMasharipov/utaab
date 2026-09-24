import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { invalidAssessmentStage, validateResult } from '../_shared/contributor-contract.ts';
import { coachingInstructions, coachingUserPrompt, reportToolSchema } from '../_shared/contributor-prompt.ts';

const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  'https://utaab.lovable.app',
  'https://utaab.org',
  'https://www.utaab.org',
  Deno.env.get('SITE_URL') || '',
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.some(allowed =>
    origin === allowed || origin.endsWith('.lovableproject.com') || origin.includes('localhost')
  );
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

// Zod schema for server-side validation of formData
const formDataSchema = z.object({
  assessmentVersion: z.union([z.literal(1), z.literal(2)]).optional(),
  locale: z.enum(['en', 'tr', 'ru', 'ar']).optional(),
  scenarioAnswers: z.object({ deadline: z.string().max(2000), evidence: z.string().max(2000), priorities: z.string().max(2000) }).optional(),
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  university: z.string().max(200).optional(),
  yearOfStudy: z.string().max(20).optional(),
  hasCommunityExperience: z.boolean().optional(),
  communityExperienceDetails: z.string().max(2000).optional(),
  topicInterests: z.array(z.string().max(100)).max(20).optional(),
  freeTimeActivities: z.array(z.string().max(100)).max(20).optional(),
  naturalWorkType: z.array(z.string().max(100)).max(20).optional(),
  strengths: z.array(z.string().max(100)).max(20).optional(),
  bestTaskTypes: z.array(z.string().max(100)).max(20).optional(),
  experienceRatings: z.record(z.string().max(50), z.number().min(1).max(5)).optional(),
  workPreference: z.string().max(100).optional(),
  decisionStyle: z.string().max(100).optional(),
  personalityType: z.string().max(100).optional(),
  underPressure: z.string().max(100).optional(),
  motivations: z.array(z.string().max(100)).max(20).optional(),
  weeklyHours: z.string().max(50).optional(),
  contributionType: z.string().max(100).optional(),
  trackInterest: z.string().max(100).optional(),
  whyJoin: z.string().max(2000).optional(),
  desiredImpact: z.string().max(2000).optional(),
  proudAchievement: z.string().max(2000).optional(),
  whatToBuild: z.string().max(2000).optional(),
  bestTeamEnvironment: z.string().max(2000).optional(),
  linkedIn: z.string().max(200).optional(),
  github: z.string().max(200).optional(),
  portfolio: z.string().max(200).optional(),
}); // Strip unknown fields before prompt construction or persistence.

// Rate limiting using the rate_limits table
async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  identifier: string,
  endpoint: string,
  maxRequests = 5,
  windowMs = 3600000
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);

  const { data, error } = await supabase
    .from('rate_limits')
    .select('id, request_count')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    // On error, fail open
    return true;
  }

  if (!data) {
    await supabase.from('rate_limits').insert({
      identifier,
      endpoint,
      request_count: 1,
      window_start: new Date().toISOString(),
    });
    return true;
  }

  if (data.request_count >= maxRequests) {
    return false;
  }

  await supabase
    .from('rate_limits')
    .update({ request_count: data.request_count + 1, updated_at: new Date().toISOString() })
    .eq('id', data.id);

  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  const corsHeaders = getCorsHeaders(req);
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const { formData: rawFormData } = body;

    if (!rawFormData) {
      return new Response(JSON.stringify({ error: 'Missing form data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Server-side input validation
    const parseResult = formDataSchema.safeParse(rawFormData);
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Invalid form data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = parseResult.data;
    const extended = formData.assessmentVersion === 2;
    if (extended && invalidAssessmentStage(formData) !== null) {
      return new Response(JSON.stringify({ error: 'Complete all required assessment answers' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client with service role for rate limiting & DB writes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limit by IP (5 requests per hour)
    const clientIP = getClientIP(req);
    if (clientIP !== 'unknown') {
      const ipAllowed = await checkRateLimit(supabase, clientIP, 'contributor-match', 5, 3600000);
      if (!ipAllowed) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Also rate limit by email (3 requests per hour)
    const emailAllowed = await checkRateLimit(supabase, formData.email, 'contributor-match-email', 3, 3600000);
    if (!emailAllowed) {
      return new Response(JSON.stringify({ error: 'Too many requests for this email. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = coachingInstructions;
    const userPrompt = coachingUserPrompt(formData);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(90000),
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'recommend_role',
              description: 'Return the contributor role recommendation based on assessment analysis.',
              parameters: reportToolSchema(extended),
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'recommend_role' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      throw new Error('AI analysis failed');
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('Invalid AI response structure');
    }

    const result = validateResult(JSON.parse(toolCall.function.arguments), formData, extended);

    // Save to database with validated data
    const { error: saveError } = await supabase.from('contributor_assessments').insert({
      full_name: formData.fullName,
      email: formData.email,
      form_data: formData,
      ai_result: result,
    });
    if (saveError) throw new Error('Could not save assessment');

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('contributor-match error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
