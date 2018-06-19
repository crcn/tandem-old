import "./scss/all.scss";
import { applyMiddleware, createStore, Reducer, Action } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { fork, call } from "redux-saga/effects";
import { rootReducer } from "./reducers";
import { createRootSaga, FrontEndSagaOptions } from "./sagas";
const PaperclipWorker = require("./paperclip.worker");

import {
  createPaperclipSaga,
  PAPERCLIP_MIME_TYPE,
  PAPERCLIP_DEFAULT_EXTENSIONS,
} from "paperclip";
import { RootState } from "./state";
import { appLoaded } from "./actions";
import {
  FSSandboxOptions,
  createFSSandboxSaga,
  setReaderMimetype
} from "fsbox";
import { createRemotePCRuntime } from "paperclip";

export type FrontEndOptions = FrontEndSagaOptions &
  FSSandboxOptions;
export type SideEffectCreator = () => IterableIterator<FrontEndOptions>;

export const setup = <TState extends RootState>(
  createSideEffects: SideEffectCreator,
  reducer?: Reducer<TState>,
  saga?: () => IterableIterator<any>
) => {
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
      let { readFile, writeFile, openPreview } = yield call(
        createSideEffects
      );

      readFile = setReaderMimetype(
        PAPERCLIP_MIME_TYPE,
        PAPERCLIP_DEFAULT_EXTENSIONS
      )(readFile);

      yield fork(createRootSaga({ openPreview }));
      if (saga) {
        yield fork(saga);
        yield fork(createFSSandboxSaga({ readFile, writeFile }));
        yield fork(createPaperclipSaga({
          createRuntime: () => {
            return createRemotePCRuntime(new PaperclipWorker());
          }
        }));
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
