import Http from "axios";

Http.interceptors.request.use(async config => {
  try {
    console.log("Loading Store...", Date.now());
    const { store } = await import("../store");
    console.log("Loaded Store!", Date.now());
    const { authToken, hostIP } = store.getState().node;
    const sanitizedBaseURL = config.url
      ?.replace(/(http(s)?:\/\/)/gi, "")
      .split("/")[0];

    if (config.url.indexOf("/") === 0) {
      config.headers.common.Authorization = `Bearer ${authToken}`;
    }

    return config;
  } catch (error) {
    console.error(error);
  }
});

Http.interceptors.response.use(async response => {
  return response;
});

export default Http;
