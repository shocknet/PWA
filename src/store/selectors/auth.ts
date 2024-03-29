import { State } from "../../reducers";

export const selectSelfPublicKey = (state: State): string =>
  state.node.publicKey;

export const isAuth = (state: State): boolean => !!state.node.publicKey;

export const selectHost = (state: State): string => state.node.hostIP;
