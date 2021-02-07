import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initializeStore = () => {
  const store = window.__REDUX_DEVTOOLS_EXTENSION__
    ? createStore(
        persistedReducer,
        compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
      )
    : createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return { store, persistor };
};

const initializedStore = initializeStore();

export const store = initializedStore.store;

export const persistor = initializedStore.persistor;
