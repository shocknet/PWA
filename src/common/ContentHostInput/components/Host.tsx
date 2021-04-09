import { useCallback, useState } from "react";
import * as Common from "shock-common";
import classNames from "classnames";

import ShockAvatar from "../../ShockAvatar";
import * as gStyles from "../../../styles";
import * as Store from "../../../store";

import styles from "./Host.module.css";

export interface IHost {
  /**
   * Can be empty if publicKey is provided.
   */
  URI: string | null;
  /**
   * Unix timestamp.
   */
  dateAdded: number;
  /**
   * An empty string means no error. If there's an error adding the host,
   * instead of making it disappear, have it show up with a warning the user can
   * interact with, after the user clicks on it the actual error message will
   * show up in a dialog.
   */
  error: string;
  /**
   * The host will be rendered with an indication that it is being added as
   * opposed to being added already.
   */
  isBeingAddedOrDeleted: boolean;
  /**
   * Will render a check mark.
   */
  isDefault: boolean;
  /**
   * In sats.
   */
  price: number;
  /**
   * Can be empty if URI is provided.
   */
  publicKey: string | null;
  /**
   * Token for the service.
   */
  token: string;
}

export interface HostProps extends IHost {
  onClickRemove(publicKeyOrURI: string): void;
  /**
   * Called when clicking on the warning icon on a host with an error set.
   */
  onClickWarning(publicKeyOrURI: string): void;
}

const Host = ({
  error: hostError,
  isBeingAddedOrDeleted,
  isDefault,
  onClickRemove,
  onClickWarning,
  price,
  publicKey,
  URI
}: HostProps) => {
  const user = Store.useSelector(Store.selectUser(publicKey));
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState<boolean>(
    false
  );
  const toggleConfirmingRemoval = useCallback(() => {
    setIsConfirmingRemoval(confirming => !confirming);
  }, []);

  const handleClickOnWarning = useCallback(() => {
    onClickWarning(publicKey || URI);
  }, [onClickWarning, publicKey, URI]);

  const handleRemovalConfirmation = useCallback(() => {
    onClickRemove(publicKey || URI);
  }, [onClickRemove, publicKey, URI]);

  const malformedHost =
    (hostError && isBeingAddedOrDeleted) ||
    (publicKey && URI) ||
    (!publicKey && !URI);

  let error = hostError;

  if (malformedHost) {
    error = `Malformed host provided to <Host />, it must have either a public key or an URI (though not both), and it must not have both truthy error and isAdding props at the same time: ${JSON.stringify(
      malformedHost
    )}`;
  }

  if (isConfirmingRemoval) {
    return (
      <div
        className={classNames(
          gStyles.rowCentered,
          gStyles.centerJustify,
          gStyles.width100
        )}
      >
        <button
          onClick={handleRemovalConfirmation}
          className={classNames(gStyles.flatBtnFullWidth)}
        >
          Remove
        </button>

        <button
          onClick={toggleConfirmingRemoval}
          className={classNames(gStyles.flatBtnFullWidth)}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        gStyles.rowCentered,
        gStyles.spaceBetween,
        gStyles.childrenSpaced24,
        styles.container
      )}
    >
      <div
        className={classNames(
          gStyles.rowCentered,
          gStyles.spaceBetween,
          gStyles.childrenSpaced8,
          styles.pill
        )}
      >
        {publicKey ? (
          <ShockAvatar height={24} publicKey={publicKey} />
        ) : (
          <div style={{ height: 24, width: 24 }} />
        )}

        <span className={styles["display-name-or-uri"]}>
          {(URI && URI.toLowerCase()) ||
            user.displayName ||
            Common.defaultName(publicKey)}
        </span>

        {isBeingAddedOrDeleted || error ? (
          <div />
        ) : (
          <span
            className="fas fa-times"
            onClick={toggleConfirmingRemoval}
            style={{
              fontSize: 12
            }}
          />
        )}
      </div>

      <div
        className={classNames(
          gStyles.flex,
          gStyles.childrenSpaced24,
          styles["price-and-status"]
        )}
      >
        <span className={classNames(gStyles.flex, styles.price)}>
          {price} sats
        </span>

        {(() => {
          if (error) {
            return (
              <i
                className={classNames(
                  "fas fa-exclamation-triangle",
                  styles.icon,
                  styles.yellow
                )}
                onClick={handleClickOnWarning}
              />
            );
          }

          if (isBeingAddedOrDeleted) {
            return (
              <i
                className={classNames(
                  "fas fa-hourglass-half",
                  styles.icon,
                  styles.yellow
                )}
              />
            );
          }

          if (isDefault) {
            return (
              <i
                className={classNames("fas fa-check", styles.icon, styles.blue)}
              />
            );
          }

          return (
            <i
              className={classNames("fas fa-link", styles.icon, styles.blue)}
            ></i>
          );
        })()}
      </div>
    </div>
  );
};

export default Host;
