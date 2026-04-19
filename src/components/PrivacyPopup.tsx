import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Xmark, Shield, Cookie, Page } from 'iconoir-react';
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={handleReject}
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
              className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="rounded-3xl p-7 sm:p-9 bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-150 border border-white/15 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-7">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-white/60" aria-hidden="true" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        id="privacy-popup-title"
                        className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight"
                      >
                        {t('privacy.popup.title')}
                      </h2>
                    </div>
                  </div>
                  <button
                    ref={closeButtonRef}
                    onClick={handleReject}
                    className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-colors flex items-center justify-center flex-shrink-0"
                    aria-label={t('common.close')}
                  >
                    <Xmark className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <p
                  id="privacy-popup-description"
                  className="text-sm sm:text-base text-white/55 leading-[1.7] mb-7"
                >
                  {t('privacy.popup.description')}
                </p>

                {/* Quick Links */}
                <div className="mb-7 pb-7 border-b border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <button
                      onClick={handleCustomize}
                      className="inline-flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors font-medium hover:underline underline-offset-4"
                    >
                       <Page className="h-4 w-4" strokeWidth={1.5} />
                      {t('privacy.center.links.kvkkNotice')}
                    </button>
                    <span className="text-white/15">•</span>
                    <button
                      onClick={handleCustomize}
                      className="inline-flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors font-medium hover:underline underline-offset-4"
                    >
                      <Page className="h-4 w-4" strokeWidth={1.5} />
                      {t('privacy.center.links.privacyPolicy')}
                    </button>
                    <span className="text-white/15">•</span>
                    <button
                      onClick={() => setShowPreferences(!showPreferences)}
                      className="inline-flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors font-medium hover:underline underline-offset-4"
                    >
                      <Cookie className="h-4 w-4" strokeWidth={1.5} />
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
                      className="mb-7 space-y-3 overflow-hidden"
                    >
                      <h3 className="text-base font-semibold text-foreground mb-4">
                        {t('privacy.center.categories')}
                      </h3>

                      {/* Essential */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                        <Switch
                          checked={preferences.essential}
                          disabled
                          aria-label={t('privacy.center.essential')}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground mb-1">
                            {t('privacy.center.essential')}
                          </div>
                          <div className="text-xs text-white/50 leading-relaxed">
                            {t('privacy.center.essentialDesc')}
                          </div>
                        </div>
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                        <Switch
                          checked={preferences.analytics}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, analytics: checked }))
                          }
                          aria-label={t('privacy.center.analytics')}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground mb-1">
                            {t('privacy.center.analytics')}
                          </div>
                          <div className="text-xs text-white/50 leading-relaxed">
                            {t('privacy.center.analyticsDesc')}
                          </div>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                        <Switch
                          checked={preferences.performance}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, performance: checked }))
                          }
                          aria-label={t('privacy.center.performance')}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground mb-1">
                            {t('privacy.center.performance')}
                          </div>
                          <div className="text-xs text-white/50 leading-relaxed">
                            {t('privacy.center.performanceDesc')}
                          </div>
                        </div>
                      </div>

                      {/* Marketing */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                        <Switch
                          checked={preferences.marketing}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, marketing: checked }))
                          }
                          aria-label={t('privacy.center.marketing')}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground mb-1">
                            {t('privacy.center.marketing')}
                          </div>
                          <div className="text-xs text-white/50 leading-relaxed">
                            {t('privacy.center.marketingDesc')}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-col gap-3.5">
                  {showPreferences ? (
                    <>
                      <Button
                        ref={firstFocusableRef}
                        onClick={handleSavePreferences}
                        className="bg-[hsl(217,80%,42%)] hover:bg-[hsl(217,80%,48%)] text-white w-full min-h-[48px] text-base font-semibold rounded-xl transition-all hover:-translate-y-px"
                      >
                        {t('privacy.center.savePreferences')}
                      </Button>
                      <div className="grid grid-cols-2 gap-3.5">
                        <Button
                          onClick={handleAccept}
                          variant="outline"
                          className="bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] min-h-[48px] font-medium rounded-xl transition-all"
                        >
                          {t('privacy.popup.accept')}
                        </Button>
                        <Button
                          onClick={handleReject}
                          variant="ghost"
                          className="text-white/40 hover:text-white/60 hover:bg-white/[0.04] min-h-[48px] font-medium rounded-xl transition-all"
                        >
                          {t('privacy.popup.reject')}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <Button
                        ref={firstFocusableRef}
                        onClick={handleAccept}
                        className="bg-[hsl(217,80%,42%)] hover:bg-[hsl(217,80%,48%)] text-white min-h-[48px] text-base font-semibold rounded-xl transition-all hover:-translate-y-px"
                      >
                        {t('privacy.popup.accept')}
                      </Button>
                      <Button
                        onClick={() => setShowPreferences(true)}
                        variant="outline"
                        className="bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] min-h-[48px] font-medium rounded-xl transition-all"
                      >
                        {t('privacy.popup.customize')}
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="ghost"
                        className="text-white/40 hover:text-white/60 hover:bg-white/[0.04] min-h-[48px] font-medium rounded-xl transition-all"
                      >
                        {t('privacy.popup.reject')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Footer Note */}
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <p className="text-xs text-white/30 text-center leading-relaxed">
                    {t('privacy.center.version')}: {CONSENT_VERSION} • KVKK (Law No. 6698)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
