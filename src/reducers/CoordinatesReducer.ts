import produce from "immer";
import { DateTime } from "luxon";

import { CoordinateWithHash } from "../schema";

import {
  coordinateDeleted,
  coordinateReceived
} from "../actions/CoordinateActions";

const INITIAL_STATE = {
  anon: {
    amount: 500,
    coordinateHash: "akjshdkjasdasd",
    coordinateIndex: 123,
    coordinateSHA256: "anon",
    inbound: true,
    timestamp: Date.now(),
    type: "tip",
    description: "Anon tipped your livestream",
    fromBtcPub: "akhsffhksajdhakjsd",
    fromGunPub: "anon",
    fromLndPub: "kjaddhfjkahsdjkasd",
    invoiceMemo: "invoiceMemo",
    metadata: "",
    ownerGunPub: "asdasf",
    toBtcPub: "asdazxvzxvzsd",
    toGunPub: "asdasfsasdad",
    toLndPub: "jkashdfkjabssjkfb"
  },
  rothbard: {
    amount: 1000,
    coordinateHash: "akjshdkjasdasd",
    coordinateIndex: 123,
    coordinateSHA256: "rothbard",
    inbound: true,
    timestamp: DateTime.fromSQL("2021-07-17 17:33").valueOf(),
    type: "tip",
    description: "Anon tipped your livestream",
    fromBtcPub: "akhsffhksajdhakjsd",
    fromGunPub: "rothbard",
    fromLndPub: "kjaddhfjkahsdjkasd",
    invoiceMemo: "invoiceMemo",
    metadata: "",
    ownerGunPub: "asdasf",
    toBtcPub: "asdazxvzxvzsd",
    toGunPub: "asdasfsasdad",
    toLndPub: "jkashdfkjabssjkfb"
  },
  mencken: {
    amount: 21000,
    coordinateHash: "akjshdkjasdasd",
    coordinateIndex: 123,
    coordinateSHA256: "mencken",
    inbound: false,
    timestamp: DateTime.fromSQL("2021-07-17 16:33").valueOf(),
    type: "tip",
    description: "Anon tipped your livestream",
    fromBtcPub: "akhsffhksajdhakjsd",
    fromGunPub: "me",
    fromLndPub: "kjaddhfjkahsdjkasd",
    invoiceMemo: "invoiceMemo",
    metadata: "",
    ownerGunPub: "asdasf",
    toBtcPub: "asdazxvzxvzsd",
    toGunPub: "mencken",
    toLndPub: "jkashdfkjabssjkfb"
  },
  smith: {
    amount: 1000,
    coordinateHash: "akjshdkjasdasd",
    coordinateIndex: 123,
    coordinateSHA256: "smith",
    inbound: true,
    timestamp: DateTime.fromSQL("2021-07-17 14:33").valueOf(),
    type: "tip",
    description: "Anon tipped your livestream",
    fromBtcPub: "akhsffhksajdhakjsd",
    fromGunPub: "smith",
    fromLndPub: "kjaddhfjkahsdjkasd",
    invoiceMemo: "invoiceMemo",
    metadata: "",
    ownerGunPub: "asdasf",
    toBtcPub: "asdazxvzxvzsd",
    toGunPub: "asdasfsasdad",
    toLndPub: "jkashdfkjabssjkfb"
  },
  lightningPage: {
    amount: 1500,
    coordinateHash: "akjshdkjasdasd",
    coordinateIndex: 123,
    coordinateSHA256: "lightningPage",
    inbound: false,
    timestamp: DateTime.fromSQL("2021-07-16 10:33").valueOf(),
    type: "tip",
    description: "Anon tipped your livestream",
    fromBtcPub: "akhsffhksajdhakjsd",
    fromGunPub: "me",
    fromLndPub: "kjaddhfjkahsdjkasd",
    invoiceMemo: "invoiceMemo",
    metadata: "",
    ownerGunPub: "asdasf",
    toBtcPub: "asdazxvzxvzsd",
    toGunPub: "lightningPage",
    toLndPub: "jkashdfkjabssjkfb"
  }
} as Record<string, CoordinateWithHash>;

const coordinates = produce((draft, action) => {
  if (coordinateDeleted.match(action)) {
    const { coordinateSHA256 } = action.payload;
    delete draft[coordinateSHA256];
  }
  if (coordinateReceived.match(action)) {
    const { coordinate, coordinateSHA256 } = action.payload;
    draft[coordinateSHA256] = { ...coordinate, coordinateSHA256 };
  }
}, INITIAL_STATE);

export default coordinates;
