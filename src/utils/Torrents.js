import WebTorrent from "webtorrent";
import { getCachedFile, renderCachedFile, saveFile } from "./Cache";
import { runSerial } from "./Promise";

const supportedFileTypes = {
  "video/embedded": {
    formats: ["mp4", "webm"],
    element: "video",
    options: {
      autoplay: true,
      muted: true
    }
  },
  "image/embedded": {
    formats: ["jpg", "png", "webp", "jpeg", "gif"],
    element: "img",
    options: {}
  }
};

const _getFileType = file => {
  const extension = file.name?.split(".")?.slice(-1)[0];
  const supportedFileType = Object.entries(
    supportedFileTypes
  ).filter(([type, options]) => options.formats.includes(extension))[0];

  if (supportedFileType) {
    const [name, fileType] = supportedFileType;
    return {
      name,
      ...fileType
    };
  }

  return null;
};

export const webTorrentClient = new WebTorrent();

export const attachMedia = (
  posts = [],
  torrentMode = true,
  allowDuplicates = false
) => {
  const torrentTasks = posts
    .map(post => {
      const { contentItems, id } = post;
      return Object.entries(contentItems ?? {})
        .filter(([key, item]) => supportedFileTypes[item.type])
        .map(([key, item]) => () =>
          new Promise(resolve => {
            const torrentExists = webTorrentClient.get(item.magnetURI);

            if (torrentExists && !allowDuplicates) {
              resolve(true);
              return;
            }

            webTorrentClient.add(item.magnetURI, async torrent => {
              // Proceed to the next torrent in queue
              resolve(true);

              const files = torrent.files.filter(file => {
                const extension = file.name?.split(".")?.slice(-1)[0];
                const supportedFileType = Object.entries(
                  supportedFileTypes
                ).filter(([type, options]) =>
                  options.formats.includes(extension)
                )[0];
                if (supportedFileType) {
                  const [, fileType] = supportedFileType;
                  const matched = fileType.formats.includes(extension);
                  return matched;
                }
                return false;
              });

              files.map(async file => {
                const fileType = _getFileType(file);

                if (!fileType) {
                  return;
                }

                const fileName = `${id}-${key}-${file.name}`;

                const element = fileType.element;
                const target = `${element}[data-torrent="${item.magnetURI}"]`;
                const cachedFile = await getCachedFile(fileName);

                if (cachedFile) {
                  const torrent = webTorrentClient.get(item.magnetURI);

                  if (torrent) {
                    torrent.destroy();
                  }

                  renderCachedFile(cachedFile, target);
                  return;
                }

                const torrentElements = document.querySelectorAll(target);
                torrentElements.forEach(torrentElement => {
                  const contentURL = decodeURIComponent(
                    item.magnetURI.replace(/.*(ws=)/gi, "")
                  );
                  const [compatibleURL] = fileType.formats.filter(format =>
                    contentURL
                      .toLowerCase()
                      .endsWith(`.${format.toLowerCase()}`)
                  );
                  const elementSrc = torrentElement.getAttribute("src");

                  if ((torrentMode || !compatibleURL) && !elementSrc) {
                    file.renderTo(torrentElement, fileType.options);
                    return;
                  }

                  torrentElement.setAttribute("src", contentURL);
                });
              });

              torrent.on("done", () => {
                files.map(file => {
                  const fileType = _getFileType(file);
                  const fileName = `${id}-${key}-${file.name}`;
                  const element = fileType.element;
                  const target = `${element}[data-torrent="${item.magnetURI}"]`;

                  file.getBlob(async (err, blob) => {
                    if (err) {
                      console.warn(err);
                      return;
                    }

                    await saveFile(fileName, blob);
                    const element = document.querySelector(target);
                    if (
                      element?.dataset.played === "false" &&
                      !element?.getAttribute("src")
                    ) {
                      const cachedFile = await getCachedFile(fileName);
                      renderCachedFile(cachedFile, target);
                    }
                  });

                  return file;
                });
              });
            });
          })
        );
    })
    .reduce((torrents, contentItems) => [...torrents, ...contentItems], []);

  runSerial(torrentTasks);
};
