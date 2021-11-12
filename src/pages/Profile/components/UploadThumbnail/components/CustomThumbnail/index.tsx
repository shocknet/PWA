import { memo, useCallback } from "react";
import classNames from "classnames";
import "./css/index.scoped.css";

const CustomThumbnail = ({
  thumbnail,
  selected,
  onUpload,
  setSelectedThumbnail,
  removeCustomThumbnail
}) => {
  const selectThumbnail = useCallback(() => {
    setSelectedThumbnail(thumbnail);
  }, [setSelectedThumbnail, thumbnail]);

  if (thumbnail) {
    return (
      <div
        className={classNames({
          "custom-image": true,
          active: selected
        })}
        style={{ backgroundImage: `url(${thumbnail.preview})` }}
        onClick={selectThumbnail}
      >
        <div className="remove-btn" onClick={removeCustomThumbnail}>
          <i className="fas fa-trash"></i>
        </div>
      </div>
    );
  }

  return (
    <label className="custom-choice" htmlFor="thumbnail">
      <i className="fas fa-images" />
      <p className="choice-text">Upload a Thumbnail</p>
      <input
        type="file"
        id="thumbnail"
        onChange={onUpload}
        multiple={false}
        accept="image/*"
      />
    </label>
  );
};

export default memo(CustomThumbnail);
