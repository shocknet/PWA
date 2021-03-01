import React, { Suspense, useEffect } from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import JWTDecode from "jwt-decode";
import { setAuthenticated } from "./actions/AuthActions";
import { loadReceivedRequests, loadSentRequests } from "./actions/ChatActions";
import Loader from "./common/Loader";
import Drawer from "./common/Drawer";
import "./styles/App.css";

const OverviewPage = React.lazy(() => import("./pages/Overview"));
const AdvancedPage = React.lazy(() => import("./pages/Advanced"));
const MessagesPage = React.lazy(() => import("./pages/Messages"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const ChatPage = React.lazy(() => import("./pages/Chat"));
const SendPage = React.lazy(() => import("./pages/Send"));
const RequestPage = React.lazy(() => import("./pages/Request"));
const AuthPage = React.lazy(() => import("./pages/Auth"));
const MoonPayPage = React.lazy(() => import("./pages/MoonPay"));


const PrivateRoute = ({ component, ...options }) => {
  const authenticated = useSelector(({ auth }) => auth.authenticated);
  const authorizedComponent = authenticated ? component : AuthPage;

  return <Route {...options} component={authorizedComponent} />;
};

const App = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(({ node }) => node.authToken);
  const authenticated = useSelector(({ auth }) => auth.authenticated);

  useEffect(() => {
    if (!authToken) {
      dispatch(setAuthenticated(false));
      return;
    }

    const decodedToken = JWTDecode(authToken);
    const tokenExpired = decodedToken.exp * 1000 < Date.now();
    setAuthenticated(tokenExpired);
  }, [authToken, dispatch]);

  useEffect(() => {
    if (authenticated && dispatch) {
      dispatch(loadSentRequests());
      dispatch(loadReceivedRequests());
    }
  }, [authenticated, dispatch]);

  return (
    <>
      <div className="ShockWallet">
        <Drawer />
        <Suspense fallback={<Loader fullScreen text={null} />}>
          <Switch>
            <Route path="/auth" exact component={AuthPage} />
            <PrivateRoute path="/overview" exact component={OverviewPage} />
            <PrivateRoute path="/advanced" exact component={AdvancedPage} />
            <PrivateRoute path="/chat" exact component={MessagesPage} />
            <PrivateRoute path="/chat/:publicKey" component={ChatPage} />
            <PrivateRoute path="/send" exact component={SendPage} />
            <PrivateRoute path="/request" exact component={RequestPage} />
            <PrivateRoute path="/profile" exact component={ProfilePage} />
            <PrivateRoute path="/moonpay" exact component={MoonPayPage} />
            <Redirect to="/overview" />
          </Switch>
        </Suspense>
      </div>
    </>
  );
};

export default withRouter(App);
