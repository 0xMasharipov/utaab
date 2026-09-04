// Admin-only: reports the certificate on-chain configuration so admins can
// confirm the deployment (issuer wallet address, chain, contract, node health).
// Never returns the issuer private key — only its public address.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { privateKeyToAccount } from 'npm:viem@2.21.40/accounts';
import type { Hex } from 'npm:viem@2.21.40';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ISSUER_PK = Deno.env.get('UTAAB_ISSUER_PRIVATE_KEY') as Hex | undefined;
const CHAIN_ID = Number(Deno.env.get('CERT_CHAIN_ID') || 84532);
const CONTRACT = Deno.env.get('CERT_CONTRACT_ADDRESS') ?? null;
const RPC_URL = Deno.env.get('CERT_RPC_URL') || 'https://sepolia.base.org';

function fail(status = 500) {
  return new Response(JSON.stringify({ error: 'Request failed' }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST' && req.method !== 'GET') return fail(405);

  try {
    const jwt = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    if (!jwt) return fail(401);

    const anon = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userRes } = await anon.auth.getUser();
    const user = userRes?.user;
    if (!user) return fail(401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: hasRole } = await admin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });
    if (!hasRole) return fail(403);

    let issuerAddress: string | null = null;
    if (ISSUER_PK) {
      try {
        issuerAddress = privateKeyToAccount(ISSUER_PK).address;
      } catch {
        issuerAddress = null;
      }
    }

    // Node health check (chain id + head block) through the configured RPC.
    let rpcChainId: number | null = null;
    let blockNumber: number | null = null;
    let rpcOk = false;
    let contractDeployed: boolean | null = null;
    try {
      const call = async (method: string, params: unknown[]) => {
        const res = await fetch(RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        });
        const json = await res.json();
        return json?.result as string | undefined;
      };
      const cid = await call('eth_chainId', []);
      const blk = await call('eth_blockNumber', []);
      rpcChainId = cid ? Number(BigInt(cid)) : null;
      blockNumber = blk ? Number(BigInt(blk)) : null;
      rpcOk = rpcChainId !== null;
      if (CONTRACT) {
        const code = await call('eth_getCode', [CONTRACT, 'latest']);
        contractDeployed = !!code && code !== '0x';
      }
    } catch {
      rpcOk = false;
    }

    return new Response(
      JSON.stringify({
        chainId: CHAIN_ID,
        network: CHAIN_ID === 8453 ? 'Base' : 'Base Sepolia',
        contract: CONTRACT,
        contractDeployed,
        issuerAddress,
        rpc: { ok: rpcOk, chainId: rpcChainId, blockNumber, dedicatedNode: !!Deno.env.get('CERT_RPC_URL') },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch {
    return fail(500);
  }
});
