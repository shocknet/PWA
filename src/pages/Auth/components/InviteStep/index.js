import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { connectHost } from "../../../../actions/NodeActions";
import { connectSocket } from "../../../../utils/WebSocket";
import Http from "../../../../utils/Http";
import Loader from "../../../../common/Loader";

const HOSTING_SERVER = "pool.shock.network";

const InviteStep = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case "inviteCode": {
        setInviteCode(value);
        return;
      }
      default:
        return;
    }
  }, []);

  const onSubmit = useCallback(
    async e => {
      try {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { data: response } = await Http.get(
          `https://${HOSTING_SERVER}/mainnet`,
          {
            headers: {
              Accept: "application/json",
              Authorization: inviteCode
            }
          }
        );
        const nodeURL = response.data.address;
        const noProtocolHostIP = nodeURL.replace(/^http(s)?:\/\//gi, "");
        const { withProtocolHostIP } = await connectHost(noProtocolHostIP)(
          dispatch
        );
        connectSocket(withProtocolHostIP);
      } catch (error) {
        setLoading(false);
        setError("Unable to connect to host");
      }
    },
    [dispatch, inviteCode]
  );

  return (
    <div className="auth-form-container">
      <p className="auth-form-container-title">Invitation Code</p>
      <form className="auth-form" onSubmit={onSubmit}>
        {loading ? <Loader fullScreen overlay /> : null}
        <input
          type="text"
          name="inviteCode"
          placeholder="Enter your invitation code"
          value={inviteCode}
          onChange={onInputChange}
          className={classNames({
            "input-field": true,
            "input-field-error": !!error
          })}
        />
        {error ? <p className="error-container">{error}</p> : null}
        <button className="submit-btn" type="submit">
          Connect
        </button>
      </form>
    </div>
  );
};

export default InviteStep;
