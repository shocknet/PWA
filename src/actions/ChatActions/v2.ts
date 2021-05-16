import { createAction } from "@reduxjs/toolkit";
import * as Common from "shock-common";

import * as Utils from "../../utils";
import * as Schema from "../../schema";
import { rifle } from "../../utils/WebSocket";

/**
 * Dispatched when one pub to outgoing pair is received from the pub to
 * outgoings map in gun.
 */
export const recipientToOutgoingReceived = createAction<{
  outgoingID: string | null;
  publicKey: string;
}>("chat/recipientToOutgoingReceived");

/**
 * Subscribe to data and changes in the pub to outgoings map stored in gun.
 * @returns A thunk that returns a subscription.
 */
export const subRecipientToOutgoing = () => (
  dispatch: (action: any) => void,
  getState: () => { node: { publicKey: string } }
): Promise<Schema.Subscription> => {
  try {
    const selfPublicKey = getState().node.publicKey;

    if (!Common.isPopulatedString(selfPublicKey)) {
      throw new Error(`Self public key not a populated string`);
    }

    return rifle({
      query: `$user::recipientToOutgoing::map.on`,
      publicKey: selfPublicKey,
      onData: (outgoingID, publicKey) => {
        dispatch(
          recipientToOutgoingReceived({
            outgoingID,
            publicKey
          })
        );
      }
    });
  } catch (e) {
    alert(
      `Could not establish a subscription to recipientToOutgoing: ${e.message}`
    );
    Utils.logger.error(
      `Could not establish a subscription to recipientToOutgoing`,
      e
    );
  }
};

/**
 * Dispatched when one pub to incoming pair is received from the user to
 * incoming map in gun.
 */
export const userToIncomingReceived = createAction<{
  incomingID: string | null;
  publicKey: string;
}>("chat/userToIncomingReceived");

/**
 * Subscribe to data and changes in the user to incoming map stored in gun.
 * @returns A thunk that returns a subscription.
 */
export const subUserToIncoming = () => (
  dispatch: (action: any) => void,
  getState: () => { node: { publicKey: string } }
): Promise<Schema.Subscription> => {
  try {
    const selfPublicKey = getState().node.publicKey;

    if (!Common.isPopulatedString(selfPublicKey)) {
      throw new Error(`Self public key not a populated string`);
    }

    return rifle({
      query: `$user::userToIncoming::map.on`,
      publicKey: selfPublicKey,
      onData: (incomingID, publicKey) => {
        dispatch(
          userToIncomingReceived({
            incomingID,
            publicKey
          })
        );
      }
    });
  } catch (e) {
    alert(`Could not establish a subscription to userToIncoming: ${e.message}`);
    Utils.logger.error(
      `Could not establish a subscription to userToIncoming`,
      e
    );
  }
};
