import * as io from "socket.io-client";
import { delay } from "redux-saga";
import { ApplicationState, serializeApplicationState } from "../state";
const PERSIST_DELAY_TIMEOUT = 1000;
import { createSocketIOSaga } from "aerial-common2";

import { take, call, fork, select, put } from "redux-saga/effects";
import { apiComponentsLoaded, FILE_CONTENT_CHANGED, FILE_REMOVED, triedLoadedSavedState, COMPONENT_SCREENSHOT_SAVED, FileChanged, loadedSavedState, LOADED_SAVED_STATE, TRIED_LOADING_APP_STATE } from "../actions";

const SAVE_KEY = "app-state";

export function* apiSaga() {
  const { apiHost }: ApplicationState = yield select();
  yield fork(getComponents);
  yield fork(syncWorkspaceState);
  yield fork(createSocketIOSaga(io(apiHost)));
  yield fork(handlePingPong);
}

function* getComponents() {

  while(true) {
    const { apiHost }: ApplicationState = yield select();
    const response: Response = yield call(fetch, apiHost + "/components");
    const json = yield call(response.json.bind(response));
    yield put(apiComponentsLoaded(json));

    // just refresh whenever a file has changed
    yield take([FILE_CONTENT_CHANGED, FILE_REMOVED, COMPONENT_SCREENSHOT_SAVED]);
  } 
}


function* syncWorkspaceState() {
  yield fork(function*() {

    let prevState: ApplicationState;
    yield take(TRIED_LOADING_APP_STATE);

    while(true) {
      yield take();
      yield call(delay, PERSIST_DELAY_TIMEOUT);
      const state: ApplicationState = yield select();
      if (prevState === state) {
        continue;
      }

      prevState = state;

      // convert to a POJO object in case there are non serializable
      // object somehow in the application store. For the most part -- everything should be
      // a POJO with very few exceptions. For cases where data cannot be converted into a plain object, the application will need to re-hydrate the non-serializable data on startup. 
      const pojoState = serializeApplicationState(state);
      const { apiHost }: ApplicationState = state;

      yield call(fetch, apiHost + "/storage/" + state.storageNamespace + SAVE_KEY, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        } as any,
        body: JSON.stringify(pojoState)
      });
    }
  });  

  const state: ApplicationState = yield select();
  const { apiHost }: ApplicationState = yield select();
  try {
    const pojoState = yield call(async function() {
      const response = await fetch(apiHost + "/storage/" + state.storageNamespace + SAVE_KEY);
      return await response.json();
    });

    if (pojoState) {
      yield put(loadedSavedState(pojoState));
    }
  } catch(e) {
    console.warn(e);
  }

  yield put(triedLoadedSavedState());
}

function* handlePingPong() {
  while(1) {
    yield take("$$TANDEM_FE_PING");
    yield put({ type: "$$TANDEM_FE_PONG", $public: true });
  }
}