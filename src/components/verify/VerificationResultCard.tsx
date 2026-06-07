import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import { BlockchainTxLink, ContractAddressLink } from '@/components/cert/BlockchainTxLink';
import { format } from 'date-fns';

export type VerificationState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'not_found' }
  | { kind: 'error'; message: string }
  | {
      kind: 'valid' | 'revoked';
      participantName: string | null;
      eventName: string;
      speakerName: string | null;
      eventDate: string | null;
      location: string | null;
      issuedBy: string;
      organizer: string | null;
      partners: string[] | null;
      certificateTitle: string;
      serialNumber: string;
      issuedAt: string | null;
      revokedAt: string | null;
      revocationReason: string | null;
      txHash: string | null;
      contractAddress: string | null;
      pdfUrl: string | null;
    };

export function VerificationResultCard({ state }: { state: VerificationState }) {
  const { t } = useTranslation();
  if (state.kind === 'idle') return null;
  const empty = t('verifyCertificate.result.empty');

  if (state.kind === 'loading') {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="w-10 h-10 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">{t('verifyCertificate.result.loading')}</p>
        </CardContent>
      </Card>
    );
  }

  if (state.kind === 'not_found') {
    return (
      <Card className="glass-card border-orange-500/30">
        <CardContent className="p-8 text-center space-y-3">
          <XCircle className="h-12 w-12 mx-auto text-orange-400" />
          <h3 className="text-2xl font-extrabold">{t('verifyCertificate.result.notFoundTitle')}</h3>
          <p className="text-muted-foreground">{t('verifyCertificate.result.notFoundDesc')}</p>
        </CardContent>
      </Card>
    );
  }

  if (state.kind === 'error') {
    return (
      <Card className="glass-card border-red-500/30">
        <CardContent className="p-8 text-center space-y-3">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-400" />
          <h3 className="text-2xl font-extrabold">{t('verifyCertificate.result.errorTitle')}</h3>
          <p className="text-muted-foreground">{state.message}</p>
        </CardContent>
      </Card>
    );
  }

  const valid = state.kind === 'valid';

  return (
    <Card className={`glass-card ${valid ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          {valid ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          ) : (
            <XCircle className="h-10 w-10 text-red-400" />
          )}
          <div>
            <h3 className="text-2xl font-extrabold">
              {valid
                ? t('verifyCertificate.result.validTitle')
                : t('verifyCertificate.result.revokedTitle')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {valid
                ? t('verifyCertificate.result.validDesc')
                : t('verifyCertificate.result.revokedDesc')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          <Field label={t('verifyCertificate.result.participant')} value={state.participantName || empty} strong />
          <Field
            label={state.certificateTitle || t('verifyCertificate.result.certificateTitle')}
            value={state.eventName}
            strong
          />
          <Field label={t('verifyCertificate.result.speaker')} value={state.speakerName || empty} />
          <Field
            label={t('verifyCertificate.result.eventDate')}
            value={state.eventDate ? format(new Date(state.eventDate), 'PPP') : empty}
          />
          <Field label={t('verifyCertificate.result.location')} value={state.location || empty} />
          <Field label={t('verifyCertificate.result.issuedBy')} value={state.issuedBy} />
          {state.partners && state.partners.length > 0 && (
            <Field label={t('verifyCertificate.result.partners')} value={state.partners.join(', ')} />
          )}
          <Field label={t('verifyCertificate.result.serial')} value={state.serialNumber} mono />
          <Field
            label={t('verifyCertificate.result.issuedOn')}
            value={state.issuedAt ? format(new Date(state.issuedAt), 'PPp') : empty}
          />
          {!valid && (
            <>
              <Field
                label={t('verifyCertificate.result.revokedOn')}
                value={state.revokedAt ? format(new Date(state.revokedAt), 'PPp') : empty}
              />
              {state.revocationReason && (
                <Field label={t('verifyCertificate.result.revocationReason')} value={state.revocationReason} />
              )}
            </>
          )}
          <Field label={t('verifyCertificate.result.network')} value={t('verifyCertificate.result.networkValue')} />
          {state.txHash && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('verifyCertificate.result.transaction')}</p>
              <BlockchainTxLink hash={state.txHash} />
            </div>
          )}
          {state.contractAddress && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('verifyCertificate.result.contract')}</p>
              <ContractAddressLink address={state.contractAddress} />
            </div>
          )}
        </div>

        {state.pdfUrl && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <a href={state.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" /> {t('verifyCertificate.result.viewPdf')}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={state.pdfUrl} download>
                <Download className="h-4 w-4 mr-2" /> {t('verifyCertificate.result.download')}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  strong,
  mono,
}: {
  label: string;
  value: string;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={`${strong ? 'text-lg font-bold' : 'text-sm'} ${
          mono ? 'font-mono' : ''
        } break-words`}
      >
        {value}
      </p>
    </div>
  );
}
