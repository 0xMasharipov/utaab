## Goal

Move on-chain certificates and the verifier from Ethereum Sepolia (current `chain_id = 11155111` default) to **Base Sepolia (84532)** today, with a one-line swap to **Base mainnet (8453)** later. Ship a Solidity contract (soulbound ERC-721 with EIP-712 voucher claim), deploy to Base Sepolia, and wire the app to read it via public Base RPC using `viem`.

## Architecture

```text
 Admin issues  →  Edge fn signs EIP-712 voucher (UTAAB_ISSUER_PRIVATE_KEY)
                  voucher persisted in cert_records (status='issued', tx_hash=NULL)
                              │
 Student opens cert page  →  "Claim on Base" button
                  Wallet connect (Coinbase Wallet / MetaMask, viem)
                  call claim(voucher, signature) on Base Sepolia
                              │
 Verifier page  →  viem readContract(getCertificate(serialHash))
                   shows: issuer, holder, issuedAt, revoked, tokenId, Basescan link
```

## Smart contract — `contracts/UtaabCertificate.sol`

Soulbound ERC-721 + voucher claim. OpenZeppelin v5.

Key surface:
- `struct Voucher { bytes32 serialHash; bytes32 eventHash; bytes32 issuedByHash; address holder; uint64 issuedAt; string tokenURI; }`
- `function claim(Voucher v, bytes signature) external` — verifies EIP-712 sig from `ISSUER_ROLE`; mints `tokenId = uint256(serialHash)` to `v.holder`; stores certificate; emits `CertificateIssued`.
- `function revoke(bytes32 serialHash, string reason)` — `ADMIN_ROLE` only; sets `revoked=true`; emits `CertificateRevoked`.
- `function getCertificate(bytes32 serialHash) view returns (Certificate)` — used by verifier.
- Transfers blocked via `_update` override (revert on non-mint/non-burn) → soulbound.
- `AccessControl`: `DEFAULT_ADMIN_ROLE`, `ADMIN_ROLE`, `ISSUER_ROLE`.
- EIP-712 domain: `UTAAB-Certificate` v1, current chainId.

Tooling: minimal **Foundry** project under `contracts/` with `foundry.toml`, `script/Deploy.s.sol`, and one test (`test/UtaabCertificate.t.sol`) covering claim, double-claim, revoke, transfer-revert. Foundry runs locally — Lovable sandbox doesn't deploy; user gets a one-command deploy script.

```text
contracts/
  foundry.toml
  src/UtaabCertificate.sol
  script/Deploy.s.sol
  test/UtaabCertificate.t.sol
  README.md           # deploy + verify commands
  abi/UtaabCertificate.json   # exported for frontend
```

Deploy command surfaced in README:
```
forge create src/UtaabCertificate.sol:UtaabCertificate \
  --rpc-url https://sepolia.base.org \
  --private-key $DEPLOYER_PK \
  --constructor-args $ADMIN_ADDR $ISSUER_ADDR \
  --verify --etherscan-api-key $BASESCAN_API_KEY \
  --verifier-url https://api-sepolia.basescan.org/api
```

## Frontend changes

1. **Add deps:** `viem`, `wagmi`, `@coinbase/wallet-sdk` (Coinbase Smart Wallet recommended on Base).
2. **`src/lib/chain.ts`** — single source of truth:
   ```ts
   export const ACTIVE_CHAIN = baseSepolia; // swap to base for mainnet
   export const CERT_CONTRACT = import.meta.env.VITE_CERT_CONTRACT_BASE_SEPOLIA as `0x${string}`;
   export const RPC_URL = "https://sepolia.base.org";
   export const EXPLORER = "https://sepolia.basescan.org";
   ```
3. **`src/lib/cert/abi.ts`** — generated ABI export.
4. **`src/lib/cert/read.ts`** — `getCertificateOnChain(serialHash)` using `createPublicClient({ chain: baseSepolia, transport: http(RPC_URL) })`.
5. **`src/pages/VerifyCertificate.tsx`** — replace any Sepolia/Etherscan link with Base Sepolia + Basescan; call `getCertificateOnChain` and render: holder, issuedAt, revoked badge, tokenId, "View on Basescan" link.
6. **New `src/components/cert/ClaimOnBase.tsx`** — connect wallet → submit `claim(voucher, sig)` → on success POST result to edge fn to persist `tx_hash` + `contract_address`.
7. Update any UI copy that says "Ethereum"/"Sepolia" in cert UX to "Base".

## Backend changes

1. **DB migration** — flip default for forward compatibility (does NOT touch existing rows):
   - `ALTER TABLE public.cert_records ALTER COLUMN chain_id SET DEFAULT 84532;`
   - Add nullable columns: `token_id NUMERIC`, `holder_address TEXT`, `voucher JSONB`, `voucher_signature TEXT`.
2. **Edge function `cert-issue-voucher`** (new): zod-validated input → builds EIP-712 voucher → signs with `UTAAB_ISSUER_PRIVATE_KEY` → updates `cert_records` row (`status='issued'`, voucher + signature). Standard hardening: `verify_jwt=false` in code with `has_role('admin')` check, multi-layer rate limit, 500-only errors.
3. **Edge function `cert-record-claim`** (new): student-callable, validates tx receipt against contract address + chainId via Base RPC, then writes `blockchain_tx_hash`, `token_id`, `holder_address`, `contract_address` to the row.

## Secrets needed (added via secrets tool after plan approval)
- `UTAAB_ISSUER_PRIVATE_KEY` — server-side signer for vouchers.
- `VITE_CERT_CONTRACT_BASE_SEPOLIA` — deployed contract address (env, not secret; written after deploy).

## Out of scope (for this turn)
- Base mainnet deploy (one-line swap when ready).
- Migrating already-issued Sepolia certs — they keep `chain_id=11155111`; verifier handles both via `chain_id`.
- Gasless / paymaster integration.

## Acceptance
1. `forge test` passes locally for the contract.
2. Deploying with the README command yields a verified contract on Base Sepolia.
3. Admin can issue a voucher; student wallet can claim it on Base Sepolia; tx + token appear on `sepolia.basescan.org`.
4. `/verify/:serial` reads the cert directly from Base Sepolia via public RPC and links to Basescan.
5. Switching to mainnet later = change `ACTIVE_CHAIN` + contract address + DB default; no other code changes.
