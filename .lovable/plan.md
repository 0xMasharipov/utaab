## Goal

Get `VITE_CERTIFICATE_CONTRACT_ADDRESS` set to a real Base Sepolia contract so certificate features work. The contract isn't deployed yet, and deployment requires a funded EOA private key + Foundry — that has to happen on your machine, not in Lovable's sandbox.

## Step 1 — You deploy the contract (local, one-time)

From the `contracts/` directory on your machine:

```bash
# install Foundry first if needed: https://book.getfoundry.sh
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit
forge test -vv   # sanity check

export DEPLOYER_PK=0x...        # any funded Base Sepolia EOA (get testnet ETH from a Base Sepolia faucet)
export ADMIN_ADDR=0x...         # address resolved by utaablockchain.base.eth (DEFAULT_ADMIN_ROLE + ADMIN_ROLE)
export ISSUER_ADDR=0x...        # must match the address of UTAAB_ISSUER_PRIVATE_KEY in Lovable Cloud secrets
export BASESCAN_API_KEY=...     # from basescan.org, for --verify

forge script script/Deploy.s.sol:Deploy \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

Copy the deployed contract address from the broadcast output (also visible on sepolia.basescan.org).

Notes:
- `ADMIN_ADDR` should be the resolved 0x address of `utaablockchain.base.eth` on Base Sepolia. ENS/Basenames resolution can differ between mainnet and Sepolia — confirm before deploy.
- `ISSUER_ADDR` must match the public address derived from the `UTAAB_ISSUER_PRIVATE_KEY` already stored in Lovable Cloud, otherwise voucher signatures won't verify.
- `DEPLOYER_PK` only needs gas; it gets no roles.

## Step 2 — I wire it into the app

Once you paste the deployed address back to me, I will:

1. Set `VITE_CERTIFICATE_CONTRACT_ADDRESS=0x...` in the project `.env` (frontend env var; safe to commit as it's a public on-chain address).
2. Confirm `src/lib/web3/wagmi.ts` picks it up (currently falls back to the zero address).
3. Verify the existing chain config stays on Base Sepolia: `VITE_CHAIN_ID=84532`, `VITE_BASE_RPC_URL=https://sepolia.base.org`, `VITE_BLOCK_EXPLORER_URL=https://sepolia.basescan.org`. Add any missing.
4. Sanity-check that `cert_records.chain_id` default is `84532` so claims log on the right chain.

## Step 3 — Smoke test

After the env is set:
- Connect admin wallet → confirm the certificates admin UI reads from the new contract (no zero-address calls in console/network).
- Issue one test voucher → claim from a student wallet on Base Sepolia → confirm tx on sepolia.basescan.org and a `cert_records` row written.

## What I need from you next

Just the deployed contract address (and confirm Sepolia, not mainnet). If you'd rather not deploy yourself, tell me and I'll outline alternatives (e.g. you share a throwaway funded testnet key via the secrets tool so an edge function could deploy — not recommended).
