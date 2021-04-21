import * as Common from "shock-common";

import * as Utils from "../utils";
import { unsubscribeRifleById, rifle } from "../utils/WebSocket";

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
    userProfiles: Record<string, Common.User>;
  }
) => {
  const [subscription, binarySub] = await Promise.all([
    rifle({
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
    }),
    rifle({
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
    })
  ]);

  return () => {
    binarySub.off();
    subscription.off();
  };
};

export const unsubscribeUserProfile = (publicKey: string) => async () => {
  unsubscribeRifleById(`${publicKey}::Profile::on`);
  unsubscribeRifleById(`${publicKey}::profileBinary::map.on`);
};
