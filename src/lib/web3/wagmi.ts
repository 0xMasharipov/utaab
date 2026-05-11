// Web3 / wagmi configuration for UTAAB Certificate Registry on Sepolia.
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const SEPOLIA_RPC_URL =
  (import.meta.env.VITE_SEPOLIA_RPC_URL as string) ||
  'https://ethereum-sepolia-rpc.publicnode.com';

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CERTIFICATE_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined) || '0x0000000000000000000000000000000000000000';

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 11155111);

export const BLOCK_EXPLORER_URL =
  (import.meta.env.VITE_BLOCK_EXPLORER_URL as string) || 'https://sepolia.etherscan.io';

export const isContractConfigured =
  CONTRACT_ADDRESS &&
  CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
});

export const explorerTx = (hash: string) => `${BLOCK_EXPLORER_URL}/tx/${hash}`;
export const explorerAddress = (addr: string) => `${BLOCK_EXPLORER_URL}/address/${addr}`;
