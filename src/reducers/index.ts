import { combineReducers } from "redux";
import * as Common from "shock-common";

import NodeReducer from "./NodeReducer";
import AuthReducer from "./AuthReducer";
import WalletReducer from "./WalletReducer";
import ChatReducer from "./ChatReducer";
import DrawerReducer from "./DrawerReducer";
import FeesReducer from "./FeesReducer";

const reducers = combineReducers({
  node: NodeReducer,
  auth: AuthReducer,
  wallet: WalletReducer,
  chat: ChatReducer,
  drawer: DrawerReducer,
  fees: FeesReducer,
  users: () => {
    return {} as Record<string, Common.User>;
  }
});

export type State = ReturnType<typeof reducers>;

export default reducers;
