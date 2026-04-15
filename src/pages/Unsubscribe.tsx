import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, MailX } from 'lucide-react';

type Status = 'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid === false && data.reason === 'already_unsubscribed') {
          setStatus('already');
        } else if (data.valid) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (data?.success) {
        setStatus('success');
      } else if (data?.reason === 'already_unsubscribed') {
        setStatus('already');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(217,50%,8%)] to-[hsl(217,55%,4%)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Validating your request…</p>
          </>
        )}

        {status === 'valid' && (
          <>
            <MailX className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Unsubscribe</h1>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unsubscribe from UTAAB emails?
            </p>
            <Button onClick={handleUnsubscribe} disabled={submitting} className="w-full">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm Unsubscribe
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Unsubscribed</h1>
            <p className="text-muted-foreground">
              You've been successfully unsubscribed and will no longer receive these emails.
            </p>
          </>
        )}

        {status === 'already' && (
          <>
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Already Unsubscribed</h1>
            <p className="text-muted-foreground">
              You've already unsubscribed from these emails.
            </p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h1>
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has expired.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Something Went Wrong</h1>
            <p className="text-muted-foreground">
              We couldn't process your request. Please try again later.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
