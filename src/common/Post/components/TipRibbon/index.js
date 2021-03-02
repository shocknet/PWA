import React from "react";
import "./css/index.css";

const TipRibbon = ({ tipCounter, tipValue, zoomed }) =>
  tipValue > 0 ? (
    <div className="ribbon-container" style={{ opacity: !zoomed ? 1 : 0 }}>
      <p className="ribbon-title">Total Tips</p>
      <p className="ribbon-value">
        {tipCounter} {tipCounter === 1 ? "Tip" : "Tips"}
      </p>
    </div>
  ) : null;

export default TipRibbon;
