import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Download, Loader2 } from 'lucide-react';
import { BlockchainTxLink, ContractAddressLink } from '@/components/cert/BlockchainTxLink';
import { NETWORK_LABEL } from '@/lib/web3/wagmi';
import type { ReactNode } from 'react';

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
  const { t, i18n } = useTranslation();
  if (state.kind === 'idle') return null;
  const empty = t('verifyCertificate.result.empty');
  const dateLabel = (value: string | null, withTime = false) => {
    if (!value) return empty;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return empty;
    return new Intl.DateTimeFormat(i18n.resolvedLanguage || 'en', { dateStyle: 'medium', ...(withTime ? { timeStyle: 'short' as const } : { timeZone: 'UTC' }) }).format(date);
  };
  if (state.kind === 'loading') return <div className="cv-result cv-result-loading" data-status="loading">
    <Loader2 className="cv-spinner" size={22} aria-hidden="true" /><div><h2>{t('verifyCertificate.studio.checking')}</h2><p>{t('verifyCertificate.result.loading')}</p></div>
  </div>;
  if (state.kind === 'not_found' || state.kind === 'error') {
    const missing = state.kind === 'not_found';
    const Icon = missing ? XCircle : AlertTriangle;
    return <div className="cv-result cv-result-error" data-status={state.kind}>
      <Icon size={25} aria-hidden="true" /><div><h2>{t(missing ? 'verifyCertificate.result.notFoundTitle' : 'verifyCertificate.result.errorTitle')}</h2>
        <p>{state.kind === 'error' ? state.message : t('verifyCertificate.result.notFoundDesc')}</p>
        <p className="cv-retry-hint">{t('verifyCertificate.studio.retryHint')}</p>
      </div>
    </div>;
  }
  const valid = state.kind === 'valid';
  const StatusIcon = valid ? CheckCircle2 : XCircle;
  return <section className={`cv-result cv-record ${valid ? 'cv-record-valid' : 'cv-record-revoked'}`} data-status={state.kind}>
    <div className="cv-record-status"><StatusIcon size={24} aria-hidden="true" /><div>
      <h2>{t(valid ? 'verifyCertificate.result.validTitle' : 'verifyCertificate.result.revokedTitle')}</h2>
      <p>{t(valid ? 'verifyCertificate.studio.validDescription' : 'verifyCertificate.result.revokedDesc')}</p>
    </div></div>
    <div className="cv-record-recipient"><p>{t('verifyCertificate.result.participant')}</p><h3>{state.participantName || empty}</h3><span>{state.certificateTitle}</span><p>{state.eventName}</p></div>
    <dl className="cv-record-details">
      <Field label={t('verifyCertificate.result.serial')} mono>{state.serialNumber}</Field>
      <Field label={t('verifyCertificate.result.eventDate')}>{dateLabel(state.eventDate)}</Field>
      <Field label={t('verifyCertificate.result.speaker')}>{state.speakerName || empty}</Field>
      <Field label={t('verifyCertificate.result.location')}>{state.location || empty}</Field>
      <Field label={t('verifyCertificate.result.issuedBy')}>{state.issuedBy}</Field>
      <Field label={t('verifyCertificate.result.issuedOn')}>{dateLabel(state.issuedAt, true)}</Field>
      {state.organizer && <Field label={t('verifyCertificate.studio.organizer')}>{state.organizer}</Field>}
      {!!state.partners?.length && <Field label={t('verifyCertificate.result.partners')}>{state.partners.join(', ')}</Field>}
      {!valid && <><Field label={t('verifyCertificate.result.revokedOn')}>{dateLabel(state.revokedAt, true)}</Field>{state.revocationReason && <Field label={t('verifyCertificate.result.revocationReason')}>{state.revocationReason}</Field>}</>}
      <Field label={t('verifyCertificate.result.network')}>{NETWORK_LABEL}</Field>
      {state.txHash && <Field label={t('verifyCertificate.result.transaction')}><BlockchainTxLink hash={state.txHash} /></Field>}
      {state.contractAddress && <Field label={t('verifyCertificate.result.contract')}><ContractAddressLink address={state.contractAddress} /></Field>}
    </dl>
    {state.pdfUrl ? <div className="cv-record-actions">
      <a className="cv-button" href={state.pdfUrl} target="_blank" rel="noopener noreferrer"><FileText size={16} aria-hidden="true" />{t('verifyCertificate.result.viewPdf')}</a>
      <a className="cv-secondary-button" href={state.pdfUrl} download><Download size={16} aria-hidden="true" />{t('verifyCertificate.result.download')}</a>
    </div> : <p className="cv-pdf-unavailable">{t('verifyCertificate.studio.noPdf')}</p>}
  </section>;
}

function Field({ label, children, mono = false }: { label: string; children: ReactNode; mono?: boolean }) {
  return <div><dt>{label}</dt><dd className={mono ? 'cv-mono' : undefined}>{children}</dd></div>;
}
