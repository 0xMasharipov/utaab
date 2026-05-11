import { keccak256, toBytes } from 'viem';

/** Normalize serial number: trim + uppercase. */
export function normalizeSerial(serial: string): string {
  return serial.trim().toUpperCase();
}

/** keccak256 hash of normalized serial number. Returns 0x-prefixed bytes32 hex. */
export function hashSerial(serial: string): `0x${string}` {
  return keccak256(toBytes(normalizeSerial(serial)));
}

/** Hash of "event_name|event_date|speaker_name". event_date is YYYY-MM-DD string. */
export function hashEvent(eventName: string, eventDate: string, speakerName: string): `0x${string}` {
  const payload = `${eventName}|${eventDate}|${speakerName ?? ''}`;
  return keccak256(toBytes(payload));
}

/** Hash of issued_by string. */
export function hashIssuedBy(issuedBy: string): `0x${string}` {
  return keccak256(toBytes(issuedBy));
}

/** Strip 0x prefix for storage in DB (we store hex without 0x). */
export function toDbHex(hex: `0x${string}`): string {
  return hex.toLowerCase().replace(/^0x/, '');
}

/** Add 0x prefix back for on-chain calls. */
export function fromDbHex(hex: string): `0x${string}` {
  const clean = hex.toLowerCase().replace(/^0x/, '');
  return `0x${clean}` as `0x${string}`;
}
