import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode.react";
import { processDisplayName } from "../../utils/String";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import "./css/index.css";

const ProfilePage = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const displayName = useSelector(({ node }) => node.displayName);
  const publicKey = useSelector(({ node }) => node.publicKey);
  const avatar = useSelector(({ node }) => node.avatar);
  const processedDisplayName = useMemo(
    () => processDisplayName(publicKey, displayName),
    [publicKey, displayName]
  );

  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(publicKey);
  }, [publicKey]);

  return (
    <div className="page-container profile-page">
      <div className="profile-container">
        <div className="profile-cover" />
        <div className="profile-info-container">
          <div
            className="profile-avatar"
            style={{ backgroundImage: `url(${avatar})` }}
          />
          <div className="profile-info">
            <p className="profile-name">{processedDisplayName}</p>
            <p className="profile-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam,
              blanditiis
            </p>
            <div className="config-btn">
              <i className="config-btn-icon icon-solid-spending-rule" />
              <p className="config-btn-text">Config</p>
            </div>
          </div>
        </div>
        <div className="profile-choices-container">
          <div className="profile-choice-container">
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Offer a Product</p>
          </div>
          <div className="profile-choice-container">
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Offer a Product</p>
          </div>
          <div className="profile-choice-container">
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Offer a Product</p>
          </div>
          <div className="profile-choice-container">
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Offer a Product</p>
          </div>
        </div>
        <Modal
          toggleModal={toggleModal}
          modalOpen={profileModalOpen}
          contentStyle={{
            padding: "40px 30px"
          }}
        >
          <QRCode
            bgColor="#23282d"
            fgColor="#4285b9"
            value={publicKey}
            size={180}
            className="profile-qrcode"
          />
          <p className="profile-qrcode-desc">
            Other users can scan this code to contact you
          </p>
          <div className="profile-clipboard-container" onClick={copyClipboard}>
            <img
              src={ClipboardIcon}
              className="profile-clipboard-icon"
              alt=""
            />
            <p className="profile-clipboard-text">Tap to copy to clipboard</p>
          </div>
        </Modal>
        <AddBtn
          onClick={toggleModal}
          large
          iconURL={QRCodeIcon}
          style={{ backgroundColor: "var(--yellow)" }}
        />
      </div>

      <BottomBar />
    </div>
  );
};

export default ProfilePage;
