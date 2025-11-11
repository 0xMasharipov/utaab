import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Award, Download, ExternalLink } from 'lucide-react';

interface ProfileCertificatesProps {
  userId: string;
}

export default function ProfileCertificates({ userId }: ProfileCertificatesProps) {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [userId]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, courses(*)')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      toast.error('Failed to load certificates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card className="glass-panel p-12 text-center">
        <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
        <p className="text-muted-foreground">
          Complete courses to earn certificates
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Certificates</h2>
        <p className="text-muted-foreground">Your earned certifications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((cert) => (
          <Card key={cert.id} className="glass-panel p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.courses?.title_en}</h3>
                  <Badge variant="outline" className="mt-1">
                    {cert.certificate_number}
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Issued: {new Date(cert.issued_at).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
