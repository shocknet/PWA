import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import * as Store from "../../store";
import { subscribeUserProfile } from "../../actions/UserProfilesActions";

import ContentHostInputView, { IHost } from "./components/ContentHostInputView";
import { Http } from "../../utils";
import { setSeedInfo, setSeedProviderPub } from "../../actions/ContentActions";
import * as Utils from "../../utils";

const ContentHostInput = () => {
  const dispatch = useDispatch();
  const seedProviderPub = Store.useSelector(
    ({ content }) => content.seedProviderPub
  );
  const userProfiles = Store.useSelector(({ userProfiles }) => userProfiles);
  const { seedUrl, seedToken } = Store.useSelector(
    ({ content }) => content.seedInfo
  );
  const [hosts, setHosts] = useState<IHost[]>([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [providedService, setProvidedService] = useState("");
  const [priceToUpdate, setPriceToUpdate] = useState(0);
  const [providerError, setProviderError] = useState("");
  //effect for user profile
  useEffect(() => {
    const provProfile = userProfiles[seedProviderPub];
    if (!provProfile) {
      setProviderProfile(null);
      return;
    }
    if (!providerProfile) {
      setProviderProfile(provProfile);
      return;
    }
    if (provProfile.avatar !== providerProfile.avatar) {
      setProviderProfile(provProfile);
      return;
    }
    if (
      // @ts-expect-error
      provProfile.offerSeedService !== providerProfile.offerSeedService
    ) {
      setProviderProfile(provProfile);
      return;
    }
  }, [userProfiles, seedProviderPub, providerProfile, setProviderProfile]);
  //effect to check provided service
  useEffect(() => {
    if (!providerProfile) {
      return;
    }
    const { offerSeedService } = providerProfile;
    if (offerSeedService !== providedService) {
      setProvidedService(offerSeedService);
    }
  }, [providerProfile, providedService, setProvidedService]);
  //effect to populate the hosts
  useEffect(() => {
    let toSet: IHost[] = [];
    if (seedUrl && seedToken) {
      toSet.push({
        URI: seedUrl,
        token: seedToken,
        price: 0,
        isBeingAddedOrDeleted: false,
        dateAdded: Date.now(),
        isDefault: true,
        error: null,
        publicKey: null
      });
    }
    if (seedProviderPub && providerProfile) {
      toSet.push({
        dateAdded: Date.now(),
        isBeingAddedOrDeleted: true,
        isDefault: true,
        publicKey: seedProviderPub,
        price: 0,
        URI: null,
        token: null,
        error: null
      });
    }
    setHosts(toSet);
  }, [seedUrl, seedToken, seedProviderPub, providerProfile, setHosts]);
  //effect to fetch provided service
  useEffect(() => {
    if (!providedService) {
      return;
    }
    Http.get(
      `/api/gun/otheruser/${seedProviderPub}/once/offeredServices>${providedService}>servicePrice`
    )
      .then(({ data }) => {
        setPriceToUpdate(data.data);
      })
      .catch(e => {
        setProviderError(e);
      });
  }, [providedService, seedProviderPub, setPriceToUpdate, setProviderError]);
  //effect to update service
  useEffect(() => {
    const tmpHosts = [...hosts];
    const providerIndex = tmpHosts.findIndex(host => !host.URI);
    if (
      providerIndex === -1 ||
      tmpHosts[providerIndex].price === priceToUpdate
    ) {
      return;
    }
    tmpHosts[providerIndex].isBeingAddedOrDeleted = false;
    tmpHosts[providerIndex].price = priceToUpdate;
    setHosts(tmpHosts);
  }, [priceToUpdate, setPriceToUpdate, hosts, setHosts]);
  //effect to update error
  useEffect(() => {
    //@ts-expect-error
    const err = providerError.message || providerError;
    const tmpHosts = [...hosts];
    const providerIndex = tmpHosts.findIndex(host => !host.URI);
    if (providerIndex === -1 || err === tmpHosts[providerIndex].error) {
      return;
    }
    tmpHosts[providerIndex].isBeingAddedOrDeleted = false;
    tmpHosts[providerIndex].error = err;
    setHosts(tmpHosts);
  }, [providerError, setProviderError, hosts, setHosts]);

  const addHost = useCallback(
    (publicKeyOrURI: string, token?: string) => {
      try {
        if (publicKeyOrURI.startsWith("http")) {
          setSeedInfo(publicKeyOrURI, token!)(dispatch);
        } else {
          setSeedProviderPub(publicKeyOrURI)(dispatch);
        }
      } catch (e) {
        alert(`Could not add host: ${e.message}`);
        Utils.logger.error("Could not add host: ", e);
      }
    },
    [dispatch]
  );

  const removeHost = useCallback(
    (publicKeyOrURI: string) => {
      try {
        if (publicKeyOrURI.startsWith("http")) {
          setSeedInfo("", "")(dispatch);
        } else {
          setSeedProviderPub("")(dispatch);
        }
      } catch (e) {
        alert(`Could not remove host: ${e.message}`);
        Utils.logger.error("Could not remove host: ", e);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const unsubscribe = (dispatch(
      subscribeUserProfile(seedProviderPub)
    ) as unknown) as () => void;

    return unsubscribe;
  }, [seedProviderPub, dispatch]);
  const filteredHosts = useMemo(() => {
    return hosts.filter(h => h);
  }, [hosts]);
  return (
    <ContentHostInputView
      hosts={filteredHosts}
      onAddHost={addHost}
      onRemoveHost={removeHost}
      onRetryHost={() => {}}
    />
  );
};

export default ContentHostInput;
