import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Returns sanitized, non-sensitive security configuration for public consumption.
 * Does NOT expose rate limit values, thresholds, or other details that could help attackers.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch only the settings we need
    const { data, error } = await supabaseClient
      .from('security_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['captcha_enabled', 'min_form_completion_time']);

    if (error) {
      console.error('Error fetching security settings:', error);
      // Return safe defaults on error
      return new Response(
        JSON.stringify({
          captchaEnabled: true,
          minFormTime: 2,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract and sanitize values - only return boolean flags and basic timing
    const captchaSetting = data?.find((s) => s.setting_key === 'captcha_enabled');
    const timingSetting = data?.find((s) => s.setting_key === 'min_form_completion_time');

    // Return sanitized config - no sensitive thresholds or limits exposed
    const publicConfig = {
      captchaEnabled: (captchaSetting?.setting_value as any)?.enabled ?? true,
      // Return a slightly randomized min form time to prevent exact timing attacks
      minFormTime: Math.max(2, ((timingSetting?.setting_value as any)?.seconds ?? 2) + Math.random() * 0.5),
    };

    return new Response(
      JSON.stringify(publicConfig),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-public-security-config:', error);
    // Return safe defaults on error
    return new Response(
      JSON.stringify({
        captchaEnabled: true,
        minFormTime: 2,
      }),
      { 
        status: 200, // Return 200 to not expose error details
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
