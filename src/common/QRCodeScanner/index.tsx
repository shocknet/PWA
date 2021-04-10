import QRScanner from "react-qr-scanner";
import { isDesktop } from "../../utils/Platform";
import "./css/index.css";

type ScannerMode = "wizard" | "invoice";
interface Props {
  mode: ScannerMode;
  onScan: (result: string | null) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

const modeContents = {
  wizard: {
    title: "SCAN A",
    target: "QR CODE",
    description: "Point your camera at a ShockWizard QR Code"
  },
  invoice: {
    title: "SCAN AN",
    target: "INVOICE",
    description: "Point your camera at an LND Invoice"
  }
};

const QRCodeScanner = ({
  mode = "wizard",
  onScan,
  onError,
  onClose
}: Props) => {
  const content = modeContents[mode];
  const facingMode = isDesktop() ? "user" : "environment";

  return (
    <div className="qr-code-scanner-container">
      <div className="qr-scanner-top-section">
        <i className="fas fa-times" onClick={onClose}></i>
      </div>

      <QRScanner
        constraints={{
          video: {
            facingMode: { exact: facingMode }
          }
        }}
        onScan={onScan}
        onError={onError}
      />

      <div className="qr-scanner-target" />
      <div className="qr-scanner-bottom-section">
        <p className="qr-scanner-bottom-title">
          {content.title}{" "}
          <span className="qr-scanner-bottom-title-highlight">
            {content.target}
          </span>
        </p>
        <p className="qr-scanner-bottom-description">{content.description}</p>
        <div className="qr-scanner-btn" onClick={onClose}>
          Cancel Scan
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
