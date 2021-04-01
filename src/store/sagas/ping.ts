import { takeEvery, select, put } from "redux-saga/effects";
import SocketIO from "socket.io-client";
import { Constants } from "shock-common";

import * as Utils from "../../utils";

import { getStore } from "./_store";

let socket: ReturnType<typeof SocketIO> | null = null;

function* ping() {
  try {
    const {
      node: { authToken: token, hostIP: host }
    } = yield select();

    if ((!token || !host) && socket) {
      Utils.logger.log(
        `Will kill ping socket because of token invalidation or host was unset`
      );
      socket.off("*");
      socket.close();
      socket = null;

      // force next tick
      yield put({ type: "shock::keepAlive" });
    }

    if (token && host && !socket) {
      Utils.logger.log(`Will try to connect ping socket`);
      socket = SocketIO(`http://${host}/shockping`, {
        query: {
          token
        }
      });

      socket.on("shockping", () => {
        getStore().dispatch({
          type: "node/ping",
          payload: {
            timestamp: Utils.normalizeTimestampToMs(Date.now())
          }
        });
      });

      socket.on(Constants.ErrorCode.NOT_AUTH, () => {
        getStore().dispatch({
          type: "node/tokenDidInvalidate"
        });
      });

      socket.on("$error", (e: string) => {
        Utils.logger.error(`Error received by ping socket: ${e}`);
      });

      socket.on("connect_error", (e: unknown) => {
        Utils.logger.error(`ping socket connect_error`);
        Utils.logger.error(e);
      });

      socket.on("connect_timeout", (timeout: unknown) => {
        Utils.logger.log(`ping socket connect_timeout`);
        Utils.logger.log(timeout);
      });

      socket.on("connect", () => {
        Utils.logger.log("ping socket connect");
      });

      socket.on("disconnect", (reason: string) => {
        Utils.logger.log(`ping socket disconnected due to -> ${reason}`);

        // from docs
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket && socket.connect();
        }
        // else the socket will automatically try to reconnect
      });

      socket.on("error", (e: unknown) => {
        Utils.logger.error(`Error inside ping socket`);
        Utils.logger.error(e);
      });

      socket.on("reconnect", (attemptNumber: number) => {
        Utils.logger.log(`ping socket reconnect attempt -> ${attemptNumber}`);
      });

      socket.on("reconnecting", (attemptNumber: number) => {
        Utils.logger.log(
          `ping socket reconnecting attempt -> ${attemptNumber}`
        );
      });

      socket.on("reconnect_error", (e: unknown) => {
        Utils.logger.log(`ping socket reconnect_error`);
        Utils.logger.error(e);
      });

      socket.on("reconnect_failed", () => {
        Utils.logger.error(`ping socket reconnect_failed`);
      });

      socket.on("ping", () => {
        Utils.logger.log(`ping socket pinging api (socket.io internal)`);
      });

      socket.on("pong", () => {
        Utils.logger.log(`ping socket ponged by api (socket.io internal)`);

        getStore().dispatch({
          type: "ping",
          payload: {
            timestamp: Utils.normalizeTimestampToMs(Date.now())
          }
        });
      });
    }
  } catch (err) {
    Utils.logger.error("Error inside ping* ()");
    Utils.logger.error(err.message);
  }
}

function* rootSaga() {
  yield takeEvery("*", ping);
}

export default rootSaga;
