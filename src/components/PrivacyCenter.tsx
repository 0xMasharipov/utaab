import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PrivacyCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyCenter = ({ isOpen, onClose }: PrivacyCenterProps) => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    performance: false,
    marketing: false,
  });

  const handleSave = () => {
    localStorage.setItem('utaa-privacy-preferences', JSON.stringify(preferences));
    toast.success('Preferences saved successfully');
    onClose();
  };

  const sections = [
    { key: 'dataController', icon: '🏢' },
    { key: 'purposes', icon: '🎯' },
    { key: 'legalBasis', icon: '⚖️' },
    { key: 'retention', icon: '🗄️' },
    { key: 'transfers', icon: '🌐' },
    { key: 'rights', icon: '✋' },
    { key: 'contact', icon: '📧' },
  ];

  const consentCategories = [
    { key: 'essential', disabled: true },
    { key: 'analytics', disabled: false },
    { key: 'performance', disabled: false },
    { key: 'marketing', disabled: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[110] overflow-hidden"
          >
            <div className="glass-strong rounded-3xl h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">{t('privacy.center.title')}</h2>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* KVKK Information Sections */}
                  {sections.map((section) => (
                    <div key={section.key} className="glass rounded-2xl p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{section.icon}</span>
                        <h3 className="text-xl font-bold text-foreground">
                          {t(`privacy.center.${section.key}`)}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(`privacy.center.${section.key}Text`)}
                      </p>
                    </div>
                  ))}

                  {/* KVKK Document Links */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">📄 KVKK (Law No. 6698) Documents</h3>
                    <div className="space-y-3">
                      {['kvkkNotice', 'privacyPolicy', 'cookiePolicy'].map((doc) => (
                        <a
                          key={doc}
                          href="#"
                          className="flex items-center justify-between p-3 glass-strong rounded-xl hover:bg-white/15 transition-all group"
                        >
                          <span className="text-foreground">{t(`privacy.center.links.${doc}`)}</span>
                          <ExternalLink className="h-5 w-5 text-accent group-hover:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Consent Categories */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      {t('privacy.center.categories')}
                    </h3>
                    <div className="space-y-4">
                      {consentCategories.map((category) => (
                        <div
                          key={category.key}
                          className="flex items-center justify-between p-4 glass-strong rounded-xl"
                        >
                          <div className="flex-1">
                            <Label
                              htmlFor={category.key}
                              className="text-foreground font-semibold cursor-pointer"
                            >
                              {t(`privacy.center.${category.key}`)}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t(`privacy.center.${category.key}Desc`)}
                            </p>
                          </div>
                          <Switch
                            id={category.key}
                            checked={preferences[category.key as keyof typeof preferences]}
                            onCheckedChange={(checked) =>
                              setPreferences({ ...preferences, [category.key]: checked })
                            }
                            disabled={category.disabled}
                            className="data-[state=checked]:bg-accent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="glass rounded-2xl p-6 border-l-4 border-accent">
                    <p className="text-muted-foreground text-sm">
                      ⚠️ {t('footer.disclaimer')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-white/10">
                <div className="flex gap-3 max-w-4xl mx-auto">
                  <Button onClick={onClose} variant="outline" className="glass hover:bg-white/10 flex-1">
                    Close
                  </Button>
                  <Button onClick={handleSave} className="btn-primary flex-1">
                    {t('privacy.center.savePreferences')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
