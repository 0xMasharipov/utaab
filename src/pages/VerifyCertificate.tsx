import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { hashSerial, normalizeSerial, toDbHex } from '@/lib/certHash';
import { publicClient } from '@/lib/web3/publicClient';
import { certificateRegistryAbi } from '@/lib/web3/abi';
import { CONTRACT_ADDRESS, isContractConfigured } from '@/lib/web3/wagmi';
import {
  VerificationResultCard,
  type VerificationState,
} from '@/components/verify/VerificationResultCard';

export default function VerifyCertificate() {
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
    const serialHashHex = hashSerial(normalized); // 0x...
    const serialHashDb = toDbHex(serialHashHex);

    // 1) DB metadata via safe RPC
    let dbRow: any = null;
    try {
      const { data, error } = await supabase.rpc('verify_certificate_by_hash', {
        _serial_hash: serialHashDb,
      });
      if (error) throw error;
      dbRow = data && data.length ? data[0] : null;
    } catch {
      // continue — chain is the source of truth
    }

    // 2) On-chain verify
    let chain: { issued: boolean; revoked: boolean; valid: boolean } | null = null;
    if (isContractConfigured) {
      try {
        const result = (await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: certificateRegistryAbi,
          functionName: 'verifyCertificate',
          args: [serialHashHex],
        })) as readonly [boolean, boolean, boolean, string, string, bigint, bigint];
        chain = { valid: result[0], issued: result[1], revoked: result[2] };
      } catch (e: any) {
        if (!dbRow) {
          setState({
            kind: 'error',
            message: 'Could not reach the Sepolia network. Please try again later.',
          });
          return;
        }
      }
    }

    if (!dbRow && !chain?.issued) {
      setState({ kind: 'not_found' });
      return;
    }

    // Decide kind based on chain (if available) else DB status
    const kind: 'valid' | 'revoked' = chain
      ? chain.revoked
        ? 'revoked'
        : 'valid'
      : dbRow?.status === 'revoked'
      ? 'revoked'
      : 'valid';

    setState({
      kind,
      participantName: dbRow?.participant_name ?? null,
      eventName: dbRow?.event_name ?? 'Unknown event',
      speakerName: dbRow?.speaker_name ?? null,
      eventDate: dbRow?.event_date ?? null,
      location: dbRow?.location ?? null,
      issuedBy: dbRow?.issued_by ?? 'UTAAB',
      organizer: dbRow?.organizer ?? null,
      partners: dbRow?.partners ?? null,
      certificateTitle: dbRow?.certificate_title ?? 'Certificate of Participation',
      serialNumber: dbRow?.serial_number ?? normalized,
      issuedAt: dbRow?.issued_at ?? null,
      revokedAt: dbRow?.revoked_at ?? null,
      revocationReason: dbRow?.revocation_reason ?? null,
      txHash: dbRow?.blockchain_tx_hash ?? null,
      contractAddress: dbRow?.contract_address ?? CONTRACT_ADDRESS,
      pdfUrl: dbRow?.pdf_url ?? null,
    });
  }

  useEffect(() => {
    if (initial) runVerify(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Verify UTAAB Certificate</title>
        <meta
          name="description"
          content="Check whether a certificate was officially issued by UTAAB and recorded on blockchain."
        />
        <link rel="canonical" href="https://utaab.org/verify-certificate" />
      </Helmet>
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" /> Certificate Verification
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">Verify UTAAB Certificate</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Check whether a certificate was officially issued by UTAAB and recorded on
              blockchain.
            </p>
          </div>

          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  runVerify(serial);
                }}
              >
                <Input
                  placeholder="UTAAB-BB-2026-0001"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="flex-1 font-mono"
                  autoFocus
                />
                <Button type="submit" size="lg" className="font-bold">
                  <Search className="h-4 w-4 mr-2" /> Verify Certificate
                </Button>
              </form>
              {!isContractConfigured && (
                <p className="text-xs text-orange-300 mt-3">
                  Note: Blockchain contract address is not yet configured. Verification will use
                  the registry only.
                </p>
              )}
            </CardContent>
          </Card>

          <VerificationResultCard state={state} />

          <p className="text-center text-sm text-muted-foreground mt-8">
            Looking for our seminars?{' '}
            <Link to="/" className="text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
