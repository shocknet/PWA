import  {
  memo,
  useCallback,
  useMemo,
  useState
} from "react";
import { useHistory } from "react-router";
import {
  getParams,
  LNURLAuthParams,
  LNURLChannelParams,
  LNURLPayParams,
  LNURLResponse,
  LNURLWithdrawParams
} from "js-lnurl";
import DialogNav from "../../common/DialogNav";
import Loader from "../../common/Loader";
import QRCodeScanner from "../../common/QRCodeScanner";
import ExtractInfo from "../../utils/validators";
import { useDispatch } from "react-redux";
import { Http } from "../../utils";
import { connectPeer, fetchPeers } from "../../actions/WalletActions";

const QRScanner = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [privateChannel, setPrivateChannel] = useState(true);
  const [payAmount, setPayAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [hasMemo, setHasMemo] = useState(false);
  const [memo, setMemo] = useState("");
  const [LNURLdata, setLNURLdata] = useState(null);
  const [scanQR, setScanQR] = useState(true);
  const [, setDone] = useState(null);
  const [, setError] = useState(null);
  const goBack = useCallback(() => {
    history.push("/overview");
  }, [history]);
  const onInputChange = useCallback(
    e => {
      const { value, name, checked } = e.target;
      //e.preventDefault()
      switch (name) {
        case "privateChannel": {
          setPrivateChannel(checked);
          return;
        }
        case "payAmount": {
          setPayAmount(value);
          return;
        }
        case "withdrawAmount": {
          setWithdrawAmount(value);
          return;
        }
        case "hasMemo": {
          setHasMemo(checked);
          return;
        }
        case "memo": {
          setMemo(value);
          return;
        }
        default:
          return;
      }
    },
    [setPrivateChannel, setPayAmount, setWithdrawAmount, setHasMemo, setMemo]
  );
  const decodeLNURL = useCallback(async data => {
    setLoading(true);
    try {
      const params = await getParams(data);
      //@ts-ignore
      if (!params.tag) {
        const p = params as LNURLResponse;
        setLoading(false);
        setError(p.reason);
      }
      const p = params as
        | LNURLChannelParams
        | LNURLWithdrawParams
        | LNURLAuthParams
        | LNURLPayParams;
      switch (p.tag) {
        case "channelRequest": {
          console.log("this url is a channel request");
          break;
        }
        case "withdrawRequest": {
          console.log("this url is a withdrawal request");
          break;
        }
        case "hostedChannelRequest": {
          console.log("this url is a hosted channel request");
          break;
        }
        case "login": {
          console.log("this url is a login ");
          break;
        }
        case "payRequest": {
          console.log("this url is a pay request");
          break;
        }
        default: {
          console.log("unknown tag");
        }
      }
      setLNURLdata(p);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(e.message || e);
    }
  }, []);
  const decodeAll = useCallback(
    result => {
      console.log("decoding!");
      const info = ExtractInfo(result);
      switch (info.type) {
        case "btc":
        case "ln":
        case "keysend": {
          history.push("/send", {
            data: info
          });
          return;
        }
        case "pk": {
          history.push(`/otherUser/${info.pk}`);
          return;
        }
        case "lnurl": {
          decodeLNURL(info.lnurl);
          return;
        }
        case "unknown": {
          setError("cant decode" + JSON.stringify(info));
        }
      }
    },
    [history, setError, decodeLNURL]
  );
  const closeQR = useCallback(() => {
    setScanQR(false);
    history.push("/overview");
  }, [setScanQR, history]);
  const scanDone = useCallback(
    content => {
      console.log(content);
      if (!content || !content.text) {
        return;
      }
      decodeAll(content.text);
      setScanQR(false);
    },
    [decodeAll, setScanQR]
  );

  const confirmWithdrawReq = useCallback(async () => {
    try {
      const { callback, k1 } = LNURLdata;
      const { data: payReq } = await Http.post("/api/lnd/addinvoice", {
        value: withdrawAmount,
        memo: memo,
        expiry: 1800
      });
      const completeUrl = `${callback}?k1=${k1}&pr=${payReq.payment_request}`;
      console.log(completeUrl);
      const res = await fetch(completeUrl);
      const json = await res.json();
      if (json.status === "OK") {
        setDone("Withdraw request sent correctly");
      } else {
        setError(json.reason);
      }
    } catch (e) {
      setError(e.message || e);
    }
  }, [LNURLdata, withdrawAmount, memo, setDone, setError]);
  const confirmChannelReq = useCallback(async () => {
    try {
      const { uri, callback, k1 } = LNURLdata;
      let newK1 = k1;
      if (k1 === "gun" && LNURLdata.shockPubKey) {
        newK1 = `$$__SHOCKWALLET__USER__${LNURLdata.shockPubKey}`;
      }
      const samePeer = e => {
        const localUri = `${e.pub_key}@${e.address}`;
        return localUri === uri;
      };
      const { peers } = await fetchPeers()(dispatch);
      if (!peers.find(samePeer)) {
        const [publicKey, host] = uri.split("@");
        await connectPeer({ publicKey, host });
      }

      const { data: node } = await Http.get("/healthz");
      const nodeId = node.identity_pubkey;
      const priv = privateChannel ? 1 : 0;
      const completeUrl = `${callback}?k1=${newK1}&remoteid=${nodeId}&private=${priv}`;
      const res = await fetch(completeUrl);
      const json = await res.json();
      if (json.status === "OK") {
        setDone("Channel request sent correctly");
      } else {
        setError(json.reason);
      }
    } catch (e) {
      setError(e.message || e);
    }
  }, [LNURLdata, setError, dispatch, privateChannel]);
  const confirmPayReq = useCallback(async () => {
    try {
      const { callback } = LNURLdata;
      const completeUrl = `${callback}?amount=${payAmount * 1000}`;
      console.log(completeUrl);
      const res = await fetch(completeUrl);
      const json = await res.json();
      if (json.status === "ERROR") {
        setError(json.reason);
        return;
      }
      history.push("/send", {
        data: { type: "ln", request: json.pr }
      });
    } catch (e) {
      setError(e.message || e);
    }
  }, [history, LNURLdata, payAmount, setError]);

  const toRender = useMemo(() => {
    if (LNURLdata === null) {
      return null;
    }
    switch (LNURLdata.tag) {
      case "channelRequest": {
        console.log("this url is a channel request");
        return (
          <div>
            <h2>LNURL Channel Request</h2>
            <p>
              Requesting channel from:{LNURLdata.uri || "ADDRESS NOT FOUND"}
            </p>
            <input
              type="checkbox"
              name="privateChannel"
              checked={privateChannel}
              onChange={onInputChange}
            />
            <button onClick={confirmChannelReq}>CONNECT</button>
          </div>
        );
      }
      case "withdrawRequest": {
        console.log("this url is a withdrawal request");
        return (
          <div>
            <h2>LNURL Channel Request</h2>
            <p>
              <strong>Max</strong>Withdrawable:{" "}
              <strong>{LNURLdata.maxWithdrawable / 1000}</strong> Satoshi
            </p>
            <input
              type="number"
              value={withdrawAmount}
              name="withdrawAmount"
              onChange={onInputChange}
            />
            <input
              type="checkbox"
              name="hasMemo"
              checked={hasMemo}
              onChange={onInputChange}
            />
            {hasMemo && (
              <input
                type="text"
                value={memo}
                name="memo"
                placeholder="memo"
                onChange={onInputChange}
              />
            )}
            <button onClick={confirmWithdrawReq}>RECEIVE</button>
          </div>
        );
      }
      case "hostedChannelRequest": {
        console.log("this url is a hosted channel request");
        return (
          <div>
            <h2>LNURL Hosted Channel Request</h2>
            <p>This Request is not supported</p>
            <button onClick={goBack}>BACK</button>
          </div>
        );
      }
      case "login": {
        console.log("this url is a login ");
        return (
          <div>
            <h2>LNURL Auth Request</h2>
            <p>This Request is not supported</p>
            <button onClick={goBack}>BACK</button>
          </div>
        );
      }
      case "payRequest": {
        console.log("this url is a pay request");
        return (
          <div>
            <h2>LNURL Pay Request</h2>
            <p>
              <strong>Min</strong>Sendable:{" "}
              <strong>{LNURLdata.minSendable / 1000}</strong> Satoshi
            </p>
            <p>
              <strong>Max</strong>Sendable:{" "}
              <strong>{LNURLdata.maxSendable / 1000}</strong> Satoshi
            </p>
            <input
              type="number"
              value={payAmount}
              name="payAmount"
              onChange={onInputChange}
            />
            <button onClick={confirmPayReq}>SEND</button>
          </div>
        );
      }
      default: {
        console.log("unknown tag");
        return (
          <div>
            <h2>LNURL Unknown Request</h2>
            <button onClick={goBack}>BACK</button>
          </div>
        );
      }
    }
  }, [
    LNURLdata,
    privateChannel,
    withdrawAmount,
    hasMemo,
    memo,
    payAmount,
    onInputChange,
    goBack,
    confirmChannelReq,
    confirmPayReq,
    confirmWithdrawReq
  ]);
  const scanErr = useCallback(
    (e: Error) => {
      setError(e.message || e);
    },
    [setError]
  );
  if (scanQR) {
    return (
      <div>
        <QRCodeScanner
          mode="invoice"
          onClose={closeQR}
          onError={scanErr}
          onScan={scanDone}
        />
      </div>
    );
  }
  return (
    <div className="publish-content-form-container m-1">
      {loading ? <Loader overlay fullScreen text="" /> : null}
      <DialogNav drawerVisible={false} pageTitle="PUBLISH CONTENT" />
      <div>{toRender}</div>
    </div>
  );
};

export default memo(QRScanner);
