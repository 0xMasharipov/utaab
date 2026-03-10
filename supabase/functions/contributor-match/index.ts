import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    const { formData } = await req.json();
    if (!formData) {
      return new Response(JSON.stringify({ error: 'Missing form data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are the UTAAB Contributor Matching AI. UTAAB is a university blockchain technology and innovation community. Based on the user's assessment data, recommend the best contributor role.

Available roles:
- Community & Growth
- Partnerships
- Events & Ecosystem
- Research
- Content & Media
- Design
- Product
- Frontend Development
- Backend Development
- Smart Contract / Blockchain Development
- Operations
- Strategy
- Education / Workshops
- Analytics

Analyze the user's interests, skills, work style, motivation, and availability to determine the best fit. Be specific, encouraging, and insightful.`;

    const userPrompt = `Analyze this contributor assessment and recommend roles:

Profile: ${formData.fullName}, ${formData.university || 'N/A'}, Year ${formData.yearOfStudy || 'N/A'}
Previous community experience: ${formData.hasCommunityExperience ? formData.communityExperienceDetails : 'None'}

Interests: ${(formData.topicInterests || []).join(', ')}
Free time activities: ${(formData.freeTimeActivities || []).join(', ')}
Natural work type: ${(formData.naturalWorkType || []).join(', ')}

Strengths: ${(formData.strengths || []).join(', ')}
Best task types: ${(formData.bestTaskTypes || []).join(', ')}

Experience ratings (1-5):
${Object.entries(formData.experienceRatings || {}).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Work preference: ${formData.workPreference || 'N/A'}
Decision style: ${formData.decisionStyle || 'N/A'}
Personality: ${formData.personalityType || 'N/A'}
Under pressure: ${formData.underPressure || 'N/A'}
Motivations: ${(formData.motivations || []).join(', ')}

Availability: ${formData.weeklyHours || 'N/A'} hours/week
Contribution type: ${formData.contributionType || 'N/A'}
Track interest: ${formData.trackInterest || 'N/A'}

Why join UTAAB: ${formData.whyJoin || 'N/A'}
Desired impact: ${formData.desiredImpact || 'N/A'}
Proud achievement: ${formData.proudAchievement || 'N/A'}
What to build/lead: ${formData.whatToBuild || 'N/A'}
Best team environment: ${formData.bestTeamEnvironment || 'N/A'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
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
              parameters: {
                type: 'object',
                properties: {
                  primary_role: { type: 'string', description: 'Best matching role from the available roles list' },
                  secondary_role: { type: 'string', description: 'Second best matching role' },
                  compatibility_score: { type: 'number', description: 'Score 0-100 indicating match strength' },
                  profile_summary: { type: 'string', description: '2-3 sentence summary of the contributor profile' },
                  strengths: { type: 'array', items: { type: 'string' }, description: 'Top 4-6 identified strengths' },
                  why_this_role: { type: 'string', description: 'Explanation of why this role fits' },
                  growth_recommendations: { type: 'string', description: 'Suggestions for growth within UTAAB' },
                  suggested_first_step: { type: 'string', description: 'Concrete first action to take' },
                  recommended_department: { type: 'string', description: 'Which UTAAB department to join' },
                  growth_path: { type: 'string', description: 'Potential career/contribution path inside UTAAB' },
                },
                required: ['primary_role', 'secondary_role', 'compatibility_score', 'profile_summary', 'strengths', 'why_this_role', 'growth_recommendations', 'suggested_first_step', 'recommended_department', 'growth_path'],
                additionalProperties: false,
              },
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

    const result = JSON.parse(toolCall.function.arguments);

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('contributor_assessments').insert({
      full_name: formData.fullName || 'Anonymous',
      email: formData.email || 'unknown@unknown.com',
      form_data: formData,
      ai_result: result,
    });

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('contributor-match error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
