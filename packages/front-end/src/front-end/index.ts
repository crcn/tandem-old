import "./scss/all.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { RootComponent } from "./components/root";
import { applyMiddleware, createStore } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { rootReducer } from "./reducers";
import { rootSaga } from "./sagas";
import { RootState } from "./state";

export const init = (initialState: RootState) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);
};

export * from "../paperclip";