import {
  useSelector as originalUseSelector,
  TypedUseSelectorHook
} from "react-redux";

import { State } from "../../reducers";

export const useSelector: TypedUseSelectorHook<State> = (selector, eqFn) =>
  originalUseSelector(selector, eqFn);

export const selectRoot = (state: State) => state;

export * from "./auth";
export * from "./users";
export * from "./follows";
export * from "./publishedContent";
export * from "./chat";
export * from "./feed";
export * from "./coordinates";
