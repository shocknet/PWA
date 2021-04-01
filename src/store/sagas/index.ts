import { all } from "redux-saga/effects";

import node from "./node";
import ping from "./ping";

import { _setStore } from "./_store";

function* rootSaga() {
  yield all([node, ping]);
}

export { _setStore };
export default rootSaga;
