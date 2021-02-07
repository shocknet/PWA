const USER_ALGORITHM = "RSA-OAEP";
const USER_HASH = "SHA-256";
const USER_KEY_ARGS = {
  name: USER_ALGORITHM,
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: USER_HASH
};

const AES_ALGORITHM = "AES-CBC";

const arrayBufferToBase64String = arrayBuffer => {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = "";
  for (const byte in byteArray) {
    byteString += String.fromCharCode(byte);
  }
  return btoa(byteString);
};

const convertBinaryToPem = (binaryData, label) => {
  const base64Cert = arrayBufferToBase64String(binaryData);
  let pemCert = "-----BEGIN " + label + "-----\r\n";
  let nextIndex = 0;
  while (nextIndex < base64Cert.length) {
    if (nextIndex + 64 <= base64Cert.length) {
      pemCert += base64Cert.substr(nextIndex, 64) + "\r\n";
    } else {
      pemCert += base64Cert.substr(nextIndex) + "\r\n";
    }
    nextIndex += 64;
  }
  pemCert += "-----END " + label + "-----\r\n";
  return pemCert;
};

const base64StringToArrayBuffer = b64str => {
  const byteStr = atob(b64str)
    .split("")
    .map(char => char.charCodeAt(0));
  const bytes = new Uint8Array(byteStr);
  return bytes.buffer;
};

const convertPemToBinary = pem => {
  const lines = pem.split("\n");
  const encoded = lines
    .map(line => {
      const isHeader =
        line.includes("-BEGIN RSA PRIVATE KEY-") &&
        line.includes("-BEGIN RSA PUBLIC KEY-") &&
        line.includes("-END RSA PRIVATE KEY-") &&
        line.includes("-END RSA PUBLIC KEY-");

      if (line.trim().length > 0 && !isHeader) {
        return line.trim();
      }

      return "";
    })
    .join("");

  return base64StringToArrayBuffer(encoded);
};
const generateRandomBytes = (length = 16) =>
  new Promise((resolve, reject) => {
    const binaryArray = new Uint8Array(length);
    const randomValues = window.crypto.getRandomValues(binaryArray);
    resolve(randomValues);
  });

const generateAESKey = async () => {
  const AESKey = await window.crypto.subtle.generateKey(
    {
      name: AES_ALGORITHM,
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
  return AESKey;
};

const generateUserKey = () => {
  const userKey = window.crypto.subtle.generateKey(USER_KEY_ARGS, true, [
    "encrypt",
    "decrypt"
  ]);

  return userKey;
};

const encryptAESKey = async ({ aesKey, userKey }) => {
  const encryptedKey = await window.crypto.subtle.encrypt(
    { name: USER_ALGORITHM },
    userKey.publicKey,
    aesKey.private
  );

  return arrayBufferToBase64String(encryptedKey);
};

const encryptData = async ({ message = "", aesKey }) => {
  const iv = await generateRandomBytes(16);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: AES_ALGORITHM, iv },
    aesKey,
    base64StringToArrayBuffer(btoa(message))
  );

  return { encryptedData: encryptedData, iv };
};

const exportUserPublicKey = async userKey => {
  const exportedKey = await window.crypto.subtle.exportKey(
    "spki",
    userKey.publicKey
  );

  return convertBinaryToPem(exportedKey, "RSA PUBLIC KEY");
};

const importUserPublicKey = async publicKey => {
  const binaryKey = convertPemToBinary(publicKey);
  const importedKey = await window.crypto.subtle.importKey(
    "spki",
    binaryKey,
    USER_KEY_ARGS,
    true,
    ["encrypt", "decrypt"]
  );

  return importedKey;
};

const decryptData = async ({ message = "", aesKey, iv }) => {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: AES_ALGORITHM,
      iv
    },
    aesKey,
    message
  );

  return decryptedData;
};

const decryptAESKey = async ({ aesKey, userKey }) => {
  const decryptedKey = await window.crypto.subtle.decrypt(
    { name: USER_ALGORITHM },
    userKey.publicKey,
    aesKey
  );

  return arrayBufferToBase64String(decryptedKey);
};

let _test = async () => {
  const userKey = await generateUserKey();
  const aesKey = await generateAESKey();

  console.log("[ENCRYPTION] USER Key Generated:", userKey);
  console.log("[ENCRYPTION] AES Key Generated:", aesKey);

  const encryptedAESKey = await encryptAESKey({ aesKey, userKey });

  console.log("[ENCRYPTION] Encrypted AES Key:", encryptedAESKey);

  // const decryptedAESKey = await decryptAESKey({ aesKey, userKey });

  const TEST_MESSAGE = "Hello this is my greatest secret ever!";

  console.log("[ENCRYPTION] Plain-text Message:", TEST_MESSAGE);

  const encryptedTestMessage = await encryptData({
    message: TEST_MESSAGE,
    aesKey
  });

  console.log(
    "[ENCRYPTION] Encrypted Message:",
    encryptedTestMessage.encryptedData,
    base64StringToArrayBuffer(
      arrayBufferToBase64String(encryptedTestMessage.encryptedData)
    )
  );

  const decryptedTestMessage = await decryptData({
    message: encryptedTestMessage.encryptedData,
    aesKey,
    iv: encryptedTestMessage.iv
  });

  const decoder = new TextDecoder("utf-8");
  const decodedText = decoder.decode(decryptedTestMessage);

  console.log("[ENCRYPTION] Decrypted Message:", decodedText);
};
