import React from "react";
import produce from "immer";

import { rifle } from "../../utils/WebSocket";
import * as Schema from "../../schema";
import * as Utils from "../../utils";

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
            <img alt={item.description} width="44%" />

            <div>
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              {/* timestamp here later */}
            </div>

            <i className="fas fa-ellipsis-v" />
          </div>
        );
      })}
    </>
  );
};

export default ContentWall;
