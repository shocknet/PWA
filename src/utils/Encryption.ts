import { Buffer } from "buffer";
import ECCrypto from "eccrypto";
import FieldError from "./FieldError";
import { safeParseJSON } from "./JSON";

interface EncryptedMessage {
  ciphertext: Buffer;
  ephemPublicKey: Buffer;
  iv: Buffer;
  mac: Buffer;
}

interface EncryptedMessageResponse {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
}

interface EncryptMessageArgs {
  publicKey: Buffer | string;
  message: string;
}

interface DecryptMessageArgs {
  privateKey: Buffer | string;
  encryptedMessage: EncryptedMessage;
}

const nonEncryptedEvents = [
  "ping",
  "disconnect",
  "IS_GUN_AUTH",
  "SET_LAST_SEEN_APP",
  "NOT_AUTH"
];

export const convertUTF8ToBase64 = (value: string) => {
  return Buffer.from(value, "utf-8").toString("base64");
};

export const convertBase64ToBuffer = (value: string) => {
  return Buffer.from(value, "base64");
};

export const convertUTF8ToBuffer = (value: string) => {
  return Buffer.from(value, "utf-8");
};

export const convertBufferToBase64 = (value: Buffer) => {
  return Buffer.from(value).toString("base64");
};

export const processKey = (key: Buffer | string): Buffer => {
  if (Buffer.isBuffer(key)) {
    return key;
  }

  const convertedKey = convertBase64ToBuffer(key);
  return convertedKey;
};

export const convertToEncryptedMessageResponse = (
  encryptedMessage: EncryptedMessage | EncryptedMessageResponse
): EncryptedMessageResponse => {
  if (
    typeof encryptedMessage.ciphertext === "string" &&
    typeof encryptedMessage.iv === "string" &&
    typeof encryptedMessage.mac === "string" &&
    typeof encryptedMessage.ephemPublicKey === "string"
  ) {
    // @ts-ignore
    return encryptedMessage;
  }

  if (
    Buffer.isBuffer(encryptedMessage.ciphertext) &&
    Buffer.isBuffer(encryptedMessage.iv) &&
    Buffer.isBuffer(encryptedMessage.mac) &&
    Buffer.isBuffer(encryptedMessage.ephemPublicKey)
  ) {
    return {
      ciphertext: convertBufferToBase64(encryptedMessage.ciphertext),
      iv: convertBufferToBase64(encryptedMessage.iv),
      mac: convertBufferToBase64(encryptedMessage.mac),
      ephemPublicKey: convertBufferToBase64(encryptedMessage.ephemPublicKey)
    };
  }

  throw new FieldError({
    field: "encryptedMessage",
    message: "Unknown encrypted message format"
  });
};

export const convertToEncryptedMessage = (
  encryptedMessage: EncryptedMessage | EncryptedMessageResponse
): EncryptedMessage => {
  if (
    Buffer.isBuffer(encryptedMessage.ciphertext) &&
    Buffer.isBuffer(encryptedMessage.iv) &&
    Buffer.isBuffer(encryptedMessage.mac) &&
    Buffer.isBuffer(encryptedMessage.ephemPublicKey)
  ) {
    // @ts-ignore
    return encryptedMessage;
  }

  if (
    typeof encryptedMessage.ciphertext === "string" &&
    typeof encryptedMessage.iv === "string" &&
    typeof encryptedMessage.mac === "string" &&
    typeof encryptedMessage.ephemPublicKey === "string"
  ) {
    return {
      ciphertext: convertBase64ToBuffer(encryptedMessage.ciphertext),
      iv: convertBase64ToBuffer(encryptedMessage.iv),
      mac: convertBase64ToBuffer(encryptedMessage.mac),
      ephemPublicKey: convertBase64ToBuffer(encryptedMessage.ephemPublicKey)
    };
  }

  throw new FieldError({
    field: "encryptedMessage",
    message: "Unknown encrypted message format"
  });
};

export const isEncryptedMessage = (message: any) =>
  message?.ciphertext && message?.iv && message?.mac && message?.ephemPublicKey;

export const isNonEncrypted = (eventName: string) =>
  nonEncryptedEvents.includes(eventName) ||
  process.env.REACT_APP_SHOCK_ENCRYPTION_ECC === "false";

export const generateKeyPair = () => {
  const privateKey: Buffer = ECCrypto.generatePrivate();
  const publicKey: Buffer = ECCrypto.getPublic(privateKey);

  const privateKeyBase64 = convertBufferToBase64(privateKey);
  const publicKeyBase64 = convertBufferToBase64(publicKey);

  return {
    privateKey,
    publicKey,
    privateKeyBase64,
    publicKeyBase64
  };
};

export const encryptMessage = async ({
  publicKey,
  message = ""
}: EncryptMessageArgs): Promise<EncryptedMessageResponse> => {
  const processedPublicKey = processKey(publicKey);
  const messageBuffer = convertUTF8ToBuffer(message);
  const encryptedMessage: EncryptedMessage = await ECCrypto.encrypt(
    processedPublicKey,
    messageBuffer
  );
  const encryptedMessageResponse = {
    ciphertext: encryptedMessage.ciphertext,
    iv: encryptedMessage.iv,
    mac: encryptedMessage.mac,
    ephemPublicKey: encryptedMessage.ephemPublicKey
  };

  return convertToEncryptedMessageResponse(encryptedMessageResponse);
};

export const decryptMessage = async ({
  privateKey,
  encryptedMessage
}: DecryptMessageArgs): Promise<string | object> => {
  try {
    const processedPrivateKey = processKey(privateKey);
    const decryptedMessageBuffer: Buffer = await ECCrypto.decrypt(
      processedPrivateKey,
      convertToEncryptedMessage(encryptedMessage)
    );
    const decryptedMessage = decryptedMessageBuffer.toString("utf-8");
    const parsedMessage = safeParseJSON(decryptedMessage);

    return parsedMessage;
  } catch (err) {
    if (err.message?.toLowerCase() === "bad mac") {
      console.warn(
        "Bad Mac!",
        err,
        convertToEncryptedMessage(encryptedMessage)
      );
    }

    throw err;
  }
};
