import { fork, call, take, select, put } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow } from "electron";
import { APP_READY, mainWindowOpened } from "../actions";
import { FRONT_END_ENTRY_FILE_PATH } from "../constants";
import { ipcSaga, pid } from "./ipc";
import {
  APP_LOADED,
  projectDirectoryLoaded,
  convertFlatFilesToNested
} from "tandem-front-end";
import { DesktopState } from "../state";
import * as globby from "globby";
import { isPublicAction } from "tandem-common";
import { shortcutsSaga } from "./menu";
import * as fs from "fs";
import * as path from "path";

export function* rootSaga() {
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga);
  yield fork(handleLoadProject);
  yield fork(shortcutsSaga);
}

function* openMainWindow() {
  yield take(APP_READY);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(FRONT_END_ENTRY_FILE_PATH);

  yield fork(function*() {
    while (1) {
      const message = yield take();
      if (isPublicAction(message) && !message["@@" + pid]) {
        mainWindow.webContents.send("message", message);
      }
    }
  });

  yield put(mainWindowOpened());
}

function* handleLoadProject() {
  while (1) {
    yield take(APP_LOADED);
    const state: DesktopState = yield select();
    const files = scanDirectory(state.projectDirectory);

    const root = convertFlatFilesToNested(state.projectDirectory, files);

    yield put(projectDirectoryLoaded(root));
  }
}

const scanDirectory = (filePath: string) => {
  if (fs.lstatSync(filePath).isDirectory()) {
    return fs.readdirSync(filePath).reduce(
      (dirs, basename) => {
        if (basename.charAt(0) === ".") {
          return dirs;
        }
        return [...dirs, ...scanDirectory(path.join(filePath, basename))];
      },
      [filePath]
    );
  }
  return [filePath];
};
