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

  const connectHostIP = useCallback(
    async (hostIP, walletPort) => {
      try {
        console.log("connectHostIP:", hostIP);
        const noProtocolHostIP = hostIP.replace(/^http(s)?:\/\//gi, "");
        const { withProtocolHostIP } = await connectHost(
          `${noProtocolHostIP}:${walletPort}`
        )(dispatch);
        connectSocket(withProtocolHostIP);
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
      <QRCodeScanner
        mode="wizard"
        onScan={onScan}
        onError={onError}
        onClose={closeScanner}
      />
    </div>
  );
};

export default ScanStep;
