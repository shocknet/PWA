import GunDB from "gun/gun";
import { isCrawler } from "./Prerender";
import "gun/sea";
import "gun/lib/load";

interface GunPath {
  path: string;
  root: string;
}

interface GunDBQuery {
  query: string;
  retryDelay?: number;
  retryLimit?: number;
  retryCondition?: (data: any) => boolean;
  // Private arguments for recursive retries
  _retryCount?: number;
  _fallbackResult?: any;
}

const safeParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const peersConfig = safeParse(process.env.PEERS);

const peers = peersConfig
  ? peersConfig
  : ["https://gun.shock.network/gun", "https://gun-eu.shock.network/gun"];

const wait = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

const randomString = (length: number) => {
  let randomString = "";
  const randomChar = function () {
    const n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  };
  while (randomString.length < length) randomString += randomChar();
  return randomString;
};

const filterGunProps = ([key, item]) => item && key !== "_" && key !== "#";

const isIncompleteGunResponse = (data: any) => {
  try {
    console.log("Incomplete Gun Response Check:", typeof data, data);
    if (data === null || data === undefined) {
      return true;
    }

    if (Array.isArray(data)) {
      if (!data.length) {
        return true;
      }

      const incompleteCollection = data.reduce((empty, item) => {
        if (empty) {
          return empty;
        }

        return isIncompleteGunResponse(item);
      });

      return incompleteCollection;
    }

    if (typeof data === "object") {
      if (!data || typeof data.err === "number") {
        return true;
      }

      const stringifiedData = JSON.stringify(data);
      console.log(data, stringifiedData);

      if (stringifiedData === "{}") {
        return true;
      }

      const filteredGunProps = Object.entries(data).filter(filterGunProps);

      console.log(filteredGunProps, filteredGunProps?.length);

      if (!filteredGunProps?.length) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.warn("An error has occurred:", err);
    return true;
  }
};

const getNode = (root: string) => {
  if (root === "$gun") {
    return Gun;
  }

  return gunUser(root);
};

const parseGunPath = ({ path, root }: GunPath) => {
  const gunPointer = getNode(root);
  const GunContext = path
    .split(">")
    .reduce((gun, path) => gun.get(path), gunPointer);
  return GunContext;
};

export const Gun = GunDB({ axe: false, peers: peers });

export const fetchPath = ({
  query,
  retryDelay = 500,
  retryLimit = 3,
  retryCondition = isIncompleteGunResponse,
  // Private arguments for recursive retries
  _retryCount = 0,
  _fallbackResult = null
}: GunDBQuery) =>
  new Promise(resolve => {
    const parsedRetryLimit = isCrawler() ? 1 : retryLimit;
    const parsedRetryDelay = isCrawler() ? 200 : retryDelay;
    const [root, path, method] = query.split("::");

    if (_retryCount > parsedRetryLimit) {
      resolve(_fallbackResult);
      return;
    }

    if (_retryCount > 0) {
      console.log(
        "Retrying event:",
        path,
        `${_retryCount}/${parsedRetryLimit}`
      );
    }

    const GunContext = parseGunPath({ path, root });
    GunContext[method](async event => {
      console.log(path + " Response:", event);
      if (retryCondition && retryCondition(event)) {
        await wait(parsedRetryDelay);
        const retryResult = await fetchPath({
          query,
          retryDelay: parsedRetryDelay,
          retryLimit: parsedRetryLimit,
          retryCondition,

          _retryCount: _retryCount + 1,
          _fallbackResult: event
        });
        resolve(retryResult);
        return;
      }

      resolve(event);
    });
  });

// Wraps GunDB data callbacks to provide better error handling
export const wrap = callback => event => {
  console.log("Event received!", event);
  if (event?.err) {
    console.error("[GunDB] Event error:", event?.err, event);
  }

  if (!event?.put) {
    console.warn("[GunDB] Item not found:", event?.put, event);
  }

  return callback(
    event,
    event.err || !event.put
      ? {
          field: !event.put ? "key" : "unknown",
          message: event.err
            ? event.err
            : !event.put
            ? "Key not found"
            : "Unknown",
          gunErr: event.err
        }
      : null
  );
};

export const putPath = ({ query = "", data = {} }) =>
  new Promise((resolve, reject) => {
    const [root, path] = query.split("::");
    const GunContext = parseGunPath({ path, root });
    GunContext.put(
      // @ts-ignore
      data,
      wrap((event, err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(event);
      })
    );
  });

export const setPath = ({ query = "", data = {} }) =>
  new Promise((resolve, reject) => {
    const [root, path] = query.split("::");
    const GunContext = parseGunPath({ path, root });
    const response = GunContext.set(data, event => {
      console.log(data);
      resolve(response);
    });
  });

export const listenPath = ({ query = "", callback }) => {
  const [root, path, method] = query.split("::");
  const GunContext = parseGunPath({ path, root });

  if (method === "open") {
    return GunContext.open(callback);
  }

  if (method === "map.on") {
    return GunContext.map().on(callback);
  }

  if (method === "map.once") {
    return GunContext.map().once(callback);
  }

  return GunContext.on(callback);
};

export const createRandomGunUser = () =>
  new Promise((resolve, reject) => {
    const randomAlias = randomString(10);
    const randomPass = randomString(10);
    Gun.user().create(randomAlias, randomPass, event => {
      if ("err" in event) {
        console.error("An error has occurred while initializing a new user");
        reject({
          field: "gundb",
          message: "An error has occurred while initializing a new user",
          _error: event.err,
          _event: event
        });
        return;
      }
      resolve({ ...event, alias: randomAlias, pass: randomPass });
    });
  });

export const authUser = (alias: string, pass: string) =>
  new Promise(resolve => {
    Gun.user().auth(alias, pass, user => {
      resolve(user);
    });
  });

export const gunUser = (publicKey: string) => {
  console.log("Getting Gun User:", publicKey);
  if (!publicKey) {
    throw new Error("Undefined public key");
  }
  return Gun.user(publicKey);
};

// Magic number provided from GunDB docs
export const DEFAULT_ONCE_WAIT_MS = 99;

export const $$_SHOCKWALLET__ENCRYPTED__ = "$$_SHOCKWALLET__ENCRYPTED__";

export const $$__SHOCKWALLET__MSG__ = "$$__SHOCKWALLET__MSG__";
