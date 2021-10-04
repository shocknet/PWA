import { ACTIONS } from "../actions/GuestActions";

export interface GuestState {
  user?: {
    alias: string;
    pass: string;
    pub: string;
    epub: string;
    ok: 0;
  };
  paymentRequest?: {
    response: string;
    metadata: object;
  };
  tips: string[];
}

const INITIAL_STATE: GuestState = {
  user: null,
  paymentRequest: null,
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
    default:
      return state;
  }
};

export default guest;
