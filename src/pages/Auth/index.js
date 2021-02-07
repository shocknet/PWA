import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { connectHost } from "../../actions/NodeActions";
import { setAuthenticated, setAuthStep } from "../../actions/AuthActions";
import DialogPageContainer from "../../common/DialogPageContainer";
import HostStep from "./components/HostStep";
import UnlockStep from "./components/UnlockStep";
import CreateAliasStep from "./components/CreateAliasStep";
import LogoSection from "./components/LogoSection";
import "./css/index.css";
import { connectSocket } from "../../utils/WebSocket";
import Http from "../../utils/Http";

const AuthPage = () => {
  const dispatch = useDispatch();
  const [, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authTokenExpirationDate = useSelector(
    ({ node }) => node.authTokenExpirationDate
  );
  const cachedHostIP = useSelector(({ node }) => node.hostIP);
  const authToken = useSelector(({ node }) => node.authToken);
  const authStep = useSelector(({ auth }) => auth.authStep);

  const renderStep = useCallback(() => {
    const commonProps = {
      error,
      setError
    };

    if (authStep === "host") {
      return <HostStep {...commonProps} />;
    }

    if (authStep === "unlockWallet" || authStep === "gunAuth") {
      return <UnlockStep {...commonProps} />;
    }

    if (authStep === "createWallet") {
      return <CreateAliasStep {...commonProps} />;
    }

    return null;
  }, [error, authStep]);

  const loadCachedNode = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading cached node IP");

      if (cachedHostIP) {
        const nodeHealth = await connectHost(cachedHostIP, false)(dispatch);
        console.log("Node Health:", nodeHealth);
        console.log(
          "Checking Cached node info:",
          cachedHostIP,
          authToken,
          DateTime.fromSeconds(authTokenExpirationDate).diffNow().milliseconds
        );
      }

      if (
        cachedHostIP &&
        authToken &&
        DateTime.fromSeconds(authTokenExpirationDate).diffNow().milliseconds > 0
      ) {
        const { data: authenticated } = await Http.get(`/api/gun/auth`);
        setAuthStep("unlockWallet");
        dispatch(setAuthenticated(authenticated.data));
        connectSocket(cachedHostIP);
        return;
      }

      if (cachedHostIP && authToken) {
        setAuthStep("unlockWallet");
        setLoading(false);
      }
    } catch (err) {
      setError(
        "Unable to connect to cached Node IP, make sure ShockAPI is up and running on your machine"
      );
      setLoading(false);
    }
  }, [cachedHostIP, dispatch, authToken, authTokenExpirationDate]);

  useEffect(() => {
    loadCachedNode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DialogPageContainer disableNav contentClassName="auth-page-content">
      <LogoSection />
      {renderStep()}
    </DialogPageContainer>
  );
};

export default AuthPage;
