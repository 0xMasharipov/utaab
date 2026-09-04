# Certificates on the test network (Base Sepolia) with your Chainstack node

Goal: certificates are provably running on the test network — your own node handles all blockchain traffic from the server, the certificate contract is actually deployed, and an end-to-end issue test passes.

## What I found

- Your Chainstack node answers correctly and is Base Sepolia (chain id 84532), current block ~46.3 million.
- The certificate address configured today (`0x4fF7…43A9`) has **no contract behind it** on Base Sepolia or Base — nothing was ever deployed. That is why issuing/claiming can never complete.
- The certificate functions currently talk to the free public endpoint `sepolia.base.org`, not your node.
- The contract source and its deploy script already exist in the project and are written for Base Sepolia.

## What I will do

1. **Point the server at your node.** Save the node address as a private setting and use it for signing, claim confirmation and PDF lookups. The public site keeps using the free public endpoint, so your node address is never visible to visitors.
2. **Deploy the certificate contract to Base Sepolia**, granting issuing rights to your existing UTAAB issuer wallet and admin rights to the address you choose.
3. **Wire the new address in** everywhere: the server setting and the site setting, plus keep the network fixed to the test network (84532) and the test explorer.
4. **Run the tests.**
   - The contract's own test suite (issue, claim, revoke, non-transferable).
   - A live check on your node: the contract exists at the new address, reports the right issuer, and the network is 84532.
   - A real issue request through the admin function, confirming the signed voucher matches the issuer wallet and the record is stored with chain 84532 and the new address.
   - A verification read of that certificate straight from the chain.

## What I need from you

- **A funded Base Sepolia deployer wallet** — the private key of a test wallet holding a little Base Sepolia ETH (free from a faucet). It is only used for the deployment transaction and stored as a private setting. I'll tell you the issuer wallet address so you can fund it too if you'd rather deploy from that one.
- **The admin address** that should control the contract (revoke, role changes). If you skip this, I'll use the issuer wallet.

Nothing is spent on real money — this is entirely the test network.

## Technical notes

- New secret `CERT_RPC_URL` = the Chainstack Base Sepolia endpoint. `cert-issue-voucher`, `cert-record-claim` and `cert-pdf-url` switch from `http()` to `http(CERT_RPC_URL)`; `CERT_CHAIN_ID` stays `84532`.
- Deployment via Foundry in the sandbox (`forge script contracts/script/Deploy.s.sol:Deploy --rpc-url <chainstack> --broadcast`), with `ISSUER_ADDR` derived from `UTAAB_ISSUER_PRIVATE_KEY` (address only, never the key) and `ADMIN_ADDR` from your answer. Basescan verification if you supply a Basescan key, otherwise skipped.
- After deploy: set secret `CERT_CONTRACT_ADDRESS` and env `VITE_CERTIFICATE_CONTRACT_ADDRESS`; leave `VITE_BASE_RPC_URL=https://sepolia.base.org` (backend-only node usage as chosen).
- End-to-end test uses `supabase--curl_edge_functions` against `cert-issue-voucher` with a seeded `cert_records` row in `pending`, then `viem`/`cast` reads (`eth_chainId`, `eth_getCode`, `hasRole(ISSUER_ROLE, issuer)`, `getCertificate(serialHash)`) through the Chainstack endpoint.
- `cert_records.chain_id` default stays 84532; no schema change needed.
