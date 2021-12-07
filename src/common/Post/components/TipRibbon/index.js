import { memo } from "react";

import "./css/index.scoped.css";

const TipRibbon = ({ tipCounter, tipValue, zoomed = false }) =>
  tipValue > 0 ? (
    <div className="ribbon-container" style={{ opacity: !zoomed ? 1 : 0 }}>
      <p className="ribbon-title">Total Tips</p>
      <p className="ribbon-value">
        {tipCounter} {tipCounter === 1 ? "Tip" : "Tips"}
      </p>
    </div>
  ) : null;

export default memo(TipRibbon);
