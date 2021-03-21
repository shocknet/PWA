import * as React from "react";
import * as Common from "shock-common";
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

export function useForceUpdate(): () => void {
  const [, setTick] = React.useState(0);
  const update = React.useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}

export const isOnline = (lastSeen: number): boolean =>
  Date.now() - lastSeen < Common.SET_LAST_SEEN_APP_INTERVAL * 2;
