import { ACTIONS } from "../actions/GuestActions";
import * as Common from "shock-common";

export interface GuestState {
  user?: {
    alias: string;
    pass: string;
    pub: string;
    epub: string;
    ok: 0;
  };
  follows: Common.Follow[];
  paymentRequest?: {
    response: string;
    metadata: object;
  };
  tips: string[];
}

const INITIAL_STATE: GuestState = {
  user: null,
  paymentRequest: null,
  follows: [],
  tips: []
};

const guest = (
  state: GuestState = INITIAL_STATE,
  action: { type: string; data: any }
): GuestState => {
  const { data } = action;

  switch (action.type) {
    case ACTIONS.RESET_GUEST: {
      return INITIAL_STATE;
    }
    case ACTIONS.CREATE_GUEST_USER: {
      return {
        ...state,
        user: data
      };
    }
    case ACTIONS.TIP_USER: {
      return {
        ...state,
        tips: [...state.tips, data]
      };
    }
    case ACTIONS.SET_PAYMENT_RESPONSE: {
      return {
        ...state,
        paymentRequest: data
      };
    }
    case ACTIONS.FOLLOW_USER: {
      const { data } = action;

      return {
        ...state,
        follows: [...state.follows, data]
      };
    }
    case ACTIONS.UNFOLLOW_USER: {
      const { data } = action;

      return {
        ...state,
        follows: state.follows.filter(follow => follow.user !== data)
      };
    }
    case ACTIONS.RESET_DEFAULT_FOLLOWS: {
      const { data } = action;

      if (state.follows.length > 0) {
        return state;
      }

      return { ...state, follows: data };
    }
    default:
      return state;
  }
};

export default guest;
