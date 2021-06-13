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
  Utils.logger.debug(`Subscribing to current handshake address.`);
  try {
    return rifle({
      query: `$user::currentHandshakeAddress::on`,
      onData: handshakeAddress => {
        Utils.logger.debug(
          `Received current handshake address: ${handshakeAddress}`
        );

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
  receivedRequest: Schema.HandshakeReqNew;
}>("chat/receivedHandshakeRequest");

/**
 * Subscribe to received requests inside the specified handshake node.
 * @returns A thunk that returns a subscription.
 */
export const subHandshakeNode = (handshakeAddress: string) => (
  dispatch: (action: any) => void,
  getState: () => { chat: { currentHandshakeAddress: string } }
): Promise<Schema.Subscription> => {
  Utils.logger.debug(`Subscribing to handshake node: ${handshakeAddress} .`);
  try {
    return rifle({
      query: `$gun::handshakeNodes>${handshakeAddress}::map.on`,
      epubField: "epub",
      onData: (handshakeRequest: Schema.HandshakeReqNew) => {
        Utils.logger.debug(
          `Subscription to handshake node: ${handshakeAddress} -> `,
          handshakeRequest
        );
        const {
          chat: { currentHandshakeAddress }
        } = getState();
        Utils.logger.debug(`Current address: ${currentHandshakeAddress}`);
        if (handshakeAddress !== currentHandshakeAddress) {
          return;
        }
        if (!Schema.isHandshakeReqNew(handshakeRequest)) {
          Utils.logger.debug(`Not a handshake request -> `, handshakeRequest);
          return;
        }
        dispatch(
          receivedHandshakeRequest({
            receivedRequest: handshakeRequest
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

const createOutgoingConversationFeed = (
  outgoingConvoID: string,
  publicKey: string,
  epub: string,
  incomingConvoID: string
) => {
  const msgID = uuidv4();

  const newOutgoingConvo: {
    [K in keyof Schema.Convo]: any;
  } & {
    messages: Record<
      string,
      {
        [K in keyof Schema.ConvoMsg]: any;
      }
    >;
  } = {
    id: outgoingConvoID,

    with: {
      $$__ENCRYPT__FOR: "me",
      value: publicKey
    },

    withEpub: {
      $$__ENCRYPT__FOR: "me",
      value: epub
    },

    counterpartConvoID: {
      $$__ENCRYPT__FOR: "me",
      value: incomingConvoID
    },

    messages: {
      [msgID]: {
        id: msgID,
        body: {
          $$__ENCRYPT__FOR: publicKey,
          $$__EPUB__FOR: epub,
          value: Common.INITIAL_MSG
        },
        timestamp: Date.now(),
        convoID: outgoingConvoID
      }
    }
  };

  return newOutgoingConvo;
};

export const acceptHandshakeRequest = (requestId: string) => async (
  _: unknown,
  getState: () => {
    chat: { receivedRequests: Record<string, Schema.HandshakeReqNew> };
  }
) => {
  const req: Schema.HandshakeReqNew = getState().chat.receivedRequests[
    requestId
  ];

  const [incomingID, outgoingID] = JSON.parse(req.response) as [string, string];

  await Utils.Http.post(`/api/gun/put`, {
    path: `$user>convos>${outgoingID}`,
    value: createOutgoingConversationFeed(
      outgoingID,
      req.from,
      req.epub,
      incomingID
    )
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
  Utils.logger.debug(
    `Sending handshake request to ${publicKey.slice(0, 8)}...`
  );
  const epubP = Common.makePromise<string>((res, rej) => {
    const subscription = rifle({
      onData(epub) {
        Utils.logger.debug(
          `Got epub for public Key ${publicKey.slice(0, 8)}... : ${epub}`
        );
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
        Utils.logger.debug(
          `Error when fetch epub for public Key ${publicKey.slice(
            0,
            8
          )}... : ${epub}`
        );
        Utils.logger.error(e);
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

  const outgoingConvoID = uuidv4();
  const incomingConvoID = uuidv4();
  const requestID = uuidv4();
  const [epub, handshakeAddress, selfEpub] = await Promise.all([
    epubP,
    handshakeAddressP,
    selfEpubP
  ]);

  Utils.logger.debug(
    `Got epub/handshakeaddress/selfEpub, sending request to public Key ${publicKey.slice(
      0,
      8
    )}...`
  );

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
        value: `[ "${outgoingConvoID}" , "${incomingConvoID}" ]`
      },
      handshakeAddress
    }
  });

  // after request was sent let's now create our outgoing feed

  Utils.logger.debug(
    `Sent request to public Key ${publicKey.slice(
      0,
      8
    )}... will now create outgoing conversation feed`
  );

  await Utils.Http.post(`/api/gun/put`, {
    path: `$user>convos>${outgoingConvoID}`,
    value: createOutgoingConversationFeed(
      outgoingConvoID,
      publicKey,
      epub,
      incomingConvoID
    )
  });
};

export const convoReceived = createAction<{ convo: Schema.Convo }>(
  "chat/convoReceived"
);

export const convoDeleted = createAction<{ id: string }>("chat/convoDeleted");

export const subConvos = () => async (
  dispatch: (action: any) => void,
  getState: () => { node: { publicKey: string } }
) => {
  try {
    return rifle({
      query: `$user::convos::map.on`,
      onData: (convo: Schema.Convo, id: string) => {
        console.log("--------------");
        console.log(convo);
        console.log("--------------");
        if (convo === null) {
          dispatch(
            convoDeleted({
              id
            })
          );
          return;
        }
        if (!Schema.isConvo(convo)) {
          return;
        }
        // @ts-expect-error
        delete convo._;
        // @ts-expect-error
        delete convo.messages;
        dispatch(
          convoReceived({
            convo
          })
        );
      },
      publicKey: getState().node.publicKey
    });
  } catch (e) {
    alert(
      `Could not establish a subscription to outgoing conversation feeds: ${e.message}`
    );
    Utils.logger.error(
      `Could not establish a subscription to outgoing conversation feeds -> `,
      e
    );
  }
};
