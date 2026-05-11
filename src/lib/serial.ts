/** Build event_code from event name: take initials of words (max 4), uppercase. */
export function buildEventCode(eventName: string): string {
  const words = eventName
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'EVT';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 4)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/** Build serial number e.g. UTAAB-BB-2026-0001 */
export function buildSerial(prefix: string, year: number, n: number): string {
  return `${prefix}-${year}-${String(n).padStart(4, '0')}`;
}

export function defaultPrefix(eventCode: string): string {
  return `UTAAB-${eventCode}`;
}
