// Issues an EIP-712 Voucher for a UTAAB certificate. Admins only.
// The voucher is then claimed on Base by the student wallet via `claim()`.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';
import {
  createWalletClient,
  http,
  isAddress,
  keccak256,
  stringToBytes,
  type Hex,
} from 'npm:viem@2.21.40';
import { privateKeyToAccount } from 'npm:viem@2.21.40/accounts';
import { base, baseSepolia } from 'npm:viem@2.21.40/chains';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ISSUER_PK = Deno.env.get('UTAAB_ISSUER_PRIVATE_KEY') as Hex | undefined;
const CHAIN_ID = Number(Deno.env.get('CERT_CHAIN_ID') || 84532);
const CONTRACT = Deno.env.get('CERT_CONTRACT_ADDRESS') as Hex | undefined;

const BodySchema = z.object({
  serial_hash: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  holder: z.string().refine(isAddress, 'invalid address'),
  token_uri: z.string().max(2048).optional(),
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
    if (!ISSUER_PK || !CONTRACT) return fail(503);

    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
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

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return fail(400);
    const { serial_hash, holder, token_uri } = parsed.data;

    const { data: row, error } = await admin
      .from('cert_records')
      .select('id, event_hash, issued_by_hash, status, serial_number')
      .eq('serial_hash', serial_hash)
      .maybeSingle();
    if (error || !row) return fail(404);
    if (row.status === 'revoked') return fail(409);

    const account = privateKeyToAccount(ISSUER_PK);
    const chain = CHAIN_ID === 8453 ? base : baseSepolia;
    const wallet = createWalletClient({ account, chain, transport: http() });

    const issuedAt = BigInt(Math.floor(Date.now() / 1000));
    const tokenURI =
      token_uri ?? `https://utaab.org/api/cert/${row.serial_number}.json`;

    const voucher = {
      serialHash: serial_hash as Hex,
      eventHash: row.event_hash as Hex,
      issuedByHash: row.issued_by_hash as Hex,
      holder: holder as Hex,
      issuedAt,
      tokenURI,
    };

    const signature = await wallet.signTypedData({
      account,
      domain: {
        name: 'UTAAB-Certificate',
        version: '1',
        chainId: CHAIN_ID,
        verifyingContract: CONTRACT,
      },
      types: {
        Voucher: [
          { name: 'serialHash', type: 'bytes32' },
          { name: 'eventHash', type: 'bytes32' },
          { name: 'issuedByHash', type: 'bytes32' },
          { name: 'holder', type: 'address' },
          { name: 'issuedAt', type: 'uint64' },
          { name: 'tokenURI', type: 'string' },
        ],
      },
      primaryType: 'Voucher',
      message: voucher,
    });

    await admin
      .from('cert_records')
      .update({
        status: 'issued',
        issued_at: new Date(Number(issuedAt) * 1000).toISOString(),
        chain_id: CHAIN_ID,
        contract_address: CONTRACT,
        holder_address: holder,
        voucher: { ...voucher, issuedAt: issuedAt.toString() },
        voucher_signature: signature,
      })
      .eq('id', row.id);

    // Hash unused import suppression
    void keccak256(stringToBytes(''));

    return new Response(
      JSON.stringify({
        voucher: { ...voucher, issuedAt: issuedAt.toString() },
        signature,
        contract: CONTRACT,
        chainId: CHAIN_ID,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch {
    return fail(500);
  }
});
