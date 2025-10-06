import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityConfig {
  captchaEnabled: boolean;
  minFormTime: number; // seconds
}

export const useSecurity = () => {
  const [config, setConfig] = useState<SecurityConfig>({
    captchaEnabled: true,
    minFormTime: 2,
  });
  const [formStartTime] = useState(Date.now());

  // Load security config
  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase
        .from('security_settings')
        .select('*')
        .in('setting_key', ['captcha_enabled', 'min_form_completion_time']);

      if (data) {
        const captchaSetting = data.find((s) => s.setting_key === 'captcha_enabled');
        const timingSetting = data.find((s) => s.setting_key === 'min_form_completion_time');

        setConfig({
          captchaEnabled: (captchaSetting?.setting_value as any)?.enabled ?? true,
          minFormTime: (timingSetting?.setting_value as any)?.seconds ?? 2,
        });
      }
    };

    loadConfig();
  }, []);

  // Verify CAPTCHA token
  const verifyCaptcha = useCallback(async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-turnstile', {
        body: { token },
      });

      if (error) throw error;
      return data?.success ?? false;
    } catch (error) {
      console.error('CAPTCHA verification error:', error);
      return false;
    }
  }, []);

  // Check rate limit
  const checkRateLimit = useCallback(
    async (
      identifier: string,
      endpoint: string,
      customLimit?: number
    ): Promise<{ allowed: boolean; retryAfter?: number }> => {
      try {
        const { data, error } = await supabase.functions.invoke('check-rate-limit', {
          body: {
            identifier,
            endpoint,
            ...(customLimit && { limit: customLimit }),
          },
        });

        if (error) {
          // Fail open - allow the request if rate limit check fails
          console.error('Rate limit check error:', error);
          return { allowed: true };
        }

        return {
          allowed: data?.allowed ?? true,
          retryAfter: data?.retry_after,
        };
      } catch (error) {
        console.error('Rate limit error:', error);
        return { allowed: true };
      }
    },
    []
  );

  // Validate form timing (bot detection)
  const validateFormTiming = useCallback((): boolean => {
    const elapsed = (Date.now() - formStartTime) / 1000;
    return elapsed >= config.minFormTime;
  }, [formStartTime, config.minFormTime]);

  // Log security event
  const logSecurityEvent = useCallback(
    async (
      eventType: string,
      severity: 'low' | 'medium' | 'high' | 'critical',
      details?: Record<string, any>
    ) => {
      try {
        await supabase.rpc('log_security_event', {
          _event_type: eventType,
          _severity: severity,
          _endpoint: window.location.pathname,
          _details: details || {},
        });
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    },
    []
  );

  return {
    config,
    verifyCaptcha,
    checkRateLimit,
    validateFormTiming,
    logSecurityEvent,
  };
};
