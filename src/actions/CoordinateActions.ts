import * as Common from "shock-common";
import { createAction } from "@reduxjs/toolkit";

import * as Utils from "../utils";
import { fetchWalletBalance } from "./WalletActions";

export const coordinateDeleted = createAction<{
  coordinateSHA256: string;
}>("coordinates/deleted");

export const coordinateReceived = createAction<{
  coordinate: Common.Coordinate;
  coordinateSHA256: string;
}>("coordinates/received");

export const subCoordinates = () => (dispatch: (action: any) => void) => {
  Utils.logger.debug(`Subscribing to coordinates.`);
  try {
    const subscription = Utils.rifle({
      query: `$user::coordinates::map.on`,
      publicKey: "me",
      onData: (unparsed, coordinateSHA256) => {
        const coordinate = Utils.safeParseJson(unparsed);

        if (Common.isCoordinate(coordinate)) {
          dispatch(
            coordinateReceived({
              coordinate,
              coordinateSHA256
            })
          );
          fetchWalletBalance()(dispatch)
        } else if (coordinate === null) {
          dispatch(
            coordinateDeleted({
              coordinateSHA256
            })
          );
        } else {
          Utils.logger.error(
            `Coordinate subscription invalid (or incomplete) value -> `,
            coordinate
          );
        }
      }
    });

    return () => {
      subscription.then(sub => {
        sub.off();
      });
    };
  } catch (e) {
    alert(`Could not establish a subscription to coordinates: ${e.message}`);
    Utils.logger.error(
      `Could not establish a subscription to coordinates -> `,
      e
    );
  }
};
