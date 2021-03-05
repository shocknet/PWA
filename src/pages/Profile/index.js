import React, { useCallback, useMemo, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import { processDisplayName } from "../../utils/String";

import {setSeedProviderPub} from '../../actions/ContentActions'

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import "./css/index.css";

const ProfilePage = () => {
  const dispatch = useDispatch()
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileConfigModalOpen, setProfileConfigModalOpen] = useState(false);
  const displayName = useSelector(({ node }) => node.displayName);
  const publicKey = useSelector(({ node }) => node.publicKey);
  const seedProviderPub = useSelector(({content}) => content.seedProviderPub)
  const [localSeedPub,setLocalSeedPub] = useState(seedProviderPub)
  const avatar = useSelector(({ node }) => node.avatar);
  const processedDisplayName = useMemo(
    () => processDisplayName(publicKey, displayName),
    [publicKey, displayName]
  );

  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);
  const toggleConfigModal = useCallback(() => {
    
    setProfileConfigModalOpen(!profileConfigModalOpen);
  }, [profileConfigModalOpen]);

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(publicKey);
  }, [publicKey]);

  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case "localPub": {
        setLocalSeedPub(value);
        return;
      }
      default:
        return;
    }
  })
  const onUpdatePub = useCallback(() => {
    setSeedProviderPub(localSeedPub)(dispatch)
  },[localSeedPub])
  const onCancel = useCallback(() => {
    setLocalSeedPub(seedProviderPub)
  },[seedProviderPub])

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
            <div className="config-btn" onClick={toggleConfigModal}>
              <i className="config-btn-icon icon-solid-spending-rule" />
              <p className="config-btn-text">Config</p>
            </div>
          </div>
        </div>
        <div className="profile-choices-container">
          <button className="profile-choice-container">
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Offer a Product</p>
          </button>
          <div className="profile-choice-container">
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Offer a Product</p>
          </div>
          <Link to={"/publishContent"} className="profile-choice-container" >
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Publish Content</p>
          </Link>
          <Link to={"/createPost"} className="profile-choice-container" >
            <i className="profile-choice-icon fas fa-user"></i>
            <p className="profile-choice-text">Create Post</p>
          </Link>
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
        <Modal
          toggleModal={toggleConfigModal}
          modalOpen={profileConfigModalOpen}
          
          contentStyle={{
            padding: "40px 30px"
          }}
        >
          <div>
            
            <input type='text' placeholder={localSeedPub} name="localPub" onChange={onInputChange} />
            <button onClick={onUpdatePub}>UPDATE</button>
            <button onClick={onCancel}>CANCEL</button>
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
