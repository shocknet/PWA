/**
 * @format
 */
import { ACTIONS } from "../actions/AppActions";

const INITIAL_STATE = {
  dialogText: '',
  dialogHasCallback:false
};
const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.OPEN_DIALOG: {
      const {text,hasCallback} = action.data
      return { ...state, dialogText: text,dialogHasCallback:hasCallback };
    }
    case ACTIONS.CLOSE_DIALOG: {
      return {...state, dialogText: '',dialogHasCallback: false}
    }
    default:
      return state;
  }
};

export default app;
