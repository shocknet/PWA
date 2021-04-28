import React from "react";
import classNames from "classnames";
import "./css/index.scoped.css";

const UserIcon = ({
  username,
  avatar,
  addButton = false,
  large = false,
  main = false
}) => (
  <div
    className={classNames({
      "followed-user": true,
      "followed-user-large": large,
      "followed-user-main": main
    })}
  >
    <div
      className="followed-user-avatar"
      style={{ backgroundImage: `url(${avatar})` }}
    >
      {addButton ? (
        <div className="user-add-btn">
          <i className="fas fa-plus" />
        </div>
      ) : null}
    </div>
    {username ? <p className="followed-user-name">{username}</p> : null}
  </div>
);

export default UserIcon;
