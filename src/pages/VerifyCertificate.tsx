import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Search, ShieldCheck, Fingerprint, Globe2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Certificate3D from '@/components/cert/Certificate3D';
import { supabase } from '@/integrations/supabase/client';
import { hashSerial, normalizeSerial } from '@/lib/certHash';
import { publicClient } from '@/lib/web3/publicClient';
import { certificateRegistryAbi } from '@/lib/web3/abi';
import { CONTRACT_ADDRESS, NETWORK_LABEL, isContractConfigured } from '@/lib/web3/wagmi';
import { VerificationResultCard, type VerificationState } from '@/components/verify/VerificationResultCard';
import '@/components/cert/certificate-page.css';

interface RegistryRecord {
  status: string;
  participant_name?: string; event_name?: string; speaker_name?: string; event_date?: string;
  location?: string; issued_by?: string; organizer?: string; partners?: string[];
  certificate_title?: string; serial_number?: string; issued_at?: string; revoked_at?: string;
  revocation_reason?: string; blockchain_tx_hash?: string; contract_address?: string;
}
interface RegistryResponse { found: boolean; record: RegistryRecord | null; url: string | null }

export default function VerifyCertificate() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const querySerial = params.get('serial') || '';
  const [serial, setSerial] = useState(querySerial);
  const [state, setState] = useState<VerificationState>({ kind: 'idle' });
  const [inputError, setInputError] = useState(false);
  const requestId = useRef(0);
  const pending = useRef<string | null>(null);
  const lastQuery = useRef<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const translation = useRef(t);
  translation.current = t;

  const runVerify = useCallback(async (input: string) => {
    const normalized = normalizeSerial(input);
    if (!normalized) { setInputError(true); inputRef.current?.focus(); return; }
    if (pending.current === normalized) return;
    const id = ++requestId.current;
    pending.current = normalized;
    setInputError(false);
    setState({ kind: 'loading' });
    const commit = (next: VerificationState) => {
      if (id !== requestId.current) return;
      pending.current = null;
      setState(next);
    };
    const networkError = () => commit({ kind: 'error', message: translation.current('verifyCertificate.networkError', { network: NETWORK_LABEL }) });
    try {
      const serialHash = hashSerial(normalized);
      let dbRow: RegistryRecord | null = null;
      let signedPdfUrl: string | null = null;
      let registryFailed = false;
      try {
        const { data, error } = await supabase.functions.invoke<RegistryResponse>('cert-pdf-url', { body: { serial_hash: serialHash } });
        registryFailed = !!error || !data || typeof data.found !== 'boolean';
        if (!error && data?.found && data.record) { dbRow = data.record; signedPdfUrl = data.url ?? null; }
      } catch { registryFailed = true; }
      if (id !== requestId.current) return;
      let chain: { issued: boolean; revoked: boolean; valid: boolean } | null = null;
      if (isContractConfigured) {
        try {
          const result = await publicClient.readContract({ address: CONTRACT_ADDRESS as `0x${string}`, abi: certificateRegistryAbi, functionName: 'verifyCertificate', args: [serialHash], authorizationList: undefined });
          chain = { valid: result[0], issued: result[1], revoked: result[2] };
        } catch { if (!dbRow) { networkError(); return; } }
      }
      if (id !== requestId.current) return;
      if (!dbRow && !chain?.issued) {
        if (registryFailed && !chain) networkError();
        else commit({ kind: 'not_found' });
        return;
      }
      // A successful on-chain issuance takes precedence; otherwise retain registry verification.
      if (chain?.issued && !chain.valid && !chain.revoked) { networkError(); return; }
      const kind = (chain?.issued ? chain.revoked : dbRow?.status === 'revoked') ? 'revoked' : 'valid';
      commit({
        kind,
        participantName: dbRow?.participant_name ?? null,
        eventName: dbRow?.event_name ?? translation.current('verifyCertificate.unknownEvent'),
        speakerName: dbRow?.speaker_name ?? null, eventDate: dbRow?.event_date ?? null,
        location: dbRow?.location ?? null, issuedBy: dbRow?.issued_by ?? 'UTAAB',
        organizer: dbRow?.organizer ?? null, partners: dbRow?.partners ?? null,
        certificateTitle: dbRow?.certificate_title ?? translation.current('verifyCertificate.defaultTitle'),
        serialNumber: dbRow?.serial_number ?? normalized, issuedAt: dbRow?.issued_at ?? null,
        revokedAt: dbRow?.revoked_at ?? null, revocationReason: dbRow?.revocation_reason ?? null,
        txHash: dbRow?.blockchain_tx_hash ?? null,
        contractAddress: dbRow?.contract_address ?? (isContractConfigured ? CONTRACT_ADDRESS : null),
        pdfUrl: signedPdfUrl,
      });
    } catch { networkError(); }
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = t('verifyCertificate.pageTitle');
    return () => { document.title = previous; };
  }, [t]);

  useEffect(() => {
    if (lastQuery.current === querySerial) return;
    lastQuery.current = querySerial;
    setSerial(querySerial);
    if (querySerial.trim()) void runVerify(querySerial);
    else { ++requestId.current; pending.current = null; setState({ kind: 'idle' }); }
  }, [querySerial, runVerify]);

  useEffect(() => () => { ++requestId.current; pending.current = null; lastQuery.current = null; }, []);

  useEffect(() => {
    if (state.kind !== 'idle' && state.kind !== 'loading') {
      resultRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  const loading = state.kind === 'loading';
  const reveal = { initial: reduced ? false as const : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  return <MotionConfig reducedMotion="user"><div className="certificate-page">
    <Navbar />
    <main className="cv-main cv-shell">
      <Link className="cv-back" to="/"><ArrowLeft size={15} aria-hidden="true" />{t('verifyCertificate.backHome')}</Link>
      <div className="cv-hero">
        <div className="cv-intro">
          <motion.p {...reveal} className="cv-eyebrow">UTAAB <span>/</span> {t('verifyCertificate.badge')}</motion.p>
          <motion.h1 {...reveal}>{t('verifyCertificate.studio.heading')}<span>{t('verifyCertificate.studio.headingAccent')}</span></motion.h1>
          <motion.p {...reveal} className="cv-intro-text">{t('verifyCertificate.studio.intro')}</motion.p>
        </div>
        <div className="cv-verifier">
          <form noValidate onSubmit={event => {
            event.preventDefault();
            if (loading) return;
            const trimmed = serial.trim();
            if (!trimmed) { setInputError(true); inputRef.current?.focus(); return; }
            lastQuery.current = trimmed;
            setParams(previous => { const next = new URLSearchParams(previous); next.set('serial', trimmed); return next; }, { replace: true });
            void runVerify(trimmed);
          }}>
            <label htmlFor="certificate-serial">{t('verifyCertificate.studio.serialLabel')}</label>
            <div className="cv-search-row">
              <input ref={inputRef} id="certificate-serial" name="serial" dir="ltr" type="text" value={serial} maxLength={200} autoComplete="off" spellCheck={false}
                aria-required="true" aria-invalid={inputError} aria-describedby={`certificate-hint${inputError ? ' certificate-input-error' : ''}`}
                placeholder={t('verifyCertificate.placeholder')}
                onChange={event => { setSerial(event.target.value); setInputError(false); }} />
              <button type="submit" className="cv-button" disabled={loading}>
                {loading ? <Loader2 className="cv-spinner" size={17} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
                {t(loading ? 'verifyCertificate.studio.checking' : 'verifyCertificate.submit')}
              </button>
            </div>
            <p id="certificate-hint" className="cv-hint">{t('verifyCertificate.studio.serialHint')}</p>
            {inputError && <p id="certificate-input-error" className="cv-input-error" role="alert">{t('verifyCertificate.studio.required')}</p>}
          </form>
          {!isContractConfigured && <p className="cv-registry-notice">{t('verifyCertificate.notConfigured')}</p>}
          <p className="sr-only" role="status">{loading ? t('verifyCertificate.result.loading') : ''}</p>
          <div className="cv-result-region" ref={resultRef} tabIndex={-1} aria-live="polite" aria-atomic="true" aria-busy={loading}>
            <VerificationResultCard state={state} />
          </div>
        </div>
        <div className="cv-hero-art"><Certificate3D /></div>
      </div>
      <section className="cv-explanation" aria-labelledby="cv-trust-title">
        <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="cv-explanation-heading">
          <p>{t('verifyCertificate.studio.trustEyebrow')}</p><h2 id="cv-trust-title">{t('verifyCertificate.studio.trustTitle')}</h2>
          <a href="/learn/guides" className="cv-learn-link">{t('verifyCertificate.studio.learn')}<ArrowUpRight size={17} aria-hidden="true" /></a>
        </motion.div>
        <div className="cv-principles">{[ShieldCheck, Fingerprint, Globe2].map((Icon, index) => <motion.article key={index}
          initial={reduced ? false : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }}>
          <Icon size={23} strokeWidth={1.3} aria-hidden="true" /><div><h3>{t(`verifyCertificate.studio.trust${index + 1}Title`)}</h3><p>{t(`verifyCertificate.studio.trust${index + 1}Text`, { network: NETWORK_LABEL })}</p></div>
        </motion.article>)}</div>
      </section>
    </main>
    <Footer onPrivacyClick={() => window.open('/privacy-policy', '_blank', 'noopener,noreferrer')} />
  </div></MotionConfig>;
}
