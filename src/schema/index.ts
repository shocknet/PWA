import * as Common from "shock-common";
import isFinite from "lodash/isFinite";

const createValidator = <T extends Record<string, unknown>>(
  valMap: Record<keyof T, (val: any) => void>,
  baseValidator: (o: unknown) => boolean = () => true
) => (o: unknown): o is T => {
  if (!Common.isObj(o)) {
    return false;
  }

  if (!baseValidator(o)) {
    return false;
  }

  return Object.entries(valMap).every(([key, validator]) => {
    return validator(o[key]);
  });
};

export type Contact = {
  pk: string;
  avatar: string | null;
  displayName: string | null;
};

export interface ReceivedRequest {
  id: string;
  pk: string;
  avatar: string | null;
  displayName: string | null;
  timestamp: number;
}

export interface HandshakeReqNew {
  /**
   * Sender's epub.
   */
  epub: string;
  /**
   * Sender's public key.
   */
  from: string;
  /**
   * Handshake address where the request was written to.
   */
  handshakeAddress: string;
  /**
   * The request's unique id.
   */
  id: string;

  /**
   * The ID for the receiver's conversation feed in their user graph. The sender
   * will preemptively watch for messages in the receiver's conversation part of
   * their user graph under this ID. When the receiver accepts, they will create
   * the conversation feed under this ID and start sending messages. The initial
   * $$__INITIAL__MSG sentinel message signals to the sender the request was
   * accepted.
   */
  receiverConvoID: string;

  /**
   * The ID for the sender's conversation feed in their user graph. This
   * conversation feed is already present upon sending the request.
   */
  senderConvoID: string;

  /**
   * Timestamp.
   */
  timestamp: number;
}

export const isHandshakeReqNew = (o: unknown): o is HandshakeReqNew => {
  if (!Common.isObj(o)) {
    return false;
  }

  const obj = (o as unknown) as HandshakeReqNew;

  if (!Common.isPopulatedString(obj.epub)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.from)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.handshakeAddress)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.id)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.receiverConvoID)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.senderConvoID)) {
    return false;
  }

  if (typeof obj.timestamp !== "number") {
    return false;
  }

  return true;
};

export interface SentRequest {
  id: string;
  pk: string;
  avatar: string | null;
  displayName: string | null;
  changedAddress: boolean;
  timestamp: number;
  loading: boolean;
}

export type ChatMessageStatus = "SENT" | "SENDING" | "FAILED" | "RECEIVED";

export const CHAT_MESSAGE_STATUS = {
  SENT: "SENT",
  SENDING: "SENDING",
  FAILED: "FAILED",
  RECEIVED: "RECEIVED"
} as const;

export interface ChatMessage {
  body: string;
  id: string;
  localId: string;
  outgoing: boolean;
  recipientPublicKey: string;
  status: ChatMessageStatus;
  timestamp: number;
}

export interface Convo {
  /**
   * The id for the conversation in the recipient's user graph.
   */
  counterpartConvoID: string;
  /**
   * The id.
   */
  id: string;
  /**
   * The recipient's public key.
   */
  with: string;
  /**
   * The recipient's epub.
   */
  withEpub: string;
}

export const isConvo = (o: unknown): o is Convo => {
  if (!Common.isObj(o)) {
    return false;
  }

  const obj = (o as unknown) as Convo;

  if (!Common.isPopulatedString(obj.counterpartConvoID)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.id)) {
    return false;
  }

  return Common.isPopulatedString(obj.with);
};

export interface ConvoMsg {
  body: string;
  convoID: string;
  err: string;
  id: string;
  state: "ok" | "error" | "received" | "sending";
  timestamp: number;
}

export const isConvoMsg = (o: unknown): o is ConvoMsg => {
  if (!Common.isObj(o)) {
    return false;
  }

  const obj = (o as unknown) as ConvoMsg;

  if (!Common.isPopulatedString(obj.body)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.convoID)) {
    return false;
  }

  if (!Common.isPopulatedString(obj.id)) {
    return false;
  }

  if (typeof obj.timestamp !== "number") {
    return false;
  }

  return true;
};

export interface Post extends Common.RawPost {
  authorId: string;
  id: string;
  tips: Record<string, number>;
  type: "post";
}

export interface PublishedContent {
  type: "image/embedded" | "video/embedded";
  magnetURI: string;
  width: number;
  height: number;
  title: string;
  description: string;
}

export const isPublishedContent = (o: unknown): o is PublishedContent => {
  if (!Common.isObj(o)) {
    return false;
  }
  const obj = (o as unknown) as PublishedContent;

  if (typeof obj.description !== "string") {
    return false;
  }
  if (typeof obj.height !== "number") {
    return false;
  }
  if (typeof obj.width !== "number") {
    return false;
  }
  if (!Common.isPopulatedString(obj.title)) {
    return false;
  }
  if (obj.type !== "image/embedded" && obj.type !== "video/embedded") {
    return false;
  }
  return true;
};

export interface Subscription {
  off(): void;
}

/**
 * Sentinel value that signals the recipient disconnected inside the user to
 * incoming map.
 */
export const DID_DISCONNECT = "DID_DISCONNECT";
export interface PublicContentItem extends PublishedContent {
  id: string;
  author: string;
  timestamp: number;
}

export const isPublicContentItem = (o: unknown): o is PublicContentItem => {
  if (!isPublishedContent(o)) {
    return false;
  }
  const obj = (o as unknown) as PublicContentItem;

  if (!Common.isPopulatedString(obj.author)) {
    return false;
  }

  return typeof obj.timestamp === "number";
};

export type FeeRate = "hourFee" | "halfHourFee" | "fastestFee";

export interface CoordinateWithHash extends Common.Coordinate {
  coordinateSHA256: string;
}

export interface ContentRevealCoordinateMetadataInbound {
  /**
   * The post ID.
   */
  ackInfo: string;
  /**
   * Content ID to magnet URI.
   */
  unlockedContents: Record<string, string>;
}

export interface ContentRevealCoordinateMetadataOutbound {
  /**
   * Same as ContentRevealCoordinateMetadataInbound.
   */
  response: ContentRevealCoordinateMetadataInbound;
  /**
   * Order type.
   */
  type: "orderAck";
}

/**
 * Post as stored in Gun. Without `contentItems`.
 */
export type PostRaw = Omit<Common.RawPost, "contentItems">;

export const isPostRaw = createValidator<PostRaw>({
  date: isFinite,
  status: Common.isPopulatedString,
  tags: (val: string) => typeof val === "string",
  title: Common.isPopulatedString
});

export interface NodeInfo {
  uris: string[];
  synced_to_chain: boolean;
  synced_to_graph: boolean;
  identity_pubkey: string;
  best_header_timestamp: string;
  block_height: number;
  num_pending_channels: number;
  version: string;
}
