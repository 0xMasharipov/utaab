import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, ExternalLink, Shield, FileText, Cookie, FileCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { mapError } from '@/lib/errorUtils';

interface PrivacyCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyCenter = ({ isOpen, onClose }: PrivacyCenterProps) => {
  const { t, i18n } = useTranslation();
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    performance: false,
    marketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataRequestForm, setDataRequestForm] = useState({
    fullName: '',
    email: '',
    requestType: '',
    details: '',
  });

  const handleSave = () => {
    const consentData = {
      preferences,
      timestamp: new Date().toISOString(),
      version: '1.0',
      locale: i18n.language,
    };
    localStorage.setItem('utaa-privacy-preferences', JSON.stringify(consentData));
    toast.success(t('privacy.center.preferencesSaved'));
    onClose();
  };

  const handleDataRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataRequestForm.fullName || !dataRequestForm.email || !dataRequestForm.requestType || !dataRequestForm.details) {
      toast.error(t('kvkk.requestForm.validation.allRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-kvkk-request', {
        body: {
          full_name: dataRequestForm.fullName,
          email: dataRequestForm.email,
          request_type: dataRequestForm.requestType,
          details: dataRequestForm.details,
          locale: i18n.language,
        },
      });

      if (error) throw error;

      toast.success(t('kvkk.requestForm.successTitle'));
      setDataRequestForm({ fullName: '', email: '', requestType: '', details: '' });
    } catch (error: any) {
      console.error('KVKK request error:', error);
      toast.error(mapError(error));
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-accent" />
                  <h2 className="text-3xl font-bold text-foreground">{t('privacy.center.title')}</h2>
                </div>
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
                <div className="max-w-4xl mx-auto">
                  <Tabs defaultValue="kvkk" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 glass-strong mb-6">
                      <TabsTrigger value="kvkk" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('privacy.center.tabs.kvkk')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('privacy.center.tabs.privacy')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="cookies" className="flex items-center gap-2">
                        <Cookie className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('privacy.center.tabs.cookies')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="request" className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('privacy.center.tabs.request')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="disclaimer" className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('privacy.center.tabs.disclaimer')}</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* KVKK Notice Tab */}
                    <TabsContent value="kvkk" className="space-y-6">
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <FileText className="h-6 w-6 text-accent" />
                          {t('privacy.center.kvkkNotice.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          {t('privacy.center.kvkkNotice.lawReference')}
                        </p>
                        
                        {sections.map((section) => (
                          <div key={section.key} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-2xl">{section.icon}</span>
                              <h4 className="text-lg font-bold text-foreground">
                                {t(`privacy.center.${section.key}`)}
                              </h4>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {t(`privacy.center.${section.key}Text`)}
                            </p>
                          </div>
                        ))}

                        <div className="mt-6 p-4 glass-strong rounded-xl">
                          <h4 className="font-semibold text-foreground mb-2">
                            📄 {t('privacy.center.kvkkNotice.documents')}
                          </h4>
                          <div className="space-y-2">
                            {['kvkkNotice', 'privacyPolicy', 'cookiePolicy'].map((doc) => (
                              <a
                                key={doc}
                                href="#"
                                className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-all group"
                              >
                                <span className="text-sm text-foreground">{t(`privacy.center.links.${doc}`)}</span>
                                <ExternalLink className="h-4 w-4 text-accent group-hover:translate-x-1 transition-transform" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Privacy Policy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Shield className="h-6 w-6 text-accent" />
                          {t('privacy.center.privacyPolicy.title')}
                        </h3>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {t('privacy.center.privacyPolicy.intro')}
                          </p>
                          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
                            {t('privacy.center.privacyPolicy.dataCollection')}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {t('privacy.center.privacyPolicy.dataCollectionText')}
                          </p>
                          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
                            {t('privacy.center.privacyPolicy.dataUsage')}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {t('privacy.center.privacyPolicy.dataUsageText')}
                          </p>
                          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
                            {t('privacy.center.privacyPolicy.dataSharing')}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {t('privacy.center.privacyPolicy.dataSharingText')}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Cookie Preferences Tab */}
                    <TabsContent value="cookies" className="space-y-6">
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Cookie className="h-6 w-6 text-accent" />
                          {t('privacy.center.cookiePreferences.title')}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {t('privacy.center.cookiePreferences.description')}
                        </p>
                        
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

                        <div className="mt-6 p-4 glass-strong rounded-xl">
                          <p className="text-sm text-muted-foreground">
                            {t('privacy.center.cookiePreferences.note')}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Data Request Tab */}
                    <TabsContent value="request" className="space-y-6">
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <FileCheck className="h-6 w-6 text-accent" />
                          {t('kvkk.requestForm.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          {t('kvkk.requestForm.subtitle')}
                        </p>

                        <form onSubmit={handleDataRequestSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="fullName" className="text-foreground mb-2 block">
                              {t('kvkk.requestForm.name')}
                            </Label>
                            <Input
                              id="fullName"
                              value={dataRequestForm.fullName}
                              onChange={(e) => setDataRequestForm({ ...dataRequestForm, fullName: e.target.value })}
                              className="glass-strong"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="email" className="text-foreground mb-2 block">
                              {t('kvkk.requestForm.email')}
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={dataRequestForm.email}
                              onChange={(e) => setDataRequestForm({ ...dataRequestForm, email: e.target.value })}
                              className="glass-strong"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="requestType" className="text-foreground mb-2 block">
                              {t('kvkk.requestForm.requestType')}
                            </Label>
                            <Select
                              value={dataRequestForm.requestType}
                              onValueChange={(value) => setDataRequestForm({ ...dataRequestForm, requestType: value })}
                              required
                            >
                              <SelectTrigger className="glass-strong">
                                <SelectValue placeholder={t('kvkk.requestForm.selectType')} />
                              </SelectTrigger>
                              <SelectContent className="glass-strong">
                                <SelectItem value="access">{t('kvkk.requestForm.typeAccess')}</SelectItem>
                                <SelectItem value="correction">{t('kvkk.requestForm.typeCorrection')}</SelectItem>
                                <SelectItem value="deletion">{t('kvkk.requestForm.typeDeletion')}</SelectItem>
                                <SelectItem value="portability">{t('kvkk.requestForm.typePortability')}</SelectItem>
                                <SelectItem value="objection">{t('kvkk.requestForm.typeObjection')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="details" className="text-foreground mb-2 block">
                              {t('kvkk.requestForm.details')}
                            </Label>
                            <Textarea
                              id="details"
                              value={dataRequestForm.details}
                              onChange={(e) => setDataRequestForm({ ...dataRequestForm, details: e.target.value })}
                              className="glass-strong min-h-[120px]"
                              placeholder={t('kvkk.requestForm.detailsPlaceholder')}
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? t('common.submitting') : t('kvkk.requestForm.submit')}
                          </Button>

                          <p className="text-xs text-muted-foreground mt-4">
                            {t('kvkk.requestForm.responseTime')}
                          </p>
                        </form>
                      </div>
                    </TabsContent>

                    {/* Disclaimer Tab */}
                    <TabsContent value="disclaimer" className="space-y-6">
                      <div className="glass rounded-2xl p-6 border-l-4 border-accent">
                        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <AlertCircle className="h-6 w-6 text-accent" />
                          {t('privacy.center.disclaimer.title')}
                        </h3>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                          <p>{t('privacy.center.disclaimer.text1')}</p>
                          <p>{t('privacy.center.disclaimer.text2')}</p>
                          <p>{t('privacy.center.disclaimer.text3')}</p>
                          <p className="font-semibold text-foreground">
                            {t('privacy.center.disclaimer.emphasis')}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-white/10">
                <div className="flex flex-col gap-3 max-w-4xl mx-auto">
                  <div className="flex gap-3">
                    <Button onClick={onClose} variant="outline" className="glass hover:bg-white/10 flex-1">
                      {t('common.close')}
                    </Button>
                    <Button onClick={handleSave} className="btn-primary flex-1">
                      {t('privacy.center.savePreferences')}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {t('privacy.center.version')}: v1.0 | {t('privacy.center.lastUpdated')}: 2025
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
