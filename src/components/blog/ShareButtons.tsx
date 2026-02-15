import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Twitter, Linkedin, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">{t('blog.share', 'Share')}:</span>
      <Button variant="ghost" size="sm" onClick={copyLink} className="glass rounded-full h-9 w-9 p-0">
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="sm" onClick={shareX} className="glass rounded-full h-9 w-9 p-0">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={shareLinkedIn} className="glass rounded-full h-9 w-9 p-0">
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  );
};
