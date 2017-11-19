import * as io from "socket.io-client";
import { take, call, fork, select, put } from "redux-saga/effects";
import { ApplicationState } from "../state";
import { apiComponentsLoaded, FILE_CHANGED, COMPONENT_SCREENSHOT_SAVED, FileChanged } from "../actions";
import { createSocketIOSaga } from "aerial-common2";

export function* apiSaga() {
  const { apiHost }: ApplicationState = yield select();
  yield fork(getComponents);
  yield fork(createSocketIOSaga(io(apiHost)));
}

function* getComponents() {

  while(true) {
    const { apiHost }: ApplicationState = yield select();
    const response: Response = yield call(fetch, apiHost + "/components");
    const json = yield call(response.json.bind(response));
    yield put(apiComponentsLoaded(json));

    // just refresh whenever a file has changed
    yield take([FILE_CHANGED, COMPONENT_SCREENSHOT_SAVED]);
  } 
}
