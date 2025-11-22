import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

// Cloudflare Turnstile Site Key (public - it's safe to be in code)
const TURNSTILE_SITE_KEY = '0x4AAAAAACCU59q4dk2ggTF_';

export const TurnstileWidget = ({
  onVerify,
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal',
}: TurnstileWidgetProps) => {
  const { i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('[Turnstile] Script loaded successfully');
      setIsLoaded(true);
      setIsLoading(false);
    };
    script.onerror = (error) => {
      console.error('[Turnstile] Failed to load script:', error);
      setIsLoading(false);
      onError?.();
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
      return;
    }

    // Remove existing widget if any
    if (widgetIdRef.current) {
      turnstile.remove(widgetIdRef.current);
    }

    console.log('[Turnstile] Rendering widget with site key:', TURNSTILE_SITE_KEY);

    // Render new widget
    try {
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        size,
        language: i18n.language,
        callback: (token: string) => {
          console.log('[Turnstile] Verification successful');
          onVerify(token);
        },
        'error-callback': () => {
          console.error('[Turnstile] Verification error');
          onError?.();
        },
        'expired-callback': () => {
          console.log('[Turnstile] Token expired');
          onExpire?.();
        },
      });
    } catch (error) {
      console.error('[Turnstile] Error rendering widget:', error);
    }

    return () => {
      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isLoaded, theme, size, i18n.language, onVerify, onError, onExpire]);

  return (
    <div className="flex justify-center my-4">
      {isLoading && (
        <div className="text-muted-foreground text-sm">Loading verification...</div>
      )}
      <div ref={containerRef} />
    </div>
  );
};
