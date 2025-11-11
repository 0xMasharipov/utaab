import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { WHATSAPP_CONFIG } from '@/config/whatsapp';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  variant?: 'primary' | 'glass';
  autoRedirect?: boolean;
  redirectDelay?: number;
  className?: string;
  message?: string;
}

export const WhatsAppButton = ({ 
  variant = 'primary', 
  autoRedirect = false,
  redirectDelay = WHATSAPP_CONFIG.redirectDelay,
  className = '',
  message = 'Join our WhatsApp Community'
}: WhatsAppButtonProps) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (autoRedirect && !cancelled) {
      const seconds = Math.ceil(redirectDelay / 1000);
      setCountdown(seconds);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      const redirectTimer = setTimeout(() => {
        if (!cancelled) {
          WHATSAPP_CONFIG.openWhatsApp();
        }
      }, redirectDelay);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimer);
      };
    }
  }, [autoRedirect, redirectDelay, cancelled]);

  const handleClick = () => {
    setCancelled(true);
    WHATSAPP_CONFIG.openWhatsApp();
  };

  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-glass';

  return (
    <div className="space-y-2">
      <Button 
        className={`${buttonClass} w-full ${className}`}
        onClick={handleClick}
        asChild
      >
        <a 
          href={WHATSAPP_CONFIG.getWhatsAppUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          {message}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
      
      {autoRedirect && countdown !== null && !cancelled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            Redirecting in {countdown}s...{' '}
            <button
              onClick={() => setCancelled(true)}
              className="text-accent hover:underline"
            >
              Cancel
            </button>
          </p>
        </motion.div>
      )}
    </div>
  );
};
