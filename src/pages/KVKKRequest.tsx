import { KVKKRequestForm } from '@/components/forms/KVKKRequestForm';
import { useTranslation } from 'react-i18next';

export const KVKKRequest = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background gradient-mesh pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <KVKKRequestForm />
      </div>
    </div>
  );
};