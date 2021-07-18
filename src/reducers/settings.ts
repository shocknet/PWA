import produce from "immer";

import * as Utils from "../utils";
import { set } from "../actions/SettingsActions";

const INITIAL_STATE: Record<string, string | number | boolean> = {};

const settings = produce((draft, action) => {
  try {
    if (set.match(action)) {
      const { key, value } = action.payload;
      draft[key] = value;
    }
  } catch (e) {
    Utils.logger.error(`Error inside settings reducer:`);
    Utils.logger.error(e);
  }
}, INITIAL_STATE);

export default settings;
