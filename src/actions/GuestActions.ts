import SEA from "gun/sea";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { State } from "../reducers";
import FieldError from "../utils/FieldError";
import * as Common from "shock-common";
import {
  $$_SHOCKWALLET__ENCRYPTED__,
  $$__SHOCKWALLET__MSG__,
  authUser,
  createRandomGunUser,
  fetchPath,
  RandomGunUser,
  setPath
} from "../utils/Gun";

interface EncryptedOrder {
  response?: string;
  type?: "err" | "invoice" | "orderAck";
  ackNode?: string;
}

export const ACTIONS = {
  RESET_GUEST: "guest/reset",
  CREATE_GUEST_USER: "guest/user/create",
  TIP_USER: "guest/user/tip",
  FOLLOW_USER: "guest/user/follow",
  UNFOLLOW_USER: "guest/user/unfollow",
  SET_PAYMENT_RESPONSE: "guest/paymentRequest/response",
  SET_PAYMENT_METADATA: "guest/paymentRequest/metadata",
  RESET_DEFAULT_FOLLOWS: "guest/follows/reset"
};

export const resetGuestUser = () => ({
  type: ACTIONS.RESET_GUEST
});

export const resetPaymentResponse = () => ({
  type: ACTIONS.SET_PAYMENT_RESPONSE
});

export const setPaymentMetadata = data => ({
  type: ACTIONS.SET_PAYMENT_METADATA,
  data
});

export const createGuestUser = (): ThunkAction<
  void,
  State,
  unknown,
  Action<string>
> => async (dispatch, getState) => {
  const { guest } = getState();

  if (!guest.user) {
    const newUser = await createRandomGunUser();
    const newUserEpub = await fetchPath({
      query: `${newUser.pub}::epub`
    });

    dispatch({
      type: ACTIONS.CREATE_GUEST_USER,
      data: { ...newUser, epub: newUserEpub }
    });
  }
};

interface TipParams {
  senderPair: RandomGunUser;
  recipientPublicKey: string;
  amount: number;
  metadata: Record<string, any>;
}

interface TipResponse {
  paymentRequest: string;
  ackNode: string;
}

export const payUser = ({
  senderPair,
  recipientPublicKey,
  amount,
  metadata
}: TipParams): ThunkAction<
  Promise<TipResponse>,
  State,
  unknown,
  Action<string>
> => async (dispatch, getState) => {
  const me = await authUser(senderPair.alias, senderPair.pass);
  const [recipientUserEPub, orderAddress] = await Promise.all([
    fetchPath({
      query: `${recipientPublicKey}::epub`
    }),
    fetchPath({
      query: `${recipientPublicKey}::currentOrderAddress`
    })
  ]);

  const secret = await SEA.secret(recipientUserEPub, me.sea);

  const [encryptedAmount, encryptedMemo] = await Promise.all([
    SEA.encrypt($$__SHOCKWALLET__MSG__ + amount.toString(), secret),
    SEA.encrypt($$__SHOCKWALLET__MSG__ + "Tipped user!", secret)
  ]);

  const order = {
    amount: $$_SHOCKWALLET__ENCRYPTED__ + encryptedAmount,
    from: me.sea.pub,
    memo: $$_SHOCKWALLET__ENCRYPTED__ + encryptedMemo,
    timestamp: Date.now(),
    // Tip type
    ...metadata
  };

  const newOrder = await setPath({
    query: `$gun::orderNodes>${orderAddress}`,
    data: order
  });

  const newOrderId = newOrder._["#"].split("/").slice(-1)[0];

  const encryptedOrderListener = await fetchPath({
    query: `${recipientPublicKey}::orderToResponse>${newOrderId}::on`
  });

  console.log("encryptedOrderListener:", encryptedOrderListener);

  const encryptedOrder: EncryptedOrder = await fetchPath({
    query: `${recipientPublicKey}::orderToResponse>${newOrderId}`
  });

  const decryptedResponse = await SEA.decrypt(
    encryptedOrder.response.replace($$_SHOCKWALLET__ENCRYPTED__, ""),
    secret
  );

  const decryptedOrder = {
    response: decryptedResponse
      ?.replace?.($$__SHOCKWALLET__MSG__, "")
      .replace($$_SHOCKWALLET__ENCRYPTED__, ""),
    type: encryptedOrder.type
  };

  console.log("[ORDER] Decrypted order:", decryptedOrder);

  if (decryptedOrder.type === "err") {
    throw new FieldError({
      field: "order",
      message: "An error has occurred while retrieving the order",
      data: decryptedOrder.response
    });
  }

  dispatch({
    type: ACTIONS.SET_PAYMENT_RESPONSE,
    data: {
      response: decryptedOrder.response
    }
  });

  return {
    paymentRequest: decryptedOrder.response,
    ackNode: encryptedOrder.ackNode
  };
};

export const followUser = ({
  publicKey = ""
}): ThunkAction<Promise<void>, State, unknown, Action<string>> => async (
  dispatch,
  getState
) => {
  const [followedUser] = getState().guest.follows.filter(
    follow => follow.user === publicKey
  );

  if (followedUser) {
    dispatch({
      type: ACTIONS.UNFOLLOW_USER,
      data: publicKey
    });
    return;
  }

  const follow: Common.Follow = {
    user: publicKey,
    status: "ok",
    private: false
  };

  dispatch({
    type: ACTIONS.FOLLOW_USER,
    data: follow
  });
};
