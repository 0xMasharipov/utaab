import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, courseContext, lessonContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt with context
    let systemPrompt = `You are CUTII, an AI learning assistant for blockchain education. You help students understand blockchain concepts, smart contracts, DeFi, NFTs, and Web3 technologies.

Guidelines:
- Provide clear, educational explanations
- Use examples and analogies when helpful
- Break down complex topics into simpler concepts
- Suggest relevant learning resources
- Never provide financial advice
- If asked about code, explain the logic clearly
- Encourage students to learn and explore

IMPORTANT: Always be encouraging and supportive of the learning journey.`;

    // Add course context if available
    if (courseContext) {
      systemPrompt += `\n\nCurrent Course Context:
Title: ${courseContext.title}
Level: ${courseContext.level}
Topics: ${courseContext.topics?.join(', ') || 'General blockchain topics'}`;
    }

    // Add lesson context if available
    if (lessonContext) {
      systemPrompt += `\n\nCurrent Lesson: ${lessonContext.title}
${lessonContext.description ? `Description: ${lessonContext.description}` : ''}`;
    }

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
      console.error('AI gateway error:', response.status, errorText);
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
    console.error('CUTII chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        type: 'server_error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
