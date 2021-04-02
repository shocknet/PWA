import * as React from "react";
import * as Common from "shock-common";

export function useForceUpdate(): () => void {
  const [, setTick] = React.useState(0);
  const update = React.useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}

export const isOnline = (lastSeen: number): boolean =>
  Date.now() - lastSeen < Common.SET_LAST_SEEN_APP_INTERVAL * 2;
