import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS
const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  Deno.env.get('SITE_URL'),
].filter(Boolean);

// Add preview domains pattern
const previewDomainPattern = /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/;
const idPreviewPattern = /^https:\/\/id\.preview\.lovableproject\.com$/;

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  
  // Check if origin is allowed
  const isAllowed = allowedOrigins.includes(origin) || 
                    previewDomainPattern.test(origin) || 
                    idPreviewPattern.test(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Rate limit tiers configuration
const RATE_LIMIT_CONFIG = {
  tier1: { limit: 10, windowMs: 60000 },      // 10 requests/minute
  tier2: { limit: 30, windowMs: 300000 },     // 30 requests/5min
  tier3: { limit: 100, windowMs: 3600000 },   // 100 requests/hour
  escalation: {
    tempBanMs: 3600000,      // 1 hour temp ban after 3 violations
    permBanMs: 604800000,    // 7 day ban after 5 violations
    violationThreshold: 3,
    permBanThreshold: 5
  }
};

// Risk score weights
const RISK_WEIGHTS = {
  missingWebGL: 15,
  headlessBrowser: 40,
  unusualScreen: 10,
  missingAudioContext: 10,
  noMouseMovement: 25,
  linearMouseMovement: 20,
  tooFastFormCompletion: 30,
  noKeyboardEvents: 15,
  instantFormFocus: 10,
  suspiciousFingerprint: 20,
  failedPow: 35,
  ipBanned: 50,
  highRateLimit: 25,
};

interface VerifyRequest {
  sessionId: string;
  fingerprint: {
    hash: string;
    webglRenderer?: string;
    screenResolution?: string;
    timezone?: number;
    languages?: string[];
    hardwareConcurrency?: number;
    deviceMemory?: number;
    touchSupport?: boolean;
    canvas?: string;
    audioContext?: boolean;
  };
  behavior: {
    mouseMovements: number;
    mouseEntropy: number;
    keystrokeCount: number;
    avgKeystrokeInterval: number;
    scrollEvents: number;
    timeOnPage: number;
    formFocusTime: number;
    clickCount: number;
  };
  pow?: {
    challenge: string;
    nonce: string;
    difficulty: number;
  };
  challengesPassed?: string[];
  endpoint: string;
}

// Verify proof of work
async function verifyProofOfWork(challenge: string, nonce: string, difficulty: number): Promise<boolean> {
  const data = new TextEncoder().encode(`${challenge}:${nonce}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.startsWith('0'.repeat(difficulty));
}

// Calculate risk score from fingerprint
function calculateFingerprintRisk(fingerprint: VerifyRequest['fingerprint']): number {
  let score = 0;
  
  // Check for headless browser indicators
  if (!fingerprint.webglRenderer || fingerprint.webglRenderer.includes('SwiftShader')) {
    score += RISK_WEIGHTS.headlessBrowser;
  }
  
  // Check for missing WebGL
  if (!fingerprint.webglRenderer) {
    score += RISK_WEIGHTS.missingWebGL;
  }
  
  // Check screen resolution
  if (fingerprint.screenResolution) {
    const [width, height] = fingerprint.screenResolution.split('x').map(Number);
    if (width < 800 || height < 600 || width > 7680 || height > 4320) {
      score += RISK_WEIGHTS.unusualScreen;
    }
  }
  
  // Check audio context
  if (fingerprint.audioContext === false) {
    score += RISK_WEIGHTS.missingAudioContext;
  }
  
  // Check hardware concurrency (most real devices have 2-32 cores)
  if (fingerprint.hardwareConcurrency && (fingerprint.hardwareConcurrency < 2 || fingerprint.hardwareConcurrency > 128)) {
    score += 10;
  }
  
  return score;
}

// Calculate risk score from behavior
function calculateBehaviorRisk(behavior: VerifyRequest['behavior']): number {
  let score = 0;
  
  // No mouse movement is suspicious
  if (behavior.mouseMovements === 0) {
    score += RISK_WEIGHTS.noMouseMovement;
  }
  
  // Very low entropy suggests linear/programmatic movement
  if (behavior.mouseEntropy < 0.5 && behavior.mouseMovements > 0) {
    score += RISK_WEIGHTS.linearMouseMovement;
  }
  
  // Too fast form completion (under 3 seconds)
  if (behavior.timeOnPage < 3000) {
    score += RISK_WEIGHTS.tooFastFormCompletion;
  }
  
  // No keyboard events for a form submission
  if (behavior.keystrokeCount === 0) {
    score += RISK_WEIGHTS.noKeyboardEvents;
  }
  
  // Instant form focus (under 500ms)
  if (behavior.formFocusTime < 500) {
    score += RISK_WEIGHTS.instantFormFocus;
  }
  
  // Very regular keystroke timing (bots type uniformly)
  if (behavior.keystrokeCount > 5 && behavior.avgKeystrokeInterval > 0) {
    const variance = behavior.avgKeystrokeInterval;
    if (variance < 20) { // Less than 20ms variance is suspicious
      score += 15;
    }
  }
  
  return score;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: VerifyRequest = await req.json();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     '0.0.0.0';
    const userAgent = req.headers.get('user-agent') || '';

    console.log(`[UTAAB] Verification request from ${clientIp} for session ${body.sessionId}`);

    // Check if IP is blacklisted
    const { data: isBlacklisted } = await supabase.rpc('is_ip_blacklisted', { _ip: clientIp });
    if (isBlacklisted) {
      console.log(`[UTAAB] IP ${clientIp} is blacklisted`);
      
      await supabase.from('utaab_verifications').insert({
        session_id: body.sessionId,
        fingerprint_hash: body.fingerprint?.hash,
        risk_score: 100,
        verdict: 'blocked',
        ip_address: clientIp,
        user_agent: userAgent,
        behavior_data: body.behavior
      });

      return new Response(JSON.stringify({
        success: false,
        verdict: 'blocked',
        message: 'Access denied',
        riskScore: 100
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check rate limits across all tiers
    let rateLimitViolation = false;
    let highestViolationCount = 0;

    for (const [tier, config] of Object.entries(RATE_LIMIT_CONFIG).filter(([k]) => k.startsWith('tier'))) {
      const { limit, windowMs } = config as { limit: number; windowMs: number };
      const windowStart = new Date(Date.now() - windowMs).toISOString();

      // Get or create rate limit entry
      const { data: existing } = await supabase
        .from('utaab_rate_limits')
        .select('*')
        .eq('identifier', clientIp)
        .eq('tier', tier)
        .gte('window_start', windowStart)
        .single();

      if (existing) {
        // Check if banned
        if (existing.banned_until && new Date(existing.banned_until) > new Date()) {
          console.log(`[UTAAB] IP ${clientIp} is banned until ${existing.banned_until}`);
          return new Response(JSON.stringify({
            success: false,
            verdict: 'blocked',
            message: 'Temporarily blocked due to excessive requests',
            retryAfter: Math.ceil((new Date(existing.banned_until).getTime() - Date.now()) / 1000)
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Check if over limit
        if (existing.request_count >= limit) {
          rateLimitViolation = true;
          const newViolationCount = existing.violation_count + 1;
          highestViolationCount = Math.max(highestViolationCount, newViolationCount);

          // Apply ban if threshold reached
          let bannedUntil = null;
          if (newViolationCount >= RATE_LIMIT_CONFIG.escalation.permBanThreshold) {
            bannedUntil = new Date(Date.now() + RATE_LIMIT_CONFIG.escalation.permBanMs).toISOString();
          } else if (newViolationCount >= RATE_LIMIT_CONFIG.escalation.violationThreshold) {
            bannedUntil = new Date(Date.now() + RATE_LIMIT_CONFIG.escalation.tempBanMs).toISOString();
          }

          await supabase
            .from('utaab_rate_limits')
            .update({
              violation_count: newViolationCount,
              banned_until: bannedUntil,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          // Increment counter
          await supabase
            .from('utaab_rate_limits')
            .update({
              request_count: existing.request_count + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        }
      } else {
        // Create new entry
        await supabase.from('utaab_rate_limits').insert({
          identifier: clientIp,
          tier: tier,
          request_count: 1,
          violation_count: 0,
          window_start: new Date().toISOString()
        });
      }
    }

    // Calculate total risk score
    let riskScore = 0;

    // Add rate limit risk
    if (rateLimitViolation) {
      riskScore += RISK_WEIGHTS.highRateLimit;
    }

    // Calculate fingerprint risk
    if (body.fingerprint) {
      riskScore += calculateFingerprintRisk(body.fingerprint);
    } else {
      riskScore += 30; // Missing fingerprint is suspicious
    }

    // Calculate behavior risk
    if (body.behavior) {
      riskScore += calculateBehaviorRisk(body.behavior);
    } else {
      riskScore += 25; // Missing behavior data is suspicious
    }

    // Verify proof of work if provided
    if (body.pow) {
      const powValid = await verifyProofOfWork(body.pow.challenge, body.pow.nonce, body.pow.difficulty);
      if (!powValid) {
        riskScore += RISK_WEIGHTS.failedPow;
        console.log(`[UTAAB] PoW verification failed for session ${body.sessionId}`);
      }
    }

    // Reduce risk for passed challenges
    if (body.challengesPassed && body.challengesPassed.length > 0) {
      riskScore = Math.max(0, riskScore - (body.challengesPassed.length * 15));
    }

    // Cap risk score at 100
    riskScore = Math.min(100, riskScore);

    // Determine verdict based on risk score
    let verdict: 'pass' | 'fail' | 'challenge' | 'blocked';
    let requiredChallenge: string | null = null;
    let requiredPowDifficulty: number | null = null;

    if (riskScore <= 30) {
      verdict = 'pass';
    } else if (riskScore <= 50) {
      verdict = 'challenge';
      requiredChallenge = 'slider';
      requiredPowDifficulty = 2;
    } else if (riskScore <= 70) {
      verdict = 'challenge';
      requiredChallenge = 'math';
      requiredPowDifficulty = 3;
    } else if (riskScore <= 85) {
      verdict = 'challenge';
      requiredChallenge = 'pattern';
      requiredPowDifficulty = 4;
    } else {
      verdict = 'blocked';
    }

    // If already passed required challenges, upgrade verdict
    if (verdict === 'challenge' && body.challengesPassed?.includes(requiredChallenge!)) {
      verdict = 'pass';
    }

    // Generate verification token for passed verifications
    let token = null;
    if (verdict === 'pass') {
      const tokenData = new TextEncoder().encode(`${body.sessionId}:${Date.now()}:${crypto.randomUUID()}`);
      const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Log verification attempt
    await supabase.from('utaab_verifications').insert({
      session_id: body.sessionId,
      fingerprint_hash: body.fingerprint?.hash,
      risk_score: riskScore,
      challenges_passed: body.challengesPassed || [],
      pow_difficulty: body.pow?.difficulty,
      pow_solution: body.pow?.nonce,
      behavior_data: body.behavior,
      verdict: verdict,
      ip_address: clientIp,
      user_agent: userAgent
    });

    // Generate PoW challenge if needed
    let powChallenge = null;
    if (requiredPowDifficulty) {
      powChallenge = {
        challenge: crypto.randomUUID(),
        difficulty: requiredPowDifficulty
      };
    }

    console.log(`[UTAAB] Verification result for ${body.sessionId}: ${verdict} (risk: ${riskScore})`);

    return new Response(JSON.stringify({
      success: verdict === 'pass',
      verdict,
      riskScore,
      token,
      challenge: requiredChallenge,
      pow: powChallenge,
      message: verdict === 'pass' ? 'Verification successful' :
               verdict === 'challenge' ? 'Please complete the challenge' :
               verdict === 'blocked' ? 'Access denied due to suspicious activity' :
               'Verification failed'
    }), {
      status: verdict === 'blocked' ? 403 : 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[UTAAB] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      verdict: 'fail',
      message: 'Verification error',
      riskScore: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
