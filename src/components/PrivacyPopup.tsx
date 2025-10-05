import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Shield, Cookie, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface PrivacyPopupProps {
  onAccept: () => void;
  onCustomize: () => void;
}

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

const CONSENT_VERSION = 'v2';
const CONSENT_KEY = `utaa-privacy-consent-${CONSENT_VERSION}`;

export const PrivacyPopup = ({ onAccept, onCustomize }: PrivacyPopupProps) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    performance: false,
    marketing: false,
  });
  
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLElement | null>(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Store the element that triggered the popup (privacy button)
    triggerButtonRef.current = document.activeElement as HTMLElement;

    // Check if user has already made a choice for this version
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      // Show popup after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  // Focus management
  useEffect(() => {
    if (isVisible) {
      // Disable page scroll
      document.body.style.overflow = 'hidden';
      
      // Focus first interactive element
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    } else {
      // Re-enable page scroll
      document.body.style.overflow = '';
      
      // Return focus to trigger button
      if (triggerButtonRef.current) {
        triggerButtonRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  // Keyboard support
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close
      if (e.key === 'Escape') {
        handleReject();
      }

      // Tab key for focus trap
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          '[role="dialog"] button:not([disabled]), [role="dialog"] [href], [role="dialog"] input:not([disabled]), [role="dialog"] select:not([disabled]), [role="dialog"] textarea:not([disabled]), [role="dialog"] [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const saveConsent = (prefs: ConsentPreferences) => {
    const consentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
      locale: i18n.language,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
  };

  const handleAccept = () => {
    const acceptedPrefs = {
      essential: true,
      analytics: true,
      performance: true,
      marketing: true,
    };
    saveConsent(acceptedPrefs);
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    const rejectedPrefs = {
      essential: true,
      analytics: false,
      performance: false,
      marketing: false,
    };
    saveConsent(rejectedPrefs);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setIsVisible(false);
    onCustomize();
  };

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const backdropAnimationProps = prefersReducedMotion 
    ? {} 
    : {
        initial: { opacity: 0 },
        exit: { opacity: 0 },
      };

  const modalAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        exit: { opacity: 0, scale: 0.95 },
      };

  const preferencesAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: { height: 0, opacity: 0 },
        exit: { height: 0, opacity: 0 },
      };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            {...backdropAnimationProps}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={handleReject}
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-popup-title"
            aria-describedby="privacy-popup-description"
            {...modalAnimationProps}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.25,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[90%] md:w-[600px] lg:w-[680px] z-[100] max-h-[90vh] overflow-y-auto"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border border-white/10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Shield className="h-6 w-6 text-accent flex-shrink-0 mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h2 
                      id="privacy-popup-title" 
                      className="text-lg sm:text-xl font-bold text-foreground mb-2"
                    >
                      {t('privacy.popup.title')}
                    </h2>
                    <p 
                      id="privacy-popup-description" 
                      className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                    >
                      {t('privacy.popup.description')}
                    </p>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={handleReject}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5 -mt-1 -mr-2 flex-shrink-0"
                  aria-label={t('common.close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Links */}
              <div className="mb-5 pb-5 border-b border-white/10">
                <div className="flex flex-wrap gap-2 text-sm">
                  <button
                    onClick={handleCustomize}
                    className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    {t('privacy.center.links.kvkkNotice')}
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    onClick={handleCustomize}
                    className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    {t('privacy.center.links.privacyPolicy')}
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    onClick={() => setShowPreferences(!showPreferences)}
                    className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors"
                  >
                    <Cookie className="h-4 w-4" />
                    {t('privacy.center.links.cookiePolicy')}
                  </button>
                </div>
              </div>

              {/* Consent Categories (Expandable) */}
              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    {...preferencesAnimationProps}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mb-5 space-y-3 overflow-hidden"
                  >
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      {t('privacy.center.categories')}
                    </h3>

                    {/* Essential */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Switch
                        checked={preferences.essential}
                        disabled
                        aria-label={t('privacy.center.essential')}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {t('privacy.center.essential')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {t('privacy.center.essentialDesc')}
                        </div>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, analytics: checked }))
                        }
                        aria-label={t('privacy.center.analytics')}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {t('privacy.center.analytics')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {t('privacy.center.analyticsDesc')}
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Switch
                        checked={preferences.performance}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, performance: checked }))
                        }
                        aria-label={t('privacy.center.performance')}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {t('privacy.center.performance')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {t('privacy.center.performanceDesc')}
                        </div>
                      </div>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, marketing: checked }))
                        }
                        aria-label={t('privacy.center.marketing')}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {t('privacy.center.marketing')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {t('privacy.center.marketingDesc')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {showPreferences ? (
                  <>
                    <Button
                      ref={firstFocusableRef}
                      onClick={handleSavePreferences}
                      className="btn-primary w-full min-h-[44px]"
                    >
                      {t('privacy.center.savePreferences')}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleAccept}
                        variant="outline"
                        className="glass hover:bg-white/10 min-h-[44px]"
                      >
                        {t('privacy.popup.accept')}
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="ghost"
                        className="hover:bg-white/5 min-h-[44px]"
                      >
                        {t('privacy.popup.reject')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      ref={firstFocusableRef}
                      onClick={handleAccept}
                      className="btn-primary min-h-[44px]"
                    >
                      {t('privacy.popup.accept')}
                    </Button>
                    <Button
                      onClick={() => setShowPreferences(true)}
                      variant="outline"
                      className="glass hover:bg-white/10 min-h-[44px]"
                    >
                      {t('privacy.popup.customize')}
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="ghost"
                      className="hover:bg-white/5 min-h-[44px]"
                    >
                      {t('privacy.popup.reject')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer Note */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground text-center">
                  {t('privacy.center.version')}: {CONSENT_VERSION} • KVKK (Law No. 6698)
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
