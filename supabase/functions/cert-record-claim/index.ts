// Records a successful on-chain claim against a cert_records row.
// Confirms the tx happened on the configured contract + chain, then stores
// blockchain_tx_hash, token_id, holder_address, contract_address.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';
import { createPublicClient, http, isAddress, type Hex } from 'npm:viem@2.21.40';
import { base, baseSepolia } from 'npm:viem@2.21.40/chains';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CHAIN_ID = Number(Deno.env.get('CERT_CHAIN_ID') || 84532);
const CONTRACT = (Deno.env.get('CERT_CONTRACT_ADDRESS') ?? '').toLowerCase();
// Dedicated Chainstack node (Base Sepolia). Falls back to the public endpoint.
const RPC_URL = Deno.env.get('CERT_RPC_URL') || undefined;

const BodySchema = z.object({
  serial_hash: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  tx_hash: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  holder: z.string().refine(isAddress, 'invalid address'),
});

function fail(status = 500) {
  return new Response(JSON.stringify({ error: 'Request failed' }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return fail(405);

  try {
    if (!CONTRACT) return fail(503);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return fail(400);
    const { serial_hash, tx_hash, holder } = parsed.data;

    const chain = CHAIN_ID === 8453 ? base : baseSepolia;
    const client = createPublicClient({ chain, transport: http(RPC_URL) });
    const receipt = await client.getTransactionReceipt({ hash: tx_hash as Hex });
    if (!receipt || receipt.status !== 'success') return fail(400);
    if (receipt.to?.toLowerCase() !== CONTRACT) return fail(400);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    await admin
      .from('cert_records')
      .update({
        blockchain_tx_hash: tx_hash,
        contract_address: CONTRACT,
        chain_id: CHAIN_ID,
        holder_address: holder,
        token_id: BigInt(serial_hash).toString(),
        status: 'issued',
      })
      .eq('serial_hash', serial_hash);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return fail(500);
  }
});
