import { all, takeEvery } from "redux-saga/effects";

import * as Utils from "../../utils";

// eslint-disable-next-line require-yield
function* handleTokenInvalidation() {
  try {
    // Utils.navigate("/");
  } catch (e) {
    Utils.logger.error(`Error inside handleTokenInvalidation* ()`);
    Utils.logger.error(e);
  }
}

function* auth() {
  try {
    yield;
  } catch (e) {
    Utils.logger.error("Error inside auth* ()");
    Utils.logger.error(e);
  }
}

function* nodeSaga() {
  yield all([
    auth,
    takeEvery("node/tokenDidInvalidate", handleTokenInvalidation)
  ]);
}

export default nodeSaga;
