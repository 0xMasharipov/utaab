import { Shield } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

interface FloatingPrivacyButtonProps {
  onClick: () => void;
}

export const FloatingPrivacyButton = ({ onClick }: FloatingPrivacyButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 glass-strong rounded-full p-3 sm:px-4 sm:py-3 shadow-lg border border-white/20 hover:border-accent/50 transition-all duration-300 flex items-center gap-2 group min-h-[44px] min-w-[44px] animate-fade-in hover:scale-105 active:scale-95"
      aria-label={t('privacy.floatingButton.label')}
    >
      <Shield className="h-5 w-5 text-accent group-hover:text-accent/80 transition-colors" strokeWidth={1.5} />
      <span className="text-sm font-medium text-foreground hidden sm:inline whitespace-nowrap">
        {t('privacy.floatingButton.text')}
      </span>
    </button>
  );
};
