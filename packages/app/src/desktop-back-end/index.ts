import { rootSaga } from "./sagas";
import { RootState } from "./state";
import { rootReducer } from "./reducers";
import { createStore, applyMiddleware } from "redux";
import { default as createSagaMiddleware } from "redux-saga";

export const init = (state: RootState) => {
  const sagaMiddleware = createSagaMiddleware({});
  const store = createStore(
    rootReducer, state, 
    applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(rootSaga);
};
