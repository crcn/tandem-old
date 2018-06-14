import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";

import { DesktopState } from "./state";

import { rootReducer } from "./reducers";

import { rootSaga } from "./sagas";

export const init = (initialState: DesktopState) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(rootSaga);
};
