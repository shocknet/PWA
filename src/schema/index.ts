import * as Common from "shock-common";

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
