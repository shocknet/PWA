import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "qrcode.react";
import { Link, useParams } from "react-router-dom";
import { GUN_PROPS } from "../../utils/Gun";
import Http from "../../utils/Http";
import { processDisplayName } from "../../utils/String";

import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "../../actions/UserProfilesActions";
import {
  rifle,
  rifleSocketExists,
  disconnectRifleSocket
} from "../../utils/WebSocket";

import BottomBar from "../../common/BottomBar";
import AddBtn from "../../common/AddBtn";
import Modal from "../../common/Modal";
import Loader from "../../common/Loader";

import ClipboardIcon from "../../images/clipboard.svg";
import QRCodeIcon from "../../images/qrcode.svg";
import "./css/index.css";
import SendTipModal from "../Feed/components/SendTipModal";
import UnlockModal from "../Feed/components/UnlockModal";
import BuyServiceModal from "../Feed/components/BuyServiceModal";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const OtherUserPage = () => {
  const dispatch = useDispatch();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  //@ts-expect-error
  const hostIP = useSelector(({ node }) => node.hostIP);
  //@ts-expect-error
  const follows = useSelector(({ feed }) => feed.follows);
  //@ts-expect-error
  const userProfiles = useSelector(({ userProfiles }) => userProfiles);
  const { publicKey: userPublicKey } = useParams<{ publicKey: string }>();
  const [userPosts,setUserPosts] = useState([])
  const [userSharedPosts,setUserSharedPosts] = useState([])
  const [finalPosts,setFinalPosts] = useState([])
  const [userServices,setUserServices] = useState({})
  const [tipModalData, setTipModalOpen] = useState(null);
  const [unlockModalData, setUnlockModalOpen] = useState(null);
  const [buyServiceModalData, setBuyServiceModalOpen] = useState(null);
  const [selectedView,setSelectedView] = useState("posts")
  //effect for user profile
  useEffect(() => {
    dispatch(subscribeUserProfile(userPublicKey));
    return () => {
      dispatch(unsubscribeUserProfile(userPublicKey));
    };
  }, [userPublicKey]);
  //effect for user posts
  useEffect(() => {
    const query = `${userPublicKey}::posts::on`;
    const socketExists = rifleSocketExists(query);
    const subscription = rifle({
      host: hostIP,
      query,
      publicKey: "",
      reconnect: false
    });
    subscription.on("$shock", async posts => {
      console.log(posts);
      const postEntries = Object.entries(posts);
      const newPosts = postEntries
        .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
        .map(([key]) => key);

      const proms = newPosts.map(async id => {
        const { data: post } = await Http.get(
          `/api/gun/otheruser/${userPublicKey}/load/posts>${id}`
        )
        return {...post.data,id,authorId:userPublicKey}
      })
      const postsAlmostReady = await Promise.allSettled(proms)
      //@ts-expect-error
      const postsReady = postsAlmostReady.filter(maybeok => maybeok.status === "fulfilled").map(res => res.value)
      console.log(postsReady)
      setUserPosts(postsReady)
    });
    if (!socketExists) {
      return () => {
        disconnectRifleSocket(query)
      }
    }
  },[userPublicKey])
  //effect for shared posts
  useEffect(() => {
    const query = `${userPublicKey}::sharedPosts::on`;
    const socketExists = rifleSocketExists(query);
    const subscription = rifle({
      host: hostIP,
      query,
      publicKey: "",
      reconnect: false
    });
    subscription.on("$shock", async posts => {
      console.log(posts);
      const postEntries = Object.entries(posts);
      const newPosts = postEntries
        .filter(([key, value]) => value !== null && !GUN_PROPS.includes(key))
        .map(([key]) => key);

      const proms = newPosts.map(async id => {
        const { data: shared } = await Http.get(
          `/api/gun/otheruser/${userPublicKey}/load/sharedPosts>${id}`
        );
        const { data: post } = await Http.get(
          `/api/gun/otheruser/${shared.data.originalAuthor}/load/posts>${id}`
        );
        return {
          ...shared.data,
          originalPost: { ...post.data, id },
          authorId: userPublicKey,
          type: "shared"
        };
      });
      const postsAlmostReady = await Promise.allSettled(proms);
      console.log(postsAlmostReady);
      const postsReady = postsAlmostReady
        .filter(maybeok => maybeok.status === "fulfilled")
        // @ts-expect-error
        .map(res => res.value);
      console.log(postsReady);
      setUserSharedPosts(postsReady);
      if (!socketExists) {
        return () => {
          disconnectRifleSocket(query);
        };
      }
    });
  }, [userPublicKey]);
  //effect for merge posts and shared posts
  useEffect(()=>{
    const final = [...userPosts,...userSharedPosts].sort((a, b) => b.date - a.date);
    setFinalPosts(final)
    const unSubProfiles = userSharedPosts.filter(post => !userProfiles[post.originalAuthor]).map(post => {
      const pub = post.originalAuthor
      dispatch(subscribeUserProfile(pub))
      return ()=>{
        dispatch(unsubscribeUserProfile(pub))
      }
    })
    return ()=>{
      unSubProfiles.forEach(unSub => unSub())
    }

  },[userPosts,userSharedPosts])
  //effect for services
  useEffect(()=>{
    Http.get(
      `/api/gun/otheruser/${userPublicKey}/load/offeredServices`
    ).then(({data}) =>{
      console.log("SERVICES")
      console.log(data)
      setUserServices(data.data)
    })
  },[userPublicKey])
  const userProfile = userProfiles[userPublicKey]
  console.log(userProfile)
  const avatar =userProfile?.avatar && `data:image/png;base64,${userProfile?.avatar}`

  const processedDisplayName = useMemo(
    () => processDisplayName(userPublicKey, userProfile?.displayName),
    [userPublicKey, userProfile]
  );
  const toggleModal = useCallback(() => {
    setProfileModalOpen(!profileModalOpen);
  }, [profileModalOpen]);

  const toggleTipModal = useCallback(
    tipData => {
      console.log(tipData);
      if (tipModalData || !tipData) {
        setTipModalOpen(null);
      }

      setTipModalOpen(tipData);
    },
    [tipModalData]
  );
  const toggleBuyServiceModal = useCallback(
    buyData => {
      console.log(buyData)
      if (buyServiceModalData || !buyData) {
        setBuyServiceModalOpen(null);
      }

      setBuyServiceModalOpen(buyData);
    },
    [buyServiceModalData]
  );
  const toggleUnlockModal = useCallback(
    unlockData => {
      console.log(unlockData);
      if (unlockModalData || !unlockData) {
        setUnlockModalOpen(null);
      }

      setUnlockModalOpen(unlockData);
    },
    [unlockModalData]
  );

  const copyClipboard = useCallback(() => {
    navigator.clipboard.writeText(userPublicKey);
  }, [userPublicKey]);
  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case 'selectedView':{
        setSelectedView(value)
        return
      }
      default:
        return;
    }
  },[setSelectedView])
  const renderPosts = () => {
    return finalPosts.map((post,index) => {
      const profile = userProfiles[post.authorId];
      if (post.type === "shared") {
        const originalPublicKey = post.originalAuthor;
        const originalProfile = userProfiles[originalPublicKey];
        return (
          <Suspense fallback={<Loader />} key={index}>
            <SharedPost
              originalPost={post.originalPost}
              originalPostProfile={originalProfile}
              sharedTimestamp={post.shareDate}
              sharerProfile={profile}
              postPublicKey={originalPublicKey}
              openTipModal={toggleTipModal}
              openUnlockModal={toggleUnlockModal}
              // TODO: User online status handling
              isOnlineNode
            />
          </Suspense>
        );
      }

      return (
        <Suspense fallback={<Loader />}  key={index}>
          <Post
            id={post.id}
            timestamp={post.date}
            contentItems={post.contentItems}
            avatar={`data:image/png;base64,${profile?.avatar}`}
            username={processDisplayName(
              profile?.user,
              profile?.displayName
            )}
            publicKey={post.authorId}
            openTipModal={toggleTipModal}
            openUnlockModal={toggleUnlockModal}
            tipCounter={0}
            tipValue={0}
            // TODO: User online status handling
            isOnlineNode
          />
        </Suspense>
      );
    })
  }
  const renderServices =()=>{
    console.log(userServices)
    return Object.entries(userServices).filter(([id,service]) => !!service).map(([id,service]) => {
      const buyCB = () => {
        //@ts-expect-error
        setBuyServiceModalOpen({...service,serviceID:id,owner:userPublicKey})
      }
      return <div className="post">
        <strong>Service ID</strong><p>{id}</p>
        {/*@ts-expect-error*/ }
        <strong>Service Tpe</strong><p>{service.serviceType}</p>
        {/*@ts-expect-error*/ }
        <strong>Service Title</strong><p>{service.serviceTitle}</p>
        {/*@ts-expect-error*/ }
        <strong>Service Description</strong><p>{service.serviceDescription}</p>
        {/*@ts-expect-error*/ }
        <strong>Service Condition</strong><p>{service.serviceCondition}</p>
        {/*@ts-expect-error*/ }
        <strong>Service Price</strong><p>{service.servicePrice}</p>
        <button onClick={buyCB}>BUY SERVICE</button>
      </div>
    })
  }
  return (
    <div className="page-container profile-page">
      <div className="profile-container">
        <div className="profile-cover" />
        <div className="profile-info-container">
          <div
            className="profile-avatar"
            style={{ backgroundImage: `url(${avatar})` }}
          />
          <div className="profile-info">
            <p className="profile-name">{processedDisplayName}</p>
            <p className="profile-desc">{userProfile?.bio || ""}</p>
          </div>
        </div>
        <div className="">
        <select value={selectedView} name="selectedView" onChange={onInputChange}>
            <option value="posts" >POSTS</option>
            <option value="services" >SERVICES</option>
          </select>
        {selectedView === "posts" && renderPosts()}
        {selectedView === "services" && renderServices()}
      </div>
        <Modal
          toggleModal={toggleModal}
          modalOpen={profileModalOpen}
          contentStyle={{
            padding: "40px 30px"
          }}
        >
          <QRCode
            bgColor="#23282d"
            fgColor="#4285b9"
            value={userPublicKey}
            size={180}
            className="profile-qrcode"
          />
          <p className="profile-qrcode-desc">Scan this code to contact me</p>
          <div className="profile-clipboard-container" onClick={copyClipboard}>
            <img
              src={ClipboardIcon}
              className="profile-clipboard-icon"
              alt=""
            />
            <p className="profile-clipboard-text">Tap to copy to clipboard</p>
          </div>
        </Modal>
        <SendTipModal tipData={tipModalData} toggleOpen={toggleTipModal} />
        <UnlockModal unlockData={unlockModalData} toggleOpen={toggleUnlockModal} />
        <BuyServiceModal service={buyServiceModalData} toggleOpen={toggleBuyServiceModal}/>
        
        <AddBtn
          onClick={toggleModal}
          large
          iconURL={QRCodeIcon}
          style={{ backgroundColor: "var(--yellow)" }}
          icon={null}
          label={null}
        />
      </div>

      <BottomBar />
    </div>
  );
};

export default OtherUserPage;
