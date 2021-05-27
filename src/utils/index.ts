import * as Common from "shock-common";
import { useCallback, useState } from "react";

import { Contact, ReceivedRequest, SentRequest } from "../schema";

export * from "./Date";
export { default as Http } from "./Http";
export * from "./Error";

export const logger = {
  log: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  debug: (...args: any[]) => console.debug(...args)
};

export interface File {
  size: number;
  type: string;
}

/**
 * Max limit in API 's http config.
 */
export const LARGEST_RES_SIZE = 102400;

/**
 * @returns Image in jpeg format, in a data url presentation (base64).
 */
export const resizeImage = (
  img: HTMLImageElement,
  desiredLongEdge: number,
  compression: number
) => {
  const canvas = document.createElement("canvas");
  let { width, height } = img;

  if (width > height) {
    if (width > desiredLongEdge) {
      //height *= max_width / width;
      height = Math.round((height *= desiredLongEdge / width));
      width = desiredLongEdge;
    }
  } /* height > width */ else {
    if (height > desiredLongEdge) {
      width = Math.round((width *= desiredLongEdge / height));
      height = desiredLongEdge;
    }
  }

  canvas.width = width;
  canvas.height = height;

  canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", compression);
};

/**
 * @returns Image in jpeg format, in a data url presentation (base64).
 */
export const processImageFile = async (
  file: File,
  desiredLongEdge: number,
  compression: number
) => {
  // based on https://github.com/josefrichter/resize/blob/master/public/preprocess.js
  if (!file.type.startsWith("image/")) {
    throw new TypeError(
      `Got a file of type ${file.type} with size: ${file.size}, expected type to start with "image"`
    );
  }

  const imageBuffer = await Common.makePromise<ArrayBuffer>((res, rej) => {
    const reader = new FileReader();

    reader.onload = e => {
      if (e.target.result instanceof ArrayBuffer) {
        res(e.target.result);
      } else {
        rej(
          new TypeError(
            `Non ArrayBuffer file reader result when trying to load image file.`
          )
        );
      }
    };

    const onFail = (e: ProgressEvent<FileReader>) => {
      rej(
        new Error(
          `Error inside processImageFile()->imageBuffer->${JSON.stringify(e)}`
        )
      );
    };
    reader.onerror = onFail;
    reader.onabort = onFail;

    /// TODO: Why the need to cast and heck why does it even allow the cast?
    reader.readAsArrayBuffer(file as Blob);
  });

  const url = (window.URL ?? window.webkitURL).createObjectURL(
    new Blob([imageBuffer], { type: "image/jpeg" })
  );

  const image = await Common.makePromise<HTMLImageElement>((res, rej) => {
    const _image = new Image();
    _image.src = url;

    _image.onload = () => {
      res(_image);
    };

    _image.onerror = e => {
      if (typeof e === "string") {
        rej(new Error(e));
      } else {
        rej(new Error(JSON.stringify(e)));
      }
    };
  });

  const resizedImage = resizeImage(image, desiredLongEdge, compression);

  return resizedImage;
};

export const wait = (ms: number): Promise<void> =>
  new Promise<void>(r => {
    setTimeout(r, ms);
  });

export const retryOperation = <T>(
  operation: () => Promise<T>,
  delay: number,
  retries: number
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch(reason => {
        if (retries > 0) {
          return (
            wait(delay)
              .then(retryOperation.bind(null, operation, delay, retries - 1))
              // @ts-expect-error
              .then(resolve)
              .catch(reject)
          );
        }
        return reject(reason);
      });
  });

/**
 * Returns an empty string if the string provided is not a url.
 */
export const normalizeURL = (_url: string): string => {
  let url = _url;

  if (url.startsWith("www.")) {
    url = "https://" + url;
  }

  // https://stackoverflow.com/a/43467144
  const isURL = (() => {
    let __url: URL;

    try {
      __url = new URL(url);
    } catch (_) {
      return false;
    }

    return __url.protocol === "http:" || __url.protocol === "https:";
  })();

  if (isURL) {
    return new URL(url).href;
  }

  return "";
};

export const getContact = (
  contacts: Array<Contact | SentRequest | ReceivedRequest>,
  publicKey: string
) => contacts.filter(contact => contact.pk === publicKey)[0];

export const EMPTY_FN: (...args: any[]) => void = () => {};

export const useBooleanState = (initialState: boolean) => {
  const [state, setState] = useState<boolean>(initialState);
  const toggle = useCallback(() => {
    setState(_state => !_state);
  }, []);

  return [state, toggle] as const;
};

export const parseJson = (o: string) => JSON.parse(o) as unknown;

/**
 * Returns a base64-encoded URI.
 */
export const extractThumbnailFromVideo = async (file: File): Promise<string> =>
  new Promise(async res => {
    const fileReader = new FileReader();
    await new Promise(res2 => {
      fileReader.onload = res2;
      fileReader.readAsDataURL(file as Blob);
    });

    const blob = new Blob([fileReader.result], { type: file.type });
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");

    function snapImage() {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL();
      const success = image.length > 100000;
      if (success) {
        // const img = document.createElement("img");
        // img.src = image;
        // document.getElementsByTagName("div")[0].appendChild(img);
        URL.revokeObjectURL(url);
      }
      return image;
    }

    function timeupdate() {
      const maybeData = snapImage();
      if (maybeData) {
        video.removeEventListener("timeupdate", timeupdate);
        video.pause();
        res(maybeData);
      }
    }
    video.addEventListener("loadeddata", function () {
      const maybeData = snapImage();
      if (maybeData) {
        video.removeEventListener("timeupdate", timeupdate);
        res(maybeData);
      }
    });

    video.addEventListener("timeupdate", timeupdate);
    video.preload = "metadata";
    video.src = url;
    // Load video in Safari / IE11
    video.muted = true;
    video.playsInline = true;
    video.play();
  });
