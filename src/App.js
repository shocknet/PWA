// @ts-check
import React, { Suspense, useEffect } from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import JWTDecode from "jwt-decode";
import videojs from "video.js";
import { setAuthenticated } from "./actions/AuthActions";
import { loadReceivedRequests, loadSentRequests } from "./actions/ChatActions";
import Loader from "./common/Loader";
import Drawer from "./common/Drawer";
import "./styles/App.css";
import { subscribeUserProfile } from "./actions/UserProfilesActions";
import * as Store from "./store";

const OverviewPage = React.lazy(() => import("./pages/Overview"));
const AdvancedPage = React.lazy(() => import("./pages/Advanced"));
const MessagesPage = React.lazy(() => import("./pages/Messages"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const ChatPage = React.lazy(() => import("./pages/Chat"));
const SendPage = React.lazy(() => import("./pages/Send"));
const RequestPage = React.lazy(() => import("./pages/Request"));
const AuthPage = React.lazy(() => import("./pages/Auth"));
const FeedPage = React.lazy(() => import("./pages/Feed"));
const MoonPayPage = React.lazy(() => import("./pages/MoonPay"));
const PublishContentPage = React.lazy(() =>
  import("./pages/Profile/publishContent")
);
const offerServicePage = React.lazy(() =>
  import("./pages/Profile/offerService")
);
const createPostPage = React.lazy(() => import("./pages/Profile/createPost"));
const GoLivePage = React.lazy(() => import("./pages/Profile/goLive"));
const OtherUserPage = React.lazy(() => import("./pages/OtherUser"));
const Story = React.lazy(() => import("./pages/Story"));
const Stories = React.lazy(() => import("./pages/Stories"));

const PrivateRoute = ({ component, ...options }) => {
  const authenticated = Store.useSelector(({ auth }) => auth.authenticated);
  const authorizedComponent = authenticated ? component : AuthPage;

  return <Route {...options} component={authorizedComponent} />;
};

const App = () => {
  const dispatch = useDispatch();
  const authToken = Store.useSelector(({ node }) => node.authToken);
  const authenticated = Store.useSelector(({ auth }) => auth.authenticated);
  const publicKey = Store.useSelector(Store.selectSelfPublicKey);

  useEffect(() => {
    videojs.addLanguage("en", {
      "The media could not be loaded, either because the server or network failed or because the format is not supported.":
        "Stream Not Available"
    });
  }, []);

  useEffect(() => {
    if (!authToken) {
      dispatch(setAuthenticated(false));
      return;
    }

    const decodedToken = JWTDecode(authToken);
    // @ts-expect-error
    const tokenExpired = decodedToken.exp * 1000 < Date.now();
    setAuthenticated(tokenExpired);
  }, [authToken, dispatch]);

  useEffect(() => {
    if (authenticated && dispatch) {
      dispatch(loadSentRequests());
      dispatch(loadReceivedRequests());
      dispatch(subscribeUserProfile(publicKey));
    }
  }, [authenticated, dispatch, publicKey]);

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
            <PrivateRoute
              path="/publishContent"
              exact
              component={PublishContentPage}
            />
            <PrivateRoute path="/feed" exact component={FeedPage} />
            <PrivateRoute path="/moonpay" exact component={MoonPayPage} />
            <PrivateRoute path="/createPost" exact component={createPostPage} />
            <PrivateRoute path="/goLive" exact component={GoLivePage} />
            <PrivateRoute path="/offerService" exact component={offerServicePage} />
            <PrivateRoute
              path="/otherUser/:publicKey"
              exact
              component={OtherUserPage}
            />
            <Route path="/story" exact component={Story} />
            <Route path="/stories" exact component={Stories} />
            <Redirect to="/overview" />
          </Switch>
        </Suspense>
      </div>
    </>
  );
};

export default withRouter(App);
