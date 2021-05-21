import { Buffer } from "buffer";
import ECCrypto from "eccrypto";
import FieldError from "./FieldError";
import { safeParseJSON } from "./JSON";

interface EncryptedMessage {
  ciphertext: Uint8Array;
  ephemPublicKey: Uint8Array;
  iv: Uint8Array;
  mac: Uint8Array;
}

interface EncryptedMessageResponse {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
}

interface EncryptMessageArgs {
  publicKey: Uint8Array | string;
  message: string;
}

interface DecryptMessageArgs {
  privateKey: Uint8Array | string;
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

export const convertBufferToBase64 = (value: Uint8Array) => {
  return Buffer.from(value).toString("base64");
};

export const processKey = (key: Uint8Array | string): Uint8Array => {
  if (key instanceof Uint8Array) {
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
    encryptedMessage.ciphertext instanceof Uint8Array &&
    encryptedMessage.iv instanceof Uint8Array &&
    encryptedMessage.mac instanceof Uint8Array &&
    encryptedMessage.ephemPublicKey instanceof Uint8Array
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
    encryptedMessage.ciphertext instanceof Uint8Array &&
    encryptedMessage.iv instanceof Uint8Array &&
    encryptedMessage.mac instanceof Uint8Array &&
    encryptedMessage.ephemPublicKey instanceof Uint8Array
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
  const privateKey: Uint8Array = ECCrypto.generatePrivate();
  const publicKey: Uint8Array = ECCrypto.getPublic(privateKey);

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
  const processedPrivateKey = processKey(privateKey);
  const decryptedMessageBuffer: Uint8Array = await ECCrypto.decrypt(
    processedPrivateKey,
    convertToEncryptedMessage(encryptedMessage)
  );
  const decryptedMessage = Buffer.from(decryptedMessageBuffer).toString();
  const parsedMessage = safeParseJSON(decryptedMessage);

  return parsedMessage;
};
