import { combineReducers } from "redux";
import * as Common from "shock-common";

import NodeReducer from "./NodeReducer";
import AuthReducer from "./AuthReducer";
import WalletReducer from "./WalletReducer";
import ChatReducer from "./ChatReducer";
import DrawerReducer from "./DrawerReducer";
import ContentReducer from "./ContentReducer";
import FeesReducer from "./FeesReducer";
import FeedReducer from "./FeedReducer";
import UserProfilesReducer from "./UserProfilesReducer";

const reducers = combineReducers({
  node: NodeReducer,
  auth: AuthReducer,
  wallet: WalletReducer,
  chat: ChatReducer,
  drawer: DrawerReducer,
  content: ContentReducer,
  fees: FeesReducer,
  feed: FeedReducer,
  userProfiles: UserProfilesReducer,
  users: () => {
    return {} as Record<string, Common.User>;
  }
});

export type State = ReturnType<typeof reducers>;

export default reducers;
