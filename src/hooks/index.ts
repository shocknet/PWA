import * as React from "react";

import * as Store from "../store";

import { rifle } from "../utils/WebSocket";

export interface Pic {
  id: string;
  data: string;
  timestamp: number;
}

export const useStory = (publicKey: string) => {
  const [pics, setPics] = React.useState<readonly Pic[]>([]);
  const { hostIP } = Store.useSelector(state => state.node);

  const subscribeStory = React.useCallback(async () => {
    const sub = await rifle({
      host: hostIP,
      query: `${publicKey}::story::open`
    });

    sub.on("$shock", (pictures: unknown) => {
      if (typeof pictures !== "object" || pictures === null) {
        return;
      }

      setPics(
        Object.values(pictures).filter(p => typeof p === "object" && p !== null)
      );
    });

    sub.on("error", (err: unknown) => {
      console.log(`Error inside story sub:`);
      console.log(err);
    });

    sub.on("NOT_AUTH", () => {
      console.warn(`NOT_AUTH inside story sub.`);
      // TODO: dispatch token invalidation
    });

    return () => {
      sub.off("$shock");
      sub.close();
    };
  }, [hostIP, publicKey]);

  React.useEffect(() => {
    subscribeStory();
  }, [subscribeStory]);

  return pics;
};
