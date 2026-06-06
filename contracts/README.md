# UTAAB Certificate Contract — Base

Soulbound ERC-721 certificate registry for UTAAB, deployed on **Base**.

- Network (now): **Base Sepolia** (chainId `84532`, RPC `https://sepolia.base.org`, explorer `https://sepolia.basescan.org`)
- Network (later): Base mainnet (chainId `8453`)
- Tokens are **soulbound** — non-transferable.
- Students claim certificates from their own wallet using an EIP-712 voucher signed off-chain by the UTAAB issuer wallet.

## Project layout

```
contracts/
├─ src/UtaabCertificate.sol          ← main contract
├─ script/Deploy.s.sol               ← deploy script
├─ test/UtaabCertificate.t.sol       ← Foundry tests
├─ foundry.toml
└─ remappings.txt
```

## One-time setup

Install [Foundry](https://book.getfoundry.sh/getting-started/installation), then from `contracts/`:

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit
```

## Run tests

```bash
forge test -vv
```

## Deploy to Base Sepolia

```bash
export DEPLOYER_PK=0x...                # funded Base Sepolia EOA
export ADMIN_ADDR=0x...                 # gets ADMIN_ROLE + DEFAULT_ADMIN_ROLE
export ISSUER_ADDR=0x...                # matches UTAAB_ISSUER_PRIVATE_KEY in Lovable Cloud
export BASESCAN_API_KEY=...             # from basescan.org

forge script script/Deploy.s.sol:Deploy \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

Copy the deployed address into the project env:

- `VITE_CERTIFICATE_CONTRACT_ADDRESS=0x...` (Lovable will read this in `src/lib/web3/wagmi.ts`)

## Promoting to Base mainnet

1. Re-run the deploy script with `--rpc-url base` and a mainnet-funded deployer.
2. Update env: `VITE_CHAIN_ID=8453`, `VITE_BASE_RPC_URL=https://mainnet.base.org`, `VITE_BLOCK_EXPLORER_URL=https://basescan.org`, `VITE_CERTIFICATE_CONTRACT_ADDRESS=0x...`.
3. Update DB default: `ALTER TABLE public.cert_records ALTER COLUMN chain_id SET DEFAULT 8453;`

No application code changes required.
