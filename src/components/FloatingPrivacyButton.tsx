import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface FloatingPrivacyButtonProps {
  onClick: () => void;
}

export const FloatingPrivacyButton = ({ onClick }: FloatingPrivacyButtonProps) => {
  const { t } = useTranslation();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 glass-strong rounded-full px-4 py-3 shadow-lg border border-white/20 hover:border-accent/50 transition-all duration-300 flex items-center gap-2 group"
      aria-label={t('privacy.floatingButton.label')}
    >
      <Shield className="h-5 w-5 text-accent group-hover:text-accent/80 transition-colors" />
      <span className="text-sm font-medium text-foreground hidden sm:inline">
        {t('privacy.floatingButton.text')}
      </span>
    </motion.button>
  );
};
