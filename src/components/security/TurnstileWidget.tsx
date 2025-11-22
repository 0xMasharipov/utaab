import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
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

// Cloudflare Turnstile Site Key (public - it's safe to be in code)
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
        const turnstile = (window as any).turnstile;
        if (turnstile && widgetIdRef.current) {
          turnstile.reset(widgetIdRef.current);
          setResponseToken(null);
          setIsVerified(false);
          setError(null);
          console.log('[Turnstile] Widget reset');
        }
      },
      execute: () => {
        const turnstile = (window as any).turnstile;
        if (turnstile && widgetIdRef.current) {
          turnstile.execute(widgetIdRef.current);
          console.log('[Turnstile] Widget executed');
        }
      },
      getResponse: () => {
        const turnstile = (window as any).turnstile;
        if (turnstile && widgetIdRef.current) {
          return turnstile.getResponse(widgetIdRef.current);
        }
        return responseToken;
      },
      isVerified,
    }));

    useEffect(() => {
      // Load Turnstile script with explicit rendering mode
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
        setError('script_load_failed');
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
        setError('api_not_available');
        return;
      }

      // Remove existing widget if any
      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
      }

      console.log('[Turnstile] Rendering widget with configuration:', {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        size,
        action,
        execution,
        retry,
        appearance,
      });

      // Render new widget with enhanced configuration
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
            console.log('[Turnstile] Verification successful', action ? `(action: ${action})` : '');
            setResponseToken(token);
            setIsVerified(true);
            setError(null);
            onVerify(token);
          },
          'error-callback': (errorCode?: string) => {
            console.error('[Turnstile] Verification error:', errorCode);
            setIsVerified(false);
            setResponseToken(null);
            setError(errorCode || 'unknown_error');
            onError?.(errorCode);
          },
          'expired-callback': () => {
            console.log('[Turnstile] Token expired');
            setResponseToken(null);
            setIsVerified(false);
            onExpire?.();
          },
        });
      } catch (err) {
        console.error('[Turnstile] Error rendering widget:', err);
        setError('render_failed');
      }

      return () => {
        if (widgetIdRef.current) {
          turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
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
      <div className="flex flex-col items-center justify-center my-4">
        {isLoading && (
          <div className="text-muted-foreground text-sm animate-pulse">
            Loading verification...
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              {error === 'script_load_failed'
                ? 'Failed to load verification service'
                : error === 'api_not_available'
                ? 'Verification service unavailable'
                : error === 'render_failed'
                ? 'Failed to render verification widget'
                : 'Verification error occurred'}
            </span>
          </div>
        )}
        <div ref={containerRef} />
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
