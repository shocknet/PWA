// @ts-check
import React, { Suspense, useEffect, useRef } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { batch, useDispatch } from "react-redux";
import JWTDecode from "jwt-decode";
import videojs from "video.js";
import FullHeight from "react-div-100vh";
import uniq from "lodash/uniq";

import { setAuthenticated } from "./actions/AuthActions";
import { loadReceivedRequests, loadSentRequests } from "./actions/ChatActions";
import Loader from "./common/Loader";
import Drawer from "./common/Drawer";
import "./styles/App.css";
import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "./actions/UserProfilesActions";
import * as FeedActions from "./actions/FeedActions";
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
const GoLivePage = React.lazy(() => import("./pages/Profile/GoLive/GoLive"));
const OtherUserPage = React.lazy(() => import("./pages/OtherUser"));
const Story = React.lazy(() => import("./pages/Story"));
const Stories = React.lazy(() => import("./pages/Stories"));
const QRScannerPage = React.lazy(() => import("./pages/QRScanner"));

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
  const contacts = Store.useSelector(({ chat }) => chat.contacts);
  const sentRequests = Store.useSelector(({ chat }) => chat.sentRequests);
  const receivedRequests = Store.useSelector(
    ({ chat }) => chat.receivedRequests
  );
  const followedPublicKeys = Store.useSelector(Store.selectFollows).map(
    f => f.user
  );

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
    if (authenticated) {
      dispatch(loadSentRequests());
      dispatch(loadReceivedRequests());
      dispatch(subscribeUserProfile(publicKey));
      dispatch(FeedActions.subscribeUserPosts(publicKey));
      dispatch(FeedActions.subscribeSharedUserPosts(publicKey));
    } else {
      dispatch(unsubscribeUserProfile(publicKey));
      dispatch(FeedActions.unsubUserPosts(publicKey));
      dispatch(FeedActions.unsubUserSharedPosts(publicKey));
    }

    return () => {
      dispatch(unsubscribeUserProfile(publicKey));
      dispatch(FeedActions.unsubUserPosts(publicKey));
      dispatch(FeedActions.unsubUserSharedPosts(publicKey));
    };
  }, [authenticated, dispatch, publicKey]);

  // Keep this effect separate from the one above, as having both together
  // causes an infinite loop due to implicit/explicit dependencies.
  const subbedUsers = useRef(/** @type {string[]} */ ([]));
  useEffect(() => {
    const unsub = () => {
      const { current: currentlySubbedUsers } = subbedUsers;

      batch(() => {
        currentlySubbedUsers.forEach(pk => {
          dispatch(unsubscribeUserProfile(pk));
        });
      });

      currentlySubbedUsers.splice(0, currentlySubbedUsers.length);
    };

    if (authenticated) {
      const contactPKs = contacts.map(c => c.pk);
      const sentReqsPKs = sentRequests.map(r => r.pk);
      const receivedReqsPKs = receivedRequests.map(r => r.pk);

      const publicKeysToSub = uniq(
        /** @type {string[]} */ ([
          ...contactPKs,
          ...sentReqsPKs,
          ...receivedReqsPKs
        ])
      ).filter(pk => !subbedUsers.current.includes(pk));

      publicKeysToSub.forEach(pk => {
        subbedUsers.current.push(pk);
      });

      batch(() => {
        publicKeysToSub.forEach(pk => {
          dispatch(subscribeUserProfile(pk));
        });
      });
    } else {
      unsub();
    }

    return unsub;
  }, [
    authenticated,
    dispatch,
    publicKey,
    contacts,
    sentRequests,
    receivedRequests
  ]);

  useEffect(() => {
    if (authenticated) {
      dispatch(FeedActions.subscribeFollows());
    } else {
      dispatch(FeedActions.unsubscribeFollows());
    }

    return () => {
      dispatch(FeedActions.unsubscribeFollows());
    };
  }, [authenticated, dispatch]);

  const subbedFollowedKeysRef = useRef(/** @type {string[]} */ ([]));

  useEffect(() => {
    const unsub = () => {
      const { current: currentlySubbedFollowedKeys } = subbedFollowedKeysRef;

      batch(() => {
        currentlySubbedFollowedKeys.forEach(pk => {
          dispatch(unsubscribeUserProfile(pk));
          dispatch(FeedActions.unsubUserPosts(pk));
          dispatch(FeedActions.unsubUserSharedPosts(pk));
        });
      });
      currentlySubbedFollowedKeys.splice(0, currentlySubbedFollowedKeys.length);
    };

    if (authenticated) {
      const { current: currentlySubbedFollowedKeys } = subbedFollowedKeysRef;
      const publicKeysToSub = followedPublicKeys.filter(
        pk => !currentlySubbedFollowedKeys.includes(pk)
      );

      batch(() => {
        publicKeysToSub.forEach(pk => {
          dispatch(subscribeUserProfile(pk));
          dispatch(FeedActions.subscribeUserPosts(pk));
          dispatch(FeedActions.subscribeSharedUserPosts(pk));
        });
      });

      subbedFollowedKeysRef.current.push(...followedPublicKeys);
    } else {
      unsub();
    }

    return unsub;
  }, [followedPublicKeys, authenticated, dispatch]);

  return (
    <FullHeight className="ShockWallet">
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
          <PrivateRoute
            path="/offerService"
            exact
            component={offerServicePage}
          />
          <PrivateRoute path="/QRScanner" exact component={QRScannerPage} />
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
    </FullHeight>
  );
};

export default App;
