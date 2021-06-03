import { useCallback } from "react";
import classNames from "classnames";
import "./css/index.scoped.css";

const Thumbnail = ({ thumbnail, selected, setSelectedThumbnail }) => {
  const selectThumbnail = useCallback(() => {
    setSelectedThumbnail(thumbnail);
  }, [setSelectedThumbnail, thumbnail]);

  return (
    <div
      className={classNames({
        choice: true,
        active: selected
      })}
      style={{ backgroundImage: `url(${thumbnail.preview})` }}
      onClick={selectThumbnail}
    />
  );
};

export default Thumbnail;
