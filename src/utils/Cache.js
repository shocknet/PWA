import FileCache from "browser-file-storage";

export const DB_NAME = "ShockWalletStore";

export const init = () =>
  new Promise((resolve, reject) => {
    FileCache.init(DB_NAME)
      .then(() => {
        console.log("File cache initialized!");
        return FileCache.persist();
      })
      .then(status => {
        if (status.persistent) {
          resolve(status);
        } else {
          reject(status);
        }
      });
  });

export const getCachedFile = async fileName => {
  try {
    if (!FileCache._init) {
      await init();
    }

    const cachedFile = await FileCache.load(fileName);
    return cachedFile.createURL();
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const renderCachedFile = (fileURL, selector) => {
  const elements = document.querySelectorAll(selector);
  if (elements && elements.length) {
    elements.forEach(element => {
      element.src = fileURL;
      element.muted = true;
      element.autoplay = true;
    });
  }
  return !!elements && !!elements.length;
};

export const saveFile = (fileName, buffer) => {
  return FileCache.save(fileName, buffer);
};
