import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { connectHost } from "../../../../actions/NodeActions";
import { connectSocket } from "../../../../utils/WebSocket";
import Http from "../../../../utils/Http";
import Loader from "../../../../common/Loader";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";

const HOSTING_SERVER = "pool.shock.network";

const InviteStep = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [podRead,setPodReady] = useState(0)
  const [apiRead,setApiReady] = useState(0)
  const [lndRead,setLndReady] = useState(0)
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

  const getTunnelURI = useCallback(async address =>
    new Promise((res, rej) => {
      const port = address.match(/:(\d+)/);
      if (!port) {
        return res(address);
      }

      const socket = new WebSocket(`wss://${HOSTING_SERVER}/ws/healthz`);
      socket.addEventListener("open", function (event) {
        socket.send(`health(${port[1]})`);
      });

      socket.addEventListener("message", function (event) {
        const data = JSON.parse(event.data);
        let count = 0
        if (data.api_uri) {
          setApiReady(1)
          count++
        }
        if (data.pod_ready) {
          setPodReady(1)
          count++
        }
        if (data.lnd_ready) {
          setLndReady(1)
          count++
        }
        if(count === 3) {
          socket.close();
          res(data.api_uri);
        }
      });
    }),[setApiReady,setPodReady,setLndReady])

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
              Authorization: `Bearer ${inviteCode}`
            }
          }
        );
        const nodeURL = response.data.address;
        const tunnelURI = await getTunnelURI(nodeURL);
        const noProtocolHostIP = tunnelURI.replace(/^http(s)?:\/\//gi, "");
        const { withProtocolHostIP } = await connectHost(
          noProtocolHostIP,
          true
        )(dispatch);
        connectSocket(withProtocolHostIP);
      } catch (error) {
        setLoading(false);
        setError("Unable to connect to host");
      }
    },
    [dispatch, inviteCode]
  );

  const chooseAnotherMethod = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);
  const sum = podRead + apiRead + lndRead
  const currentWidthLoader = ((sum / 3) * 100)
  return (
    <div className="auth-form-container">
      {loading && 
        <div className="w-100">
          <p className="text-center">
            {sum === 0 && "Initializing Node..."}
            {sum === 1 && "Preparing API..."}
            {sum === 2 && "Synchronizing LND..."}
            {sum === 3 && "All set! Let's go!"}
          </p>
          <div className="meter blue">
            <span style={{width:`${currentWidthLoader || 2}%`}}></span>
          </div>
        </div>
      }
      <p className="auth-form-container-title">Invitation Code</p>
      {!loading &&
        <form className="auth-form" onSubmit={onSubmit}>
          
          
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
        <p className="inline-link" onClick={chooseAnotherMethod}>
          Choose another method
        </p>
      </form>
      }
    </div>
  );
};

export default InviteStep;
