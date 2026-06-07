// ABI for UtaabCertificate (soulbound ERC-721 + voucher claim on Base).
// Backwards-compatible: still exposes `verifyCertificate` for the existing
// verifier UI. Adds `claim`, `revoke`, `getCertificate`, `tokenURI`.
export const certificateRegistryAbi = [
  // --- Verifier read (unchanged shape) ---
  {
    type: 'function',
    name: 'verifyCertificate',
    stateMutability: 'view',
    inputs: [{ name: 'serialHash', type: 'bytes32' }],
    outputs: [
      { name: 'valid', type: 'bool' },
      { name: 'issued', type: 'bool' },
      { name: 'revoked', type: 'bool' },
      { name: 'eventHash', type: 'bytes32' },
      { name: 'issuedByHash', type: 'bytes32' },
      { name: 'issuedAt', type: 'uint64' },
      { name: 'revokedAt', type: 'uint64' },
    ],
  },
  {
    type: 'function',
    name: 'getCertificate',
    stateMutability: 'view',
    inputs: [{ name: 'serialHash', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'eventHash', type: 'bytes32' },
          { name: 'issuedByHash', type: 'bytes32' },
          { name: 'holder', type: 'address' },
          { name: 'issuedAt', type: 'uint64' },
          { name: 'revokedAt', type: 'uint64' },
          { name: 'issued', type: 'bool' },
          { name: 'revoked', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }],
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  // --- Voucher claim (student pays gas) ---
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'v',
        type: 'tuple',
        components: [
          { name: 'serialHash', type: 'bytes32' },
          { name: 'eventHash', type: 'bytes32' },
          { name: 'issuedByHash', type: 'bytes32' },
          { name: 'holder', type: 'address' },
          { name: 'issuedAt', type: 'uint64' },
          { name: 'tokenURI', type: 'string' },
        ],
      },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
  // --- Admin revoke ---
  {
    type: 'function',
    name: 'revoke',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'serialHash', type: 'bytes32' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  // --- Legacy registry surface (DEPRECATED).
  //     These entries exist only so older code compiles. Calling them against
  //     the live UtaabCertificate contract on Base will REVERT — issuance must
  //     go through the cert-issue-voucher edge function and `claim()`, and
  //     revocation must use `revoke(serialHash, reason)`.
  //     @deprecated do not call: issueCertificate, issueBatchCertificates, revokeCertificate ---
  {
    type: 'function',
    name: 'issueCertificate',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'serialHash', type: 'bytes32' },
      { name: 'eventHash', type: 'bytes32' },
      { name: 'issuedByHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'issueBatchCertificates',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'serialHashes', type: 'bytes32[]' },
      { name: 'eventHash', type: 'bytes32' },
      { name: 'issuedByHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'revokeCertificate',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'serialHash', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
  // --- Events ---
  {
    type: 'event',
    name: 'CertificateIssued',
    inputs: [
      { name: 'serialHash', type: 'bytes32', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'holder', type: 'address', indexed: true },
      { name: 'eventHash', type: 'bytes32', indexed: false },
      { name: 'issuedByHash', type: 'bytes32', indexed: false },
      { name: 'issuedAt', type: 'uint64', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CertificateRevoked',
    inputs: [
      { name: 'serialHash', type: 'bytes32', indexed: true },
      { name: 'revokedAt', type: 'uint64', indexed: false },
      { name: 'reason', type: 'string', indexed: false },
    ],
    anonymous: false,
  },
] as const;

export type CertificateVoucher = {
  serialHash: `0x${string}`;
  eventHash: `0x${string}`;
  issuedByHash: `0x${string}`;
  holder: `0x${string}`;
  issuedAt: bigint;
  tokenURI: string;
};
