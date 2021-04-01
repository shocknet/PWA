import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer, { State } from "../reducers";
import { useSelector as origUseSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import Migrations from "./Migrations";
import createMigrate from "redux-persist/es/createMigrate";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

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

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initializeStore = () => {
  // @ts-expect-error
  const store = window.__REDUX_DEVTOOLS_EXTENSION__
    ? createStore(
        persistedReducer,
        // @ts-expect-error
        compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
      )
    : createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
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
