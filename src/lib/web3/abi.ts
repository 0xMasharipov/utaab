// ABI for UTAABCertificateRegistry
export const certificateRegistryAbi = [
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
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;
