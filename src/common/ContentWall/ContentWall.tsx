import React from "react";
import produce from "immer";

import { rifle } from "../../utils/WebSocket";
import * as Schema from "../../schema";
import * as Utils from "../../utils";
import Image from "../../common/Post/components/Image";

import "./css/ContentWall.scoped.css";

export interface ContentWallProps {
  publicKey: string;
}

const ContentWall: React.FC<ContentWallProps> = ({ publicKey }) => {
  const [content, setContent] = React.useState<
    Record<string, Schema.PublishedContent>
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
            if (Schema.isPublishedContent(item)) {
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
    return Object.entries(content).sort(([, a], [, b]) => {
      // TODO: timestamps
      return 0;
    });
  }, [content]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {orderedContent.map(([key, item], i) => {
        return (
          <div className="item" key={key}>
            {item.type === "image/embedded" && (
              <div className="image-container">
                <Image
                  disableZoom
                  hideRibbon
                  id={key}
                  index={i}
                  item={item}
                  postId={null}
                  tipCounter={null}
                  tipValue={null}
                  width={100}
                  // height={1000}
                />
              </div>
            )}

            {item.type === "video/embedded" && (
              <div className="video-container" style={VIDEO_PLACEHOLDER_STYLE}>
                <i className="fas fa-video video-icon" />
              </div>
            )}

            <div className="title-and-description">
              <h3 className="title">{item.title}</h3>

              <p className="description">{item.description || ""}</p>

              {/* timestamp here later */}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ContentWall;
