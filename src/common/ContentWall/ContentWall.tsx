import React from "react";
import produce from "immer";
import { useHistory } from "react-router-dom";

import { rifle } from "../../utils/WebSocket";
import * as Schema from "../../schema";
import * as Utils from "../../utils";
import Image from "../../common/Post/components/Image";

import "./css/ContentWall.scoped.css";

export interface ContentWallProps {
  publicKey: string;
}

const ContentWall: React.FC<ContentWallProps> = ({ publicKey }) => {
  const history = useHistory();
  const [content, setContent] = React.useState<
    Record<string, Schema.PublicContentItem>
  >({});
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const subscription = rifle({
      query: `${publicKey}::publishedContentPublic::map.on`,
      onError(e) {
        setError(JSON.stringify(e, null, 4));
      },
      onData(item, key) {
        setContent(
          produce(draft => {
            if (Schema.isPublicContentItem(item)) {
              draft[key] = item;
            } else {
              Utils.logger.warn(
                `Invalid/incomplete public published content found for public key ...${publicKey.slice(
                  -8
                )}, might be due to pending replication or was deleted if null: ${JSON.stringify(
                  item,
                  null,
                  4
                )}`
              );
            }
          })
        );
      }
    });

    return () => {
      subscription.then(sub => sub.off());
    };
  }, [publicKey]);

  const orderedContent = React.useMemo(() => {
    return Object.values(content).sort((a, b) => {
      return b.timestamp - a.timestamp;
    });
  }, [content]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {orderedContent.map((item, i) => {
        return (
          <div
            className="item"
            key={item.id}
            onClick={() => {
              history.push(`/item/${item.author}/${item.id}`);
            }}
          >
            {item.type === "image/embedded" && (
              <div style={MEDIA_STYLE}>
                <Image
                  disableZoom
                  hideRibbon
                  id={item.id}
                  index={i}
                  item={item}
                  postId={null}
                  tipCounter={null}
                  tipValue={null}
                  style={MEDIA_STYLE}
                />
              </div>
            )}

            {item.type === "video/embedded" && (
              <div className="video-placeholder" style={MEDIA_STYLE}>
                <i className="fas fa-video video-icon" />
              </div>
            )}

            <div className="title-and-description">
              <h2 className="title">{item.title}</h2>

              <p className="description">{item.description || " "}</p>

              <span className="timestamp">
                {Utils.formatTimestamp(item.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

const MAX_MEDIA_LONG_EDGE = 100;

const MEDIA_STYLE: React.CSSProperties = {
  height: MAX_MEDIA_LONG_EDGE,
  width: MAX_MEDIA_LONG_EDGE,
  objectFit: "contain"
};

export default ContentWall;
