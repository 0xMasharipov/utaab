import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { collectFingerprint, BrowserFingerprint, detectHeadlessBrowser } from '@/lib/fingerprint';
import { solveProofOfWork, ProofOfWorkSolution, ProofOfWorkChallenge } from '@/lib/proofOfWork';
import { useUtaabBehavior, BehaviorData } from './useUtaabBehavior';

export type UtaabVerdict = 'pending' | 'pass' | 'fail' | 'challenge' | 'blocked';
export type ChallengeType = 'slider' | 'math' | 'pattern' | 'text';

export interface UtaabConfig {
  autoStart?: boolean;
  endpoint?: string;
  onRiskScoreChange?: (score: number) => void;
  onVerdictChange?: (verdict: UtaabVerdict) => void;
}

export interface UtaabState {
  isVerified: boolean;
  isLoading: boolean;
  verdict: UtaabVerdict;
  riskScore: number;
  token: string | null;
  challenge: ChallengeType | null;
  powChallenge: ProofOfWorkChallenge | null;
  error: string | null;
}

export interface UseUtaabReturn extends UtaabState {
  verify: (challengesPassed?: string[]) => Promise<boolean>;
  reset: () => void;
  startBehaviorTracking: () => void;
  stopBehaviorTracking: () => void;
  getBehaviorData: () => BehaviorData;
  solvePow: () => Promise<ProofOfWorkSolution | null>;
}

/**
 * Main UTAAB Anti-bot hook
 */
export function useUtaab(config: UtaabConfig = {}): UseUtaabReturn {
  const { autoStart = true, endpoint = 'default', onRiskScoreChange, onVerdictChange } = config;

  const [state, setState] = useState<UtaabState>({
    isVerified: false,
    isLoading: false,
    verdict: 'pending',
    riskScore: 0,
    token: null,
    challenge: null,
    powChallenge: null,
    error: null
  });

  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const fingerprintRef = useRef<BrowserFingerprint | null>(null);
  const {
    startTracking,
    stopTracking,
    getBehaviorData,
    resetTracking,
    isTracking
  } = useUtaabBehavior();

  // Auto-start behavior tracking
  useEffect(() => {
    if (autoStart && !isTracking) {
      startTracking();
    }
    
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [autoStart, isTracking, startTracking, stopTracking]);

  // Collect fingerprint on mount
  useEffect(() => {
    const collectFp = async () => {
      try {
        fingerprintRef.current = await collectFingerprint();
        
        // Check for headless browser early
        if (detectHeadlessBrowser()) {
          console.warn('[UTAAB] Headless browser detected');
        }
      } catch (error) {
        console.error('[UTAAB] Fingerprint collection error:', error);
      }
    };

    collectFp();
  }, []);

  // Notify on risk score change
  useEffect(() => {
    if (onRiskScoreChange && state.riskScore > 0) {
      onRiskScoreChange(state.riskScore);
    }
  }, [state.riskScore, onRiskScoreChange]);

  // Notify on verdict change
  useEffect(() => {
    if (onVerdictChange && state.verdict !== 'pending') {
      onVerdictChange(state.verdict);
    }
  }, [state.verdict, onVerdictChange]);

  // Solve proof of work
  const solvePow = useCallback(async (): Promise<ProofOfWorkSolution | null> => {
    if (!state.powChallenge) return null;

    try {
      const solution = await solveProofOfWork(
        state.powChallenge.challenge,
        state.powChallenge.difficulty,
        (attempts) => {
          console.log(`[UTAAB] PoW progress: ${attempts} attempts`);
        }
      );
      return solution;
    } catch (error) {
      console.error('[UTAAB] PoW solving error:', error);
      return null;
    }
  }, [state.powChallenge]);

  // Verify with server
  const verify = useCallback(async (challengesPassed?: string[]): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Ensure we have fingerprint
      if (!fingerprintRef.current) {
        fingerprintRef.current = await collectFingerprint();
      }

      // Get behavior data
      const behaviorData = getBehaviorData();

      // Solve PoW if required
      let powSolution: ProofOfWorkSolution | undefined;
      if (state.powChallenge) {
        const solution = await solvePow();
        if (solution) {
          powSolution = solution;
        }
      }

      const { data, error } = await supabase.functions.invoke('utaab-verify', {
        body: {
          sessionId: sessionIdRef.current,
          fingerprint: fingerprintRef.current,
          behavior: behaviorData,
          pow: powSolution,
          challengesPassed: challengesPassed || [],
          endpoint
        }
      });

      if (error) {
        throw new Error(error.message || 'Verification failed');
      }

      const { success, verdict, riskScore, token, challenge, pow, message } = data;

      setState(prev => ({
        ...prev,
        isLoading: false,
        isVerified: success,
        verdict: verdict as UtaabVerdict,
        riskScore: riskScore || 0,
        token: token || null,
        challenge: challenge as ChallengeType || null,
        powChallenge: pow || null,
        error: !success && verdict !== 'challenge' ? message : null
      }));

      return success;
    } catch (error) {
      console.error('[UTAAB] Verification error:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        verdict: 'fail',
        error: error instanceof Error ? error.message : 'Verification failed'
      }));

      return false;
    }
  }, [endpoint, getBehaviorData, state.powChallenge, solvePow]);

  // Reset state
  const reset = useCallback(() => {
    sessionIdRef.current = crypto.randomUUID();
    fingerprintRef.current = null;
    resetTracking();

    setState({
      isVerified: false,
      isLoading: false,
      verdict: 'pending',
      riskScore: 0,
      token: null,
      challenge: null,
      powChallenge: null,
      error: null
    });
  }, [resetTracking]);

  return {
    ...state,
    verify,
    reset,
    startBehaviorTracking: startTracking,
    stopBehaviorTracking: stopTracking,
    getBehaviorData,
    solvePow
  };
}
