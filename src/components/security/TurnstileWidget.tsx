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
const TURNSTILE_SITE_KEY = '0x4AAAAAAAzcj4KvUqH-djbJ';

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

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const turnstile = (window as any).turnstile;
    if (!turnstile) return;

    // Remove existing widget if any
    if (widgetIdRef.current) {
      turnstile.remove(widgetIdRef.current);
    }

    // Render new widget
    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme,
      size,
      language: i18n.language,
      callback: (token: string) => {
        onVerify(token);
      },
      'error-callback': () => {
        onError?.();
      },
      'expired-callback': () => {
        onExpire?.();
      },
    });

    return () => {
      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isLoaded, theme, size, i18n.language, onVerify, onError, onExpire]);

  return (
    <div className="flex justify-center my-4">
      <div ref={containerRef} />
    </div>
  );
};
