import React from "react";
import { DateTime } from "luxon";
import * as Common from "shock-common";

export function useForceUpdate() {
  const [tick, setTick] = React.useState(0);
  const update = React.useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return { forceUpdate: update, tick };
}

/**
 * Handle the ugly "in 0 seconds" cases (returning "Just now"), returns an empty
 * string if the timestamp is -1.
 */
export const formatTimestamp = (timestamp: number): string => {
  if (timestamp === -1) {
    return "";
  }
  const relativeTime = DateTime.fromMillis(
    Common.normalizeTimestampToMs(timestamp)
  ).toRelative();
  return relativeTime === "in 0 seconds" ? "Just now" : relativeTime;
};
