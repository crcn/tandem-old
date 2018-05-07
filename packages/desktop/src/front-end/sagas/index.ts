import { fork, select, take, call, put } from "redux-saga/effects";
import * as fs from "fs";
import { ipcSaga } from "./ipc";
import { RootState, FILE_NAVIGATOR_ITEM_CLICKED, OPEN_FILE_ITEM_CLICKED, PAPERCLIP_EXTENSION_NAME, loadEntry, dependencyEntryLoaded } from "tandem-front-end";

export function* rootSaga() {
  yield fork(handleActivePaperclipFile);
  yield fork(ipcSaga);
}

function* handleActivePaperclipFile() {
  while(1) {
    yield take([FILE_NAVIGATOR_ITEM_CLICKED, OPEN_FILE_ITEM_CLICKED]);
    const { activeFilePath = "", browser }: RootState = yield select();

    if (activeFilePath.indexOf(PAPERCLIP_EXTENSION_NAME) === -1) {
      continue;
    }

    const { entry, graph } = yield call(loadEntry, activeFilePath, {
      graph: browser.graph,
      openFile: uri => fs.readFileSync(uri.substr("file:/".length), "utf8")
    });

    yield put(dependencyEntryLoaded(entry, graph));
  }
}