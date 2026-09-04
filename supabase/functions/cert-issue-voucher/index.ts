// Issues an EIP-712 Voucher for a UTAAB certificate. Admins only.
// The voucher is then claimed on Base by the student wallet via `claim()`.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';
import {
  createWalletClient,
  getAddress,
  http,
  isAddress,
  type Hex,
} from 'npm:viem@2.21.40';
import { privateKeyToAccount } from 'npm:viem@2.21.40/accounts';
import { base, baseSepolia } from 'npm:viem@2.21.40/chains';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ISSUER_PK = Deno.env.get('UTAAB_ISSUER_PRIVATE_KEY') as Hex | undefined;
const CHAIN_ID = Number(Deno.env.get('CERT_CHAIN_ID') || 84532);
const CONTRACT = Deno.env.get('CERT_CONTRACT_ADDRESS') as Hex | undefined;
// Dedicated Chainstack node (Base Sepolia). Falls back to the public endpoint.
const RPC_URL = Deno.env.get('CERT_RPC_URL') || undefined;

const BodySchema = z.object({
  serial_hash: z
    .string()
    .regex(/^0x[0-9a-fA-F]{64}$/)
    .transform((s) => s.toLowerCase()),
  holder: z.string().refine(isAddress, 'invalid address'),
  token_uri: z
    .string()
    .max(2048)
    .refine((u) => u.startsWith('https://'), 'token_uri must be https')
    .optional(),
});

function fail(status = 500, code?: string) {
  return new Response(JSON.stringify({ error: 'Request failed' }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...(code ? { 'X-Error-Code': code } : {}),
    },
  });
}

function logStage(stage: string, payload: Record<string, unknown>) {
  // Structured server logs — no raw error text, only stable codes/values.
  try {
    console.log(`[voucher:${stage}]`, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return fail(405, 'method');

  const attemptId = crypto.randomUUID().slice(0, 8);
  const startedAt = Date.now();

  try {
    if (!ISSUER_PK || !CONTRACT) {
      logStage('error', { attempt_id: attemptId, stage: 'config' });
      return fail(503, 'config');
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) return fail(401, 'no_jwt');

    const anon = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userRes } = await anon.auth.getUser();
    const user = userRes?.user;
    if (!user) return fail(401, 'no_user');

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: hasRole } = await admin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });
    if (!hasRole) {
      logStage('error', { attempt_id: attemptId, stage: 'forbidden', user_id: user.id });
      return fail(403, 'forbidden');
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      logStage('error', { attempt_id: attemptId, stage: 'schema' });
      return fail(400, 'schema');
    }

    // Re-derive holder with checksum normalization; rejects bad casing/format.
    let holderChecksummed: Hex;
    try {
      holderChecksummed = getAddress(parsed.data.holder) as Hex;
    } catch {
      logStage('error', { attempt_id: attemptId, stage: 'holder_checksum' });
      return fail(400, 'holder_checksum');
    }

    const { serial_hash, token_uri } = parsed.data;
    // DB stores serial_hash as 64 hex chars without the 0x prefix.
    const serialHashDb = serial_hash.slice(2);

    logStage('request', {
      attempt_id: attemptId,
      user_id: user.id,
      serial_hash,
      holder: holderChecksummed,
      chain_id: CHAIN_ID,
      contract: CONTRACT,
      has_token_uri: !!token_uri,
    });

    const { data: row, error } = await admin
      .from('cert_records')
      .select('id, event_hash, issued_by_hash, status, serial_number, chain_id')
      .eq('serial_hash', serialHashDb)
      .maybeSingle();
    if (error || !row) {
      logStage('error', { attempt_id: attemptId, stage: 'lookup', found: !!row });
      return fail(404, 'not_found');
    }
    if (row.status === 'revoked') {
      logStage('error', { attempt_id: attemptId, stage: 'revoked' });
      return fail(409, 'revoked');
    }
    if (row.status === 'issued') {
      logStage('error', { attempt_id: attemptId, stage: 'already_issued' });
      return fail(409, 'already_issued');
    }
    if (row.chain_id != null && row.chain_id !== CHAIN_ID) {
      logStage('error', { attempt_id: attemptId, stage: 'chain_mismatch', row_chain: row.chain_id });
      return fail(409, 'chain_mismatch');
    }

    const account = privateKeyToAccount(ISSUER_PK);
    const chain = CHAIN_ID === 8453 ? base : baseSepolia;
    const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });

    const issuedAt = BigInt(Math.floor(Date.now() / 1000));
    const tokenURI =
      token_uri ?? `https://utaab.org/api/cert/${row.serial_number}.json`;

    const voucher = {
      serialHash: serial_hash as Hex,
      eventHash: row.event_hash as Hex,
      issuedByHash: row.issued_by_hash as Hex,
      holder: holderChecksummed,
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
        holder_address: holderChecksummed,
        voucher: { ...voucher, issuedAt: issuedAt.toString() },
        voucher_signature: signature,
      })
      .eq('id', row.id);

    logStage('signed', {
      attempt_id: attemptId,
      serial_hash,
      issued_at: issuedAt.toString(),
      duration_ms: Date.now() - startedAt,
    });

    return new Response(
      JSON.stringify({
        voucher: { ...voucher, issuedAt: issuedAt.toString() },
        signature,
        contract: CONTRACT,
        chainId: CHAIN_ID,
        attemptId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch {
    logStage('error', { attempt_id: attemptId, stage: 'unhandled', duration_ms: Date.now() - startedAt });
    return fail(500, 'unhandled');
  }
});
