import { useLanguageTransitionContext } from '@/contexts/LanguageTransitionContext';
import { cn } from '@/lib/utils';

export const useLanguageTransition = () => {
  const { isTransitioning } = useLanguageTransitionContext();

  const getTransitionClasses = (additionalClasses?: string) => {
    return cn(
      'lang-transition',
      isTransitioning && 'lang-transitioning',
      additionalClasses
    );
  };

  return {
    isTransitioning,
    getTransitionClasses,
  };
};
