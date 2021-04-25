import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import * as Store from "../../store";
import {
  subscribeUserProfile,
  unsubscribeUserProfile
} from "../../actions/UserProfilesActions";

import ContentHostInputView, { IHost } from "./components/ContentHostInputView";
import { Http } from "../../utils";
import { setSeedInfo, setSeedProviderPub } from "../../actions/ContentActions";

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
      provProfile.SeedServiceProvided !== providerProfile.SeedServiceProvided
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
    const { SeedServiceProvided } = providerProfile;
    if (SeedServiceProvided !== providedService) {
      setProvidedService(SeedServiceProvided);
    }
  }, [providerProfile, providedService, setProvidedService]);
  //effect to populate the hosts
  useEffect(() => {
    let toSet = [];
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
      `/api/gun/otheruser/${seedProviderPub}/load/offeredServices>${providedService}`
    )
      .then(({ data }) => {
        const { data: service } = data;
        const tmpHosts = [...hosts];
        const providerIndex = tmpHosts.findIndex(host => !host.URI);
        if (providerIndex === -1) {
          return;
        }
        tmpHosts[providerIndex].isBeingAddedOrDeleted = false;
        tmpHosts[providerIndex].price = service.servicePrice;

        setHosts(tmpHosts);
      })
      .catch(e => {
        const tmpHosts = [...hosts];
        const providerIndex = tmpHosts.findIndex(host => !host.URI);
        tmpHosts[providerIndex].isBeingAddedOrDeleted = false;
        tmpHosts[providerIndex].error = e.message || e;
        setHosts(tmpHosts);
      });
  }, [providedService, hosts, setHosts, seedProviderPub]);
  const addHost = useCallback(
    (publicKeyOrURI, token) => {
      if (publicKeyOrURI.startsWith("http")) {
        setSeedInfo(publicKeyOrURI, token)(dispatch);
      } else {
        setSeedProviderPub(publicKeyOrURI)(dispatch);
      }
    },
    [dispatch]
  );

  const removeHost = useCallback(
    publicKeyOrURI => {
      if (publicKeyOrURI.startsWith("http")) {
        setSeedInfo("", "")(dispatch);
      } else {
        setSeedProviderPub("")(dispatch);
      }
    },
    [dispatch]
  );

  // @ts-ignore
  useEffect(() => {
    const unsubscribe = dispatch(subscribeUserProfile(seedProviderPub));

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
