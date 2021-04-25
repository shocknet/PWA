import * as React from "react";

import * as Store from "../store";

import { rifle, rifleCleanup } from "../utils/WebSocket";

export interface Pic {
  id: string;
  data: string;
  timestamp: number;
}

export const useStory = (publicKey: string) => {
  const [pics, setPics] = React.useState<readonly Pic[]>([]);
  const { hostIP } = Store.useSelector(state => state.node);

  const subscribeStory = React.useCallback(() => {
    const sub = rifle({
      query: `${publicKey}::story::open`,
      onData: (pictures: unknown) => {
        if (typeof pictures !== "object" || pictures === null) {
          return;
        }
  
        setPics(
          Object.values(pictures).filter(p => typeof p === "object" && p !== null)
        );
      },
      onError: (err: unknown) => {
        console.log(`Error inside story sub:`);
        console.log(err);
      }
    });

    return rifleCleanup(sub);
  }, [hostIP, publicKey]);

  React.useEffect(() => {
    const unsubscribe = subscribeStory();

    return unsubscribe
  }, [subscribeStory]);

  return pics;
};
