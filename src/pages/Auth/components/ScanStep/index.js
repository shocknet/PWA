import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { connectHost } from "../../../../actions/NodeActions";
import { connectSocket } from "../../../../utils/WebSocket";
import QRCodeScanner from "../../../../common/QRCodeScanner";
import Loader from "../../../../common/Loader";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";

const ScanStep = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(false);

  const openScanner = useCallback(()=>{
    setScan(true)
  },[setScan])

  const connectHostIP = useCallback(
    async (hostIP, walletPort) => {
      try {
        console.log("connectHostIP:", hostIP);
        const noProtocolHostIP = hostIP.replace(/^http(s)?:\/\//gi, "");
        const { withProtocolHostIP } = await connectHost(
          `${noProtocolHostIP}:${walletPort}`
        )(dispatch);
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const onScan = useCallback(
    async data => {
      try {
        if (!data) {
          return;
        }
        setLoading(true);
        console.log("Scanned Code:", data);
        setError(null);
        const { internalIP, externalIP, walletPort } = JSON.parse(data.text);
        const internalConnection = await connectHostIP(internalIP, walletPort);

        if (internalConnection) {
          setLoading(false);
          return true;
        }

        const externalConnection = await connectHostIP(externalIP, walletPort);

        if (externalConnection) {
          setLoading(false);
          return true;
        }

        setError(
          `Unable to connect to host, please ensure that your ShockWizard node is up and fully synced to the blockchain.`
        );
      } catch (error) {
        setLoading(false);
        console.error(error);
        setError(error.message);
      }
    },
    [connectHostIP]
  );

  const onError = useCallback(error => {
    console.error(error);
    setError(
      "Unable to detect a camera, please make sure that the Camera permission is allowed in order to be able to scan QR Codes"
    );
  }, []);

  const closeScanner = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);

  return (
    <div className="auth-form-container">
      {loading ? <Loader fullScreen overlay text="Loading Host..." /> : null}
      {scan && <QRCodeScanner
        mode="wizard"
        onScan={onScan}
        onError={onError}
        onClose={closeScanner}
      />}
      {!scan && <div className="vertical-flex m-b-5">
        <div className="m-b-1">
          <div className="w-100 d-flex">
          <h2 className="m-auto">Connect to ShockWizard</h2>
            
          </div>
          <div className="d-flex m-b-1 m-t-1">
          <img className="w-50 m-auto" src="https://raw.githubusercontent.com/shocknet/Wizard/master/wizardSS_900.png"></img>
          </div>
          <p>ShockWizard is an easy to install Lightning node for your Desktop or Laptop.  Windows, MacOS and Desktop Linux users can download it  <a href="https://github.com/shocknet/Wizard" className="color-text-blue">Here</a></p>
        </div>
        <div>
          <p>At the end of the Wizard, scan the QR code to pair it with your mobile device.</p>
        </div>
      </div>}
      {!scan && <button className="submit-btn" onClick={openScanner}>
        Scan QR
      </button>}
    </div>
  );
};

export default ScanStep;
