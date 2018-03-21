import * as electron from "electron";
import { mainReducer } from "./reducers";
import { mainSaga } from "./sagas";
import { ApplicationState } from "./state";
import sagaMiddlewareFactory, { default as createSagaMiddleware } from "redux-saga";
import { createStore, Reducer, Store, applyMiddleware, Middleware } from "redux";

const init = (initialState: ApplicationState) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    mainReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(mainSaga);
};

init({

});