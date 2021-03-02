import { combineReducers } from "redux";
import NodeReducer from "./NodeReducer";
import AuthReducer from "./AuthReducer";
import WalletReducer from "./WalletReducer";
import ChatReducer from "./ChatReducer";
import DrawerReducer from "./DrawerReducer";
import FeesReducer from "./FeesReducer";
import FeedReducer from "./FeedReducer";
import UserProfilesReducer from "./UserProfilesReducer";

const reducers = combineReducers({
  node: NodeReducer,
  auth: AuthReducer,
  wallet: WalletReducer,
  chat: ChatReducer,
  drawer: DrawerReducer,
  fees: FeesReducer,
  feed: FeedReducer,
  userProfiles: UserProfilesReducer
});

export default reducers;
