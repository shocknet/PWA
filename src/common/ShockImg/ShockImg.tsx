import React from "react";
import c from "classnames";

import "./css/ShockImg.scoped.css";

export interface ShockImgProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  placeholderHeight: number;
  placeholderWidth: number;
}

const ShockImg: React.FC<ShockImgProps> = props => {
  const { placeholderHeight, placeholderWidth } = props;

  const showPlaceholder = placeholderHeight || placeholderWidth;

  const [loaded, setLoaded] = React.useState(false);

  const containerStyle = React.useMemo<React.CSSProperties>(
    () => ({
      height: placeholderHeight + "px",
      width: placeholderWidth + "px"
    }),
    [placeholderHeight, placeholderWidth]
  );

  const onLoad: ShockImgProps["onLoad"] = React.useCallback(
    e => {
      const { onLoad: propsOnLoad } = props;

      setLoaded(true);

      if (propsOnLoad) {
        propsOnLoad(e);
      }
    },
    [props]
  );

  const imgNode = React.useMemo(() => {
    const imgProps = { ...props };
    // react complains otherwise
    delete imgProps.placeholderHeight;
    delete imgProps.placeholderWidth;
    // alt is marked as required above
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...imgProps} onLoad={onLoad} />;
  }, [props, onLoad]);

  if (!showPlaceholder || loaded) {
    return imgNode;
  }

  return (
    <div className="container" style={containerStyle}>
      <div className="icon-container">
        <i className={c("fas", "fa-image", "icon")} />
      </div>

      {imgNode}
    </div>
  );
};

export default ShockImg;
