import * as Common from "shock-common";
import { DateTime } from "luxon";

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
    node: { publicKey: string };
    userProfiles: Record<string, Common.User>;
  }
) => {
  if (subscribedProfiles.has(publicKey)) {
    return () => {};
  }
  if (publicKey === getState().node.publicKey) {
    console.debug(`Subbing to self data`);
  }
  console.info("subbing user..." + publicKey);
  subscribedProfiles.add(publicKey);

  const subscription = rifle({
    query: `${publicKey}::Profile::on`,
    reconnect: true,
    onData: profile => {
      const { [publicKey]: existingUser } = getState().userProfiles;
      const isSelf = publicKey === getState().node.publicKey;
      //#region loggingPresence
      let lastSeenNodeFormatted = DateTime.fromMillis(
        profile.lastSeenNode
      ).toRelativeCalendar({
        unit: "seconds"
      });
      // ugh
      if (lastSeenNodeFormatted === "in 0 seconds") {
        lastSeenNodeFormatted = "Just now";
      }
      let lastSeenAppFormatted = DateTime.fromMillis(
        profile.lastSeenApp
      ).toRelativeCalendar({
        unit: "seconds"
      });
      // ugh
      if (lastSeenAppFormatted === "in 0 seconds") {
        lastSeenAppFormatted = "Just now";
      }

      console.debug(
        `${
          isSelf ? "self" : publicKey.slice(0, 6) + "..."
        } lastSeenNode: ${lastSeenNodeFormatted}`
      );
      console.debug(
        `${
          isSelf ? "self" : publicKey.slice(0, 6) + "..."
        } lastSeenApp: ${lastSeenAppFormatted}`
      );
      //#endregion loggingPresence

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
    const isSelf = publicKey === getState().node.publicKey;

    console.debug(
      isSelf
        ? `unsubbing from self data`
        : `unsubbing from ${publicKey.slice(0, 6)}...`
    );

    rifleCleanup(subscription, binarySub)();
    subscribedProfiles.delete(publicKey);
  };
};

export const unsubscribeUserProfile = (publicKey: string) => async () => {
  unsubscribeRifleByQuery(`${publicKey}::Profile::on`);
  unsubscribeRifleByQuery(`${publicKey}::profileBinary::map.on`);
};
