import { createSelector } from "reselect";

import { State } from "../../reducers";

import { PublishedContent } from "../../schema";

export const selectOwnPublishedContent = createSelector(
  (state: State) => state.content.publishedContent,
  (state: State) => state.content.publicContent,
  (privateContent, publicContent): Record<string, PublishedContent> => {
    return {
      ...privateContent,
      ...publicContent
    };
  }
);
