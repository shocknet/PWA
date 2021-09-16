import { useCallback, useEffect, useState } from "react";
import MainNav from "../../common/MainNav";
import "./css/index.scoped.css";
import Http from "../../utils/Http";
import * as Store from "../../store";

const Backups = () => {
  const [seedBackup, setSeedBackup] = useState("");
  const [channelsBackup, setChannelsBackup] = useState(null);
  const [copied, setCopied] = useState(false);
  const { identity_pubkey: lndPub } = Store.useSelector(
    ({ wallet }) => wallet.lightningInfo
  );
  const gunPub = Store.useSelector(({ node }) => node.publicKey);
  //effect for seed backup
  useEffect(() => {
    Http.get(`/api/gun/user/once/seedBackup`, {
      headers: {
        "public-key-for-decryption": gunPub
      }
    }).then(({ data: { data: seedBackup } }) => {
      setSeedBackup(seedBackup);
    });
  }, [gunPub]);
  //effect for channels backup
  useEffect(() => {
    Http.get(`/api/gun/user/once/channelsBackup`, {
      headers: {
        "public-key-for-decryption": gunPub
      }
    }).then(({ data: { data: channelsBackup } }) => {
      setChannelsBackup(channelsBackup);
    });
  }, [gunPub]);
  const copyChannelsBackup = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(channelsBackup));
    setCopied(true);
  }, [channelsBackup]);
  return (
    <div className="moonPayContainer">
      <MainNav pageTitle="BACKUPS" enableBackButton={true} />
      <div className="backupsContainer">
        <div className="innerContainer">
          <h1>Lightning Public Key</h1>
          <h3>{lndPub}</h3>
        </div>
        <div className="innerContainer">
          <h1>Seed Backup</h1>
          {seedBackup && <h3>{seedBackup}</h3>}
          {!seedBackup && <h3>backup not available on this node</h3>}
        </div>
        <div className="innerContainer">
          <h2>Channels Backups</h2>
          {channelsBackup && (
            <div className="copyContainer">
              <p>copy channel backups: </p>
              {copied && (
                <i className="fas fa-check" onClick={copyChannelsBackup}></i>
              )}
              {!copied && (
                <i className="fas fa-copy" onClick={copyChannelsBackup}></i>
              )}
            </div>
          )}
          {!channelsBackup && <h3>backup not available on this node</h3>}
        </div>
      </div>
    </div>
  );
};

export default Backups;
