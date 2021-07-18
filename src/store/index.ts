import {
  createStore,
  applyMiddleware,
  compose,
  AnyAction,
  Action
} from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import rootReducer, { State } from "../reducers";
import {
  useSelector as origUseSelector,
  useDispatch as originalUseDispatch
} from "react-redux";
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

const persistedReducer = persistReducer<State, AnyAction>(
  persistConfig,
  rootReducer
);

const initializeStore = () => {
  const appliedMiddleware = applyMiddleware(thunk);
  // @ts-expect-error
  const store = window.__REDUX_DEVTOOLS_EXTENSION__
    ? createStore(
        persistedReducer,
        // @ts-expect-error
        compose(appliedMiddleware, window.__REDUX_DEVTOOLS_EXTENSION__())
      )
    : createStore(persistedReducer, appliedMiddleware);
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

export const useDispatch = (): ThunkDispatch<State, undefined, Action> => {
  return originalUseDispatch() as ThunkDispatch<State, undefined, Action>;
};

export * from "./selectors";
