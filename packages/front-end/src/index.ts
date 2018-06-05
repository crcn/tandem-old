import "./scss/all.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { RootComponent } from "./components/root";
import { applyMiddleware, createStore, Reducer, Action } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { fork } from "redux-saga/effects";
import { rootReducer } from "./reducers";
import { rootSaga } from "./sagas";
import {
  createPaperclipSaga,
  PAPERCLIP_MIME_TYPE,
  PAPERCLIP_DEFAULT_EXTENSIONS
} from "paperclip";
import { RootState } from "./state";
import { appLoaded } from "./actions";
import {
  FSSandboxOptions,
  createFSSandboxSaga,
  setReaderMimetype
} from "fsbox";

export const setup = <TState extends RootState>(
  { readFile, writeFile }: FSSandboxOptions,
  reducer?: Reducer<TState>,
  saga?: () => IterableIterator<any>
) => {
  readFile = setReaderMimetype(
    PAPERCLIP_MIME_TYPE,
    PAPERCLIP_DEFAULT_EXTENSIONS
  )(readFile);

  return (initialState: TState) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
      (state: TState, event: Action) => {
        state = rootReducer(state, event) as TState;
        if (reducer) {
          state = reducer(state, event);
        }
        return state;
      },
      initialState,
      applyMiddleware(sagaMiddleware)
    );
    sagaMiddleware.run(function*() {
      yield fork(rootSaga);
      if (saga) {
        yield fork(saga);
        yield fork(createFSSandboxSaga({ readFile, writeFile }));
        yield fork(createPaperclipSaga());
      }
    });

    store.dispatch(appLoaded());
  };
};
export const init = (initialState: RootState) => {};

export * from "paperclip";
export * from "./state";
export * from "./actions";
export * from "tandem-common";
