// @ts-check
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import JWTDecode from "jwt-decode";
import videojs from "video.js";
import FullHeight from "react-div-100vh";
import { toast } from "react-toastify";

import { setAuthenticated } from "./actions/AuthActions";

import Loader from "./common/Loader";
import Drawer from "./common/Drawer";
import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "./actions/UserProfilesActions";
import * as Store from "./store";
import "./styles/App.global.css";
import Stream from "./common/Post/components/Stream";
import { dragElement } from "./utils/ui";
import * as Utils from "./utils";
import { Http } from "./utils";
import {
  addStream,
  removeStream,
  setSeedInfo,
  setSeedProviderPub
} from "./actions/ContentActions";
import { closeDialog } from "./actions/AppActions";

import { ToastContainer } from "react-toastify";

const OverviewPage = React.lazy(() => import("./pages/Overview"));
const AdvancedPage = React.lazy(() => import("./pages/Advanced"));
const WalletSettingsPage = React.lazy(() => import("./pages/WalletSettings"));
const MessagesPage = React.lazy(() => import("./pages/Messages"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const ChatPage = React.lazy(() => import("./pages/Chat"));
const SendPage = React.lazy(() => import("./pages/Send"));
const RequestPage = React.lazy(() => import("./pages/Request"));
const AuthPage = React.lazy(() => import("./pages/Auth"));
const FeedPage = React.lazy(() => import("./pages/Feed"));
const MoonPayPage = React.lazy(() => import("./pages/MoonPay"));
const PublishContentPage = React.lazy(() =>
  import("./pages/Profile/PublishContent")
);
const offerServicePage = React.lazy(() =>
  import("./pages/Profile/offerService")
);
const CreatePostPage = React.lazy(() => import("./pages/Profile/CreatePost"));
const GoLivePage = React.lazy(() => import("./pages/Profile/GoLive/GoLive"));
const OtherUserPage = React.lazy(() => import("./pages/OtherUser"));
const QRScannerPage = React.lazy(() => import("./pages/QRScanner"));
const BackupsPage = React.lazy(() => import("./pages/Backups"));
const PublicContentItemPage = React.lazy(() =>
  import("./pages/PublicContentItem")
);

const PrivateRoute = ({ component, ...options }) => {
  const authenticated = Store.useSelector(({ auth }) => auth.authenticated);
  const authorizedComponent = authenticated ? component : AuthPage;

  return <Route {...options} component={authorizedComponent} />;
};

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authToken = Store.useSelector(({ node }) => node.authToken);
  const authenticated = Store.useSelector(({ auth }) => auth.authenticated);
  const publicKey = Store.useSelector(Store.selectSelfPublicKey);
  const streamUrl = Store.useSelector(({ content }) => content.streamUrl);
  const streamStatusUrl = Store.useSelector(
    ({ content }) => content.streamStatusUrl
  );
  const streamContentId = Store.useSelector(
    ({ content }) => content.streamContentId
  );
  const streamPostId = Store.useSelector(({ content }) => content.streamPostId);
  const streamUserToken = Store.useSelector(
    ({ content }) => content.streamUserToken
  );
  const streamLiveToken = Store.useSelector(
    ({ content }) => content.streamLiveToken
  );
  const dialogText = Store.useSelector(({ app }) => app.dialogText);
  const dialogHasCallback = Store.useSelector(
    ({ app }) => app.dialogHasCallback
  );
  const [update, setUpdate] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);
  // effect to update live status
  useEffect(() => {
    if (!streamStatusUrl) {
      return;
    }
    let timeout;
    const interval = setInterval(async () => {
      try {
        const res = await Http.get(streamStatusUrl);
        if (!res.data.isLive) {
          return;
        }
        setIsLive(true);
        clearInterval(interval);
        timeout = setTimeout(() => {
          console.info("upp");
          setUpdate(Date.now());
        }, 5000);
      } catch (e) {}
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [streamStatusUrl, setIsLive, setUpdate]);
  const StreamRender = useMemo(() => {
    return (
      <Stream
        hideRibbon={true}
        item={{ magnetURI: streamUrl, liveStatus: "live" }}
        timeout={1500}
        id={undefined}
        index={undefined}
        postId={undefined}
        tipCounter={undefined}
        tipValue={undefined}
        width={undefined}
      />
    );
  }, [streamUrl, update]);

  const stopStream = useCallback(() => {
    Http.post("/api/stopStream", {
      postId: streamPostId,
      contentId: streamContentId,
      endUrl: `https://stream.shock.network/api/stream/end`,
      urlForMagnet: `https://stream.shock.network/api/stream/torrent/${streamUserToken}`,
      obsToken: streamLiveToken
    });
    removeStream()(dispatch);
    console.info(streamUserToken);
    history.push("/profile");
  }, [
    dispatch,
    history,
    streamContentId,
    streamLiveToken,
    streamPostId,
    streamUserToken
  ]);

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
      // Get current user's profile on login
      dispatch(subscribeUserProfile(publicKey));

      return () => {
        dispatch(unsubscribeUserProfile(publicKey));
      };
    }
  }, [authenticated, dispatch, publicKey]);

  useEffect(() => {
    const tmp = !!(authenticated && isLive && streamUrl);
    if (tmp !== showFloatingPlayer) {
      setShowFloatingPlayer(tmp);
    }
  }, [
    authenticated,
    isLive,
    streamUrl,
    showFloatingPlayer,
    setShowFloatingPlayer
  ]);
  useEffect(() => {
    if (showFloatingPlayer) {
      dragElement("floatyVideo");
    }
  }, [showFloatingPlayer]);

  //load info about content provider stored into gun
  const loadContentInfo = useCallback(async () => {
    try {
      const { data: serviceProvider } = await Http.get(
        `/api/gun/user/once/preferencesSeedServiceProvider`,
        {
          headers: {
            "public-key-for-decryption": publicKey
          }
        }
      );
      if (
        serviceProvider &&
        typeof serviceProvider.data === "string" &&
        serviceProvider.data !== ""
      ) {
        setSeedProviderPub(serviceProvider.data, true)(dispatch);
      }
    } catch (err) {
      const msg = Utils.extractErrorMessage(err);

      if (msg.startsWith("timeout of ") || msg === "TIMEOUT_ERR") {
        Utils.logger.warn(
          `Could not fetch seed service provider due to a timeout error, this can be expected if the data hasn't been populated yet.`
        );
      } else {
        toast.dark(
          `There was an error fetching your seed service provider: ${msg}`
        );
        Utils.logger.error(err);
      }
    }
    try {
      const { data: seedData } = await Http.get(
        `/api/gun/user/once/preferencesSeedServiceData`,
        {
          headers: {
            "public-key-for-decryption": publicKey
          }
        }
      );
      if (
        seedData &&
        typeof seedData.data === "string" &&
        seedData.data !== ""
      ) {
        const JObject = JSON.parse(seedData.data);
        if (JObject && JObject.seedUrl && JObject.seedToken) {
          setSeedInfo(JObject.seedUrl, JObject.seedToken, true)(dispatch);
        }
      }
    } catch (err) {
      const msg = Utils.extractErrorMessage(err);

      if (msg.startsWith("timeout of ") || msg === "TIMEOUT_ERR") {
        Utils.logger.warn(
          `Could not fetch seed service data due to a timeout error, this can be expected if the data hasn't been populated yet.`
        );
      } else {
        toast.dark(
          `There was an error fetching your seed service data: ${msg}`
        );
        Utils.logger.error(err);
      }
    }
  }, [dispatch, publicKey]);
  useEffect(() => {
    if (!authenticated) {
      return;
    }
    loadContentInfo();
  }, [authenticated, loadContentInfo]);

  //load info about current stream stored into gun
  const loadStreamInfo = useCallback(async () => {
    try {
      const { data: streamData } = await Http.get(
        `/api/gun/user/once/currentStreamInfo`,
        {
          headers: {
            "public-key-for-decryption": publicKey
          }
        }
      );
      if (
        streamData &&
        typeof streamData.data === "string" &&
        streamData.data !== ""
      ) {
        if (streamData.data === "NO DATA") {
          removeStream(true, true)(dispatch);
          return;
        }
        const JObject = JSON.parse(streamData.data);

        if (JObject) {
          addStream(JObject, true)(dispatch);
        }
      }
    } catch (err) {
      const msg = Utils.extractErrorMessage(err);

      if (msg.startsWith("timeout of ") || msg === "TIMEOUT_ERR") {
        Utils.logger.warn(
          `Could not fetch current stream info due to a timeout error, this can be expected if the data hasn't been populated yet.`
        );
      } else {
        toast.dark(
          `There was an error fetching your current stream info: ${msg}`
        );
        Utils.logger.error(err);
      }
    }
  }, [dispatch, publicKey]);
  useEffect(() => {
    if (!authenticated) {
      return;
    }
    loadStreamInfo();
  }, [authenticated, loadStreamInfo]);

  const DialogClose = useCallback(() => {
    closeDialog(false)(dispatch);
  }, [closeDialog, dispatch]);

  const ConfirmDialog = useCallback(() => {
    closeDialog(dialogHasCallback)(dispatch);
  }, [dialogHasCallback, closeDialog, dispatch]);
  return (
    <FullHeight className="root-container">
      {showFloatingPlayer && (
        <div id="floatyVideo" className="floaty-container">
          <i id="floatyVideoHeader" className="fas fa-grip-vertical"></i>
          {StreamRender}
          <button onClick={stopStream}>CLOSE STREAM</button>
        </div>
      )}
      {dialogText && (
        <div className="fixed-container">
          <div className="global-dialog">
            <p>{dialogText}</p>
            <div className="d-flex flex-justify-center w-80">
              {dialogHasCallback && (
                <button
                  className="shock-form-button m-t-1 w-50"
                  onClick={DialogClose}
                >
                  Cancel
                </button>
              )}
              {dialogHasCallback && <div style={{ width: "1rem" }}></div>}
              <button
                className="shock-form-button-confirm m-t-1 w-50"
                onClick={ConfirmDialog}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <Drawer />
      <Suspense fallback={<Loader fullScreen text={null} />}>
        <Switch>
          <Route path="/auth" exact component={AuthPage} />
          <PrivateRoute path="/overview" exact component={OverviewPage} />
          <PrivateRoute path="/advanced" exact component={AdvancedPage} />
          <PrivateRoute
            path="/walletSettings"
            exact
            component={WalletSettingsPage}
          />
          <PrivateRoute path="/chat" exact component={MessagesPage} />
          <PrivateRoute path="/chat/:convoOrReqID" component={ChatPage} />
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
          <PrivateRoute path="/createPost" exact component={CreatePostPage} />
          <PrivateRoute path="/goLive" exact component={GoLivePage} />
          <PrivateRoute
            path="/offerService"
            exact
            component={offerServicePage}
          />
          <PrivateRoute path="/QRScanner" exact component={QRScannerPage} />
          <PrivateRoute
            path="/otherUser/:publicKey/:selectedView?"
            exact
            component={OtherUserPage}
          />
          <PrivateRoute path="/Backups" exact component={BackupsPage} />

          <PrivateRoute
            path="/item/:publicKey/:id"
            exact
            component={PublicContentItemPage}
          />
          <Redirect to="/overview" />
        </Switch>
      </Suspense>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        closeButton={false}
      />
    </FullHeight>
  );
};

export default App;
