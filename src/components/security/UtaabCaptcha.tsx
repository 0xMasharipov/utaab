import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useUtaab, UtaabVerdict, ChallengeType } from '@/hooks/useUtaab';
import { UtaabChallenge } from './UtaabChallenge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export interface UtaabCaptchaProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  mode?: 'invisible' | 'visible' | 'interactive';
  theme?: 'light' | 'dark' | 'auto';
  difficulty?: 'low' | 'medium' | 'high' | 'adaptive';
  endpoint?: string;
  className?: string;
}

export interface UtaabCaptchaRef {
  reset: () => void;
  execute: () => Promise<boolean>;
  getToken: () => string | null;
  isVerified: () => boolean;
}

export const UtaabCaptcha = forwardRef<UtaabCaptchaRef, UtaabCaptchaProps>(
  ({ 
    onVerify, 
    onError, 
    onExpire,
    mode = 'visible',
    theme = 'auto',
    difficulty = 'adaptive',
    endpoint = 'default',
    className = ''
  }, ref) => {
    const { t } = useTranslation();
    const [challengesPassed, setChallengesPassed] = useState<string[]>([]);
    const [showPowProgress, setShowPowProgress] = useState(false);

    const {
      isVerified,
      isLoading,
      verdict,
      riskScore,
      token,
      challenge,
      powChallenge,
      error,
      verify,
      reset,
      solvePow
    } = useUtaab({
      endpoint,
      autoStart: true,
      onRiskScoreChange: (score) => {
        console.log(`[UTAAB] Risk score: ${score}`);
      },
      onVerdictChange: (v) => {
        if (v === 'blocked' || v === 'fail') {
          onError?.(error || 'Verification failed');
        }
      }
    });

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        setChallengesPassed([]);
        reset();
      },
      execute: async () => {
        const success = await verify(challengesPassed);
        return success;
      },
      getToken: () => token,
      isVerified: () => isVerified
    }), [reset, verify, token, isVerified, challengesPassed]);

    // Auto-verify in invisible mode
    useEffect(() => {
      if (mode === 'invisible') {
        verify();
      }
    }, [mode]);

    // Notify parent when verified
    useEffect(() => {
      if (isVerified && token) {
        onVerify(token);
      }
    }, [isVerified, token, onVerify]);

    // Handle challenge completion
    const handleChallengeComplete = async (success: boolean) => {
      if (success && challenge) {
        const newChallengesPassed = [...challengesPassed, challenge];
        setChallengesPassed(newChallengesPassed);

        // If PoW is required, solve it first
        if (powChallenge) {
          setShowPowProgress(true);
          await solvePow();
          setShowPowProgress(false);
        }

        // Re-verify with passed challenges
        await verify(newChallengesPassed);
      }
    };

    // Determine difficulty based on risk score
    const getChallengefficulty = (): 'low' | 'medium' | 'high' => {
      if (difficulty !== 'adaptive') return difficulty;
      if (riskScore <= 40) return 'low';
      if (riskScore <= 60) return 'medium';
      return 'high';
    };

    // Get status color
    const getStatusColor = () => {
      switch (verdict) {
        case 'pass': return 'text-green-500';
        case 'fail':
        case 'blocked': return 'text-red-500';
        case 'challenge': return 'text-yellow-500';
        default: return 'text-muted-foreground';
      }
    };

    // Invisible mode - just verify silently
    if (mode === 'invisible') {
      return null;
    }

    return (
      <div className={`w-full ${className}`}>
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && !showPowProgress && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 p-4 border rounded-lg bg-card"
            >
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {t('utaab.verifying', 'Verifying...')}
              </span>
            </motion.div>
          )}

          {/* PoW Progress */}
          {showPowProgress && (
            <motion.div
              key="pow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card"
            >
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {t('utaab.solvingChallenge', 'Solving computational challenge...')}
              </span>
            </motion.div>
          )}

          {/* Verified State */}
          {isVerified && !isLoading && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between p-4 border border-green-500/30 rounded-lg bg-green-500/10"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t('utaab.verified', 'Verified')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('utaab.humanConfirmed', 'Human confirmed')}
                  </p>
                </div>
              </div>
              <Shield className="w-8 h-8 text-green-500/50" />
            </motion.div>
          )}

          {/* Challenge State */}
          {verdict === 'challenge' && challenge && !isLoading && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UtaabChallenge
                type={challenge}
                onComplete={handleChallengeComplete}
                onRefresh={() => verify(challengesPassed)}
                difficulty={getChallengefficulty()}
              />
            </motion.div>
          )}

          {/* Error/Blocked State */}
          {(verdict === 'fail' || verdict === 'blocked') && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg bg-red-500/10"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t('utaab.verificationFailed', 'Verification Failed')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {error || t('utaab.tryAgain', 'Please try again')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setChallengesPassed([]);
                  reset();
                  verify();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('common.retry', 'Retry')}
              </Button>
            </motion.div>
          )}

          {/* Initial/Interactive State */}
          {verdict === 'pending' && !isLoading && mode === 'interactive' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between p-4 border rounded-lg bg-card cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => verify()}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-muted-foreground rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-muted-foreground rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-foreground">
                  {t('utaab.clickToVerify', 'Click to verify you are human')}
                </span>
              </div>
              <Shield className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          )}

          {/* Visible Mode - Auto verify button */}
          {verdict === 'pending' && !isLoading && mode === 'visible' && (
            <motion.div
              key="visible-initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 border rounded-lg bg-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    UTAAB Security
                  </span>
                </div>
              </div>
              <Button
                onClick={() => verify()}
                className="w-full"
                size="sm"
              >
                {t('utaab.verify', 'Verify')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UTAAB Branding */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <Shield className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[10px] text-muted-foreground/50">
            Protected by UTAAB
          </span>
        </div>
      </div>
    );
  }
);

UtaabCaptcha.displayName = 'UtaabCaptcha';
