import { createAction } from "@reduxjs/toolkit";
import * as Common from "shock-common";
import { v4 as uuidv4 } from "uuid";

import * as Utils from "../../utils";
import * as Schema from "../../schema";
import { rifle } from "../../utils/WebSocket";

//#region receivedRequests

/**
 * Dispatched when the handshake address changes.
 */
export const handshakeAddressUpdated = createAction<{
  handshakeAddress: string;
}>("handshakeAddressUpdated");

/**
 * Subscribe to the current handshake address stored in gun.
 * @returns A thunk that returns a subscription.
 */
export const subCurrentHandshakeAddress = () => (
  dispatch: (action: any) => void
) => {
  try {
    return rifle({
      query: `$user::currentHandshakeAddress::on`,
      onData: handshakeAddress => {
        dispatch(
          handshakeAddressUpdated({
            handshakeAddress
          })
        );
      }
    });
  } catch (e) {
    alert(
      `Could not establish a subscription to current handshake address: ${e.message}`
    );
    Utils.logger.error(
      `Could not establish a subscription to current handshake address:`,
      e
    );
  }
};

/**
 * Dispatched when a handshake request is received inside the current handshake
 * node.
 */
export const receivedHandshakeRequest = createAction<{
  receivedRequest: Schema.ReceivedRequest;
}>("chat/receivedHandshakeRequest");

/**
 * Subscribe to received requests inside the specified handshake node.
 * @returns A thunk that returns a subscription.
 */
export const subHandshakeNode = (handshakeAddress: string) => (
  dispatch: (action: any) => void,
  getState: () => { chat: { currentHandshakeAddress: string } }
): Promise<Schema.Subscription> => {
  try {
    return rifle({
      query: `$gun::handshakeNodes>${handshakeAddress}::map.on`,
      onData: (handshakeRequest: Common.HandshakeRequest, id) => {
        const {
          chat: { currentHandshakeAddress }
        } = getState();
        if (handshakeAddress !== currentHandshakeAddress) {
          return;
        }
        if (!Common.isHandshakeRequest(handshakeRequest)) {
          return;
        }
        dispatch(
          receivedHandshakeRequest({
            receivedRequest: {
              avatar: null,
              displayName: null,
              id,
              pk: handshakeRequest.from,
              timestamp: handshakeRequest.timestamp
            }
          })
        );
      }
    });
  } catch (e) {
    alert(
      `Could not establish a subscription to handshake node with address: ${handshakeAddress} : ${e.message}`
    );
    Utils.logger.error(
      `Could not establish a subscription to handshake node with address: ${handshakeAddress} : `,
      e
    );
  }
};

//#endregion receivedRequests

//#endregion sentRequests

export const acceptHandshakeRequest = (requestId: string) => async (
  _: unknown,
  getState: () => Record<string, any>
) => {
  const req: Schema.ReceivedRequestNew = getState().requestsNew[requestId];

  const [incomingID, outgoingID] = JSON.parse(req.response) as [string, string];

  await Utils.Http.post(`/api/gun/put`, {
    path: `$user>outgoings>${outgoingID}`,
    value: {
      with: {
        $$__ENCRYPT__FOR: "me",
        value: {
          messages: {
            [uuidv4()]: {
              body: {
                $$__ENCRYPT__FOR: req.from,
                $$__EPUB__FOR: req.epub,
                value: Common.INITIAL_MSG
              }
            }
          },
          with: {
            $$__ENCRYPT__FOR: "me",
            value: req.from
          },
          incomingID: {
            $$__ENCRYPT__FOR: "me",
            value: incomingID
          }
        }
      }
    }
  });

  Utils.Http.post(`/api/gun/put`, {
    path: `$gun>handshakeNodes>${req.handshakeAddress}>${req.id}`,
    value: null
  });
};

export const sendHandshakeRequest = (publicKey: string) => async (
  _: unknown,
  getState: () => { node: { publicKey: string } }
) => {
  const epubP = Common.makePromise<string>((res, rej) => {
    const subscription = rifle({
      onData(epub) {
        if (Common.isPopulatedString(epub)) {
          res(epub);
          subscription.then(sub => sub.off());
        } else {
          rej(new TypeError(`Could not fetch epub`));
          subscription.then(sub => sub.off());
        }
      },
      query: `${publicKey}::epub::on`,
      onError(e) {
        if (typeof e === "string") {
          rej(new Error(e));
        } else {
          rej(e);
        }
      }
    });
  });

  const handshakeAddressP = Common.makePromise<string>((res, rej) => {
    const subscription = rifle({
      onData(handshakeAddress) {
        if (Common.isPopulatedString(handshakeAddress)) {
          res(handshakeAddress);
          subscription.then(sub => sub.off());
        } else {
          rej(new TypeError(`Could not fetch epub`));
          subscription.then(sub => sub.off());
        }
      },
      query: `${publicKey}::currentHandshakeAddress::on`,
      onError(e) {
        if (typeof e === "string") {
          rej(new Error(e));
        } else {
          rej(e);
        }
      }
    });
  });

  const selfEpubP = Common.makePromise<string>((res, rej) => {
    const subscription = rifle({
      onData(epub) {
        if (Common.isPopulatedString(epub)) {
          res(epub);
          subscription.then(sub => sub.off());
        } else {
          rej(new TypeError(`Could not fetch self epub`));
          subscription.then(sub => sub.off());
        }
      },
      query: `$user::epub::on`,
      onError(e) {
        if (typeof e === "string") {
          rej(new Error(e));
        } else {
          rej(e);
        }
      }
    });
  });

  const outgoingID = uuidv4();
  const incomingID = uuidv4();
  const requestID = uuidv4();
  const [epub, handshakeAddress, selfEpub] = await Promise.all([
    epubP,
    handshakeAddressP,
    selfEpubP
  ]);

  await Utils.Http.post(`/api/gun/put`, {
    path: `$gun>handshakeNodes>${handshakeAddress}>${requestID}`,
    value: {
      id: requestID,
      from: {
        $$__ENCRYPT__FOR: publicKey,
        $$__EPUB__FOR: epub,
        value: getState().node.publicKey
      },
      epub: selfEpub,
      timestamp: Date.now(),
      response: {
        $$__ENCRYPT__FOR: publicKey,
        $$__EPUB__FOR: epub,
        value: `[ "${outgoingID}" , "${incomingID}" ]`
      },
      handshakeAddress
    }
  });

  // after request was sent let's now create our outgoing feed

  await Utils.Http.post(`/api/gun/put`, {
    path: `$user>outgoings>${outgoingID}`,
    value: {
      with: {
        value: {
          messages: {
            [uuidv4()]: {
              body: {
                $$__ENCRYPT__FOR: publicKey,
                $$__EPUB__FOR: epub,
                value: Common.INITIAL_MSG
              }
            }
          },
          with: {
            $$__ENCRYPT__FOR: "me",
            value: publicKey
          },
          incomingID: {
            $$__ENCRYPT__FOR: "me",
            value: incomingID
          }
        }
      }
    }
  });
};
