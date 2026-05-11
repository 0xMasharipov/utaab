import { CertNav } from '@/components/admin/cert/CertNav';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CONTRACT_ADDRESS, CHAIN_ID, BLOCK_EXPLORER_URL, SEPOLIA_RPC_URL, isContractConfigured, explorerAddress } from '@/lib/web3/wagmi';
import { WalletConnectButton } from '@/components/cert/WalletConnectButton';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { certificateRegistryAbi } from '@/lib/web3/abi';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-white/5">
      <div className="text-sm text-muted-foreground">{k}</div>
      <div className="text-sm font-mono text-right break-all">{v}</div>
    </div>
  );
}

export default function CertSettings() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: certificateRegistryAbi,
    functionName: 'owner',
    query: { enabled: isContractConfigured },
  });
  const isOwner = isConnected && owner && address?.toLowerCase() === (owner as string).toLowerCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="text-muted-foreground mt-1">Blockchain configuration & wallet status.</p>
      </div>
      <CertNav />

      {!isContractConfigured && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Contract not configured.</strong> Add <code className="px-1 bg-black/20 rounded">VITE_CERTIFICATE_CONTRACT_ADDRESS</code> to environment variables and reload.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 glass-section border-white/10">
        <h2 className="text-lg font-bold mb-4">Network</h2>
        <Row k="Chain" v={`Sepolia (${CHAIN_ID})`} />
        <Row k="RPC URL" v={SEPOLIA_RPC_URL} />
        <Row k="Block explorer" v={<a href={BLOCK_EXPLORER_URL} target="_blank" rel="noopener" className="text-primary inline-flex items-center gap-1">{BLOCK_EXPLORER_URL} <ExternalLink className="h-3 w-3" /></a>} />
        <Row k="Contract" v={
          isContractConfigured
            ? <a href={explorerAddress(CONTRACT_ADDRESS)} target="_blank" rel="noopener" className="text-primary inline-flex items-center gap-1">{CONTRACT_ADDRESS} <ExternalLink className="h-3 w-3" /></a>
            : <span className="text-destructive">Not set</span>
        } />
        <Row k="Contract owner" v={owner ? (owner as string) : '—'} />
      </Card>

      <Card className="p-6 glass-section border-white/10">
        <h2 className="text-lg font-bold mb-4">Wallet</h2>
        <div className="mb-4"><WalletConnectButton /></div>
        <Row k="Connected" v={isConnected ? <span className="inline-flex items-center gap-1 text-green-500"><CheckCircle2 className="h-4 w-4" />Yes</span> : <span className="inline-flex items-center gap-1 text-destructive"><XCircle className="h-4 w-4" />No</span>} />
        <Row k="Address" v={address ?? '—'} />
        <Row k="Chain ID" v={chainId} />
        <Row k="On Sepolia" v={chainId === CHAIN_ID ? <span className="text-green-500">Yes</span> : <span className="text-destructive">No</span>} />
        <Row k="Is contract owner" v={isOwner ? <span className="text-green-500">Yes — can issue/revoke</span> : <span className="text-muted-foreground">No</span>} />
      </Card>

      <Card className="p-6 glass-section border-white/10">
        <h2 className="text-lg font-bold mb-2">Workflow</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Create an <strong>Event</strong> with code, date, speaker.</li>
          <li>Add <strong>Participants</strong> (manual or CSV). Each gets a draft certificate.</li>
          <li>Generate <strong>PDFs</strong> for each certificate (uploaded to storage).</li>
          <li>Connect your <strong>owner wallet</strong> on Sepolia and issue selected drafts on-chain.</li>
          <li>Public users verify certificates at <code>/verify-certificate?serial=…</code>.</li>
        </ol>
      </Card>
    </div>
  );
}
