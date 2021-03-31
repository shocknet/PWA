import { Store, AnyAction } from "redux";

import { State } from "../../reducers";

type ShockStore = Store<State, AnyAction>;

let currStore = {} as ShockStore;

export const _setStore = (store: ShockStore) => {
  currStore = store;
};

export const getStore = () => currStore;
