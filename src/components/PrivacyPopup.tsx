import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PrivacyPopupProps {
  onAccept: () => void;
  onCustomize: () => void;
}

export const PrivacyPopup = ({ onAccept, onCustomize }: PrivacyPopupProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('utaa-privacy-consent');
    if (!hasConsent) {
      // Show popup after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('utaa-privacy-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('utaa-privacy-consent', 'rejected');
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setIsVisible(false);
    onCustomize();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={() => setIsVisible(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[90%] md:w-[85%] max-w-4xl z-[100] max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 pr-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                    {t('privacy.popup.title')}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t('privacy.popup.description')}
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-2 sm:ml-4 flex-shrink-0 p-1"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <Button
                  onClick={handleAccept}
                  className="btn-primary flex-1 min-h-[44px]"
                >
                  {t('privacy.popup.accept')}
                </Button>
                <Button
                  onClick={handleCustomize}
                  variant="outline"
                  className="glass hover:bg-white/10 flex-1 min-h-[44px]"
                >
                  {t('privacy.popup.customize')}
                </Button>
                <Button
                  onClick={handleReject}
                  variant="ghost"
                  className="hover:bg-white/5 flex-1 min-h-[44px]"
                >
                  {t('privacy.popup.reject')}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
