import { Award, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Certificate {
  id: string;
  certificate_number: string;
  issued_at: string;
  course_title: string;
  student_name: string;
}

interface CertificateDisplayProps {
  certificate: Certificate;
}

export const CertificateDisplay = ({ certificate }: CertificateDisplayProps) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    toast.success(t('certificate.downloadStarting'));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('certificate.title'),
          text: `${t('certificate.hasCompleted')} ${certificate.course_title}!`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('certificate.shareLinkCopied'));
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 p-12">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative text-center space-y-8">
            <Award className="h-20 w-20 mx-auto text-primary" />
            
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('certificate.title')}</h2>
              <p className="text-muted-foreground">{t('certificate.certifiesThat')}</p>
            </div>
            
            <div>
              <h3 className="text-4xl font-serif font-bold mb-2">{certificate.student_name}</h3>
              <p className="text-muted-foreground">{t('certificate.hasCompleted')}</p>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-4">{certificate.course_title}</h4>
              <p className="text-sm text-muted-foreground">
                {t('certificate.certificateNumber')} {certificate.certificate_number}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('certificate.issuedOn')} {new Date(certificate.issued_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex justify-center gap-4 pt-8">
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                {t('certificate.downloadPdf')}
              </Button>
              <Button onClick={handleShare} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                {t('certificate.share')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
