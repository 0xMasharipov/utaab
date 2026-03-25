import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface WhisperResponse {
  text: string;
  segments?: TranscriptSegment[];
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${pad(ms, 3)}`;
}

function generateVTT(segments: TranscriptSegment[]): string {
  let vtt = 'WEBVTT\n\n';
  
  segments.forEach((segment, index) => {
    const startTime = formatTimestamp(segment.start);
    const endTime = formatTimestamp(segment.end);
    vtt += `${index + 1}\n`;
    vtt += `${startTime} --> ${endTime}\n`;
    vtt += `${segment.text.trim()}\n\n`;
  });
  
  return vtt;
}

async function translateText(text: string, targetLang: string, lovableApiKey: string): Promise<string> {
  const languageNames: Record<string, string> = {
    'tr': 'Turkish',
    'ru': 'Russian',
    'ar': 'Arabic'
  };

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following subtitle text to ${languageNames[targetLang]}. Maintain the same line breaks and formatting. Only return the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function translateSegments(
  segments: TranscriptSegment[],
  targetLang: string,
  lovableApiKey: string
): Promise<TranscriptSegment[]> {
  const translatedSegments: TranscriptSegment[] = [];
  
  // Process in batches of 5 segments
  const batchSize = 5;
  for (let i = 0; i < segments.length; i += batchSize) {
    const batch = segments.slice(i, i + batchSize);
    const batchText = batch.map(s => s.text).join('\n---\n');
    
    const translatedBatch = await translateText(batchText, targetLang, lovableApiKey);
    const translatedTexts = translatedBatch.split('\n---\n');
    
    batch.forEach((segment, idx) => {
      translatedSegments.push({
        ...segment,
        text: translatedTexts[idx] || segment.text
      });
    });
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return translatedSegments;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    // --- Authentication & Authorization ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin } = await userClient.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // --- End Auth ---

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { jobId } = await req.json();

    if (!jobId) {
      throw new Error('jobId is required');
    }

    console.log(`Starting subtitle generation for job ${jobId}`);

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('subtitle_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found');
    }

    // Update job status to processing
    await supabase
      .from('subtitle_jobs')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        progress: 5
      })
      .eq('id', jobId);

    console.log(`Downloading video from ${job.video_url}`);

    // Download video
    const videoResponse = await fetch(job.video_url);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    
    await supabase
      .from('subtitle_jobs')
      .update({ progress: 20 })
      .eq('id', jobId);

    console.log('Transcribing with OpenAI Whisper...');

    // Transcribe with Whisper
    const formData = new FormData();
    formData.append('file', videoBlob, 'lecture.mp4');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      throw new Error(`Whisper API error: ${errorText}`);
    }

    const transcription: WhisperResponse = await whisperResponse.json();
    
    if (!transcription.segments || transcription.segments.length === 0) {
      throw new Error('No segments returned from Whisper API');
    }

    console.log(`Received ${transcription.segments.length} segments`);

    await supabase
      .from('subtitle_jobs')
      .update({ progress: 40 })
      .eq('id', jobId);

    // Generate English VTT
    const englishVTT = generateVTT(transcription.segments);
    const enPath = `/subtitles/mit-blockchain/lecture-${job.lecture_id.toString().padStart(2, '0')}-en.vtt`;
    
    console.log('Translating to Turkish...');
    await supabase
      .from('subtitle_jobs')
      .update({ progress: 50 })
      .eq('id', jobId);

    const turkishSegments = await translateSegments(transcription.segments, 'tr', lovableApiKey);
    const turkishVTT = generateVTT(turkishSegments);
    const trPath = `/subtitles/mit-blockchain/lecture-${job.lecture_id.toString().padStart(2, '0')}-tr.vtt`;

    console.log('Translating to Russian...');
    await supabase
      .from('subtitle_jobs')
      .update({ progress: 70 })
      .eq('id', jobId);

    const russianSegments = await translateSegments(transcription.segments, 'ru', lovableApiKey);
    const russianVTT = generateVTT(russianSegments);
    const ruPath = `/subtitles/mit-blockchain/lecture-${job.lecture_id.toString().padStart(2, '0')}-ru.vtt`;

    console.log('Translating to Arabic...');
    await supabase
      .from('subtitle_jobs')
      .update({ progress: 85 })
      .eq('id', jobId);

    const arabicSegments = await translateSegments(transcription.segments, 'ar', lovableApiKey);
    const arabicVTT = generateVTT(arabicSegments);
    const arPath = `/subtitles/mit-blockchain/lecture-${job.lecture_id.toString().padStart(2, '0')}-ar.vtt`;

    console.log('Saving subtitle files...');

    // Save VTT files to public folder (in production, these would be written to storage)
    // For now, we'll store them in the database and serve them dynamically
    
    // Update lecture_subtitles table
    await supabase
      .from('lecture_subtitles')
      .upsert({
        lecture_id: job.lecture_id,
        subtitle_en: enPath,
        subtitle_tr: trPath,
        subtitle_ru: ruPath,
        subtitle_ar: arPath,
        updated_at: new Date().toISOString()
      });

    // For actual file storage, you would write to Supabase Storage here
    // For now, we'll include the VTT content in metadata for manual extraction
    const generatedFiles = {
      en: enPath,
      tr: trPath,
      ru: ruPath,
      ar: arPath
    };

    const vttContent = {
      en: englishVTT,
      tr: turkishVTT,
      ru: russianVTT,
      ar: arabicVTT
    };

    // Update job as completed
    await supabase
      .from('subtitle_jobs')
      .update({
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        generated_files: generatedFiles,
        metadata: { vtt_content: vttContent }
      })
      .eq('id', jobId);

    console.log('Subtitle generation completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        job_id: jobId,
        generated_files: generatedFiles,
        message: 'Subtitles generated successfully. VTT files are stored in job metadata.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error generating subtitles:', error);
    
    // Try to update job status to failed
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { jobId } = await req.json();
      if (jobId) {
        await supabase
          .from('subtitle_jobs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', jobId);
      }
    } catch (updateError) {
      console.error('Failed to update job status:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});
