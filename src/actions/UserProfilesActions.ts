import * as Common from "shock-common";
import { createAction } from "@reduxjs/toolkit";

import * as Utils from "../utils";
import {
  rifle,
  rifleCleanup,
  unsubscribeRifleByQuery
} from "../utils/WebSocket";

export const ACTIONS = {
  RESET_USER_PROFILES: "userProfiles/profiles/reset",
  REMOVE_USER_PROFILE: "userProfiles/profiles/remove"
};

const subscribedProfiles = new Set();

export const updatedUserProfile = createAction<{
  profile: Partial<Common.User>;
  publicKey: string;
}>("userProfiles/profiles/update");

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
    query: `${publicKey}::Profile::map.on`,
    reconnect: true,
    onData: (data: any, key: string) => {
      if (key === "bio") {
        dispatch(
          updatedUserProfile({
            profile: {
              bio: data
            },
            publicKey
          })
        );
      }
      if (key === "displayName") {
        dispatch(
          updatedUserProfile({
            profile: {
              displayName: data
            },
            publicKey
          })
        );
      }
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
          updatedUserProfile({
            profile: {
              avatar: data
            },
            publicKey
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
          updatedUserProfile({
            profile: {
              header: data
            },
            publicKey
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
