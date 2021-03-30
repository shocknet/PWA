import * as Common from "shock-common";

import * as Utils from "../utils";
import { disconnectRifleSocket, rifle } from "../utils/WebSocket";

import { setAuthenticated } from "./AuthActions";

export const ACTIONS = {
  RESET_USER_PROFILES: "userProfiles/profiles/reset",
  LOAD_USER_PROFILE: "userProfiles/profiles/load",
  REMOVE_USER_PROFILE: "userProfiles/profiles/remove",
  UPDATE_USER_PROFILE: "userProfiles/profiles/update"
};

export const updateUserProfile = (
  publicKey: string,
  profile: Partial<Common.User>
) => ({
  type: ACTIONS.UPDATE_USER_PROFILE,
  data: {
    publicKey,
    profile
  }
});

/**
 * Returns an un subscription function.
 */
export const subscribeUserProfile = (publicKey: string) => async (
  dispatch: (action: object) => void,
  getState: () => {
    node: { hostIP: string };
    userProfiles: Record<string, Common.User>;
  }
) => {
  const { hostIP } = getState().node;
  const subscription = rifle({
    host: hostIP,
    query: `${publicKey}::Profile::on`,
    reconnect: true
  });

  const binarySub = rifle({
    host: hostIP,
    query: `${publicKey}::profileBinary::map.on`,
    reconnect: true
  });

  binarySub.on("$shock", (data, key) => {
    if (key === "avatar") {
      if (typeof data !== "string" && data !== null) {
        Utils.logger.error(
          `Expected avatar data to be string or null, instead got: ${typeof data}. Public key: ${publicKey}`
        );
        return;
      }
      dispatch(
        updateUserProfile(publicKey, {
          avatar: data
        })
      );
    } else if (key === "header") {
      if (typeof data !== "string" && data !== null) {
        Utils.logger.error(
          `Expected header data to be string or null, instead got: ${typeof data}. Public key: ${publicKey}`
        );
        return;
      }
      dispatch(
        updateUserProfile(publicKey, {
          header: data
        })
      );
    } else {
      Utils.logger.error(
        `Unknown key: ${key} for user binary profile data gun RPC socket`
      );
    }
  });

  subscription.on("$shock", profile => {
    const { [publicKey]: existingUser } = getState().userProfiles;

    if (existingUser) {
      dispatch({
        type: ACTIONS.UPDATE_USER_PROFILE,
        data: { publicKey, profile }
      });
      return profile;
    }

    dispatch({
      type: ACTIONS.LOAD_USER_PROFILE,
      data: { publicKey, profile }
    });
  });

  const onError = (err: unknown) => {
    if (err === Common.NOT_AUTH) {
      dispatch(setAuthenticated(false));
      return;
    }

    Utils.logger.error(
      `Error inside user profile subscription ( ${publicKey} )`
    );
    Utils.logger.error(err);
  };

  const onNotAuth = () => {
    dispatch(setAuthenticated(false));
  };

  binarySub.on("$error", onError);
  subscription.on("$error", onError);
  binarySub.on(Common.NOT_AUTH, onNotAuth);
  subscription.on(Common.NOT_AUTH, onNotAuth);

  return () => {
    binarySub.off("*");
    binarySub.close();
    subscription.off("*");
    subscription.close();
  };
};

export const unsubscribeUserProfile = publicKey => async () => {
  disconnectRifleSocket(`${publicKey}::Profile::on`);
  disconnectRifleSocket(`${publicKey}::profileBinary::map.on`);
};
