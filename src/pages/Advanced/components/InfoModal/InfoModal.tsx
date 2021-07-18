import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Schema from "../../../../schema";
import * as Utils from "../../../../utils";
import ShockModal from "../../../../common/Modal";
import Pad from "../../../../common/Pad";

import "./InfoModal.scoped.css";

export interface InfoModalProps {
  modalOpen: boolean;
  toggleModal(): void;
}

const InfoModal = ({ modalOpen, toggleModal }: InfoModalProps) => {
  const [nodeInfo, setNodeInfo] = React.useState<Schema.NodeInfo | null>(null);

  React.useEffect(() => {
    if (modalOpen) {
      Utils.Http.get("/healthz")
        .then(res => {
          setNodeInfo(res.data.LNDStatus.message);
        })
        .catch(e => {
          Utils.logger.error(
            `Error while fetching node info inside <InfoModal /> -> `,
            e
          );
          alert(`Error while fetching node info: ${e.message}`);
        });
    }
  }, [modalOpen]);

  let modalContent = <span>Loading...</span>;

  if (nodeInfo) {
    modalContent = (
      <div className="container">
        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Synced to Chain</span>

          {nodeInfo.synced_to_chain ? (
            <i className="fas fa-check icon" />
          ) : (
            <i className="far fa-clock icon" />
          )}
        </div>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Synced to Graph</span>

          {nodeInfo.synced_to_graph ? (
            <i className="fas fa-check icon" />
          ) : (
            <i className="far fa-clock icon" />
          )}
        </div>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Lightning PubKey:</span>

          <i
            className="far fa-copy icon cursor-pointer"
            onClick={() => {
              try {
                navigator.clipboard.writeText(nodeInfo.identity_pubkey);
                toast.dark("Copied to clipboard");
              } catch (e) {
                alert(e.message);
              }
            }}
          />
        </div>

        <span className="data pubKey">
          {/* poor man's ellipsis */}
          ...{nodeInfo.identity_pubkey.slice(-14)}
        </span>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Uris</span>

          <i
            className="far fa-copy icon cursor-pointer"
            onClick={() => {
              try {
                navigator.clipboard.writeText(nodeInfo.uris.join(" , "));
                toast.dark("Copied to clipboard");
              } catch (e) {
                alert(e.message);
              }
            }}
          />
        </div>

        <span className="data">
          {`Number of Uris: ${nodeInfo.uris.length.toString()}`}
        </span>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Pending Channels:</span>
        </div>

        <span className="data">{nodeInfo.num_pending_channels.toString()}</span>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Block Height:</span>
        </div>

        <span className="data">{nodeInfo.block_height.toString()}</span>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Block Height:</span>
        </div>

        <span className="data">{nodeInfo.block_height.toString()}</span>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">Best Header Timestamp:</span>
        </div>

        <span className="data">{nodeInfo.best_header_timestamp}</span>

        <Pad amt={45} />

        <div className="subtitle-and-icon-holder">
          <span className="subtitle">LND Version</span>
        </div>

        <span className="data">{nodeInfo.version}</span>

        <Pad amt={45} />

        <div
          className="btn"
          onClick={() => {
            alert("Coming soon");
          }}
        >
          <span className="btn-text">Download Backup</span>
        </div>

        <Pad amt={18} />

        <span className="footer">
          <span className="warning">Warning: </span> Consult documentation
          before use.
        </span>
      </div>
    );
  }

  return (
    <ShockModal
      modalOpen={modalOpen}
      toggleModal={toggleModal}
      modalTitle="Node Info"
    >
      <Pad amt={50} />

      {modalContent}
    </ShockModal>
  );
};

export default InfoModal;
