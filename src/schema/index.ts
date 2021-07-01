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
  didDisconnect: boolean;
};

export interface ReceivedRequest {
  id: string;
  pk: string;
  avatar: string | null;
  displayName: string | null;
  timestamp: number;
}

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

export interface Post extends Common.RawPost {
  authorId: string;
  id: string;
  type: "post";
}

/**
 * Different from the one in shock-common.
 */
export interface SharedPost extends Common.SharedPostRaw {
  authorId: string;
  sharerId: string;
  id: string;
  type: "shared";
  /**
   * Undefined when loading it.
   */
  originalPost?: Post;
}

export const isSharedPost = (post: any): post is SharedPost => {
  if (!Common.isObj(post)) {
    return false;
  }

  const obj = (post as unknown) as SharedPost;

  if (typeof obj.authorId !== "string") {
    return false;
  }

  if (typeof obj.id !== "string") {
    return false;
  }

  if (typeof obj.originalAuthor !== "string") {
    return false;
  }

  return obj.type === "shared";
};

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
