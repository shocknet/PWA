import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import Migrations from "./Migrations";
import createMigrate from "redux-persist/es/createMigrate";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"],
  version: 3,
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

export * from "./selectors";
