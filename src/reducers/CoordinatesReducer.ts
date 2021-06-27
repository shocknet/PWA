import produce from "immer";

import { CoordinateWithHash } from "../schema";

import {
  coordinateDeleted,
  coordinateReceived
} from "../actions/CoordinateActions";

const INITIAL_STATE = {} as Record<string, CoordinateWithHash>;

const coordinates = produce((draft, action) => {
  if (coordinateDeleted.match(action)) {
    const { coordinateSHA256 } = action.payload;
    delete draft[coordinateSHA256];
  }
  if (coordinateReceived.match(action)) {
    const { coordinate, coordinateSHA256 } = action.payload;
    draft[coordinateSHA256] = { ...coordinate, coordinateSHA256 };
  }
}, INITIAL_STATE);

export default coordinates;
