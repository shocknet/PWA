import { useEffect, useMemo, useState } from "react";
import produce from "immer";
import { useDispatch } from "react-redux";

import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "../../actions/UserProfilesActions";

import ContentHostInputView, { IHost } from "./components/ContentHostInputView";

const ContentHostInput = () => {
  const dispatch = useDispatch();
  const [hosts, setHosts] = useState<IHost[]>([
    {
      URI: "",
      dateAdded: Date.now() - 1000 * 3600 * 2,
      error: "",
      isBeingAddedOrDeleted: false,
      isDefault: true,
      price: 1000,
      publicKey:
        "qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg"
    }
  ]);

  const subbedUsers = useMemo<string[]>(() => [], []);

  useEffect(() => {
    hosts
      .filter(h => !!h.publicKey)
      .map(h => h.publicKey)
      .filter(publicKey => !subbedUsers.includes(publicKey))
      .forEach(publicKey => {
        dispatch(subscribeUserProfile(publicKey));
      });

    return () => {
      subbedUsers.forEach(publicKey => {
        dispatch(unsubscribeUserProfile(publicKey));
      });
    };
  }, [hosts, dispatch, subbedUsers]);

  return (
    <ContentHostInputView
      hosts={hosts}
      onAddHost={publicKeyOrURI => {
        setHosts(
          produce(existingHosts => {
            const isURI = publicKeyOrURI.toLowerCase().startsWith("http");
            existingHosts.push({
              URI: isURI ? publicKeyOrURI : "",
              dateAdded: Date.now(),
              error: "",
              isBeingAddedOrDeleted: true,
              isDefault: false,
              price: Math.round(Math.random() * 1000),
              publicKey: isURI ? "" : publicKeyOrURI
            });
          })
        );

        setTimeout(() => {
          setHosts(
            produce(existingHosts => {
              if (Math.random() > 0.5) {
                existingHosts[
                  existingHosts.length - 1
                ].isBeingAddedOrDeleted = false;
              } else {
                existingHosts[existingHosts.length - 1].error =
                  "Could not reach server";
              }
            })
          );
        }, 1000);
      }}
      onRemoveHost={publicKeyOrURI => {
        setHosts(
          produce(existingHosts => {
            const idx = existingHosts.findIndex(
              h => h.URI === publicKeyOrURI || h.publicKey === publicKeyOrURI
            );

            existingHosts.splice(idx, 1);
          })
        );
      }}
      onRetryHost={publicKeyOrURI => {
        setHosts(
          produce(existingHosts => {
            const idx = existingHosts.findIndex(
              h => h.URI === publicKeyOrURI || h.publicKey === publicKeyOrURI
            );

            existingHosts[idx].isBeingAddedOrDeleted = true;
            existingHosts[idx].error = "";
          })
        );

        setTimeout(() => {
          setHosts(
            produce(existingHosts => {
              const idx = existingHosts.findIndex(
                h => h.URI === publicKeyOrURI || h.publicKey === publicKeyOrURI
              );

              existingHosts[idx].isBeingAddedOrDeleted = false;
              existingHosts[idx].error =
                Math.random() > 0.5 ? "" : "Lorem ipsum dolor";
            })
          );
        }, 1000);
      }}
    />
  );
};

export default ContentHostInput;
