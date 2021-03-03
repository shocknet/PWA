/**
 * Converts seconds/microseconds timestamps to milliseconds, leaves milliseconds
 * timestamps untouched. Works for timestamps no older than 2001.
 * @timestamp A timestamp that can be seconds, milliseconds or microseconds.
 * Should be no older than 2001.
 */
export function normalizeTimestampToMs(timestamp: number): number {
  if (timestamp === 0) {
    return timestamp;
  }

  const t = timestamp.toString();

  if (t.length === 10) {
    // is seconds
    return Number(t) * 1000;
  } else if (t.length === 13) {
    // is milliseconds
    return Number(t);
  } else if (t.length === 16) {
    // is microseconds
    return Number(t) / 1000;
  }

  console.error("normalizeTimestamp() -> could not interpret timestamp");

  return Number(t);
}
