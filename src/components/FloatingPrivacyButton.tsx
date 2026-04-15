import { Shield } from 'iconoir-react';
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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 glass-strong rounded-full p-3 sm:px-4 sm:py-3 shadow-lg border border-white/20 hover:border-accent/50 transition-all duration-300 flex items-center gap-2 group min-h-[44px] min-w-[44px]"
      aria-label={t('privacy.floatingButton.label')}
    >
      <Shield className="h-5 w-5 text-accent group-hover:text-accent/80 transition-colors" strokeWidth={1.5} />
      <span className="text-sm font-medium text-foreground hidden sm:inline whitespace-nowrap">
        {t('privacy.floatingButton.text')}
      </span>
    </motion.button>
  );
};
