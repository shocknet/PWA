import { createSelector } from "reselect";

import { CoordinateWithHash } from "../../schema";
import { State } from "../../reducers";

export const selectAllCoordinates = createSelector(
  (state: State) => state.coordinates,
  (coordinates): CoordinateWithHash[] => {
    return Object.values(coordinates);
  }
);

export const selectAllCoordinatesNewestToOldest = createSelector(
  selectAllCoordinates,
  (coords): CoordinateWithHash[] => {
    return coords.slice().sort((a, b) => {
      return b.timestamp - a.timestamp;
    });
  }
);

export const selectSingleCoordinate = (coordinateSHA256: string) => (
  state: State
) => state.coordinates[coordinateSHA256];
