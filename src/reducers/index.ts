import { combineReducers } from "redux";

import NodeReducer from "./NodeReducer";
import AuthReducer from "./AuthReducer";
import WalletReducer from "./WalletReducer";
import ChatReducer from "./ChatReducer";
import DrawerReducer from "./DrawerReducer";
import ContentReducer from "./ContentReducer";
import FeesReducer from "./FeesReducer";
import FeedReducer from "./FeedReducer";
import EncryptionReducer from "./EncryptionReducer";
import UserProfilesReducer from "./UserProfilesReducer";
import OrdersReducer from "./OrdersReducer";
import AppReducer from "./AppReducer";

const reducers = combineReducers({
  node: NodeReducer,
  auth: AuthReducer,
  encryption: EncryptionReducer,
  wallet: WalletReducer,
  chat: ChatReducer,
  drawer: DrawerReducer,
  content: ContentReducer,
  fees: FeesReducer,
  feed: FeedReducer,
  userProfiles: UserProfilesReducer,
  orders: OrdersReducer,
  app: AppReducer
});

export type State = ReturnType<typeof reducers>;

export default reducers;
