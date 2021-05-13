import { useCallback, useState } from "react";
import c from "classnames";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import * as Store from "../../../../store";
import * as Utils from "../../../../utils";
import * as gStyles from "../../../../styles";
import { sendHandshakeRequest } from "../../../../actions/ChatActions";

import styles from "./SendReqBtn.module.css";

export interface SendReqBtnProps {
  publicKey: string;
}

const SendReqBtn = ({ publicKey }: SendReqBtnProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isInContact = Store.useSelector(Store.selectIsInContact(publicKey));

  const [changingStatus, setChangingStatus] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      if (changingStatus) {
        return;
      }

      if (isInContact) {
        history.push(`/chat/${publicKey}`);
        return;
      }

      setChangingStatus(true);

      await dispatch(sendHandshakeRequest(publicKey));

      setChangingStatus(false);
    } catch (e) {
      alert(`Could not send contact request: ${e.message}`);
      Utils.logger.error(e);
      setChangingStatus(false);
    }
  }, [changingStatus, dispatch, history, isInContact, publicKey]);

  return (
    <div className={c(styles.container)} onClick={handleClick}>
      <p className={c(gStyles.unselectable, styles.text)}>
        {changingStatus ? "..." : isInContact ? "Message" : "Request Contact"}
      </p>
    </div>
  );
};

export default SendReqBtn;
