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
  if (state.kind === 'idle') return null;

  if (state.kind === 'loading') {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="w-10 h-10 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">Checking blockchain & registry…</p>
        </CardContent>
      </Card>
    );
  }

  if (state.kind === 'not_found') {
    return (
      <Card className="glass-card border-orange-500/30">
        <CardContent className="p-8 text-center space-y-3">
          <XCircle className="h-12 w-12 mx-auto text-orange-400" />
          <h3 className="text-2xl font-extrabold">Certificate not found</h3>
          <p className="text-muted-foreground">
            No certificate found for this serial number. Please double-check and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (state.kind === 'error') {
    return (
      <Card className="glass-card border-red-500/30">
        <CardContent className="p-8 text-center space-y-3">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-400" />
          <h3 className="text-2xl font-extrabold">Verification error</h3>
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
              {valid ? 'Certificate is valid' : 'Certificate has been revoked'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {valid
                ? 'This certificate was officially issued by UTAAB and recorded on the blockchain.'
                : 'This certificate was issued but later revoked by UTAAB.'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          <Field label="Participant" value={state.participantName || '—'} strong />
          <Field label={state.certificateTitle || 'Certificate title'} value={state.eventName} strong />
          <Field label="Speaker / Instructor" value={state.speakerName || '—'} />
          <Field
            label="Event date"
            value={state.eventDate ? format(new Date(state.eventDate), 'PPP') : '—'}
          />
          <Field label="Location" value={state.location || '—'} />
          <Field label="Issued by" value={state.issuedBy} />
          {state.partners && state.partners.length > 0 && (
            <Field label="Partners" value={state.partners.join(', ')} />
          )}
          <Field label="Serial number" value={state.serialNumber} mono />
          <Field
            label="Issued on"
            value={state.issuedAt ? format(new Date(state.issuedAt), 'PPp') : '—'}
          />
          {!valid && (
            <>
              <Field
                label="Revoked on"
                value={state.revokedAt ? format(new Date(state.revokedAt), 'PPp') : '—'}
              />
              {state.revocationReason && (
                <Field label="Revocation reason" value={state.revocationReason} />
              )}
            </>
          )}
          <Field label="Network" value="Sepolia Testnet" />
          {state.txHash && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Transaction</p>
              <BlockchainTxLink hash={state.txHash} />
            </div>
          )}
          {state.contractAddress && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contract</p>
              <ContractAddressLink address={state.contractAddress} />
            </div>
          )}
        </div>

        {state.pdfUrl && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <a href={state.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" /> View PDF
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={state.pdfUrl} download>
                <Download className="h-4 w-4 mr-2" /> Download
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
