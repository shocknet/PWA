import * as Common from "shock-common";

import * as Utils from "../utils";
import {
  rifle,
  rifleCleanup,
  unsubscribeRifleByQuery
} from "../utils/WebSocket";

export const ACTIONS = {
  RESET_USER_PROFILES: "userProfiles/profiles/reset",
  LOAD_USER_PROFILE: "userProfiles/profiles/load",
  REMOVE_USER_PROFILE: "userProfiles/profiles/remove",
  UPDATE_USER_PROFILE: "userProfiles/profiles/update"
};

const subscribedProfiles = new Set();

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
export const subscribeUserProfile = (publicKey: string) => (
  dispatch: (action: object) => void,
  getState: () => {
    userProfiles: Record<string, Common.User>;
  }
) => {
  return () => {};
  if (subscribedProfiles.has(publicKey)) {
    return () => {};
  }

  console.info("subbing user..." + publicKey);
  subscribedProfiles.add(publicKey);

  const subscription = rifle({
    query: `${publicKey}::Profile::on`,
    reconnect: true,
    onData: profile => {
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
    }
  });

  const binarySub = rifle({
    query: `${publicKey}::profileBinary::map.on`,
    reconnect: true,
    onData: (data, key: string) => {
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
    }
  });

  return () => {
    rifleCleanup(subscription, binarySub)();
    subscribedProfiles.delete(publicKey);
  };
};

export const unsubscribeUserProfile = (publicKey: string) => async () => {
  unsubscribeRifleByQuery(`${publicKey}::Profile::on`);
  unsubscribeRifleByQuery(`${publicKey}::profileBinary::map.on`);
};
