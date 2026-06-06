// Web3 / wagmi configuration for UTAAB Certificate on Base.
//
// We default to Base Sepolia (chainId 84532). To promote to Base mainnet,
// set VITE_CHAIN_ID=8453, swap VITE_BASE_RPC_URL + VITE_BLOCK_EXPLORER_URL,
// and update VITE_CERTIFICATE_CONTRACT_ADDRESS.
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 84532);

export const ACTIVE_CHAIN = CHAIN_ID === 8453 ? base : baseSepolia;

export const BASE_RPC_URL =
  (import.meta.env.VITE_BASE_RPC_URL as string) ||
  (CHAIN_ID === 8453 ? 'https://mainnet.base.org' : 'https://sepolia.base.org');

/** Legacy alias kept for backwards-compatibility with old imports. */
export const SEPOLIA_RPC_URL = BASE_RPC_URL;

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CERTIFICATE_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined) || '0x0000000000000000000000000000000000000000';

export const BLOCK_EXPLORER_URL =
  (import.meta.env.VITE_BLOCK_EXPLORER_URL as string) ||
  (CHAIN_ID === 8453 ? 'https://basescan.org' : 'https://sepolia.basescan.org');

export const NETWORK_LABEL = CHAIN_ID === 8453 ? 'Base' : 'Base Sepolia';

export const isContractConfigured =
  CONTRACT_ADDRESS &&
  CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [coinbaseWallet({ appName: 'UTAAB' }), metaMask(), injected()],
  transports: {
    [baseSepolia.id]: http(CHAIN_ID === 84532 ? BASE_RPC_URL : 'https://sepolia.base.org'),
    [base.id]: http(CHAIN_ID === 8453 ? BASE_RPC_URL : 'https://mainnet.base.org'),
  },
});

export const explorerTx = (hash: string) => `${BLOCK_EXPLORER_URL}/tx/${hash}`;
export const explorerAddress = (addr: string) => `${BLOCK_EXPLORER_URL}/address/${addr}`;
export const explorerToken = (addr: string, tokenId: string | bigint) =>
  `${BLOCK_EXPLORER_URL}/token/${addr}?a=${tokenId.toString()}`;
