import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { connectHost } from "../../../../actions/NodeActions";
import QRCodeScanner from "../../../../common/QRCodeScanner";
import Loader from "../../../../common/Loader";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";
import { ParseNodeIP } from "../../../../utils/relay";

const ScanStep = () => {
  const dispatch = useDispatch();
  const [, setError] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(false);
  const [scanned, setScanned] = useState("");

  const openScanner = useCallback(() => {
    setScan(true);
  }, [setScan]);

  const connectHostIP = useCallback(
    async (hostIdentifier, walletPort) => {
      try {
        const [hostIP, relayId, accessSecret] = ParseNodeIP(hostIdentifier);
        console.log("connectHostIP:", hostIP);
        const noProtocolHostIP = hostIP.replace(/^http(s)?:\/\//gi, "");
        await connectHost(
          `${noProtocolHostIP}:${walletPort}`,
          true,
          relayId,
          accessSecret
        )(dispatch);
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const onScan = useCallback(
    data => {
      if (!data) {
        return;
      }
      setScanned(data.text);
    },
    [setScanned]
  );

  const onScanCb = useCallback(
    async data => {
      try {
        if (!data) {
          return;
        }
        setLoading(true);
        console.log("Scanned Code:", data);
        setError(null);
        const { internalIP, externalIP, walletPort } = JSON.parse(data);
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

  useEffect(() => {
    if (!scanned) {
      return;
    }
    onScanCb(scanned);
  }, [onScanCb, scanned]);

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

  const chooseAnotherMethod = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);

  return (
    <div className="auth-form-container">
      {loading ? <Loader fullScreen overlay text="Loading Host..." /> : null}
      {scan && (
        <QRCodeScanner
          mode="wizard"
          onScan={onScan}
          onError={onError}
          onClose={closeScanner}
        />
      )}
      {!scan && (
        <div className="vertical-flex-center">
          <div className="m-b-1 vertical-flex-center">
            <h2 className="m-auto text-center" style={{ marginBottom: "1rem" }}>
              Connect to ShockWizard
            </h2>

            <a
              target="_blank"
              href="https://github.com/shocknet/Wizard"
              className="w-50 m-auto"
              style={{ marginBottom: "1rem" }}
              rel="noreferrer"
            >
              <img
                alt="Laptop running Shockwizard and phone running Lightning.Page"
                className="w-100"
                src="https://raw.githubusercontent.com/shocknet/Wizard/master/wizardSS_900tr.png"
              ></img>
            </a>
            <p className="text-center m-b-5">
              ShockWizard is an easy to install Lightning node for your Desktop
              or Laptop. Windows, MacOS and Desktop Linux users can download it{" "}
              <a
                target="_blank"
                href="https://github.com/shocknet/Wizard/releases"
                className="color-text-blue"
                rel="noreferrer"
              >
                Here
              </a>
            </p>
            <p className="text-center ">
              At the end of the Wizard, scan the QR code to pair it with your
              mobile device.
            </p>
          </div>
        </div>
      )}
      <div style={{ height: "15vh" }}></div>
      {!scan && (
        <button className="submit-btn" onClick={openScanner}>
          Scan QR
        </button>
      )}
      {!scan && (
        <p className="inline-link" onClick={chooseAnotherMethod}>
          Choose another method
        </p>
      )}
    </div>
  );
};

export default ScanStep;
