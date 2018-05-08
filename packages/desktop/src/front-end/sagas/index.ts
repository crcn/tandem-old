import { fork, select, take, call, put } from "redux-saga/effects";
import * as fs from "fs";
import { ipcSaga } from "./ipc";
import { RootState, FILE_NAVIGATOR_ITEM_CLICKED, OPEN_FILE_ITEM_CLICKED, PAPERCLIP_EXTENSION_NAME, loadEntry, dependencyEntryLoaded, SHORTCUT_SAVE_KEY_DOWN, savedFile, getOpenFile } from "tandem-front-end";

export function* rootSaga() {
  yield fork(ipcSaga);
  yield fork(handleSaveShortcut);
  yield fork(handleActivePaperclipFile);
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

function* handleSaveShortcut() {
  while(1) {
    yield take(SHORTCUT_SAVE_KEY_DOWN);
    const state: RootState = yield select();
    const uri = state.activeFilePath;

    // TODO - post save
    if (!uri) {
      continue;
    }
    const openFile = getOpenFile(uri, state);

    if (openFile.newContent) {
      yield call(saveFile, uri, openFile.newContent);
      yield put(savedFile(uri));
    }
  }
}

const saveFile = (uri: string, content: Buffer) => {
  console.log(content.toString());
  return new Promise((resolve, reject) => {
    fs.writeFile(uri.substr("file:/".length), content, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    })
  });
}