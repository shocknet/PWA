import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { connectSocket } from "../../utils/WebSocket";
import Http from "../../utils/Http";
import { connectHost } from "../../actions/NodeActions";
import { setAuthenticated, setAuthStep } from "../../actions/AuthActions";
import DialogPageContainer from "../../common/DialogPageContainer";
import HostStep from "./components/HostStep";
import UnlockStep from "./components/UnlockStep";
import CreateAliasStep from "./components/CreateAliasStep";
import LogoSection from "./components/LogoSection";
import ChoicesStep from "./components/ChoicesStep";
import InviteStep from "./components/InviteStep";
import ScanStep from "./components/ScanStep";
import "./css/index.css";

const AuthPage = () => {
  const dispatch = useDispatch();
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const authTokenExpirationDate = useSelector(
    ({ node }) => node.authTokenExpirationDate
  );
  const cachedHostIP = useSelector(({ node }) => node.hostIP);
  const authToken = useSelector(({ node }) => node.authToken);
  const authStep = useSelector(({ auth }) => auth.authStep);
  const authMethod = useSelector(({ auth }) => auth.authMethod);

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
      return <CreateAliasStep />;
    }

    return <ChoicesStep />;
  }, [authStep, authMethod]);

  const loadCachedNode = useCallback(async () => {
    try {
      if (cachedHostIP) {
        setLoading(true);
        console.log("Loading cached node IP");

        await connectHost(cachedHostIP, false)(dispatch);

        if (
          authToken &&
          DateTime.fromSeconds(authTokenExpirationDate).diffNow().milliseconds >
            0
        ) {
          const { data: authenticated } = await Http.get(`/api/gun/auth`);
          setAuthStep("unlockWallet");
          dispatch(setAuthenticated(authenticated.data));
          connectSocket(cachedHostIP);
          return;
        }

        if (authToken) {
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
    <DialogPageContainer disableNav contentClassName="auth-page-content">
      <LogoSection />
      {currentStep}
    </DialogPageContainer>
  );
};

export default AuthPage;
