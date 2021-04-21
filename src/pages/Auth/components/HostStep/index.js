import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { connectHost } from "../../../../actions/NodeActions";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";

const HostStep = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [hostIP, setHostIP] = useState("");
  const [connecting, setConnecting] = useState(false);

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

  const onSubmit = async e => {
    try {
      e.preventDefault();
      if (connecting) {
        return;
      }
      setConnecting(true);
      setError(null);
      const noProtocolHostIP = hostIP.replace(/^http(s)?:\/\//gi, "");
      const { withProtocolHostIP } = await connectHost(noProtocolHostIP)(
        dispatch
      );
    } catch (error) {
      setConnecting(false);
      setError("Unable to connect to host");
    }
  };

  const chooseAnotherMethod = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);

  return (
    <div className="auth-form-container">
      {!connecting && (
        <p className="auth-form-container-title">Connect to Node</p>
      )}
      <form className="auth-form" onSubmit={onSubmit}>
        {connecting ? (
          <p>Connecting...</p>
        ) : (
          <>
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
            <p className="inline-link" onClick={chooseAnotherMethod}>
              Choose another method
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default HostStep;
