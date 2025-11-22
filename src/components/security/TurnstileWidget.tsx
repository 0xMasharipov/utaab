import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error?: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  action?: string;
  cData?: string;
  execution?: 'render' | 'execute';
  retry?: 'auto' | 'never';
  retryInterval?: number;
  refreshExpired?: 'auto' | 'manual' | 'never';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

export interface TurnstileWidgetRef {
  reset: () => void;
  execute: () => void;
  getResponse: () => string | null;
  isVerified: boolean;
}

// Cloudflare Turnstile Site Key (public - safe to be in code)
const TURNSTILE_SITE_KEY = '0x4AAAAAACCU59q4dk2ggTF_';

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  (
    {
      onVerify,
      onError,
      onExpire,
      theme = 'dark',
      size = 'normal',
      action,
      cData,
      execution = 'render',
      retry = 'auto',
      retryInterval = 8000,
      refreshExpired = 'auto',
      appearance = 'always',
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [responseToken, setResponseToken] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && (window as any).turnstile) {
          console.log('[Turnstile] Resetting widget');
          (window as any).turnstile.reset(widgetIdRef.current);
          setResponseToken(null);
          setIsVerified(false);
          setError(null);
        }
      },
      execute: () => {
        if (widgetIdRef.current && (window as any).turnstile) {
          console.log('[Turnstile] Executing widget');
          (window as any).turnstile.execute(widgetIdRef.current);
        }
      },
      getResponse: () => responseToken,
      isVerified,
    }));

    useEffect(() => {
      // Check if script already loaded
      if ((window as any).turnstile) {
        console.log('[Turnstile] Script already loaded');
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      // Load Turnstile script with explicit rendering
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('[Turnstile] Script loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      script.onerror = (err) => {
        console.error('[Turnstile] Failed to load script:', err);
        setIsLoading(false);
        setError('Failed to load CAPTCHA. Please refresh the page.');
        onError?.('script_load_failed');
      };
      
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }, [onError]);

    useEffect(() => {
      if (!isLoaded || !containerRef.current) return;

      const turnstile = (window as any).turnstile;
      if (!turnstile) {
        console.error('[Turnstile] Turnstile API not available');
        setError('CAPTCHA service unavailable');
        return;
      }

      // Remove existing widget if any
      if (widgetIdRef.current) {
        try {
          turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.warn('[Turnstile] Error removing widget:', e);
        }
      }

      console.log('[Turnstile] Rendering widget with config:', {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        size,
        action,
        execution,
        appearance,
      });

      // Render new widget with full configuration
      try {
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          size,
          action,
          cData,
          execution,
          retry,
          'retry-interval': retryInterval,
          'refresh-expired': refreshExpired,
          appearance,
          language: i18n.language,
          callback: (token: string) => {
            console.log('[Turnstile] Verification successful');
            setResponseToken(token);
            setIsVerified(true);
            setError(null);
            onVerify(token);
          },
          'error-callback': (errorCode?: string) => {
            console.error('[Turnstile] Verification error:', errorCode);
            setIsVerified(false);
            setResponseToken(null);
            setError(errorCode || 'Verification failed');
            onError?.(errorCode);
          },
          'expired-callback': () => {
            console.log('[Turnstile] Token expired');
            setResponseToken(null);
            setIsVerified(false);
            setError(null);
            onExpire?.();
          },
        });
        
        console.log('[Turnstile] Widget rendered with ID:', widgetIdRef.current);
      } catch (err) {
        console.error('[Turnstile] Error rendering widget:', err);
        setError('Failed to initialize CAPTCHA');
      }

      return () => {
        if (widgetIdRef.current) {
          try {
            turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          } catch (e) {
            console.warn('[Turnstile] Error cleaning up widget:', e);
          }
        }
      };
    }, [
      isLoaded,
      theme,
      size,
      action,
      cData,
      execution,
      retry,
      retryInterval,
      refreshExpired,
      appearance,
      i18n.language,
      onVerify,
      onError,
      onExpire,
    ]);

    return (
      <div className="flex flex-col items-center justify-center my-4 min-h-[78px]">
        {isLoading && (
          <div className="text-muted-foreground text-sm animate-pulse">
            Loading verification...
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4 max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div ref={containerRef} className="flex items-center justify-center" />
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
