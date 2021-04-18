import { State } from "../../reducers";

export const selectFollows = (state: State) => state.feed.follows;
