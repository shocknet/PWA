import React from "react";
import classNames from "classnames";
import "./css/index.css";

const UserIcon = ({ addButton, username, avatar, large, main }) => (
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
