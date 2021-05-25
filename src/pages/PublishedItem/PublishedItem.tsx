import React from "react";
import { useParams } from "react-router-dom";

import * as Schema from "../../schema";
import * as Utils from "../../utils";
import DarkPage from "../../common/DarkPage";
import { rifle } from "../../utils/WebSocket";

export interface PublishedItemPageProps {
  id: string;
}

const PublishedItemPage: React.FC<PublishedItemPageProps> = () => {
  const { id, publicKey } = useParams<{ id: string; publicKey: string }>();
  const [item, setItem] = React.useState<Schema.PublicContentItem | null>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
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
  }, [id, publicKey]);

  if (!item) {
    return <DarkPage pageTitle="Loading..." />;
  }

  return (
    <DarkPage>
      <h1>{item.title}</h1>

      <p>{publicKey}</p>
    </DarkPage>
  );
};

export default PublishedItemPage;
