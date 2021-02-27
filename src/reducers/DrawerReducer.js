/**
 * @format
 */
import { ACTIONS } from "../actions/DrawerActions";

const INITIAL_STATE = {
  open: false
};

const drawer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_DRAWER_OPEN: {
      return { ...state, open: action.data };
    }
    default:
      return state;
  }
};

export default drawer;
