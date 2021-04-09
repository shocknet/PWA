import { useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import produce from "immer";

import * as gStyles from "../../../styles";
import Modal from "../../Modal";

import styles from "./ContentHostInputView.module.css";
import Host, { IHost as _IHost } from "./Host";

export type IHost = _IHost;

export interface ContentHostInputViewProps {
  hosts: IHost[];
  onAddHost(publicKeyOrServerURI: string): void;
  onRemoveHost(publicKeyOrServerURI: string): void;
  /**
   * If a host has an error set, the user will be offered to retry adding it.
   */
  onRetryHost(publicKeyOrServerURI: string): void;
}

const ContentHostInputView = ({
  hosts: unorderedHosts,
  onAddHost,
  onRemoveHost,
  onRetryHost
}: ContentHostInputViewProps) => {
  type PublicKeyOrServerURIData = {
    publicKeyOrServerURI: string;
    URIHostAwaitingForToken: string;
  };
  const [
    { publicKeyOrServerURI },
    setPublicKeyOrServerURIData
  ] = useState<PublicKeyOrServerURIData>({
    publicKeyOrServerURI: "",
    URIHostAwaitingForToken: ""
  });
  const [hostForErrorDialog, setHostForErrorDialog] = useState("");
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const [isPasting, setIsPasting] = useState(false);

  const sortedHosts = useMemo(
    () =>
      unorderedHosts.slice().sort((a, b) => {
        return b.dateAdded - a.dateAdded;
      }),
    [unorderedHosts]
  );

  const defaultHosts = useMemo(() => sortedHosts.filter(h => h.isDefault), [
    sortedHosts
  ]);

  const nonDefaultHosts = useMemo(() => sortedHosts.filter(h => !h.isDefault), [
    sortedHosts
  ]);

  const hosts = useMemo(() => [...defaultHosts, ...nonDefaultHosts], [
    defaultHosts,
    nonDefaultHosts
  ]);

  const handleFocus = useCallback(() => {
    setOpen(true);
  }, []);

  const onClickPaste = useCallback(() => {
    if (isPasting) {
      return;
    }

    if (navigator.clipboard) {
      setIsPasting(true);
      navigator.clipboard
        .readText()
        .then(txt => {
          setPublicKeyOrServerURIData(
            produce((data: PublicKeyOrServerURIData) => {
              data.publicKeyOrServerURI = txt;
            })
          );
        })
        .catch(e => {
          alert(`Could not paste: ${e.message}`);
        })
        .finally(() => {
          setIsPasting(false);
        });
    } else {
      if (input.current) {
        input.current.focus();
        document.execCommand("paste");
        input.current.blur();
      }
    }
  }, [isPasting, setIsPasting]);

  const onClickAdd = useCallback(() => {
    setPublicKeyOrServerURIData(
      produce((data: PublicKeyOrServerURIData) => {
        data.publicKeyOrServerURI = "";
      })
    );
    onAddHost(publicKeyOrServerURI);
  }, [setPublicKeyOrServerURIData, publicKeyOrServerURI, onAddHost]);

  const handleHostRemoval = useCallback(
    (publicKeyOrURI: string) => {
      onRemoveHost(publicKeyOrURI);
    },
    [onRemoveHost]
  );

  const closeErrorDialog = useCallback(() => {
    setHostForErrorDialog("");
  }, [setHostForErrorDialog]);

  const handleRemovalOfHostWithError = useCallback(() => {
    onRemoveHost(hostForErrorDialog);
    closeErrorDialog();
  }, [onRemoveHost, hostForErrorDialog, closeErrorDialog]);

  const handleHostRetry = useCallback(() => {
    onRetryHost(hostForErrorDialog);
    setHostForErrorDialog("");
  }, [onRetryHost, hostForErrorDialog, setHostForErrorDialog]);

  return (
    <>
      <div
        className={classNames(gStyles.col, gStyles.width100, styles.container)}
      >
        <div className={(gStyles.row, gStyles.centerJustify)}>
          {/* https://stackoverflow.com/a/15314433 */}
          <input
            className={classNames("input-field", styles["uri-or-token-input"])}
            onChange={e => {
              setPublicKeyOrServerURIData(
                produce((data: PublicKeyOrServerURIData) => {
                  data.publicKeyOrServerURI = e.target.value;
                  data.URIHostAwaitingForToken = "";
                })
              );
            }}
            type="text"
            value={publicKeyOrServerURI}
            onKeyUp={e => {
              if (e.key === "Enter" || e.keyCode === 13) {
                onClickAdd();
              }
            }}
            autoCapitalize="off"
            autoCorrect="none"
            placeholder="Provider Pubkey or Server URI"
            ref={input}
            onFocus={handleFocus}
          />

          {publicKeyOrServerURI.length === 0 && (
            <button
              className={classNames(
                gStyles.flatBtn,
                styles["plus-or-paste-btn"]
              )}
              disabled={isPasting}
              onClick={onClickPaste}
            >
              <i className="fas fa-paste"></i>
            </button>
          )}

          {publicKeyOrServerURI.length > 0 && (
            <button
              className={classNames(
                gStyles.flatBtn,
                styles["plus-or-paste-btn"]
              )}
              disabled={publicKeyOrServerURI.length === 0}
              onClick={onClickAdd}
            >
              +
            </button>
          )}
        </div>

        <div className={classNames(gStyles.col)}>
          {(open ? hosts : defaultHosts).map(host => (
            <Host
              URI={host.URI}
              dateAdded={0}
              error={host.error}
              isBeingAddedOrDeleted={host.isBeingAddedOrDeleted}
              isDefault={host.isDefault}
              key={host.publicKey || host.URI}
              onClickRemove={handleHostRemoval}
              onClickWarning={setHostForErrorDialog}
              price={host.price}
              publicKey={host.publicKey}
            />
          ))}
        </div>
      </div>

      {/* TODO: change to global modal */}
      <Modal
        modalOpen={!!hostForErrorDialog}
        modalTitle={
          hosts.find(
            h =>
              h.publicKey === hostForErrorDialog || h.URI === hostForErrorDialog
          )?.error
        }
        toggleModal={closeErrorDialog}
      >
        <div className={BUTTON_HOLDER_CLASS_NAME}>
          <button
            onClick={handleRemovalOfHostWithError}
            className="shock-form-button m-1"
          >
            REMOVE
          </button>

          <button
            onClick={handleHostRetry}
            className="shock-form-button-confirm m-1"
          >
            RETRY
          </button>
        </div>
      </Modal>
    </>
  );
};

const BUTTON_HOLDER_CLASS_NAME = classNames(
  gStyles.rowCentered,
  gStyles.width100,
  gStyles.centerJustify,
  gStyles.childrenSpaced16,
  gStyles.padding12
);

export default ContentHostInputView;
