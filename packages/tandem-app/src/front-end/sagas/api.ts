import { take, call, fork, select, put } from "redux-saga/effects";
import { ApplicationState } from "../state";
import { apiComponentsLoaded } from "../actions";

export function* apiSaga() {
  yield fork(getComponents);
}

function* getComponents() {
  const { apiHost }: ApplicationState = yield select();
  const response: Response = yield call(fetch, location.protocol + "//" + apiHost + "/components");

  const json = yield call(response.json.bind(response));
  yield put(apiComponentsLoaded(json));
}

