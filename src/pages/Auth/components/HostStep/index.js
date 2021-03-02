import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { connectHost } from "../../../../actions/NodeActions";
import { connectSocket } from "../../../../utils/WebSocket";

const HostStep = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [hostIP, setHostIP] = useState("");

  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case "hostIP": {
        setHostIP(value);
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
        const noProtocolHostIP = hostIP.replace(/^http(s)?:\/\//gi, "");
        const { withProtocolHostIP } = await connectHost(noProtocolHostIP)(
          dispatch
        );
        connectSocket(withProtocolHostIP);
      } catch (error) {
        setError("Unable to connect to host");
      }
    },
    [hostIP, dispatch, setError]
  );

  return (
    <div className="auth-form-container">
      <p className="auth-form-container-title">Connect to Node</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="hostIP"
          placeholder="Host Address (in IP or DNS form)"
          value={hostIP}
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

export default HostStep;
