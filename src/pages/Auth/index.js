import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import Http from "../../utils/Http";
import { connectHost } from "../../actions/NodeActions";
import {
  logout,
  setAuthenticated,
  setAuthStep
} from "../../actions/AuthActions";
import DialogPageContainer from "../../common/DialogPageContainer";
import HostStep from "./components/HostStep";
import UnlockStep from "./components/UnlockStep";
import CreateWalletStep from "./components/CreateWalletStep";
import LogoSection from "./components/LogoSection";
import ChoicesStep from "./components/ChoicesStep";
import InviteStep from "./components/InviteStep";
import ScanStep from "./components/ScanStep";
import * as Store from "../../store";
import "./css/index.css";
import CreateAliasStep from "./components/CreateAliasStep";
import TiersStep from "./components/TiersStep";
import InputGroup from "../../common/InputGroup";
import { ParseNodeIP } from "../../utils/relay";
import { reloadFollows } from "../../actions/FeedActions";

const AuthPage = () => {
  const dispatch = useDispatch();
  const cachedHostIP = Store.useSelector(({ node }) => node.hostIP);
  const relayId = Store.useSelector(({ node }) => node.relayId);
  const cachedAlias = Store.useSelector(({ node }) => node.alias);
  const cachedRelayId = Store.useSelector(({ node }) => node.relayId);
  const [loading, setLoading] = useState(!!cachedHostIP);
  const [error, setError] = useState(null);
  const [retryHostIP, setRetryHostIP] = useState("");

  const authTokenExpirationDate = Store.useSelector(
    ({ node }) => node.authTokenExpirationDate
  );
  const authToken = Store.useSelector(({ node }) => node.authToken);
  const authStep = Store.useSelector(({ auth }) => auth.authStep);
  const authMethod = Store.useSelector(({ auth }) => auth.authMethod);

  // reset follows token present
  useEffect(() => {
    if (!authToken) {
      dispatch(
        reloadFollows([
          {
            // Lightning.Page
            user:
              "tcUUzRkyzXYhIZQbmopiCLREyZ_kQJqQ-C4XesecOm4.GX1Dv-eGcfKuOPobBK9Q-Sc-o697XgVCQzOCfqfimIo",
            status: "ok",
            private: false
          },
          {
            // Guy Swann
            user:
              "CDfURSDaABun7sbzxt1LvUrTrtgLza_3NrCKrmUWIYU.Ssr3U9JN6cpFI9BZLL-1HLM2vS0ECEt-H4iUXvhkGzU",
            status: "ok",
            private: false
          },
          {
            // JohnOnChain
            user:
              "Fd_7lUhwH7JoHbg6UKnGO9rYsZBOuR1KSbpZz8-Sbcw.fUu68TPuBWl83LBKgAbuiy0r1hMqnUevzyEgqPYu0B4",
            status: "ok",
            private: false
          }
        ])
      );
    }
  }, [authToken, dispatch]);

  const updateRetryHostIP = useCallback(
    e => {
      setRetryHostIP(e.target.value);
    },
    [setRetryHostIP]
  );

  useEffect(() => {
    const cleanHostIP = !cachedHostIP
      ? ""
      : cachedHostIP.replace("https://", "").replace("http://", "");
    const setTo = relayId ? `${relayId}@${cleanHostIP}` : cachedHostIP;
    setRetryHostIP(setTo);
  }, [relayId, cachedHostIP, setRetryHostIP]);

  const handleBackOnError = useCallback(() => {
    setError(null);
    dispatch(setAuthStep("host"));
  }, [setError, dispatch]);

  const currentStep = useMemo(() => {
    if (authMethod === "manual") {
      if (authStep === "host") {
        return <HostStep />;
      }
    }

    if (authMethod === "shockWizard") {
      if (authStep === "scan") {
        return <ScanStep />;
      }
    }

    if (authMethod === "shockCloud") {
      if (authStep === "inviteCode") {
        return <InviteStep />;
      }
    }

    if (authMethod === "hostingTiers") {
      if (authStep === "chooseTier") {
        return <TiersStep />;
      }
    }

    if (authStep === "unlockWallet" || authStep === "gunAuth") {
      return <UnlockStep />;
    }

    if (authStep === "createWallet") {
      return <CreateWalletStep />;
    }

    if (authStep === "createGun") {
      return <CreateAliasStep />;
    }

    return <ChoicesStep />;
  }, [authStep, authMethod]);

  const loadCachedNode = useCallback(
    async (hostIPParam, relayIdParam) => {
      setError(null);
      const hostIP = hostIPParam || cachedHostIP;
      try {
        if (hostIP) {
          setLoading(true);
          console.log("Loading cached node IP");
          await connectHost(
            hostIP,
            false,
            relayIdParam || cachedRelayId
          )(dispatch);

          if (
            authToken &&
            DateTime.fromSeconds(authTokenExpirationDate).diffNow()
              .milliseconds > 0
          ) {
            const { data: authenticated } = await Http.get(`/api/gun/auth`);
            if (!authenticated.data) {
              const { data: walletStatus } = await Http.get(
                `/api/lnd/wallet/status`
              );
              console.log(walletStatus);
            }
            setAuthStep("unlockWallet");
            setLoading(false);
            dispatch(setAuthenticated(authenticated.data));
            return;
          }

          if (authToken) {
            setAuthStep("unlockWallet");
            setLoading(false);
          }

          setLoading(false);
        }
      } catch (err) {
        setError(
          "Unable to connect to cached Node IP, make sure ShockAPI is up and running on your machine"
        );
        setLoading(false);
      }
    },
    [cachedHostIP, cachedRelayId, dispatch, authToken, authTokenExpirationDate]
  );

  useEffect(() => {
    loadCachedNode();
  }, [loadCachedNode]);
  const retry = useCallback(() => {
    const [parsed, relay] = ParseNodeIP(retryHostIP);
    loadCachedNode(parsed, relay);
  }, [retryHostIP, loadCachedNode]);
  const clearCache = useCallback(() => {
    dispatch(logout());
    handleBackOnError();
  }, [dispatch, handleBackOnError]);
  return (
    <DialogPageContainer
      disableNav
      contentClassName="auth-page-content"
      onBack={handleBackOnError}
      showBackBtn={!!error}
      renderCommitHash={authStep === null || authStep === "host"}
    >
      <LogoSection />
      {loading && <span>Loading...</span>}
      {error && <span>There was an error: {error}</span>}
      {error && (
        <div className="error-info-container">
          <div className="p-1">
            {/*@ts-expect-error*/}
            <InputGroup
              label="Cached node Url"
              value={retryHostIP}
              onChange={updateRetryHostIP}
            />
          </div>
          <div className="p-1">
            {/*@ts-expect-error*/}
            <InputGroup label="Cached alias" value={cachedAlias} />
          </div>
          <button className="p-1 btn-primary" onClick={retry}>
            RETRY
          </button>
          <button className="p-1 m-t-1 btn-secondary" onClick={clearCache}>
            CLEAR
          </button>
        </div>
      )}

      {!loading && !error && currentStep}
    </DialogPageContainer>
  );
};

export default AuthPage;
