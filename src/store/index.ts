import { createStore, applyMiddleware, compose, AnyAction } from "redux";
import thunk from "redux-thunk";
import rootReducer, { State } from "../reducers";
import { useSelector as origUseSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import Migrations from "./Migrations";
import createMigrate from "redux-persist/es/createMigrate";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import createSagaMiddleware from "redux-saga";

import rootSaga, { _setStore as setSagaStore } from "./sagas";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"],
  version: 1,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(Migrations, {
    debug: process.env.NODE_ENV === "development"
  })
};

const persistedReducer = persistReducer<State, AnyAction>(
  persistConfig,
  rootReducer
);

const initializeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  // @ts-expect-error
  const store = window.__REDUX_DEVTOOLS_EXTENSION__
    ? createStore(
        persistedReducer,
        // @ts-expect-error
        compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
      )
    : createStore(persistedReducer, applyMiddleware(thunk, sagaMiddleware));
  let persistor = persistStore(store);
  setSagaStore(store);
  sagaMiddleware.run(rootSaga);
  // In the future if polls (which cause ticks in the store) are moved to sagas
  // they will be dependant on the ping socket, we need a keep alive tick for
  // when the are no actions being dispatched making the store tick and
  // therefore the ping saga realizing the socket died, if it did so. Ideally,
  // the ping/socket subscription should emit a timeout event of such but I'd
  // rather do that when I learn Event Channels and implement the ping socket
  // using that.
  setInterval(() => {
    store.dispatch({
      type: "shock::keepAlive"
    });
  }, 20000);
  return { store, persistor };
};

const initializedStore = initializeStore();

export const store = initializedStore.store;

export const persistor = initializedStore.persistor;

/**
 * React-redux 's useSelector with our state type pre-specified.
 */
export const useSelector = <TSelected = unknown>(
  selector: (state: State) => TSelected
): TSelected => origUseSelector<State, TSelected>(selector);

export * from "./selectors";
