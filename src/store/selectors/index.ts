import {
  useSelector as originalUseSelector,
  TypedUseSelectorHook
} from "react-redux";

import { State } from "../../reducers";

export const useSelector: TypedUseSelectorHook<State> = (selector, eqFn) =>
  originalUseSelector(selector, eqFn);

export const selectRoot = (state: State) => state;

export const selectIsInContact = (publicKey: string) => (
  state: State
): boolean => {
  const {
    chat: { contacts, sentRequests, receivedRequests }
  } = state;

  const isContact = !!contacts.find(c => c.pk === publicKey);
  const hasSentReq = !!sentRequests.find(r => r.pk === publicKey);
  const hasReceivedReq = !!receivedRequests.find(r => r.pk === publicKey);

  return isContact || hasSentReq || hasReceivedReq;
};

export * from "./auth";
export * from "./users";
export * from "./follows";
export * from "./publishedContent";
