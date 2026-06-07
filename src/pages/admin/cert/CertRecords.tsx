import { useState, useMemo } from 'react';
import { CertNav } from '@/components/admin/cert/CertNav';
import { useCertEvents, useCertParticipants, useCertRecords } from '@/hooks/useCertData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { CertificateStatusBadge } from '@/components/cert/CertificateStatusBadge';
import { BlockchainTxLink } from '@/components/cert/BlockchainTxLink';
import { WalletConnectButton } from '@/components/cert/WalletConnectButton';
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ACTIVE_CHAIN, CONTRACT_ADDRESS, CHAIN_ID, NETWORK_LABEL, isContractConfigured } from '@/lib/web3/wagmi';
import { certificateRegistryAbi } from '@/lib/web3/abi';
import { fromDbHex } from '@/lib/certHash';
import { generateCertificatePdf } from '@/lib/pdf/generateCertificatePdf';
import { Input } from '@/components/ui/input';
import { isAddress } from 'viem';
import { Download, FileText, Send, XCircle, AlertTriangle } from 'lucide-react';

export default function CertRecords() {
  const { data: events } = useCertEvents();
  const [eventId, setEventId] = useState('all');
  const filterId = eventId === 'all' ? undefined : eventId;
  const { data: records, isLoading } = useCertRecords(filterId);
  const { data: parts } = useCertParticipants(filterId);
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [issueOpen, setIssueOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeRow, setRevokeRow] = useState<any>(null);
  const [revokeReason, setRevokeReason] = useState('');

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const { isLoading: txPending, isSuccess: txOk } = useWaitForTransactionReceipt({ hash: txHash });

  const partsById = useMemo(() => {
    const m = new Map<string, any>();
    (parts ?? []).forEach((p: any) => m.set(p.id, p));
    return m;
  }, [parts]);
  const eventsById = useMemo(() => {
    const m = new Map<string, any>();
    (events ?? []).forEach((e: any) => m.set(e.id, e));
    return m;
  }, [events]);

  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const selectedRows = (records ?? []).filter((r: any) => selected.has(r.id) && r.status === 'draft');

  const wrongNetwork = isConnected && chainId !== CHAIN_ID;

  const issue = async () => {
    if (!isContractConfigured) { toast.error('Contract address not configured'); return; }
    if (!isConnected) { toast.error('Connect your wallet'); return; }
    if (wrongNetwork) { toast.error('Switch to Sepolia'); switchChain?.({ chainId: sepolia.id }); return; }
    if (selectedRows.length === 0) { toast.error('No drafts selected'); return; }
    // Group by event (one tx per event)
    const byEvent = new Map<string, any[]>();
    selectedRows.forEach((r: any) => {
      const arr = byEvent.get(r.event_id) ?? [];
      arr.push(r); byEvent.set(r.event_id, arr);
    });
    try {
      for (const [eid, rows] of byEvent) {
        const ev = eventsById.get(eid);
        if (!ev) continue;
        const event_hash = hashEvent(ev.event_name, ev.event_date ?? '', ev.speaker_name ?? '');
        const issued_by_hash = hashIssuedBy(ev.issued_by);
        const serialHashes = rows.map((r) => fromDbHex(r.serial_hash));
        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: certificateRegistryAbi,
          functionName: 'issueBatchCertificates',
          account: address,
          chain: sepolia,
          args: [serialHashes, event_hash, issued_by_hash],
        });
        setTxHash(hash);
        toast.info('Tx submitted, waiting for confirmation…');
        // Optimistically update DB after submission
        const issuedAt = new Date().toISOString();
        for (const r of rows) {
          await supabase.from('cert_records').update({
            status: 'issued',
            issued_at: issuedAt,
            blockchain_tx_hash: hash,
            contract_address: CONTRACT_ADDRESS,
            chain_id: CHAIN_ID,
          }).eq('id', r.id);
        }
      }
      toast.success('Certificates issued on-chain');
      qc.invalidateQueries({ queryKey: ['cert_records'] });
      qc.invalidateQueries({ queryKey: ['cert_stats'] });
      setSelected(new Set());
      setIssueOpen(false);
    } catch (e: any) {
      toast.error(e.shortMessage || e.message || 'Issuance failed');
    }
  };

  const revoke = async () => {
    if (!revokeRow) return;
    if (!isContractConfigured) { toast.error('Contract not configured'); return; }
    if (!isConnected) { toast.error('Connect wallet'); return; }
    if (wrongNetwork) { toast.error('Switch to Sepolia'); return; }
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: certificateRegistryAbi,
        functionName: 'revokeCertificate',
        account: address,
        chain: sepolia,
        args: [fromDbHex(revokeRow.serial_hash)],
      });
      setTxHash(hash);
      await supabase.from('cert_records').update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revocation_reason: revokeReason || null,
      }).eq('id', revokeRow.id);
      toast.success('Certificate revoked');
      qc.invalidateQueries({ queryKey: ['cert_records'] });
      qc.invalidateQueries({ queryKey: ['cert_stats'] });
      setRevokeOpen(false); setRevokeRow(null); setRevokeReason('');
    } catch (e: any) {
      toast.error(e.shortMessage || e.message || 'Revoke failed');
    }
  };

  const generatePdf = async (r: any) => {
    const ev = eventsById.get(r.event_id);
    const p = r.participant_id ? partsById.get(r.participant_id) : null;
    if (!ev || !p) { toast.error('Missing event or participant'); return; }
    try {
      const verifyUrl = `${window.location.origin}/verify-certificate?serial=${encodeURIComponent(r.serial_number)}`;
      const bytes = await generateCertificatePdf({
        participantName: p.full_name,
        eventName: ev.event_name,
        speakerName: ev.speaker_name,
        eventDate: ev.event_date,
        location: ev.location,
        issuedBy: ev.issued_by,
        organizer: ev.organizer,
        partners: ev.partners,
        serialNumber: r.serial_number,
        certificateTitle: ev.certificate_title || 'Certificate of Participation',
        verificationUrl: verifyUrl,
      });
      const path = `${r.event_id}/${r.serial_number}.pdf`;
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      const { error: upErr } = await supabase.storage.from('certificates').upload(path, blob, { upsert: true, contentType: 'application/pdf' });
      if (upErr) throw upErr;
      // Store the storage path; signed URLs are issued on demand from the private bucket.
      await supabase.from('cert_records').update({ pdf_url: path }).eq('id', r.id);
      toast.success('PDF generated');
      qc.invalidateQueries({ queryKey: ['cert_records'] });
    } catch (e: any) {
      toast.error(e.message || 'PDF generation failed');
    }
  };

  const openSignedPdf = async (pathOrUrl: string) => {
    try {
      let path = pathOrUrl;
      const marker = '/certificates/';
      const idx = path.indexOf(marker);
      if (idx !== -1) path = path.substring(idx + marker.length);
      const { data, error } = await supabase.storage.from('certificates').createSignedUrl(path, 600);
      if (error || !data?.signedUrl) throw error || new Error('No URL');
      window.open(data.signedUrl, '_blank', 'noopener');
    } catch (e: any) {
      toast.error(e.message || 'Could not open PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Certificates</h1>
          <p className="text-muted-foreground mt-1">Generate PDFs and issue or revoke certificates on Sepolia.</p>
        </div>
        <div className="flex items-center gap-2">
          <WalletConnectButton />
          <Button onClick={() => setIssueOpen(true)} disabled={selected.size === 0}>
            <Send className="h-4 w-4 mr-2" /> Issue selected ({selected.size})
          </Button>
        </div>
      </div>
      <CertNav />

      {!isContractConfigured && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Contract address not configured. Set <code>VITE_CERTIFICATE_CONTRACT_ADDRESS</code> in environment to enable on-chain operations.</AlertDescription>
        </Alert>
      )}
      {wrongNetwork && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Wallet is on chain {chainId}. <Button size="sm" variant="link" onClick={() => switchChain?.({ chainId: sepolia.id })}>Switch to Sepolia</Button></AlertDescription>
        </Alert>
      )}

      <Card className="p-4 glass-section border-white/10">
        <div className="flex items-center gap-3 flex-wrap">
          <Label className="text-sm">Event:</Label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              {(events ?? []).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.event_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-6 glass-section border-white/10 overflow-x-auto">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 w-8"></th>
                <th>Serial</th><th>Participant</th><th>Status</th><th>Tx</th><th>PDF</th><th></th>
              </tr>
            </thead>
            <tbody>
              {(records ?? []).map((r: any) => {
                const p = r.participant_id ? partsById.get(r.participant_id) : null;
                return (
                  <tr key={r.id} className="border-t border-white/5">
                    <td className="py-2">
                      {r.status === 'draft' && (
                        <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
                      )}
                    </td>
                    <td className="font-mono text-xs">{r.serial_number}</td>
                    <td>{p?.full_name ?? '—'}</td>
                    <td><CertificateStatusBadge status={r.status} /></td>
                    <td>{r.blockchain_tx_hash ? <BlockchainTxLink hash={r.blockchain_tx_hash} /> : '—'}</td>
                    <td>{r.pdf_url ? <button onClick={() => openSignedPdf(r.pdf_url)} className="text-primary text-xs underline">Open</button> : '—'}</td>
                    <td className="text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => generatePdf(r)} title="Generate PDF">
                        <FileText className="h-4 w-4" />
                      </Button>
                      {r.status === 'issued' && (
                        <Button size="sm" variant="ghost" onClick={() => { setRevokeRow(r); setRevokeOpen(true); }} title="Revoke">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {r.pdf_url && (
                        <Button size="sm" variant="ghost" onClick={() => openSignedPdf(r.pdf_url)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(records ?? []).length === 0 && <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No certificates yet.</td></tr>}
            </tbody>
          </table>
        )}
      </Card>

      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Issue {selectedRows.length} certificate(s) on-chain</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">This will submit a transaction on Sepolia. Only hashes are written on-chain; no PII.</p>
            {!isConnected && <WalletConnectButton />}
            {isConnected && <p>Wallet: <span className="font-mono">{address?.slice(0, 6)}…{address?.slice(-4)}</span></p>}
            {txHash && <BlockchainTxLink hash={txHash} />}
            {txPending && <p className="text-muted-foreground">Waiting for confirmation…</p>}
            {txOk && <p className="text-green-500">Confirmed</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIssueOpen(false)}>Close</Button>
            <Button onClick={issue} disabled={isPending || !isConnected}>{isPending ? 'Submitting…' : 'Issue on-chain'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Revoke certificate {revokeRow?.serial_number}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Reason</Label>
            <Textarea rows={3} value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRevokeOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={revoke} disabled={isPending}>Revoke</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
