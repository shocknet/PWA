import { ACTIONS } from "../actions/ContentActions";
const INITIAL_STATE = {
  seedProviderPub:'test'
};

const content = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_SEED_PROVIDER_PUB: {
      return { ...state, seedProviderPub: action.data };
    }
    default:
      return state;
  }
};

export default content;
