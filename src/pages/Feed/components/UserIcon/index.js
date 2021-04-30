import * as R from "react";
import classNames from "classnames";
import { useHistory } from "react-router";

import * as Store from "../../../../store";

import "./css/index.scoped.css";

const UserIcon = ({
  username,
  avatar,
  addButton = false,
  large = false,
  main = false,
  publicKey
}) => {
  // TODO: use ShockAvatar
  const history = useHistory();
  const selfPublicKey = Store.useSelector(Store.selectSelfPublicKey);
  const isOwn = publicKey === selfPublicKey;

  const handleClick = R.useCallback(() => {
    if (isOwn) {
      // add/view story
    } else {
      history.push(`/otherUser/${publicKey}`);
    }
  }, [isOwn]);

  return (
    <div
      className={classNames({
        "followed-user": true,
        "followed-user-large": large,
        "followed-user-main": main
      })}
      onClick={handleClick}
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
};

export default UserIcon;
