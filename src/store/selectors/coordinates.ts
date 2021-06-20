import { createSelector } from "reselect";

import { CoordinateWithHash } from "../../schema";
import { State } from "../../reducers";

export const selectAllCoordinates = createSelector(
  (state: State) => state.coordinates,
  (coordinates): CoordinateWithHash[] => {
    return Object.values(coordinates);
  }
);

export const selectSingleCoordinate = (coordinateSHA256: string) => (
  state: State
) => state.coordinates[coordinateSHA256];
