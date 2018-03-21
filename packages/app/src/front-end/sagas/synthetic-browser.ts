import { RootState } from "../state";
import { fork, take, select, put, call } from "redux-saga/effects";
import { PROJECT_LOADED, ProjectLoaded, syntheticWindowOpened, SyntheticWindowOpened, SYNTHETIC_WINDOW_OPENED } from "../actions";
import { getSyntheticWindow, createSyntheticWindow, SyntheticWindow } from "paperclip";

export function* syntheticBrowserSaga() {
  yield fork(handleOpenedFiles);
  yield fork(handleOpenedWindows);
}

function* handleOpenedFiles() {
  while(1) {
    const { uri }: ProjectLoaded = yield take(PROJECT_LOADED);
    const { browser }: RootState = yield select();
    const window = getSyntheticWindow(uri, browser);
    if (!window) {
      yield call(openFileWindow, uri);
    }
  }
}

function* openFileWindow(uri: string) {
  const window = createSyntheticWindow(uri);
  yield put(syntheticWindowOpened(window));
}

function* handleOpenedWindows() {
  while(1) {
    const { window }: SyntheticWindowOpened = yield take(SYNTHETIC_WINDOW_OPENED);
    console.log(window);
  }
}

function* renderWindow(window: SyntheticWindow) {
  /*

  */
}