import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '@/i18n/config';

interface LanguageTransitionContextType {
  isTransitioning: boolean;
}

const LanguageTransitionContext = createContext<LanguageTransitionContextType>({
  isTransitioning: false,
});

interface LanguageTransitionProviderProps {
  children: ReactNode;
}

export const LanguageTransitionProvider = ({ children }: LanguageTransitionProviderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleLanguageChanging = () => {
      setIsTransitioning(true);
      // Transition duration: 300ms total (150ms fade out + 150ms fade in)
      setTimeout(() => setIsTransitioning(false), 300);
    };

    i18n.on('languageChanged', handleLanguageChanging);
    return () => {
      i18n.off('languageChanged', handleLanguageChanging);
    };
  }, []);

  return (
    <LanguageTransitionContext.Provider value={{ isTransitioning }}>
      {children}
    </LanguageTransitionContext.Provider>
  );
};

export const useLanguageTransitionContext = () => useContext(LanguageTransitionContext);
