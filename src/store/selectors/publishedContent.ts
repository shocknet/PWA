import { State } from "../../reducers";

export const selectOwnPublishedContent = (state: State) =>
  state.content.publishedContent;
