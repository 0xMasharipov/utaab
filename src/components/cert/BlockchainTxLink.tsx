import { ExternalLink } from 'lucide-react';
import { explorerTx, explorerAddress } from '@/lib/web3/wagmi';

export function BlockchainTxLink({ hash, label }: { hash: string; label?: string }) {
  return (
    <a
      href={explorerTx(hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-sm break-all"
    >
      {label || `${hash.slice(0, 10)}…${hash.slice(-8)}`}
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  );
}

export function ContractAddressLink({ address }: { address: string }) {
  return (
    <a
      href={explorerAddress(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-sm break-all"
    >
      {`${address.slice(0, 10)}…${address.slice(-8)}`}
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  );
}
