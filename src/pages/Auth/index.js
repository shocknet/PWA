import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import Http from "../../utils/Http";
import { connectHost } from "../../actions/NodeActions";
import { setAuthenticated, setAuthStep } from "../../actions/AuthActions";
import DialogPageContainer from "../../common/DialogPageContainer";
import HostStep from "./components/HostStep";
import UnlockStep from "./components/UnlockStep";
import CreateWalletStep from "./components/CreateWalletStep";
import LogoSection from "./components/LogoSection";
import ChoicesStep from "./components/ChoicesStep";
import InviteStep from "./components/InviteStep";
import ScanStep from "./components/ScanStep";
import "./css/index.css";

const AuthPage = () => {
  const dispatch = useDispatch();
  const cachedHostIP = useSelector(({ node }) => node.hostIP);
  const [loading, setLoading] = useState(!!cachedHostIP);
  const [error, setError] = useState(null);
  const authTokenExpirationDate = useSelector(
    ({ node }) => node.authTokenExpirationDate
  );
  const authToken = useSelector(({ node }) => node.authToken);
  const authStep = useSelector(({ auth }) => auth.authStep);
  const authMethod = useSelector(({ auth }) => auth.authMethod);

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

    if (authStep === "unlockWallet" || authStep === "gunAuth") {
      return <UnlockStep />;
    }

    if (authStep === "createWallet") {
      return <CreateWalletStep />;
    }

    return <ChoicesStep />;
  }, [authStep, authMethod]);

  const loadCachedNode = useCallback(async () => {
    try {
      if (cachedHostIP) {
        console.log("Loading cached node IP");

        const connected = !!(await connectHost(cachedHostIP, false)(dispatch));

        if (connected) {
          setLoading(false);
        }

        if (
          authToken &&
          DateTime.fromSeconds(authTokenExpirationDate).diffNow().milliseconds >
            0
        ) {
          setLoading(true);
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
          setLoading(true);
          setAuthStep("unlockWallet");
          setLoading(false);
        }
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
  }, [loadCachedNode]);

  return (
    <DialogPageContainer
      disableNav
      contentClassName="auth-page-content"
      onBack={handleBackOnError}
      showBackBtn={!!error}
    >
      <LogoSection />
      {loading && <span>Loading...</span>}

      {error && <span>There was an error: {error}</span>}

      {!loading && !error && currentStep}
    </DialogPageContainer>
  );
};

export default AuthPage;
