import { fork, call, take, select, put } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow } from "electron";
import { APP_READY, mainWindowOpened, pcConfigLoaded } from "../actions";
import { FRONT_END_ENTRY_FILE_PATH } from "../constants";
import { ipcSaga, pid } from "./ipc";
import { APP_LOADED, projectDirectoryLoaded } from "tandem-front-end";
import {
  PAPERCLIP_CONFIG_DEFAULT_FILENAME,
  creaPCConfig,
  pcFrameContainerCreated,
  PCConfig,
  openPCConfig,
  createPCDependency,
  findPaperclipSourceFiles,
  walkPCRootDirectory
} from "paperclip";
import { DesktopState } from "../state";
import * as globby from "globby";
import { isPublicAction, convertFlatFilesToNested } from "tandem-common";
import { shortcutsSaga } from "./menu";
import * as fs from "fs";
import * as path from "path";

export function* rootSaga() {
  yield call(initConfig);
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga);
  yield fork(handleLoadProject);
  yield fork(shortcutsSaga);
}

function* initConfig() {
  const state: DesktopState = yield select();

  // todo - may want this to be custom
  const configFileName = PAPERCLIP_CONFIG_DEFAULT_FILENAME;
  let config: PCConfig = openPCConfig(state.projectDirectory);

  if (!config) {
    console.log("writing default paperclip config");
    fs.writeFileSync(
      path.join(state.projectDirectory, configFileName),
      JSON.stringify(creaPCConfig("."), null, 2)
    );
    config = openPCConfig(state.projectDirectory);
  }

  yield put(pcConfigLoaded(config));
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
    const { pcConfig, projectDirectory }: DesktopState = yield select();

    const files = [];
    walkPCRootDirectory(pcConfig, projectDirectory, filePath => {
      files.push(filePath);
    });

    const root = convertFlatFilesToNested(projectDirectory, files);

    yield put(projectDirectoryLoaded(root));
  }
}
