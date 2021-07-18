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

const initializeStore = () => {
  const appliedMiddleware = applyMiddleware(thunk);
  // @ts-expect-error
  const store = window.__REDUX_DEVTOOLS_EXTENSION__
    ? createStore(
        rootReducer,
        // @ts-expect-error
        compose(appliedMiddleware, window.__REDUX_DEVTOOLS_EXTENSION__())
      )
    : createStore(rootReducer, appliedMiddleware);

  return { store };
};

const initializedStore = initializeStore();

export const store = initializedStore.store;

export const persistor = {};

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
