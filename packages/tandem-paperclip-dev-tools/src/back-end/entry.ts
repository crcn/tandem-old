import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import createSagaMiddleware from "redux-saga";
import {extensionActivated } from "./actions";
import { createStore, applyMiddleware } from "redux";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  mainReducer,
  {
  },
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mainSaga);
store.dispatch(extensionActivated());