import { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ShieldCheck, Link2, Lock, Globe2, ArrowLeft } from 'lucide-react';
import BackgroundGrid from '@/components/BackgroundGrid';
import GlassCard from '@/components/glass/GlassCard';
import { supabase } from '@/integrations/supabase/client';
import { hashSerial, normalizeSerial, toDbHex } from '@/lib/certHash';
import { publicClient } from '@/lib/web3/publicClient';
import { certificateRegistryAbi } from '@/lib/web3/abi';
import { CONTRACT_ADDRESS, NETWORK_LABEL, isContractConfigured } from '@/lib/web3/wagmi';
import {
  VerificationResultCard,
  type VerificationState,
} from '@/components/verify/VerificationResultCard';

const Certificate3D = lazy(() => import('@/components/cert/Certificate3D'));

export default function VerifyCertificate() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const initial = params.get('serial') || '';
  const [serial, setSerial] = useState(initial);
  const [state, setState] = useState<VerificationState>({ kind: 'idle' });

  async function runVerify(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return;
    setState({ kind: 'loading' });
    setParams({ serial: trimmed }, { replace: true });

    const normalized = normalizeSerial(trimmed);
    const serialHashHex = hashSerial(normalized);
    const serialHashDb = toDbHex(serialHashHex);

    let dbRow: any = null;
    let signedPdfUrl: string | null = null;
    try {
      const { data: resp } = await supabase.functions.invoke('cert-pdf-url', {
        body: { serial_hash: serialHashHex },
      });
      if (resp && (resp as any).found) {
        dbRow = (resp as any).record;
        signedPdfUrl = (resp as any).url ?? null;
      }
    } catch {
      /* chain is source of truth */
    }

    let chain: { issued: boolean; revoked: boolean; valid: boolean } | null = null;
    if (isContractConfigured) {
      try {
        const result = (await (publicClient.readContract as any)({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: certificateRegistryAbi,
          functionName: 'verifyCertificate',
          args: [serialHashHex],
        })) as readonly [boolean, boolean, boolean, string, string, bigint, bigint];
        chain = { valid: result[0], issued: result[1], revoked: result[2] };
      } catch {
        if (!dbRow) {
          setState({
            kind: 'error',
            message: t('verifyCertificate.networkError', { network: NETWORK_LABEL }),
          });
          return;
        }
      }
    }

    if (!dbRow && !chain?.issued) {
      setState({ kind: 'not_found' });
      return;
    }

    const kind: 'valid' | 'revoked' = chain
      ? chain.revoked ? 'revoked' : 'valid'
      : dbRow?.status === 'revoked' ? 'revoked' : 'valid';

    setState({
      kind,
      participantName: dbRow?.participant_name ?? null,
      eventName: dbRow?.event_name ?? t('verifyCertificate.unknownEvent'),
      speakerName: dbRow?.speaker_name ?? null,
      eventDate: dbRow?.event_date ?? null,
      location: dbRow?.location ?? null,
      issuedBy: dbRow?.issued_by ?? 'UTAAB',
      organizer: dbRow?.organizer ?? null,
      partners: dbRow?.partners ?? null,
      certificateTitle: dbRow?.certificate_title ?? t('verifyCertificate.defaultTitle'),
      serialNumber: dbRow?.serial_number ?? normalized,
      issuedAt: dbRow?.issued_at ?? null,
      revokedAt: dbRow?.revoked_at ?? null,
      revocationReason: dbRow?.revocation_reason ?? null,
      txHash: dbRow?.blockchain_tx_hash ?? null,
      contractAddress: dbRow?.contract_address ?? CONTRACT_ADDRESS,
      pdfUrl: signedPdfUrl,
    });
  }

  useEffect(() => {
    const prev = document.title;
    document.title = t('verifyCertificate.pageTitle');
    if (initial) runVerify(initial);
    return () => {
      document.title = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const trust = [
    {
      Icon: Link2,
      title: t('verifyCertificate.trust.onChainTitle', { network: NETWORK_LABEL }),
      desc: t('verifyCertificate.trust.onChainDesc'),
    },
    {
      Icon: Lock,
      title: t('verifyCertificate.trust.tamperTitle'),
      desc: t('verifyCertificate.trust.tamperDesc'),
    },
    {
      Icon: Globe2,
      title: t('verifyCertificate.trust.publicTitle'),
      desc: t('verifyCertificate.trust.publicDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <BackgroundGrid>
        <main className="flex-1 pt-28 pb-16">
          <div className="section-container">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t('verifyCertificate.backHome')}
              </Link>
            </motion.div>

            {/* Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold mb-4">
                  <ShieldCheck className="h-3.5 w-3.5" /> {t('verifyCertificate.badge')}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-glow-soft">
                  {t('verifyCertificate.headingPrefix')}{' '}
                  <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                    {t('verifyCertificate.headingNetwork')}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                  {t('verifyCertificate.subtitle', { network: NETWORK_LABEL })}
                </p>

                <Card className="bg-card/40 backdrop-blur-xl border-primary/20 shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
                  <CardContent className="p-5 sm:p-6">
                    <form
                      className="flex flex-col sm:flex-row gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        runVerify(serial);
                      }}
                    >
                      <Input
                        placeholder={t('verifyCertificate.placeholder')}
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        className="flex-1 font-mono bg-background/60 border-white/10 focus-visible:ring-primary/40"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="font-bold shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all"
                      >
                        <Search className="h-4 w-4 mr-2" /> {t('verifyCertificate.submit')}
                      </Button>
                    </form>
                    {!isContractConfigured && (
                      <p className="text-xs text-amber-300/90 mt-3">
                        {t('verifyCertificate.notConfigured')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* 3D Certificate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-sm">
                  <Suspense
                    fallback={<Skeleton className="w-full aspect-[1/1.414] rounded-2xl" />}
                  >
                    <Certificate3D />
                  </Suspense>
                </div>
              </motion.div>
            </div>

            {/* Result */}
            {state.kind !== 'idle' && (
              <motion.div
                key={state.kind}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-12 max-w-3xl mx-auto"
              >
                <VerificationResultCard state={state} />
              </motion.div>
            )}

            {/* Trust strip */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
              {trust.map(({ Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <GlassCard className="p-5 h-full">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
        <Footer onPrivacyClick={() => {}} />
      </BackgroundGrid>
    </div>
  );
}
