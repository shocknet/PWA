import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { connectHost } from "../../../../actions/NodeActions";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";

const isIP = hostname => {
  const digits = hostname.split(".");
  if (digits.length !== 4) {
    return false;
  }
  const notNumber = digits.find(e => isNaN(e) || parseInt(e, 10) > 255);
  return !notNumber;
};

const parseUrl = url => {
  console.log("check ip");
  if (url === "localhost" || url === "http://localhost") {
    return url + ":9835";
  }
  if (isIP(url)) {
    return url + ":9835";
  }
  //if not an IP it must start with http
  const toTest = url.startsWith("http") ? url : "http://" + url;
  const u = new URL(toTest);
  //let check again if it's an IP
  if (!u.port && isIP(u.hostname)) {
    return u.hostname + ":9835";
  }
  return u.host;
};

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

      const noProtocolHostIP = parseUrl(hostIP);
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
      <div className="vertical-flex m-b-5">
        <div className="m-b-1">
          <h2>Configure Your Node</h2>
          <p>Shockwallet can connect to your own Lightning node, your node must be running <a href="https://github.com/shocknet/api" className="color-text-blue">ShockAPI</a> with LND</p>
        </div>
        <div>
          <p>Umbrel, MyNode and Command Line instructions can be found <a href="" className="color-text-blue">Here</a></p>
        </div>
      </div>
      {!connecting && (
        <p className="auth-form-container-title">Connect to Node</p>
      )}
      <form className="auth-form" onSubmit={onSubmit}>
        {connecting ? (
          <p>Connecting...</p>
        ) : (
          <>
            <input
              autoCapitalize="off"
              autoCorrect="off"
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
