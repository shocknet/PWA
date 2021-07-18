import React from "react";
import { useParams } from "react-router-dom";

import * as Schema from "../../schema";
import * as Utils from "../../utils";
import * as Store from "../../store";
import DarkPage from "../../common/DarkPage";
import Pad from "../../common/Pad";
import Image from "../../common/Post/components/Image";
import ShockAvatar from "../../common/ShockAvatar";
import { rifle } from "../../utils/WebSocket";
import { subscribeUserProfile } from "../../actions/UserProfilesActions";

import "./css/PublicContentItemPage.scoped.css";

export interface PublicContentItemPageProps {
  id: string;
}

const PublicContentItemPage: React.FC<PublicContentItemPageProps> = () => {
  const dispatch = Store.useDispatch();
  const { id, publicKey } = useParams<{ id: string; publicKey: string }>();
  const [item, setItem] = React.useState<Schema.PublicContentItem | null>(null);
  const [error, setError] = React.useState<string>("");

  const author = Store.useSelector(Store.selectUser(publicKey));

  React.useEffect(() => dispatch(subscribeUserProfile(publicKey)));

  React.useEffect(() => {
    if (error) {
      return () => {};
    }
    const subscription = rifle({
      query: `${publicKey}::publishedContentPublic>${id}::on`,
      onError(e) {
        setError(JSON.stringify(e, null, 4));
      },
      onData(data) {
        if (Schema.isPublicContentItem(data)) {
          setItem(data);
        } else {
          Utils.logger.warn(
            `Invalid/incomplete public published content found for public key ...${publicKey.slice(
              -8
            )}, might be due to pending replication or was deleted if null: ${JSON.stringify(
              data,
              null,
              4
            )}`
          );
        }
      }
    });

    return () => {
      subscription.then(sub => sub.off());
    };
  }, [error, id, publicKey]);

  const onRetry = React.useCallback(() => {
    setError("");
  }, []);

  if (error) {
    return (
      <DarkPage pageTitle="Error" justify="center">
        <span>{error}</span>

        <Pad amt={32} />

        <button className="submit-btn retry-btn" onClick={onRetry}>
          Retry
        </button>
      </DarkPage>
    );
  }

  if (!item) {
    return <DarkPage pageTitle="Loading..." />;
  }

  return (
    <DarkPage scrolls>
      <h1>{item.title}</h1>

      {item.type === "image/embedded" && <Image item={item} />}

      {item.type === "video/embedded" && (
        <video
          className="public-content-item-video"
          controls
          src={decodeURIComponent(item.magnetURI.replace(/.*(ws=)/gi, ""))}
        />
      )}

      <div className="info">
        <div className="user-info">
          <ShockAvatar height={48} publicKey={publicKey} />

          <Pad amt={12} insideRow />

          <span>{author.displayName}</span>
        </div>

        <span>{Utils.formatTimestamp(item.timestamp)}</span>
      </div>

      <p className="description">{item.description}</p>

      <Pad amt={160} />
    </DarkPage>
  );
};

export default PublicContentItemPage;
