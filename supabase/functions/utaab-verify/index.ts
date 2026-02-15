import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS
const allowedOrigins = [
  'https://nxbjgqdehvxszqjoxumx.lovableproject.com',
  'https://utaab.org',
  'https://www.utaab.org',
  Deno.env.get('SITE_URL'),
].filter(Boolean) as string[];

// Patterns to match all Lovable preview domains and localhost
const lovableDomainPatterns = [
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^https:\/\/[a-z0-9-]+\.preview\.lovableproject\.com$/,
  /^https:\/\/id-[a-z0-9-]+\.lovable\.app$/,
  /^http:\/\/localhost:\d+$/,
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.includes(origin) || 
                    lovableDomainPatterns.some(pattern => pattern.test(origin));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : (allowedOrigins[0] || '*'),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Rate limit tiers configuration
const RATE_LIMIT_CONFIG = {
  tier1: { limit: 10, windowMs: 60000 },
  tier2: { limit: 30, windowMs: 300000 },
  tier3: { limit: 100, windowMs: 3600000 },
  escalation: {
    tempBanMs: 3600000,
    permBanMs: 604800000,
    violationThreshold: 3,
    permBanThreshold: 5
  }
};

// Global rate limit configuration
const GLOBAL_RATE_LIMIT = { limit: 500, windowMs: 60000 };

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
  fingerprintRateLimitViolation: 25,
  globalPressure: 15,
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
  if (!fingerprint.webglRenderer || fingerprint.webglRenderer.includes('SwiftShader')) {
    score += RISK_WEIGHTS.headlessBrowser;
  }
  if (!fingerprint.webglRenderer) {
    score += RISK_WEIGHTS.missingWebGL;
  }
  if (fingerprint.screenResolution) {
    const [width, height] = fingerprint.screenResolution.split('x').map(Number);
    if (width < 800 || height < 600 || width > 7680 || height > 4320) {
      score += RISK_WEIGHTS.unusualScreen;
    }
  }
  if (fingerprint.audioContext === false) {
    score += RISK_WEIGHTS.missingAudioContext;
  }
  if (fingerprint.hardwareConcurrency && (fingerprint.hardwareConcurrency < 2 || fingerprint.hardwareConcurrency > 128)) {
    score += 10;
  }
  return score;
}

// Calculate risk score from behavior
function calculateBehaviorRisk(behavior: VerifyRequest['behavior']): number {
  let score = 0;
  if (behavior.mouseMovements === 0) {
    score += RISK_WEIGHTS.noMouseMovement;
  }
  if (behavior.mouseEntropy < 0.5 && behavior.mouseMovements > 0) {
    score += RISK_WEIGHTS.linearMouseMovement;
  }
  if (behavior.timeOnPage < 3000) {
    score += RISK_WEIGHTS.tooFastFormCompletion;
  }
  if (behavior.keystrokeCount === 0) {
    score += RISK_WEIGHTS.noKeyboardEvents;
  }
  if (behavior.formFocusTime < 500) {
    score += RISK_WEIGHTS.instantFormFocus;
  }
  if (behavior.keystrokeCount > 5 && behavior.avgKeystrokeInterval > 0) {
    if (behavior.avgKeystrokeInterval < 20) {
      score += 15;
    }
  }
  return score;
}

// Check rate limits for a given identifier (IP or fingerprint hash)
async function checkIdentifierRateLimit(
  supabase: ReturnType<typeof createClient>,
  identifier: string
): Promise<{ violation: boolean; banned: boolean; retryAfter?: number; highestViolationCount: number }> {
  let violation = false;
  let highestViolationCount = 0;

  for (const [tier, config] of Object.entries(RATE_LIMIT_CONFIG).filter(([k]) => k.startsWith('tier'))) {
    const { limit, windowMs } = config as { limit: number; windowMs: number };
    const windowStart = new Date(Date.now() - windowMs).toISOString();

    const { data: existing } = await supabase
      .from('utaab_rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('tier', tier)
      .gte('window_start', windowStart)
      .single();

    if (existing) {
      if (existing.banned_until && new Date(existing.banned_until) > new Date()) {
        return {
          violation: true,
          banned: true,
          retryAfter: Math.ceil((new Date(existing.banned_until).getTime() - Date.now()) / 1000),
          highestViolationCount: existing.violation_count
        };
      }

      if (existing.request_count >= limit) {
        violation = true;
        const newViolationCount = existing.violation_count + 1;
        highestViolationCount = Math.max(highestViolationCount, newViolationCount);

        let bannedUntil = null;
        if (newViolationCount >= RATE_LIMIT_CONFIG.escalation.permBanThreshold) {
          bannedUntil = new Date(Date.now() + RATE_LIMIT_CONFIG.escalation.permBanMs).toISOString();
        } else if (newViolationCount >= RATE_LIMIT_CONFIG.escalation.violationThreshold) {
          bannedUntil = new Date(Date.now() + RATE_LIMIT_CONFIG.escalation.tempBanMs).toISOString();
        }

        await supabase
          .from('utaab_rate_limits')
          .update({ violation_count: newViolationCount, banned_until: bannedUntil, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('utaab_rate_limits')
          .update({ request_count: existing.request_count + 1, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      }
    } else {
      await supabase.from('utaab_rate_limits').insert({
        identifier,
        tier,
        request_count: 1,
        violation_count: 0,
        window_start: new Date().toISOString()
      });
    }
  }

  return { violation, banned: false, highestViolationCount };
}

// Check global endpoint rate limit and return pressure status
async function checkGlobalRateLimit(
  supabase: ReturnType<typeof createClient>,
  endpoint: string,
  clientIp: string,
  userAgent: string
): Promise<{ globalPressure: boolean }> {
  const windowStart = new Date(Date.now() - GLOBAL_RATE_LIMIT.windowMs).toISOString();

  const { data: existing } = await supabase
    .from('utaab_global_rate_limits')
    .select('*')
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart)
    .order('window_start', { ascending: false })
    .limit(1)
    .single();

  let currentCount = 1;

  if (existing) {
    currentCount = existing.request_count + 1;
    await supabase
      .from('utaab_global_rate_limits')
      .update({ request_count: currentCount })
      .eq('id', existing.id);
  } else {
    await supabase.from('utaab_global_rate_limits').insert({
      endpoint,
      request_count: 1,
      window_start: new Date().toISOString()
    });
  }

  // Log security event if global limit breached
  if (currentCount >= GLOBAL_RATE_LIMIT.limit) {
    await supabase.rpc('log_security_event', {
      _event_type: 'ddos_global_limit',
      _severity: 'high',
      _ip: clientIp,
      _endpoint: endpoint,
      _user_agent: userAgent,
      _details: JSON.stringify({ request_count: currentCount, limit: GLOBAL_RATE_LIMIT.limit })
    });
  }

  // Pressure if >80% of limit
  const globalPressure = currentCount >= GLOBAL_RATE_LIMIT.limit * 0.8;
  return { globalPressure };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

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
        success: false, verdict: 'blocked', message: 'Access denied', riskScore: 100
      }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // === 1. IP Rate Limiting ===
    const ipResult = await checkIdentifierRateLimit(supabase, clientIp);
    if (ipResult.banned) {
      return new Response(JSON.stringify({
        success: false, verdict: 'blocked',
        message: 'Temporarily blocked due to excessive requests',
        retryAfter: ipResult.retryAfter
      }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // === 2. Fingerprint Rate Limiting ===
    let fingerprintRateLimitViolation = false;
    if (body.fingerprint?.hash) {
      const fpResult = await checkIdentifierRateLimit(supabase, body.fingerprint.hash);
      if (fpResult.banned) {
        console.log(`[UTAAB] Fingerprint ${body.fingerprint.hash} is banned`);
        return new Response(JSON.stringify({
          success: false, verdict: 'blocked',
          message: 'Temporarily blocked due to excessive requests',
          retryAfter: fpResult.retryAfter
        }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      fingerprintRateLimitViolation = fpResult.violation;
    }

    // === 3. Global Endpoint Rate Limiting ===
    const { globalPressure } = await checkGlobalRateLimit(supabase, body.endpoint || 'unknown', clientIp, userAgent);

    // === Calculate total risk score ===
    let riskScore = 0;

    if (ipResult.violation) riskScore += RISK_WEIGHTS.highRateLimit;
    if (fingerprintRateLimitViolation) riskScore += RISK_WEIGHTS.fingerprintRateLimitViolation;
    if (globalPressure) riskScore += RISK_WEIGHTS.globalPressure;

    if (body.fingerprint) {
      riskScore += calculateFingerprintRisk(body.fingerprint);
    } else {
      riskScore += 30;
    }

    if (body.behavior) {
      riskScore += calculateBehaviorRisk(body.behavior);
    } else {
      riskScore += 25;
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

    riskScore = Math.min(100, riskScore);

    // Determine verdict
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

    // === 4. Adaptive PoW: force minimum difficulty 3 under global pressure ===
    if (globalPressure && requiredPowDifficulty !== null && requiredPowDifficulty < 3) {
      requiredPowDifficulty = 3;
    }
    if (globalPressure && verdict === 'pass') {
      // Under pressure, even passing requests get a PoW challenge
      requiredPowDifficulty = 3;
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

    // Log verification
    await supabase.from('utaab_verifications').insert({
      session_id: body.sessionId,
      fingerprint_hash: body.fingerprint?.hash,
      risk_score: riskScore,
      challenges_passed: body.challengesPassed || [],
      pow_difficulty: body.pow?.difficulty,
      pow_solution: body.pow?.nonce,
      behavior_data: body.behavior,
      verdict,
      ip_address: clientIp,
      user_agent: userAgent,
      token,
      expires_at: token ? new Date(Date.now() + 3600000).toISOString() : null
    });

    // Generate PoW challenge if needed
    let powChallenge = null;
    if (requiredPowDifficulty) {
      powChallenge = { challenge: crypto.randomUUID(), difficulty: requiredPowDifficulty };
    }

    console.log(`[UTAAB] Result for ${body.sessionId}: ${verdict} (risk: ${riskScore}, globalPressure: ${globalPressure})`);

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
      success: false, verdict: 'fail', message: 'Verification error', riskScore: 0
    }), { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } });
  }
});
