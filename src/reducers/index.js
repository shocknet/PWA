import { combineReducers } from "redux";
import NodeReducer from "./NodeReducer";
import AuthReducer from "./AuthReducer";
import WalletReducer from "./WalletReducer";
import ChatReducer from "./ChatReducer";
import DrawerReducer from "./DrawerReducer";

const reducers = combineReducers({
  node: NodeReducer,
  auth: AuthReducer,
  wallet: WalletReducer,
  chat: ChatReducer,
  drawer: DrawerReducer
});

export default reducers;
