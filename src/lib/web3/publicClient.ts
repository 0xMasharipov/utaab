import { createPublicClient, http } from 'viem';
import { ACTIVE_CHAIN, BASE_RPC_URL } from './wagmi';

/** Public read-only RPC client (no wallet required), targets Base by default. */
export const publicClient = createPublicClient({
  chain: ACTIVE_CHAIN,
  transport: http(BASE_RPC_URL),
});
