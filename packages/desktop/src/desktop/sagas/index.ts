import { fork, call, take, select, put } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow } from "electron";
import {
  APP_READY,
  mainWindowOpened,
  pcConfigLoaded,
  tdConfigLoaded,
  TD_CONFIG_LOADED,
  previewServerStarted
} from "../actions";
import { FRONT_END_ENTRY_FILE_PATH, TD_CONFIG_FILE_NAME } from "../constants";
import { ipcSaga, pid } from "./ipc";
import * as getPort from "get-port";
import * as qs from "querystring";
import { spawn } from "child_process";
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
import {
  isPublicAction,
  convertFlatFilesToNested,
  isDirectory,
  Directory,
  createDirectory,
  addProtocol,
  FILE_PROTOCOL,
  publicActionCreator
} from "tandem-common";
import { shortcutsSaga } from "./menu";
import * as fs from "fs";
import * as path from "path";

export function* rootSaga() {
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga);
  yield fork(handleLoadProject);
  yield fork(shortcutsSaga);
  yield fork(previewServer);
  yield call(loadTDConfig);
  yield call(initPCConfig);
}

const projectDirectoryLoaded = publicActionCreator((directory: Directory) => ({
  directory,
  type: "PROJECT_DIRECTORY_LOADED"
}));

function* initPCConfig() {
  const state: DesktopState = yield select();

  // todo - may want this to be custom
  const configFileName = PAPERCLIP_CONFIG_DEFAULT_FILENAME;
  let configResult = openPCConfig(state.projectDirectory);

  if (!configResult) {
    console.log("writing default paperclip config");
    fs.writeFileSync(
      path.join(state.projectDirectory, configFileName),
      JSON.stringify(creaPCConfig("."), null, 2)
    );
    configResult = openPCConfig(state.projectDirectory);
  }

  yield put(pcConfigLoaded(configResult.config));
}

function* loadTDConfig() {
  const state: DesktopState = yield select();
  const tdConfigPath = path.join(state.projectDirectory, TD_CONFIG_FILE_NAME);
  if (!fs.existsSync(tdConfigPath)) {
    console.warn(`Tandem config file not found`);
    return;
  }

  const config = JSON.parse(fs.readFileSync(tdConfigPath, "utf8"));

  // TODO - validate config here
  yield put(tdConfigLoaded(config));
}

function* openMainWindow() {
  yield take(APP_READY);
  const state: DesktopState = yield select();

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  let url = FRONT_END_ENTRY_FILE_PATH;

  const query: any = {};

  if (state.info.previewServer) {
    query.previewHost = `localhost:${state.info.previewServer.port}`;
  }

  mainWindow.loadURL(
    url + (Object.keys(query).length ? "?" + qs.stringify(query) : "")
  );

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
    yield take("APP_LOADED");
    const { pcConfig, projectDirectory }: DesktopState = yield select();

    const files: [string, boolean][] = [];
    walkPCRootDirectory(pcConfig, projectDirectory, (filePath, isDirectory) => {
      if (filePath === projectDirectory) {
        return;
      }
      files.push([filePath, isDirectory]);
    });

    const root = createDirectory(
      addProtocol(FILE_PROTOCOL, projectDirectory),
      convertFlatFilesToNested(files)
    );

    yield put(projectDirectoryLoaded(root));
  }
}

function* previewServer() {
  yield take(TD_CONFIG_LOADED);
  const state: DesktopState = yield select();
  if (
    !state.tdConfig ||
    !state.tdConfig.scripts ||
    !state.tdConfig.scripts.previewServer
  ) {
    return;
  }
  const port = yield call(getPort);
  let [bin, ...args] = state.tdConfig.scripts.previewServer.split(" ");
  const proc = spawn(bin, args, {
    cwd: state.projectDirectory,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: true,
      PORT: port
    }
  });
  proc.stderr.pipe(process.stderr);
  proc.stdout.pipe(process.stdout);

  yield put(previewServerStarted(port));
}
