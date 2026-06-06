import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useWriteContract } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { certificateRegistryAbi, type CertificateVoucher } from '@/lib/web3/abi';
import {
  ACTIVE_CHAIN,
  CONTRACT_ADDRESS,
  NETWORK_LABEL,
  explorerTx,
  isContractConfigured,
} from '@/lib/web3/wagmi';
import { toast } from 'sonner';

type Props = {
  serialHash: `0x${string}`;
  /** When omitted, the component fetches the voucher from the backend. */
  voucher?: CertificateVoucher;
  signature?: `0x${string}`;
};

export function ClaimOnBase({ serialHash, voucher, signature }: Props) {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending: writing } = useWriteContract();

  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isContractConfigured) {
    return (
      <Card className="border-amber-200/40 bg-amber-50/5">
        <CardContent className="p-4 text-sm text-amber-200">
          The on-chain registry isn't configured for this environment yet.
        </CardContent>
      </Card>
    );
  }

  async function handleClaim() {
    try {
      setBusy(true);

      let v = voucher;
      let sig = signature;

      if (!v || !sig) {
        const { data, error } = await supabase.functions.invoke('cert-issue-voucher', {
          body: { serial_hash: serialHash, holder: address },
        });
        if (error) throw new Error(error.message);
        v = (data as any).voucher;
        sig = (data as any).signature;
      }

      if (chainId !== ACTIVE_CHAIN.id) {
        await switchChainAsync({ chainId: ACTIVE_CHAIN.id });
      }

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: certificateRegistryAbi,
        functionName: 'claim',
        args: [
          {
            serialHash: v!.serialHash,
            eventHash: v!.eventHash,
            issuedByHash: v!.issuedByHash,
            holder: v!.holder,
            issuedAt: BigInt(v!.issuedAt),
            tokenURI: v!.tokenURI,
          },
          sig as `0x${string}`,
        ],
      });

      setTxHash(hash);

      // Best-effort: persist receipt to DB. Failures here are non-fatal.
      supabase.functions
        .invoke('cert-record-claim', {
          body: { serial_hash: serialHash, tx_hash: hash, holder: address },
        })
        .catch(() => undefined);

      toast.success(`Claim submitted on ${NETWORK_LABEL}.`);
    } catch (err: any) {
      toast.error(err?.shortMessage || err?.message || 'Claim failed.');
    } finally {
      setBusy(false);
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-card/40 border-primary/30">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Claim your certificate on {NETWORK_LABEL}
          </div>
          <div className="flex flex-wrap gap-2">
            {connectors.map((c) => (
              <Button
                key={c.uid}
                variant="outline"
                disabled={connecting}
                onClick={() => connect({ connector: c })}
              >
                {connecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {c.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/40 border-primary/30">
      <CardContent className="p-5 space-y-3">
        <div className="text-xs text-muted-foreground">
          Connected: <span className="font-mono">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
          <button
            className="ml-2 underline text-muted-foreground/80"
            onClick={() => disconnect()}
          >
            disconnect
          </button>
        </div>
        <Button
          onClick={handleClaim}
          disabled={busy || writing}
          className="font-bold w-full sm:w-auto"
        >
          {busy || writing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Claiming…
            </>
          ) : (
            <>Claim on {NETWORK_LABEL}</>
          )}
        </Button>
        {txHash && (
          <a
            href={explorerTx(txHash)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View transaction on Basescan <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
