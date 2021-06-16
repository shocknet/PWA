import { createAction } from "@reduxjs/toolkit";
import * as Common from "shock-common";
import { v4 as uuidv4 } from "uuid";

import * as Utils from "../utils";
import * as Schema from "../schema";
import { rifle } from "../utils/WebSocket";

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

        if (!Common.isPopulatedString(handshakeAddress)) {
          Utils.logger.error(
            `Current handshake address not an string -> `,
            JSON.stringify(handshakeAddress)
          );
          return;
        }

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
 * Dispatched when a handshake request is deleted after accepting  it.
 */
export const handshakeRequestDeleted = createAction<{
  id: string;
}>("chat/handshakeRequestDeleted");

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
      onData: (handshakeRequest: Schema.HandshakeReqNew, id: string) => {
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
        if (Schema.isHandshakeReqNew(handshakeRequest)) {
          dispatch(
            receivedHandshakeRequest({
              receivedRequest: handshakeRequest
            })
          );
        } else if (handshakeRequest === null) {
          dispatch(
            handshakeRequestDeleted({
              id
            })
          );
        } else {
          Utils.logger.debug(`Not a handshake request -> `, handshakeRequest);
        }
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
        convoID: outgoingConvoID,
        state: "ok",
        err: ""
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

  await Utils.Http.post(`/api/gun/put`, {
    path: `$user>convos>${req.receiverConvoID}`,
    value: createOutgoingConversationFeed(
      req.receiverConvoID,
      req.from,
      req.epub,
      req.senderConvoID
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
          subscription.then(sub => sub.off());
          res(epub);
        } else {
          Utils.logger.debug(
            `Could not fetch epub for public Key ${publicKey.slice(
              0,
              8
            )}... : ${epub}`
          );
          subscription.then(sub => sub.off());
          rej(new TypeError(`Could not fetch epub`));
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

  const handshakeReqForGun: {
    [K in keyof Schema.HandshakeReqNew]: any;
  } = {
    id: requestID,
    from: {
      $$__ENCRYPT__FOR: publicKey,
      $$__EPUB__FOR: epub,
      value: getState().node.publicKey
    },
    epub: selfEpub,
    timestamp: Date.now(),
    receiverConvoID: {
      $$__ENCRYPT__FOR: publicKey,
      $$__EPUB__FOR: epub,
      value: incomingConvoID
    },
    senderConvoID: {
      $$__ENCRYPT__FOR: publicKey,
      $$__EPUB__FOR: epub,
      value: outgoingConvoID
    },
    handshakeAddress
  };

  await Utils.Http.post(`/api/gun/put`, {
    path: `$gun>handshakeNodes>${handshakeAddress}>${requestID}`,
    value: handshakeReqForGun
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

export const messageTransmissionRequested = createAction<{
  convoID: string;
  messageID: string;
  message: string;
}>("chat/messageTransmissionRequested");

export const messageTransmissionSucceeded = createAction<{
  convoID: string;
  messageID: string;
}>("chat/messageTransmissionSucceeded");

export const messageTransmissionFailed = createAction<{
  convoID: string;
  errorMessage: string;
  messageID: string;
}>("chat/messageTransmissionFailed");

export const sendMessage = (convoID: string, messageBody: string) => async (
  dispatch: (action: any) => void,
  getState: () => {
    chat: {
      convos: Record<string, Schema.Convo>;
    };
  }
) => {
  const messageID = uuidv4(); // does not throw, ever...?

  try {
    const convo = getState().chat.convos[convoID];

    if (messageBody.trim().length === 0) {
      return;
    }

    dispatch(
      messageTransmissionRequested({
        convoID,
        messageID,
        message: messageBody.trim()
      })
    );

    const message: Schema.ConvoMsg = {
      body: ({
        $$__ENCRYPT__FOR: convo.with,
        $$__EPUB__FOR: convo.withEpub,
        value: messageBody
      } as unknown) as string,
      convoID,
      id: messageID,
      timestamp: Date.now(),
      state: "ok",
      err: ""
    };

    await Utils.Http.post(`/api/gun/put`, {
      path: `$user>convos>${convoID}>messages>${messageID}`,
      value: message
    });

    dispatch(
      messageTransmissionSucceeded({
        convoID,
        messageID
      })
    );
  } catch (e) {
    Utils.logger.error(`Error inside sendMessage() -> `, e);
    dispatch(
      messageTransmissionFailed({
        convoID,
        errorMessage: e.message,
        messageID
      })
    );
  }
};

export const messageTransmissionRetried = createAction<{
  convoID: string;
  messageID: string;
}>("chat/messageTransmissionRetried");

export const retryMessage = (convoID: string, messageID: string) => async (
  dispatch: (action: any) => void,
  getState: () => {
    chat: {
      convos: Record<string, Schema.Convo>;
      convoToMessages: Record<
        string,
        Record<
          string,
          Schema.ConvoMsg & { err: string; state: "ok" | "sending" | "error" }
        >
      >;
    };
  }
) => {
  try {
    const convo = getState().chat.convos[convoID];
    const existingMessage = getState().chat.convoToMessages[convoID][messageID];

    if (!existingMessage) {
      throw new ReferenceError(
        `Tried to retry sending a message that was not found in redux convoID: ${convoID} & messageID: ${messageID}`
      );
    }

    dispatch(
      messageTransmissionRetried({
        convoID,
        messageID
      })
    );

    const message: Schema.ConvoMsg = {
      body: ({
        $$__ENCRYPT__FOR: convo.with,
        $$__EPUB__FOR: convo.withEpub
      } as unknown) as string,
      convoID,
      id: messageID,
      timestamp: Date.now(),
      state: "ok",
      err: ""
    };

    await Utils.Http.post(`/api/gun/put`, {
      path: `$user>convos>${convoID}>messages>${messageID}`,
      value: message
    });

    dispatch(
      messageTransmissionSucceeded({
        convoID,
        messageID
      })
    );
  } catch (e) {
    Utils.logger.error(`Error inside retryMessage() -> `, e);
    dispatch(
      messageTransmissionFailed({
        convoID,
        errorMessage: e.message,
        messageID
      })
    );
  }
};

export const receivedConvoMessage = createAction<{
  message: Schema.ConvoMsg;
}>("chat/receivedConvoMessage");

export const subConvoMessages = (convoID: string) => (
  dispatch: (action: any) => void,
  getState: () => {
    chat: {
      convos: Record<string, Schema.Convo>;
    };
  }
) => {
  try {
    Utils.logger.debug(`Subscribing to messages for convo: ${convoID}`);

    const convo = getState().chat.convos[convoID];

    const outgoingSub = rifle({
      query: `$user::convos>${convoID}>messages::map.on`,
      onData: (message: unknown) => {
        Utils.logger.debug(
          `Outgoing subscription for convo: ${convoID} -> `,
          message
        );
        if (Schema.isConvoMsg(message)) {
          dispatch(
            receivedConvoMessage({
              message
            })
          );
        } else if (message === null) {
          // TODO: message deleted
        } else {
          Utils.logger.warn(
            `Outgoing message in convo ${convo.id} does not correspond to schema -> `,
            message
          );
        }
      },
      epubForDecryption: convo.withEpub,
      onError(e) {
        Utils.logger.error(
          `Error inside subConvoMessages() outgoing sub -> `,
          e
        );
        alert(`Error inside outgoing messages subscription: ${e.message}`);
      }
    });

    const incomingSub = rifle({
      query: `${convo.with}::convos>${convo.counterpartConvoID}>messages::map.on`,
      onData: (message: unknown) => {
        Utils.logger.debug(
          `Incoming subscription for convo: ${convoID} -> `,
          message
        );
        if (Schema.isConvoMsg(message)) {
          dispatch(
            receivedConvoMessage({
              message: {
                ...message,
                state: "received"
              }
            })
          );
        } else if (message === null) {
          // TODO: message deleted
        } else {
          Utils.logger.warn(
            `Incoming message in convo ${convo.id} does not correspond to schema -> `,
            message
          );
        }
      },
      epubForDecryption: convo.withEpub,
      onError(e) {
        Utils.logger.error(
          `Error inside subConvoMessages() incoming sub -> `,
          e
        );
        alert(`Error inside incoming messages subscription: ${e.message}`);
      }
    });

    return () => {
      Promise.all([outgoingSub, incomingSub]).then(subs =>
        subs.forEach(sub => sub.off())
      );
    };
  } catch (e) {
    Utils.logger.error(`Error inside subConvoMessages() -> `, e);
    alert(`Could not subscribe to conversation messages: ${e.message}`);
  }
};
